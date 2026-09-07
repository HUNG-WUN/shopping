from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.app.core.database import init_db

app = FastAPI(title="Shopee Clone API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def startup_event():
    # 容器啟動時自動建立資料庫 Models
    try:
        init_db()
        print("Database tables created successfully!")
    except Exception as e:
        print(f"Error initializing database: {e}")

@app.get("/")
def read_root():
    return {"status": "success", "message": "Shopee Backend API is running!"}