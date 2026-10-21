# app/api/v1/endpoints/users.py
from fastapi import APIRouter, Depends
from app.api.deps import get_current_user
from app.models.user import User
from app.schema.user import UserOut

router = APIRouter(prefix="/users", tags=["Users"])

@router.get("/me", response_model=UserOut)
def me(current_user: User = Depends(get_current_user)):
    return current_user