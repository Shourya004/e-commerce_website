FROM python:3.12-slim

WORKDIR /code

# pehle requirements copy karke install (taaki cache ho jaye)
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# phir baaki code
COPY . .

CMD ["uvicorn", "backend.app.main:app", "--host", "0.0.0.0", "--port", "8000"]