"""
Super Resolution inference service.

NOTE (from the AI teammate): preprocess_raster() normalizes each band using
that image's own min/max. If the model was trained on a fixed reflectance
scale (e.g. DN / 10000), output quality is not validated yet.
"""

import os
from pathlib import Path

import numpy as np
import rasterio
from rasterio.windows import Window

WEIGHTS_PATH = (
    Path(__file__).resolve().parent.parent
    / "ml"
    / "weights"
    / "sentinel2_sr_inference.pth"
)

IN_CHANNELS = 4
OUT_CHANNELS = 4
FEATURES = 64
NUM_BLOCKS = 8
SCALE = 4
EXPECTED_PARAMS = 927_876

# Small tiles keep memory low enough for a 512 MB server.
# TILE_PAD is extra border read around each tile so tile edges blend in.
TILE_SIZE = 64
TILE_PAD = 16

# Maximum image size (in pixels) allowed. 0 means no limit.
# Set MAX_SR_PIXELS on the live server only, so your laptop stays unlimited.
MAX_PIXELS = int(os.getenv("MAX_SR_PIXELS", "0"))

_model = None
_device = None


class ModelNotAvailableError(Exception):
    """Raised when the .pth weights file is missing or fails to load."""
    pass


def load_model():
    """Load (or return cached) Sentinel2SR model with trained weights."""
    global _model, _device

    if _model is not None:
        return _model

    if not WEIGHTS_PATH.exists():
        raise ModelNotAvailableError(
            f"Model weights not found at {WEIGHTS_PATH}. "
            "Copy sentinel2_sr_inference.pth into backend/app/ml/weights/ "
            "(the .pth file IS a zip container internally - do not extract it)."
        )

    # Imported here so the server starts fast and upload/preprocess
    # do not pay the memory cost of torch.
    import torch
    from app.ml.model import Sentinel2SR

    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

    model = Sentinel2SR(
        in_channels=IN_CHANNELS,
        out_channels=OUT_CHANNELS,
        features=FEATURES,
        num_blocks=NUM_BLOCKS,
    ).to(device)

    try:
        state_dict = torch.load(WEIGHTS_PATH, map_location=device)
        model.load_state_dict(state_dict, strict=True)
    except Exception as error:
        raise ModelNotAvailableError(
            f"Failed to load weights from {WEIGHTS_PATH}: {error}"
        ) from error

    model.eval()

    params = sum(p.numel() for p in model.parameters())
    if params != EXPECTED_PARAMS:
        raise ModelNotAvailableError(
            f"Loaded model has {params:,} parameters, expected "
            f"{EXPECTED_PARAMS:,}. The architecture in app/ml/model.py no "
            "longer matches the trained checkpoint."
        )

    _model = model
    _device = device
    return _model


def _infer_tile(model, device, tile: np.ndarray) -> np.ndarray:
    """Run the model on a single (C, H, W) float32 tile."""
    import torch

    x = torch.from_numpy(tile).unsqueeze(0).to(device)
    with torch.inference_mode():
        y = model(x)
    return y.squeeze(0).cpu().numpy()


def run_super_resolution(
    input_path: str,
    output_path: str,
    progress_callback=None,
) -> dict:
    """
    Run 4x super-resolution on a preprocessed GeoTIFF and write the result
    tile by tile. Uses the first 4 bands (B02, B03, B04, B08).

    progress_callback(done_tiles, total_tiles) is called after the model is
    loaded (with done_tiles = 0) and again after every finished tile.
    """
    model = load_model()
    device = _device

    with rasterio.open(input_path) as src:
        band_count, height, width = src.count, src.height, src.width

        if band_count < IN_CHANNELS:
            raise ValueError(
                f"Input has {band_count} band(s); the model needs at least "
                f"{IN_CHANNELS} (B02, B03, B04, B08)."
            )

        if MAX_PIXELS and width * height > MAX_PIXELS:
            raise ValueError(
                f"Image is {width}x{height}. The demo server can only process "
                f"images up to about {MAX_PIXELS:,} pixels. "
                "Please crop the image and try again."
            )

        out_h, out_w = height * SCALE, width * SCALE

        # Count the tiles first so we can report progress
        tiles_x = (width + TILE_SIZE - 1) // TILE_SIZE
        tiles_y = (height + TILE_SIZE - 1) // TILE_SIZE
        total_tiles = tiles_x * tiles_y
        done_tiles = 0

        if progress_callback:
            progress_callback(0, total_tiles)

        transform = src.transform * src.transform.scale(
            width / out_w, height / out_h
        )

        profile = src.profile.copy()
        profile.update(
            width=out_w,
            height=out_h,
            count=OUT_CHANNELS,
            transform=transform,
            dtype=rasterio.float32,
            compress="lzw",
            tiled=True,
            blockxsize=256,
            blockysize=256,
        )

        with rasterio.open(output_path, "w", **profile) as dst:
            for y0 in range(0, height, TILE_SIZE):
                y1 = min(y0 + TILE_SIZE, height)

                for x0 in range(0, width, TILE_SIZE):
                    x1 = min(x0 + TILE_SIZE, width)

                    # Read a slightly bigger area so the tile edges get context
                    ry0 = max(y0 - TILE_PAD, 0)
                    ry1 = min(y1 + TILE_PAD, height)
                    rx0 = max(x0 - TILE_PAD, 0)
                    rx1 = min(x1 + TILE_PAD, width)

                    tile = src.read(
                        indexes=list(range(1, IN_CHANNELS + 1)),
                        window=Window(rx0, ry0, rx1 - rx0, ry1 - ry0),
                    ).astype(np.float32)

                    sr_tile = _infer_tile(model, device, tile)

                    # Cut the extra border away again
                    cy0 = (y0 - ry0) * SCALE
                    cx0 = (x0 - rx0) * SCALE
                    core = sr_tile[
                        :,
                        cy0 : cy0 + (y1 - y0) * SCALE,
                        cx0 : cx0 + (x1 - x0) * SCALE,
                    ]

                    dst.write(
                        core,
                        window=Window(
                            x0 * SCALE,
                            y0 * SCALE,
                            (x1 - x0) * SCALE,
                            (y1 - y0) * SCALE,
                        ),
                    )

                    done_tiles += 1
                    if progress_callback:
                        progress_callback(done_tiles, total_tiles)

    return {
        "input_width": width,
        "input_height": height,
        "output_width": out_w,
        "output_height": out_h,
        "scale_factor": SCALE,
        "output_path": str(output_path),
    }
