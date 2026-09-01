from fastapi import APIRouter, HTTPException
from app.database import user_collection
from app.models.user import UserSignup, UserLogin
from app.auth import hash_password, verify_password, create_access_token

router = APIRouter(prefix="/auth", tags=["Auth"])

@router.post("/signup")
async def signup(user: UserSignup):
    existing_user = await user_collection.find_one({"email": user.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    hashed_pw = hash_password(user.password)
    new_user = {
        "email": user.email,
        "hashed_password": hashed_pw,
        "role": "user"
    }
    result = await user_collection.insert_one(new_user)

    token = create_access_token({"sub": str(result.inserted_id), "role": "user"})
    return {"access_token": token, "token_type": "bearer"}

@router.post("/login")
async def login(user: UserLogin):
    db_user = await user_collection.find_one({"email": user.email})
    if not db_user or not verify_password(user.password, db_user["hashed_password"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    token = create_access_token({"sub": str(db_user["_id"]), "role": db_user["role"]})
    return {"access_token": token, "token_type": "bearer"}