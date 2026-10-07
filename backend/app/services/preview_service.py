"""
Turns a GeoTIFF into a small PNG picture that a web page can show.

Bands are expected in the order B02, B03, B04, B08, so the natural-colour
picture uses band 3 (red), band 2 (green) and band 1 (blue).
No extra libraries are needed: the PNG file is written by hand.
"""

import struct
import zlib

import numpy as np
import rasterio
from rasterio.enums import Resampling

# Longest side of the preview picture, in pixels
MAX_PREVIEW_SIZE = 1200


def _png_bytes(rgb: np.ndarray) -> bytes:
    """Encode an (H, W, 3) uint8 array as a PNG file."""
    height, width, _ = rgb.shape

    # Each row starts with a filter byte (0 = no filter)
    rows = np.zeros((height, 1 + width * 3), dtype=np.uint8)
    rows[:, 1:] = rgb.reshape(height, width * 3)

    def chunk(tag: bytes, data: bytes) -> bytes:
        body = tag + data
        return (
            struct.pack(">I", len(data))
            + body
            + struct.pack(">I", zlib.crc32(body) & 0xFFFFFFFF)
        )

    return (
        b"\x89PNG\r\n\x1a\n"
        + chunk(b"IHDR", struct.pack(">IIBBBBB", width, height, 8, 2, 0, 0, 0))
        + chunk(b"IDAT", zlib.compress(rows.tobytes(), 6))
        + chunk(b"IEND", b"")
    )


def _to_rgb8(data: np.ndarray) -> np.ndarray:
    """
    Stretch (3, H, W) float data to a (H, W, 3) uint8 picture.
    Each band is stretched between its 2nd and 98th percentile so the
    picture has good contrast. Original and enhanced images use the same
    method, so they can be compared side by side.
    """
    data = np.nan_to_num(data.astype(np.float32), nan=0.0, posinf=0.0, neginf=0.0)

    stretched = np.zeros_like(data)
    for i in range(data.shape[0]):
        band = data[i]
        valid = band[band != 0]
        if valid.size < 10:
            valid = band.ravel()

        low, high = np.percentile(valid, (2, 98))
        if high <= low:
            high = low + 1e-6

        stretched[i] = np.clip((band - low) / (high - low), 0.0, 1.0)

    rgb = (stretched * 255.0 + 0.5).astype(np.uint8)
    return np.ascontiguousarray(np.transpose(rgb, (1, 2, 0)))


def render_preview_png(file_path: str, max_size: int = MAX_PREVIEW_SIZE) -> bytes:
    """Read a GeoTIFF (shrunk if it is large) and return it as PNG bytes."""
    with rasterio.open(file_path) as src:
        scale = min(1.0, max_size / max(src.width, src.height))
        out_w = max(1, int(round(src.width * scale)))
        out_h = max(1, int(round(src.height * scale)))

        if src.count >= 4:
            indexes = [3, 2, 1]  # B04, B03, B02 = natural colour
        elif src.count == 3:
            indexes = [1, 2, 3]
        else:
            indexes = [1, 1, 1]  # single band shown as grey

        data = src.read(
            indexes,
            out_shape=(len(indexes), out_h, out_w),
            resampling=Resampling.average,
        )

    return _png_bytes(_to_rgb8(data))
