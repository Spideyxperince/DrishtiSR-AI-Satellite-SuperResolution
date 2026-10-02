from pathlib import Path

import cv2
import numpy as np
import rasterio


def bicubic_upscale(input_path: str, output_path: str):
    """
    Upscale a GeoTIFF from 10m resolution to approximately 4m
    using Bicubic interpolation.
    """

    with rasterio.open(input_path) as src:

        # Read all bands
        image = src.read()

        # Original dimensions
        bands, height, width = image.shape

        # Calculate scale factor
        scale_factor = 10 / 4

        # New dimensions
        new_width = int(width * scale_factor)
        new_height = int(height * scale_factor)

        # Create output array
        upscaled = np.zeros(
            (bands, new_height, new_width),
            dtype=np.float32
        )

        # Upscale every band independently
        for i in range(bands):

            band = image[i]

            upscaled[i] = cv2.resize(
                band,
                (new_width, new_height),
                interpolation=cv2.INTER_CUBIC
            )

        # Update geographic transform
        transform = src.transform * src.transform.scale(
            width / new_width,
            height / new_height
        )

        # Copy original GeoTIFF profile
        profile = src.profile.copy()

        profile.update(
            width=new_width,
            height=new_height,
            transform=transform,
            dtype=rasterio.float32,
            compress="lzw"
        )

        # Save output
        with rasterio.open(
            output_path,
            "w",
            **profile
        ) as dst:

            dst.write(upscaled)

    return {
        "input_width": width,
        "input_height": height,
        "output_width": new_width,
        "output_height": new_height,
        "scale_factor": scale_factor,
        "output_path": output_path,
    }


if __name__ == "__main__":

    input_file = "../../backend/processed/sample_processed.tif"

    output_file = "../outputs/sample_bicubic_4m.tif"

    Path(output_file).parent.mkdir(
        parents=True,
        exist_ok=True
    )

    result = bicubic_upscale(
        input_file,
        output_file
    )

    print("Bicubic upscaling completed!")
    print(f"Input size: {result['input_width']} x {result['input_height']}")
    print(f"Output size: {result['output_width']} x {result['output_height']}")
    print(f"Scale factor: {result['scale_factor']}")
    print(f"Output: {result['output_path']}")
