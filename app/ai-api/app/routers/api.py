from fastapi import APIRouter, Depends
from app.routers import (
    features, prediction, upload
)
from app.core.security import get_api_key

api_router = APIRouter(
    prefix="/ml_api",
    tags=["API"],
    responses={404: {"description": "Not found"}},
    #dependencies=[Depends(get_api_key)],
)


api_router.include_router(features.router)
api_router.include_router(prediction.router)
api_router.include_router(upload.router)
