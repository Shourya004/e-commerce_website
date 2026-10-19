import bcrypt
from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session

from backend.app.db.base import Base
from backend.app.db.session import engine, get_db
from backend.app.models.user import User
from backend.app.schema.user import RegisterRequest, UserOut

# Tables bana do agar nahi hain (baad mein iski jagah Alembic aayega)
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Jewellery Shop API")

@app.get("/health")
def health():
    return {"status": "ok"}

@app.post("/auth/register", response_model=UserOut)
def register(data: RegisterRequest, db: Session = Depends(get_db)):
    # 1. Email pehle se hai kya?
    existing = db.query(User).filter(User.email == data.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    # 2. Password hash kar (plain password kabhi save nahi karte)
    hashed = bcrypt.hashpw(data.password.encode(), bcrypt.gensalt()).decode()

    # 3. User bana ke DB mein save kar
    user = User(name=data.name, email=data.email, password_hash=hashed)
    db.add(user)
    db.commit()
    db.refresh(user)
    return user