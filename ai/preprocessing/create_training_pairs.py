from pathlib import Path

import cv2
import numpy as np
import rasterio


HR_DIR = Path("../dataset/hr")
LR_DIR = Path("../dataset/lr")

HR_DIR.mkdir(parents=True, exist_ok=True)
LR_DIR.mkdir(parents=True, exist_ok=True)


SCALE_FACTOR = 2.5


def create_low_resolution(input_path: str, output_path: str):

    with rasterio.open(input_path) as src:

        image = src.read()

        bands, height, width = image.shape

        # Create lower-resolution dimensions
        new_width = int(width / SCALE_FACTOR)
        new_height = int(height / SCALE_FACTOR)

        low_resolution = np.zeros(
            (bands, new_height, new_width),
            dtype=np.float32
        )

        # Downsample each band
        for i in range(bands):

            low_resolution[i] = cv2.resize(
                image[i],
                (new_width, new_height),
                interpolation=cv2.INTER_AREA
            )

        # Update geographic transform
        transform = src.transform * src.transform.scale(
            width / new_width,
            height / new_height
        )

        profile = src.profile.copy()

        profile.update(
            width=new_width,
            height=new_height,
            transform=transform,
            dtype=rasterio.float32,
            compress="lzw"
        )

        with rasterio.open(
            output_path,
            "w",
            **profile
        ) as dst:

            dst.write(low_resolution)

        print("Training pair created!")
        print(f"HR size: {width} x {height}")
        print(f"LR size: {new_width} x {new_height}")
        print(f"Output: {output_path}")


def create_pairs():

    hr_files = list(HR_DIR.glob("*.tif"))

    if not hr_files:

        print("No high-resolution GeoTIFF files found.")
        print(f"Place HR images inside: {HR_DIR}")
        return

    for hr_file in hr_files:

        output_name = (
            f"{hr_file.stem}_lr.tif"
        )

        lr_file = LR_DIR / output_name

        create_low_resolution(
            str(hr_file),
            str(lr_file)
        )


if __name__ == "__main__":

    create_pairs()
