# app/api/v1/endpoints/auth.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from backend.app.core.security import hash_password, verify_password, create_access_token
from backend.app.db.session import get_db
from backend.app.models.user import User
from backend.app.schema.user import RegisterRequest, UserOut, LoginRequest, TokenOut

router = APIRouter(prefix="/auth", tags=["Auth"])   # sab URL /auth se shuru honge

@router.post("/register", response_model=UserOut)
def register(data: RegisterRequest, db: Session = Depends(get_db)):
    if db.query(User).filter(User.email == data.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")
    user = User(name=data.name, email=data.email, password_hash=hash_password(data.password))
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

@router.post("/login", response_model=TokenOut)
def login(data: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == data.email).first()
    if not user or not verify_password(data.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Wrong email or password")
    return TokenOut(access_token=create_access_token(user.id))