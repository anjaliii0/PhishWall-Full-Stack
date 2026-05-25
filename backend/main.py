from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routers.qr_routes import router as qr_router
from routers.message_routes import router as message_router
from routers.url_routes import router as url_router

app = FastAPI(
    title="PhishWall API",
    description="FastAPI backend for SMS, Email and URL phishing detection",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://phish-wall-full-stack-opal.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(message_router)
#app.include_router(url_router)
app.include_router(qr_router)

@app.get("/")
def home():
    return {
        "message": "PhishWall FastAPI backend is running"
    }