from fastapi import APIRouter

router = APIRouter(
    prefix="/validation",
    tags=["Validation"],
)


@router.get("/confidence")
def confidence_map():
    return {
        "status": "pending",
        "message": "Confidence map will be provided by AI model"
    }


@router.get("/spectral")
def spectral_validation():
    return {
        "status": "pending",
        "message": "Spectral validation will be provided by validation module"
    }


@router.get("/geographic")
def geographic_validation():
    return {
        "status": "pending",
        "message": "Geographic validation will be provided by GIS module"
    }


@router.get("/hallucination")
def hallucination_check():
    return {
        "status": "pending",
        "message": "Hallucination detection will be provided by AI module"
    }