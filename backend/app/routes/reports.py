from fastapi import APIRouter

router = APIRouter(
    prefix="/reports",
    tags=["Reports"],
)


@router.get("/")
def get_reports():
    return {
        "status": "success",
        "reports": []
    }


@router.post("/generate")
def generate_report():
    return {
        "status": "pending",
        "message": "Report generation will be connected later"
    }
