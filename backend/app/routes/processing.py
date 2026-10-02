from pathlib import Path

from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse
from pydantic import BaseModel

from app.services.sr_service import run_super_resolution, ModelNotAvailableError


router = APIRouter(
    prefix="/processing",
    tags=["Processing"],
)


PROCESSED_DIR = Path("processed")
PROCESSED_DIR.mkdir(parents=True, exist_ok=True)


# Temporary project state
processing_state = {
    "status": "idle",
    "stage": "Waiting for input",
    "input_filename": None,
    "output_filename": None,
    "input_resolution": "10m",
    "target_resolution": "≤4m",
}


class SuperResolutionRequest(BaseModel):
    filename: str


# --------------------------------------------------
# Processing Status
# --------------------------------------------------

@router.get("/status")
def processing_status():
    return {
        "status": processing_state["status"],
        "stage": processing_state["stage"],
        "input_filename": processing_state["input_filename"],
        "output_filename": processing_state["output_filename"],
        "input_resolution": processing_state["input_resolution"],
        "target_resolution": processing_state["target_resolution"],
    }


# --------------------------------------------------
# Start Super Resolution
# --------------------------------------------------

@router.post("/super-resolution")
def super_resolution(request: SuperResolutionRequest):

    filename = Path(request.filename).name

    processed_file = PROCESSED_DIR / filename

    if not processed_file.exists():
        raise HTTPException(
            status_code=404,
            detail=(
                f"Processed file not found: {filename}. "
                "Please preprocess the image first."
            ),
        )

    # Mark as running before we start the (potentially slow) inference call.
    processing_state["status"] = "running"
    processing_state["stage"] = "AI Super Resolution"
    processing_state["input_filename"] = filename
    processing_state["output_filename"] = None

    output_filename = f"{processed_file.stem}_sr_4x.tif"
    output_file = PROCESSED_DIR / output_filename

    try:
        result = run_super_resolution(
            input_path=str(processed_file),
            output_path=str(output_file),
        )
    except ModelNotAvailableError as error:
        processing_state["status"] = "failed"
        processing_state["stage"] = "Model unavailable"
        raise HTTPException(status_code=503, detail=str(error))
    except ValueError as error:
        processing_state["status"] = "failed"
        processing_state["stage"] = "Invalid input"
        raise HTTPException(status_code=400, detail=str(error))
    except Exception as error:
        processing_state["status"] = "failed"
        processing_state["stage"] = "Inference error"
        raise HTTPException(
            status_code=500,
            detail=f"Super resolution inference failed: {error}",
        )

    processing_state["status"] = "completed"
    processing_state["stage"] = "Completed"
    processing_state["output_filename"] = output_filename

    return {
        "status": "completed",
        "message": (
            f"Super resolution completed: {result['input_width']}x"
            f"{result['input_height']} -> {result['output_width']}x"
            f"{result['output_height']} (x{result['scale_factor']})."
        ),
        "filename": filename,
        "input_path": str(processed_file),
        "output": output_filename,
        "target_resolution": "≤4m",
    }


# --------------------------------------------------
# Processing Results
# --------------------------------------------------

@router.get("/results")
def get_results():

    return {
        "status": processing_state["status"],
        "stage": processing_state["stage"],
        "input_filename": processing_state["input_filename"],
        "output_filename": processing_state["output_filename"],
        "input_resolution": processing_state["input_resolution"],
        "target_resolution": processing_state["target_resolution"],
    }


# --------------------------------------------------
# Serve Processed GeoTIFF
# --------------------------------------------------

@router.get("/output/{filename}")
def get_output_file(filename: str):

    safe_filename = Path(filename).name

    file_path = PROCESSED_DIR / safe_filename

    if not file_path.exists():
        raise HTTPException(
            status_code=404,
            detail=f"Output file not found: {safe_filename}",
        )

    return FileResponse(
        path=file_path,
        media_type="image/tiff",
        filename=safe_filename,
    )