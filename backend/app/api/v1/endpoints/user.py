# app/api/v1/endpoints/users.py
from backend.app.api.deps import get_current_user
from backend.app.models.user import User
from backend.app.schema.user import UserOut
from fastapi import APIRouter, Depends

router = APIRouter(prefix="/users", tags=["Users"])

@router.get("/me", response_model=UserOut)
def me(current_user: User = Depends(get_current_user)):
    return current_user