from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.app.api.v1.router import api_router
from backend.app.db.base import Base
from backend.app.db.session import engine

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Jewellery Shop API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health():
    return {"status": "ok"}

app.include_router(api_router, prefix="/api/v1")