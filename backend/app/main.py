from fastapi import FastAPI
from backend.app.routes.test import router as test_router

app = FastAPI(
    title="GlobeTrotter API",
    description="Backend API for the GlobeTrotter travel planning application",
    version="1.0.0"
)


@app.get("/")
def root():
    return {
        "message": "GlobeTrotter API is running",
        "status": "success"
    }


@app.get("/health")
def health_check():
    return {
        "status": "healthy"
    }


app.include_router(test_router)