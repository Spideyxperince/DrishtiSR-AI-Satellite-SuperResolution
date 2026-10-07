import shutil
from pathlib import Path

from fastapi import APIRouter, File, UploadFile, HTTPException

from app.services.raster_service import (
    get_raster_metadata,
    preprocess_raster,
)
from app.session import cleanup_old_sessions, processed_dir, upload_dir


router = APIRouter(
    prefix="/upload",
    tags=["Upload"],
)


@router.post("/")
def upload_file(file: UploadFile = File(...), sid: str | None = None):

    cleanup_old_sessions()
    folder = upload_dir(sid)

    if not file.filename:
        raise HTTPException(status_code=400, detail="No file selected")

    filename = file.filename.lower()

    allowed_extensions = [".tif", ".tiff", ".zip"]

    if not any(filename.endswith(ext) for ext in allowed_extensions):
        raise HTTPException(
            status_code=400,
            detail="Only .tif, .tiff and .zip files are supported",
        )

    file_path = folder / Path(file.filename).name

    try:
        # Copy straight to disk instead of loading the whole file in memory
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail=f"Could not save the uploaded file: {error}",
        )

    response = {
        "message": "File uploaded successfully",
        "filename": file.filename,
        "size": file_path.stat().st_size,
        "path": str(file_path),
    }

    # Extract GeoTIFF metadata
    if filename.endswith(".tif") or filename.endswith(".tiff"):
        try:
            response["metadata"] = get_raster_metadata(str(file_path))
        except Exception as error:
            response["metadata_error"] = str(error)

    return response


@router.post("/preprocess/{filename}")
def preprocess_uploaded_file(filename: str, sid: str | None = None):

    file_path = upload_dir(sid) / Path(filename).name

    if not file_path.exists():
        raise HTTPException(
            status_code=404,
            detail="File not found on the server. Please upload it again.",
        )

    if not (
        filename.lower().endswith(".tif")
        or filename.lower().endswith(".tiff")
    ):
        raise HTTPException(
            status_code=400,
            detail="Preprocessing currently supports GeoTIFF files only",
        )

    try:
        result = preprocess_raster(str(file_path), str(processed_dir(sid)))

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
            detail=f"Preprocessing failed: {str(error)}",
        )
