from pydantic import BaseModel, ConfigDict
from typing import List, Optional
from decimal import Decimal
from datetime import datetime

# 1. SKU 規格單項 Schema
class SKUCreate(BaseModel):
    sku_name: str  # 例如: "紅色, XL"
    price: Decimal
    stock: int
    sku_image: Optional[str] = None

class SKUOut(SKUCreate):
    id: int
    product_id: int

    model_config = ConfigDict(from_attributes=True)

# 2. 商品建立 Schema
class ProductCreate(BaseModel):
    title: str
    description: Optional[str] = None
    cover_image: Optional[str] = None
    skus: List[SKUCreate]  # 建立商品時同步建立多個 SKU 規格

# 3. 商品列表/詳情回傳 Schema
class ProductOut(BaseModel):
    id: int
    seller_id: int
    title: str
    description: Optional[str] = None
    cover_image: Optional[str] = None
    status: str
    created_at: datetime
    skus: List[SKUOut] = []

    model_config = ConfigDict(from_attributes=True)