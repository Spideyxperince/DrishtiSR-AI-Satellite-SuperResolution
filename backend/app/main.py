from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes.upload import router as upload_router
from app.routes.processing import router as processing_router

from app.routes.validation import router as validation_router
from app.routes.analysis import router as analysis_router
from app.routes.gis import router as gis_router
from app.routes.reports import router as reports_router
from app.routes.models import router as models_router


app = FastAPI(
    title="SIH 26142 Backend",
    description="Deep Learning Based Super Resolution Mapping",
    version="1.0.0",
)


# Allow frontend to communicate with backend
app.add_middleware(
    CORSMiddleware,
        allow_origins=[
        "https://drishtisr-galaxious.vercel.app",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_origin_regex=r"https://drishtisr-galaxious(-[a-z0-9-]+)?\.vercel\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Routes
app.include_router(upload_router, prefix="/api")
app.include_router(processing_router, prefix="/api")
app.include_router(validation_router, prefix="/api")
app.include_router(analysis_router, prefix="/api")
app.include_router(gis_router, prefix="/api")
app.include_router(reports_router, prefix="/api")
app.include_router(models_router, prefix="/api")



@app.get("/")
def root():
    return {
        "message": "SIH 26142 Backend is running"
    }


@app.get("/health")
def health():
    return {
        "status": "healthy"
    }