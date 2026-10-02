"""
Super Resolution inference service.

Wires the trained Sentinel2SR checkpoint into the backend. Loads the model
once (module-level singleton) and exposes `run_super_resolution()`, which
the /api/processing/super-resolution route calls.

--------------------------------------------------------------------------
KNOWN LIMITATION (flagged by the AI/ML teammate, intentionally NOT fixed
here per team decision):

`preprocess_raster()` in raster_service.py normalizes each band using
THAT IMAGE's own min/max (scene-relative 0-1 scaling). Sentinel-2 SR
models are usually trained on a FIXED reflectance scale (e.g. raw DN /
10000, clipped to [0,1]) instead. If the checkpoint was trained on fixed
scaling, feeding it scene-relative-normalized bands will produce
plausible-looking but scientifically wrong output on real scenes. This
was called out explicitly in the ML teammate's README ("likely
scaling/normalization issue... should be fixed before backend
integration"). The team has decided to wire the pipeline end-to-end
first and revisit normalization with the ML teammate afterwards - do
not treat SR output quality as validated until that's confirmed.
--------------------------------------------------------------------------
"""

from pathlib import Path
from typing import Optional

import numpy as np
import rasterio
import torch

from app.ml.model import Sentinel2SR

WEIGHTS_PATH = Path(__file__).resolve().parent.parent / "ml" / "weights" / "sentinel2_sr_inference.pth"

IN_CHANNELS = 4
OUT_CHANNELS = 4
FEATURES = 64
NUM_BLOCKS = 8
SCALE = 4
EXPECTED_PARAMS = 927_876

# Tile size for chunked inference (keeps memory bounded on CPU/large scenes).
# The model is fully convolutional so any tile size works; 256 is a safe
# default for CPU inference. Increase if you have a GPU with more memory.
TILE_SIZE = 256

_model: Optional[torch.nn.Module] = None
_device: Optional[torch.device] = None


class ModelNotAvailableError(Exception):
    """Raised when the .pth weights file is missing or fails to load."""
    pass


def load_model() -> torch.nn.Module:
    """Load (or return cached) Sentinel2SR model with trained weights."""
    global _model, _device

    if _model is not None:
        return _model

    if not WEIGHTS_PATH.exists():
        raise ModelNotAvailableError(
            f"Model weights not found at {WEIGHTS_PATH}. "
            "Copy sentinel2_sr_inference.pth into backend/app/ml/weights/ "
            "(note: the .pth file IS a zip container internally - if you "
            "were given it as a .zip, just rename it to .pth, don't extract it)."
        )

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
        # Not fatal, but almost certainly means architecture drifted from
        # what was actually trained - surface it loudly instead of
        # silently serving a mismatched model.
        raise ModelNotAvailableError(
            f"Loaded model has {params:,} parameters, expected "
            f"{EXPECTED_PARAMS:,}. The architecture in app/ml/model.py no "
            "longer matches the trained checkpoint."
        )

    _model = model
    _device = device
    return _model


def _infer_tile(model: torch.nn.Module, device: torch.device, tile: np.ndarray) -> np.ndarray:
    """Run the model on a single (C, H, W) float32 tile."""
    x = torch.from_numpy(tile).unsqueeze(0).to(device)
    with torch.no_grad():
        y = model(x)
    return y.squeeze(0).cpu().numpy()


def run_super_resolution(input_path: str, output_path: str) -> dict:
    """
    Run 4x super-resolution on a preprocessed (normalized) GeoTIFF and
    write the result to output_path as a new GeoTIFF with an updated,
    correctly-scaled geotransform.

    Assumes the input's first 4 bands are, in order, B02, B03, B04, B08
    (matching the AI teammate's training setup). If the file has more
    bands, only the first 4 are used; if fewer than 4, raises ValueError.
    """
    model = load_model()
    device = _device

    with rasterio.open(input_path) as src:
        image = src.read().astype(np.float32)  # (bands, H, W)
        band_count, height, width = image.shape

        if band_count < IN_CHANNELS:
            raise ValueError(
                f"Input has {band_count} band(s); the model needs at least "
                f"{IN_CHANNELS} (B02, B03, B04, B08)."
            )

        image = image[:IN_CHANNELS]

        out_h, out_w = height * SCALE, width * SCALE
        output = np.zeros((OUT_CHANNELS, out_h, out_w), dtype=np.float32)

        # Simple non-overlapping grid tiling. Good enough for a working
        # demo; may show faint seams at tile borders on large scenes since
        # each tile only sees its own local context. Adding overlap +
        # blending is a natural next improvement, not required for the
        # pipeline to function.
        for y0 in range(0, height, TILE_SIZE):
            y1 = min(y0 + TILE_SIZE, height)
            for x0 in range(0, width, TILE_SIZE):
                x1 = min(x0 + TILE_SIZE, width)

                tile = image[:, y0:y1, x0:x1]
                sr_tile = _infer_tile(model, device, tile)

                oy0, oy1 = y0 * SCALE, y1 * SCALE
                ox0, ox1 = x0 * SCALE, x1 * SCALE
                output[:, oy0:oy1, ox0:ox1] = sr_tile

        # Correctly scale the geotransform so the output GeoTIFF still
        # lines up spatially (pixel size shrinks by SCALE).
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
        )

        with rasterio.open(output_path, "w", **profile) as dst:
            dst.write(output)

    return {
        "input_width": width,
        "input_height": height,
        "output_width": out_w,
        "output_height": out_h,
        "scale_factor": SCALE,
        "output_path": str(output_path),
    }
