from pydantic import BaseModel, Field
from typing import Optional

class Product(BaseModel):
    name: str
    description: str
    price: float
    image_url: str
    stock: int = 0
    category: Optional[str] = None

class ProductResponse(Product):
    id: str = Field(alias="_id")

    class Config:
        populate_by_name = True