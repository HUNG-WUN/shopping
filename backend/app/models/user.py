from sqlalchemy import Column, Integer, String, Boolean, DateTime, func
from sqlalchemy.orm import declarative_base

Base = declarative_base()

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, nullable=False, index=True)
    username = Column(String(100), unique=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    phone = Column(String(20), nullable=True)
    avatar_url = Column(String(500), nullable=True)
    is_seller = Column(Boolean, default=False)  # 是否開通賣家功能
    created_at = Column(DateTime, server_default=func.now())