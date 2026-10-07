from pathlib import Path

import numpy as np
import rasterio
from rasterio.windows import Window


# Read the image a few rows at a time instead of all at once
STRIP_ROWS = 256


def get_raster_metadata(file_path: str):
    with rasterio.open(file_path) as src:

        metadata = {
            "width": src.width,
            "height": src.height,
            "band_count": src.count,
            "crs": str(src.crs),
            "transform": list(src.transform),
            "bounds": {
                "left": src.bounds.left,
                "bottom": src.bounds.bottom,
                "right": src.bounds.right,
                "top": src.bounds.top,
            },
            "resolution": {
                "x": src.res[0],
                "y": src.res[1],
            },
            "dtype": src.dtypes[0],
        }

        return metadata


def _strips(src):
    for row in range(0, src.height, STRIP_ROWS):
        yield Window(0, row, src.width, min(STRIP_ROWS, src.height - row))


def _clean(data):
    data = data.astype(np.float32)
    return np.nan_to_num(data, nan=0.0, posinf=0.0, neginf=0.0)


def preprocess_raster(file_path: str, output_dir: str):
    """Normalize every band to 0-1 and save it in output_dir."""

    output_folder = Path(output_dir)
    output_folder.mkdir(parents=True, exist_ok=True)

    input_name = Path(file_path).stem
    output_path = output_folder / f"{input_name}_processed.tif"

    with rasterio.open(file_path) as src:

        # Pass 1: find the min and max of every band (small memory use)
        low = np.full(src.count, np.inf, dtype=np.float64)
        high = np.full(src.count, -np.inf, dtype=np.float64)

        for window in _strips(src):
            data = _clean(src.read(window=window))
            low = np.minimum(low, data.min(axis=(1, 2)))
            high = np.maximum(high, data.max(axis=(1, 2)))

        # Pass 2: normalize each strip and write it out
        profile = src.profile.copy()
        profile.update(
            dtype=rasterio.float32,
            count=src.count,
            compress="lzw",
        )

        with rasterio.open(output_path, "w", **profile) as dst:
            for window in _strips(src):
                data = _clean(src.read(window=window))

                for i in range(src.count):
                    if high[i] > low[i]:
                        data[i] = (data[i] - low[i]) / (high[i] - low[i])

                dst.write(data, window=window)

        return {
            "width": src.width,
            "height": src.height,
            "band_count": src.count,
            "crs": str(src.crs),
            "transform": src.transform,
            "bounds": src.bounds,
            "output_path": str(output_path),
        }
