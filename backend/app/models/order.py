from pydantic import BaseModel
from typing import List
from datetime import datetime

class OrderItem(BaseModel):
    product_id: str
    name: str
    price: float
    qty: int

class OrderCreate(BaseModel):
    phone: str
    items: List[OrderItem]
    total: float

class OrderResponse(OrderCreate):
    id: str
    email: str
    created_at: datetime