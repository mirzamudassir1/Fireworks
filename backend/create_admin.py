import asyncio
import os
from app.database import user_collection
from app.auth import hash_password
from dotenv import load_dotenv

load_dotenv()

async def create_admin():
    email = os.getenv("ADMIN_EMAIL")
    password = os.getenv("ADMIN_PASSWORD")

    if not email or not password:
        print("❌ Set ADMIN_EMAIL and ADMIN_PASSWORD in your .env file first.")
        return

    existing = await user_collection.find_one({"email": email})
    if existing:
        print("Admin already exists.")
        return

    await user_collection.insert_one({
        "email": email,
        "hashed_password": hash_password(password),
        "role": "admin"
    })
    print(f"✅ Admin created: {email}")

if __name__ == "__main__":
    asyncio.run(create_admin())