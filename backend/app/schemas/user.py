from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

# 註冊請求用 Schema
class UserCreate(BaseModel):
    email: EmailStr
    username: str
    password: str
    phone: Optional[str] = None
    is_seller: Optional[bool] = False

# 登入請求用 Schema
class UserLogin(BaseModel):
    email: EmailStr
    password: str

# Token 回傳 Schema
class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"

# 用戶資訊回傳 Schema (自動隱藏密碼)
class UserOut(BaseModel):
    id: int
    email: EmailStr
    username: str
    phone: Optional[str] = None
    avatar_url: Optional[str] = None
    is_seller: bool
    created_at: datetime

    class Config:
        from_attributes = True