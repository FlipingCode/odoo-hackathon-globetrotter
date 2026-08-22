from fastapi import APIRouter, Depends
from sqlalchemy import text
from sqlalchemy.orm import Session

from backend.app.database import get_db


router = APIRouter(
    prefix="/api/v1",
    tags=["Database"]
)


@router.get("/db-test")
def database_test(db: Session = Depends(get_db)):
    result = db.execute(text("SELECT COUNT(*) FROM users"))
    user_count = result.scalar()

    return {
        "database": "connected",
        "users": user_count
    }