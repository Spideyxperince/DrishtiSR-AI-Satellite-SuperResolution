from fastapi import APIRouter

router = APIRouter(
    prefix="/models",
    tags=["Models"],
)


@router.get("/")
def get_models():
    return {
        "status": "success",
        "models": [
            {
                "name": "Bicubic",
                "type": "Baseline",
                "status": "available"
            },
            {
                "name": "AI Super Resolution",
                "type": "Deep Learning",
                "status": "pending"
            }
        ]
    }


@router.get("/{model_name}")
def get_model(model_name: str):
    return {
        "status": "pending",
        "model": model_name,
        "message": "Model details will be connected later"
    }