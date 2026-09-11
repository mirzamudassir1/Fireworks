from fastapi import APIRouter, HTTPException, Depends
from app.database import product_collection
from app.models.product import Product
from app.dependencies import get_current_admin
from bson import ObjectId

router = APIRouter(prefix="/products", tags=["Products"])

def product_helper(product) -> dict:
    product["_id"] = str(product["_id"])
    return product

@router.post("/")
async def create_product(product: Product, admin=Depends(get_current_admin)):
    result = await product_collection.insert_one(product.model_dump())
    new_product = await product_collection.find_one({"_id": result.inserted_id})
    return product_helper(new_product)

@router.get("/")
async def list_products():
    products = []
    async for product in product_collection.find():
        products.append(product_helper(product))
    return products

@router.get("/{product_id}")
async def get_product(product_id: str):
    product = await product_collection.find_one({"_id": ObjectId(product_id)})
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product_helper(product)

@router.put("/{product_id}")
async def update_product(product_id: str, product: Product, admin=Depends(get_current_admin)):
    result = await product_collection.update_one(
        {"_id": ObjectId(product_id)}, {"$set": product.model_dump()}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Product not found")
    updated = await product_collection.find_one({"_id": ObjectId(product_id)})
    return product_helper(updated)

@router.delete("/{product_id}")
async def delete_product(product_id: str, admin=Depends(get_current_admin)):
    result = await product_collection.delete_one({"_id": ObjectId(product_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Product not found")
    return {"message": "Product deleted"}