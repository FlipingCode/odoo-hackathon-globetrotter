from fastapi import FastAPI
from sqlalchemy import text

from backend.app.database import engine
from backend.app.routes.db_test import router as db_test_router

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


@app.get("/api/v1/db-test")
def database_test():
    with engine.connect() as connection:
        result = connection.execute(text("SELECT 1"))
        value = result.scalar()

    return {
        "database": "connected",
        "result": value
    }

app.include_router(db_test_router)