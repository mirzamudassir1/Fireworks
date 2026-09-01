from fastapi import APIRouter, HTTPException
from app.database import product_collection
from app.models.product import Product
from bson import ObjectId

router = APIRouter(prefix="/products", tags=["Products"])

def product_helper(product) -> dict:
    product["_id"] = str(product["_id"])
    return product

@router.post("/")
async def create_product(product: Product):
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