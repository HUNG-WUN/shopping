from sqlalchemy import Column, Integer, String, Text, Numeric, ForeignKey, DateTime, func
from sqlalchemy.orm import relationship
from backend.app.models.user import Base

# 1. 商品主檔
class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    seller_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    title = Column(String(255), nullable=False, index=True)
    description = Column(Text, nullable=True)
    cover_image = Column(String(500), nullable=True)
    status = Column(String(20), default="active")  # active, inactive, deleted
    created_at = Column(DateTime, server_default=func.now())

    # 關聯
    skus = relationship("ProductSKU", back_populates="product", cascade="all, delete-orphan")

# 2. 商品 SKU (多規格庫存與價格，如：紅色/L號)
class ProductSKU(Base):
    __tablename__ = "product_skus"

    id = Column(Integer, primary_primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    sku_name = Column(String(100), nullable=False)  # 例如: "紅色, L號"
    price = Column(Numeric(10, 2), nullable=False)
    stock = Column(Integer, default=0, nullable=False)
    sku_image = Column(String(500), nullable=True)

    product = relationship("Product", back_populates="skus")

# 3. 購物車項目
class CartItem(Base):
    __tablename__ = "cart_items"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    sku_id = Column(Integer, ForeignKey("product_skus.id"), nullable=False)
    quantity = Column(Integer, default=1, nullable=False)
    created_at = Column(DateTime, server_default=func.now())

# 4. 訂單主檔
class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True)
    order_number = Column(String(50), unique=True, nullable=False, index=True)  # 訂單編號
    buyer_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    total_amount = Column(Numeric(10, 2), nullable=False)
    status = Column(String(20), default="pending")  # pending, paid, shipped, completed, cancelled
    shipping_address = Column(Text, nullable=False)
    created_at = Column(DateTime, server_default=func.now())

    items = relationship("OrderItem", back_populates="order")

# 5. 訂單明細 (紀錄購買時的快照資訊)
class OrderItem(Base):
    __tablename__ = "order_items"

    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.id"), nullable=False)
    sku_id = Column(Integer, ForeignKey("product_skus.id"), nullable=False)
    product_name = Column(String(255), nullable=False)  # 避免商品被刪除後找不到名稱
    sku_name = Column(String(100), nullable=False)
    price = Column(Numeric(10, 2), nullable=False)
    quantity = Column(Integer, nullable=False)

    order = relationship("Order", back_populates="items")