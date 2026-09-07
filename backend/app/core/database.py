import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from backend.app.models.user import Base

# 優先讀取 Docker 環境變數，若無則降級為本地開發連線
DATABASE_URL = os.getenv("DATABASE_URL", "mysql+pymysql://shopee_user:shopee_password@localhost:3306/shopee_db")

engine = create_engine(DATABASE_URL, pool_pre_ping=True)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Dependency 提供給 FastAPI 各路由使用
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# 自動建立所有未存在的 Tables
def init_db():
    Base.metadata.create_all(bind=engine)