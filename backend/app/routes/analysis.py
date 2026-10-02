from fastapi import APIRouter

router = APIRouter(
    prefix="/analysis",
    tags=["Analysis"],
)


@router.get("/crop")
def crop_analysis():
    return {
        "status": "pending",
        "message": "Crop analysis will be connected to the AI/GIS module",
        "data": {}
    }


@router.get("/urban")
def urban_analysis():
    return {
        "status": "pending",
        "message": "Urban analysis will be connected to the AI/GIS module",
        "data": {}
    }


@router.get("/disaster")
def disaster_analysis():
    return {
        "status": "pending",
        "message": "Disaster analysis will be connected to the AI/GIS module",
        "data": {}
    }