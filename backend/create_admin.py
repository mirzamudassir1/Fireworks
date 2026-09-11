import asyncio
from app.database import user_collection
from app.auth import hash_password

async def create_admin():
    email = "admin@fireworks.com"       # change to whatever you want
    password = "123123123"  # change this too

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