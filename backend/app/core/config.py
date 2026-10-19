from pathlib import Path
from pydantic_settings import BaseSettings, SettingsConfigDict

# config.py -> core -> app -> backend
BASE_DIR = Path(__file__).resolve().parents[2]

class Settings(BaseSettings):
    DATABASE_URL: str

    model_config = SettingsConfigDict(env_file=BASE_DIR / ".env",extra="ignore",)

settings = Settings()