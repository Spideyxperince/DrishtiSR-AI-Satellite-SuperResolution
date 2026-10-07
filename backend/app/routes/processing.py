import threading
from pathlib import Path

from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse, Response
from pydantic import BaseModel

from app.services.preview_service import render_preview_png
from app.services.sr_service import run_super_resolution, ModelNotAvailableError
from app.session import get_state, processed_dir


router = APIRouter(
    prefix="/processing",
    tags=["Processing"],
)


# The small server can only enhance one image at a time
_sr_lock = threading.Lock()


class SuperResolutionRequest(BaseModel):
    filename: str


def _state_response(state: dict):
    return {
        "status": state["status"],
        "stage": state["stage"],
        "progress": state["progress"],
        "input_filename": state["input_filename"],
        "output_filename": state["output_filename"],
        "input_size": state.get("input_size"),
        "output_size": state.get("output_size"),
        "input_resolution": state["input_resolution"],
        "target_resolution": state["target_resolution"],
    }


# --------------------------------------------------
# Processing Status (the website polls this to fill the progress bar)
# --------------------------------------------------

@router.get("/status")
def processing_status(sid: str | None = None):
    return _state_response(get_state(sid))


# --------------------------------------------------
# Start Super Resolution
# --------------------------------------------------

@router.post("/super-resolution")
def super_resolution(request: SuperResolutionRequest, sid: str | None = None):

    state = get_state(sid)
    folder = processed_dir(sid)

    filename = Path(request.filename).name

    processed_file = folder / filename

    if not processed_file.exists():
        raise HTTPException(
            status_code=404,
            detail=(
                f"Processed file not found: {filename}. "
                "Please preprocess the image first."
            ),
        )

    if not _sr_lock.acquire(blocking=False):
        raise HTTPException(
            status_code=503,
            detail=(
                "Another image is being enhanced right now. "
                "Please try again in a minute."
            ),
        )

    try:
        # Mark as running before we start the (potentially slow) inference call.
        state["status"] = "running"
        state["stage"] = "Loading AI model"
        state["progress"] = 0
        state["input_filename"] = filename
        state["output_filename"] = None
        state["input_size"] = None
        state["output_size"] = None

        output_filename = f"{processed_file.stem}_sr_4x.tif"
        output_file = folder / output_filename

        def report_progress(done_tiles: int, total_tiles: int):
            # Stay at 99% until the file is completely written
            percent = int(done_tiles * 100 / total_tiles) if total_tiles else 0
            state["progress"] = min(percent, 99)
            state["stage"] = (
                f"Enhancing image ({done_tiles} of {total_tiles} tiles)"
            )

        try:
            result = run_super_resolution(
                input_path=str(processed_file),
                output_path=str(output_file),
                progress_callback=report_progress,
            )
        except ModelNotAvailableError as error:
            state["status"] = "failed"
            state["stage"] = "Model unavailable"
            raise HTTPException(status_code=503, detail=str(error))
        except ValueError as error:
            state["status"] = "failed"
            state["stage"] = "Invalid input"
            raise HTTPException(status_code=400, detail=str(error))
        except Exception as error:
            state["status"] = "failed"
            state["stage"] = "Inference error"
            raise HTTPException(
                status_code=500,
                detail=f"Super resolution inference failed: {error}",
            )

        state["status"] = "completed"
        state["stage"] = "Completed"
        state["progress"] = 100
        state["output_filename"] = output_filename
        state["input_size"] = {
            "width": result["input_width"],
            "height": result["input_height"],
        }
        state["output_size"] = {
            "width": result["output_width"],
            "height": result["output_height"],
        }

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
    finally:
        _sr_lock.release()


# --------------------------------------------------
# Processing Results
# --------------------------------------------------

@router.get("/results")
def get_results(sid: str | None = None):
    return _state_response(get_state(sid))


# --------------------------------------------------
# Serve Processed GeoTIFF
# --------------------------------------------------

@router.get("/output/{filename}")
def get_output_file(filename: str, sid: str | None = None):

    safe_filename = Path(filename).name

    file_path = processed_dir(sid) / safe_filename

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


# --------------------------------------------------
# Preview picture (PNG) of a processed GeoTIFF
# --------------------------------------------------

@router.get("/preview/{filename}")
def get_preview(filename: str, sid: str | None = None):

    safe_filename = Path(filename).name

    if not safe_filename.lower().endswith((".tif", ".tiff")):
        raise HTTPException(
            status_code=400,
            detail="Previews are only available for GeoTIFF files",
        )

    file_path = processed_dir(sid) / safe_filename

    if not file_path.exists():
        raise HTTPException(
            status_code=404,
            detail=f"File not found: {safe_filename}",
        )

    try:
        png = render_preview_png(str(file_path))
    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail=f"Could not create the preview: {error}",
        )

    return Response(
        content=png,
        media_type="image/png",
        headers={"Cache-Control": "no-cache"},
    )
