from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.app.core.database import init_db
from backend.app.api.auth import router as auth_router

app = FastAPI(title="Shopee Clone API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 註冊 API 路由
app.include_router(auth_router)

@app.on_event("startup")
def startup_event():
    try:
        init_db()
        print("Database tables created successfully!")
    except Exception as e:
        print(f"Error initializing database: {e}")

@app.get("/")
def read_root():
    return {"status": "success", "message": "Shopee Backend API is running!"}