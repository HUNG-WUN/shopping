from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from backend.app.core.database import get_db
from backend.app.core.deps import get_current_user
from backend.app.models.user import User
from backend.app.models.shop import CartItem, ProductSKU, Product
from backend.app.schemas.cart_order import CartItemCreate, CartItemOut

router = APIRouter(prefix="/api/v1/cart", tags=["Cart"])

# 1. 取得目前使用者的購物車內容
@router.get("/", response_model=List[CartItemOut])
def get_cart(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    items = db.query(CartItem).filter(CartItem.user_id == current_user.id).all()
    result = []
    for item in items:
        sku = db.query(ProductSKU).filter(ProductSKU.id == item.sku_id).first()
        product = db.query(Product).filter(Product.id == sku.product_id).first() if sku else None
        if sku and product:
            result.append({
                "id": item.id,
                "sku_id": item.sku_id,
                "quantity": item.quantity,
                "sku_name": sku.sku_name,
                "price": sku.price,
                "stock": sku.stock,
                "product_title": product.title,
                "cover_image": product.cover_image,
            })
    return result

# 2. 加入購物車 (若已有同規格則累加數量)
@router.post("/", status_code=status.HTTP_201_CREATED)
def add_to_cart(
    item_in: CartItemCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    sku = db.query(ProductSKU).filter(ProductSKU.id == item_in.sku_id).first()
    if not sku or sku.stock < item_in.quantity:
        raise HTTPException(status_code=400, detail="商品規格不存在或庫存不足")

    existing_item = db.query(CartItem).filter(
        CartItem.user_id == current_user.id,
        CartItem.sku_id == item_in.sku_id
    ).first()

    if existing_item:
        if sku.stock < (existing_item.quantity + item_in.quantity):
            raise HTTPException(status_code=400, detail="加上已在購物車的數量後超過庫存上限")
        existing_item.quantity += item_in.quantity
    else:
        new_item = CartItem(
            user_id=current_user.id,
            sku_id=item_in.sku_id,
            quantity=item_in.quantity
        )
        db.add(new_item)

    db.commit()
    return {"status": "success", "message": "已加入購物車"}

# 3. 刪除購物車項目
@router.delete("/{cart_item_id}")
def delete_cart_item(
    cart_item_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    cart_item = db.query(CartItem).filter(
        CartItem.id == cart_item_id,
        CartItem.user_id == current_user.id
    ).first()
    if not cart_item:
        raise HTTPException(status_code=404, detail="購物車項目不存在")

    db.delete(cart_item)
    db.commit()
    return {"status": "success", "message": "已自購物車移除"}