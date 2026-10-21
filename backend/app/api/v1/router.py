# app/api/v1/router.py
from fastapi import APIRouter
from app.api.v1.endpoints import auth, user

api_router = APIRouter()
api_router.include_router(auth.router)
api_router.include_router(user.router)