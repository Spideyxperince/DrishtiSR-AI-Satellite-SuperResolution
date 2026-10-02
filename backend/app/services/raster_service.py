from pathlib import Path

import rasterio
import numpy as np


PROCESSED_DIR = Path("processed")
PROCESSED_DIR.mkdir(parents=True, exist_ok=True)


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


def preprocess_raster(file_path: str):

    with rasterio.open(file_path) as src:

        # Read all bands
        image = src.read()

        # Convert to float32
        image = image.astype(np.float32)

        # Replace invalid values
        image = np.nan_to_num(
            image,
            nan=0.0,
            posinf=0.0,
            neginf=0.0
        )

        # Normalize each band independently
        normalized = np.zeros_like(
            image,
            dtype=np.float32
        )

        for i in range(image.shape[0]):

            band = image[i]

            min_value = np.min(band)
            max_value = np.max(band)

            if max_value > min_value:
                normalized[i] = (
                    (band - min_value)
                    / (max_value - min_value)
                )
            else:
                normalized[i] = band

        # Create processed filename
        input_name = Path(file_path).stem
        output_path = PROCESSED_DIR / f"{input_name}_processed.tif"

        # Copy original GeoTIFF profile
        profile = src.profile.copy()

        # Update profile for processed data
        profile.update(
            dtype=rasterio.float32,
            count=src.count,
            compress="lzw"
        )

        # Save normalized image
        with rasterio.open(output_path, "w", **profile) as dst:

            dst.write(normalized)

        return {
            "bands": normalized,
            "width": src.width,
            "height": src.height,
            "band_count": src.count,
            "crs": str(src.crs),
            "transform": src.transform,
            "bounds": src.bounds,
            "output_path": str(output_path),
        }