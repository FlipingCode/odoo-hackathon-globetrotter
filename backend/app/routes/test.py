from fastapi import APIRouter

router = APIRouter(
    prefix="/api/v1",
    tags=["Test"]
)


@router.get("/test")
def test_api():
    return {
        "message": "GlobeTrotter API v1 is working"
    }