# app/api/v1/router.py
from backend.app.api.v1.endpoints import auth, user
from fastapi import APIRouter

api_router = APIRouter()
api_router.include_router(auth.router)
api_router.include_router(user.router)