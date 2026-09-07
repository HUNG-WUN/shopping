from pydantic import BaseModel, ConfigDict
from typing import List, Optional
from decimal import Decimal
from datetime import datetime

# --- 購物車 Schemas ---
class CartItemCreate(BaseModel):
    sku_id: int
    quantity: int

class CartItemOut(BaseModel):
    id: int
    sku_id: int
    quantity: int
    sku_name: str
    price: Decimal
    stock: int
    product_title: str
    cover_image: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)

# --- 訂單 Schemas ---
class OrderCreate(BaseModel):
    shipping_address: str
    cart_item_ids: List[int]  # 前端勾選要結帳的購物車項目 ID 清單

class OrderItemOut(BaseModel):
    id: int
    product_name: str
    sku_name: str
    price: Decimal
    quantity: int

    model_config = ConfigDict(from_attributes=True)

class OrderOut(BaseModel):
    id: int
    order_number: str
    total_amount: Decimal
    status: str
    shipping_address: str
    created_at: datetime
    items: List[OrderItemOut] = []

    model_config = ConfigDict(from_attributes=True)