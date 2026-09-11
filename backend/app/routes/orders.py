from fastapi import APIRouter, HTTPException, Depends
from app.database import order_collection, user_collection
from app.models.order import OrderCreate
from app.dependencies import get_current_user, get_current_admin
from bson import ObjectId
from datetime import datetime

router = APIRouter(prefix="/orders", tags=["Orders"])

def order_helper(order) -> dict:
    order["_id"] = str(order["_id"])
    return order

@router.post("/")
async def create_order(order: OrderCreate, user=Depends(get_current_user)):
    user_doc = await user_collection.find_one({"_id": ObjectId(user["sub"])})
    if not user_doc:
        raise HTTPException(status_code=404, detail="User not found")

    # Save phone on the user's account too, so it's remembered for next time
    await user_collection.update_one(
        {"_id": ObjectId(user["sub"])}, {"$set": {"phone": order.phone}}
    )

    new_order = {
        "email": user_doc["email"],
        "phone": order.phone,
        "items": [item.model_dump() for item in order.items],
        "total": order.total,
        "created_at": datetime.utcnow(),
    }
    result = await order_collection.insert_one(new_order)
    created = await order_collection.find_one({"_id": result.inserted_id})
    return order_helper(created)

@router.get("/")
async def list_orders(admin=Depends(get_current_admin)):
    orders = []
    async for order in order_collection.find().sort("created_at", -1):
        orders.append(order_helper(order))
    return orders
@router.delete("/{order_id}")
async def delete_order(order_id: str, admin=Depends(get_current_admin)):
    result = await order_collection.delete_one({"_id": ObjectId(order_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Order not found")
    return {"message": "Order deleted"}