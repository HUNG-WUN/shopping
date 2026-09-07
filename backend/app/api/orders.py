import uuid
from decimal import Decimal
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from backend.app.core.database import get_db
from backend.app.core.deps import get_current_user
from backend.app.models.user import User
from backend.app.models.shop import CartItem, ProductSKU, Product, Order, OrderItem
from backend.app.schemas.cart_order import OrderCreate, OrderOut

router = APIRouter(prefix="/api/v1/orders", tags=["Orders"])

# 1. 建立訂單 (結帳)
@router.post("/", response_model=OrderOut, status_code=status.HTTP_201_CREATED)
def create_order(
    order_in: OrderCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if not order_in.cart_item_ids:
        raise HTTPException(status_code=400, detail="請選擇至少一項欲結帳商品")

    cart_items = db.query(CartItem).filter(
        CartItem.id.in_(order_in.cart_item_ids),
        CartItem.user_id == current_user.id
    ).all()

    if not cart_items:
        raise HTTPException(status_code=400, detail="找不到對應的購物車項目")

    try:
        total_amount = Decimal("0.0")
        order_number = f"SP{uuid.uuid4().hex[:12].upper()}"

        # 建立訂單主檔
        db_order = Order(
            order_number=order_number,
            buyer_id=current_user.id,
            total_amount=0,
            shipping_address=order_in.shipping_address,
            status="pending"
        )
        db.add(db_order)
        db.flush()

        # 處理各品項：悲觀鎖/庫存檢查、扣庫存、寫入 OrderItem
        for cart_item in cart_items:
            sku = db.query(ProductSKU).filter(ProductSKU.id == cart_item.sku_id).with_for_update().first()
            if not sku or sku.stock < cart_item.quantity:
                raise HTTPException(
                    status_code=400, 
                    detail=f"商品規格 ID:{cart_item.sku_id} 庫存不足 (現有:{sku.stock if sku else 0})"
                )

            product = db.query(Product).filter(Product.id == sku.product_id).first()

            # 扣減庫存
            sku.stock -= cart_item.quantity

            # 計算總價
            item_total = sku.price * cart_item.quantity
            total_amount += item_total

            # 建立訂單快照明細
            order_item = OrderItem(
                order_id=db_order.id,
                sku_id=sku.id,
                product_name=product.title if product else "已刪除商品",
                sku_name=sku.sku_name,
                price=sku.price,
                quantity=cart_item.quantity
            )
            db.add(order_item)

            # 清除對應的購物車項目
            db.delete(cart_item)

        db_order.total_amount = total_amount
        db.commit()
        db.refresh(db_order)
        return db_order

    except Exception as e:
        db.rollback()  # 發生任何異常即刻回滾
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(status_code=500, detail=f"訂單建立失敗: {str(e)}")

# 2. 查詢買家所有訂單
@router.get("/", response_model=List[OrderOut])
def get_user_orders(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    orders = db.query(Order).filter(Order.buyer_id == current_user.id).order_by(Order.created_at.desc()).all()
    return orders