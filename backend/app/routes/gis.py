from fastapi import APIRouter

router = APIRouter(
    prefix="/gis",
    tags=["GIS"],
)


@router.get("/map")
def get_map_data():
    return {
        "status": "pending",
        "message": "GIS data will be provided by the geospatial module",
        "features": []
    }