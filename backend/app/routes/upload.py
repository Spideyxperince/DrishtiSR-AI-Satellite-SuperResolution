from pathlib import Path

from fastapi import APIRouter, File, UploadFile, HTTPException

from app.services.raster_service import (
    get_raster_metadata,
    preprocess_raster,
)


router = APIRouter(
    prefix="/upload",
    tags=["Upload"],
)


UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)


@router.post("/")
async def upload_file(file: UploadFile = File(...)):

    if not file.filename:
        raise HTTPException(
            status_code=400,
            detail="No file selected"
        )

    filename = file.filename.lower()

    allowed_extensions = [
        ".tif",
        ".tiff",
        ".zip",
    ]

    if not any(filename.endswith(ext) for ext in allowed_extensions):
        raise HTTPException(
            status_code=400,
            detail="Only .tif, .tiff and .zip files are supported"
        )

    file_path = UPLOAD_DIR / Path(file.filename).name

    contents = await file.read()

    with open(file_path, "wb") as buffer:
        buffer.write(contents)

    response = {
        "message": "File uploaded successfully",
        "filename": file.filename,
        "size": len(contents),
        "path": str(file_path),
    }

    # Extract GeoTIFF metadata
    if filename.endswith(".tif") or filename.endswith(".tiff"):
        try:
            metadata = get_raster_metadata(str(file_path))
            response["metadata"] = metadata

        except Exception as error:
            response["metadata_error"] = str(error)

    return response

@router.post("/preprocess/{filename}")
async def preprocess_uploaded_file(filename: str):

    file_path = UPLOAD_DIR / Path(filename).name

    if not file_path.exists():
        raise HTTPException(
            status_code=404,
            detail="File not found"
        )

    if not (
        filename.lower().endswith(".tif")
        or filename.lower().endswith(".tiff")
    ):
        raise HTTPException(
            status_code=400,
            detail="Preprocessing currently supports GeoTIFF files only"
        )

    try:
        result = preprocess_raster(str(file_path))

        return {
            "message": "Raster preprocessing completed",
            "filename": filename,
            "width": result["width"],
            "height": result["height"],
            "band_count": result["band_count"],
            "crs": result["crs"],
            "bounds": {
                "left": result["bounds"].left,
                "bottom": result["bounds"].bottom,
                "right": result["bounds"].right,
                "top": result["bounds"].top,
            },
        }

    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail=f"Preprocessing failed: {str(error)}"
        )