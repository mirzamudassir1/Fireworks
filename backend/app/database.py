import motor.motor_asyncio
from app.config import MONGO_URI

client = motor.motor_asyncio.AsyncIOMotorClient(MONGO_URI)
database = client.ecommers_db

# Collections — think of these as your "tables"
product_collection = database.get_collection("products")
user_collection = database.get_collection("users")
order_collection = database.get_collection("orders")
cart_collection = database.get_collection("carts")
user_collection = database.get_collection("users")