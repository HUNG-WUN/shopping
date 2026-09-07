from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from backend.app.core.database import get_db
from backend.app.core.deps import get_current_user
from backend.app.models.user import User
from backend.app.models.shop import Product, ProductSKU
from backend.app.schemas.product import ProductCreate, ProductOut

router = APIRouter(prefix="/api/v1/products", tags=["Products"])

# 1. 取得商品列表 (支援關鍵字搜尋與分頁)
@router.get("/", response_model=List[ProductOut])
def list_products(
    keyword: Optional[str] = None,
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db)
):
    query = db.query(Product).filter(Product.status == "active")
    if keyword:
        query = query.filter(Product.title.ilike(f"%{keyword}%"))
    
    products = query.offset(skip).limit(limit).all()
    return products

# 2. 取得單一商品詳情 (含所有 SKUs 規格)
@router.get("/{product_id}", response_model=ProductOut)
def get_product(product_id: int, db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.id == product_id, Product.status == "active").first()
    if not product:
        raise HTTPException(status_code=404, detail="商品不存在或已下架")
    return product

# 3. 賣家新增商品 (含規格批次建立)
@router.post("/", response_model=ProductOut, status_code=status.HTTP_201_CREATED)
def create_product(
    product_in: ProductCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if not current_user.is_seller:
        raise HTTPException(status_code=403, detail="您尚未開通賣家權限，無法上架商品")

    if not product_in.skus:
        raise HTTPException(status_code=400, detail="商品至少需包含一種規格與價格")

    # 建立商品主檔
    db_product = Product(
        seller_id=current_user.id,
        title=product_in.title,
        description=product_in.description,
        cover_image=product_in.cover_image,
    )
    db.add(db_product)
    db.flush()  # 取得自動生成的 db_product.id

    # 批次建立對應的 SKUs 規格
    for sku in product_in.skus:
        db_sku = ProductSKU(
            product_id=db_product.id,
            sku_name=sku.sku_name,
            price=sku.price,
            stock=sku.stock,
            sku_image=sku.sku_image
        )
        db.add(db_sku)

    db.commit()
    db.refresh(db_product)
    return db_product