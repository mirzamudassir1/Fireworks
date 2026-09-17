import os
from fastapi import APIRouter, HTTPException, Depends
from app.database import user_collection
from app.models.user import UserSignup, UserLogin, UpdateCredentials, GoogleAuthRequest
from app.auth import hash_password, verify_password, create_access_token
from app.dependencies import get_current_user
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
from bson import ObjectId

router = APIRouter(prefix="/auth", tags=["Auth"])

GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")

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

@router.post("/google")
async def google_auth(payload: GoogleAuthRequest):
    try:
        idinfo = id_token.verify_oauth2_token(
            payload.token, google_requests.Request(), GOOGLE_CLIENT_ID
        )
    except ValueError:
        raise HTTPException(status_code=401, detail="Invalid Google token")

    email = idinfo.get("email")
    if not email:
        raise HTTPException(status_code=400, detail="Google account has no email")

    user_doc = await user_collection.find_one({"email": email})
    if not user_doc:
        new_user = {
            "email": email,
            "hashed_password": None,
            "role": "user",
            "auth_provider": "google",
        }
        result = await user_collection.insert_one(new_user)
        user_id = str(result.inserted_id)
        role = "user"
    else:
        user_id = str(user_doc["_id"])
        role = user_doc["role"]

    token = create_access_token({"sub": user_id, "role": role})
    return {"access_token": token, "token_type": "bearer"}

@router.put("/update-credentials")
async def update_credentials(payload: UpdateCredentials, user=Depends(get_current_user)):
    user_doc = await user_collection.find_one({"_id": ObjectId(user["sub"])})
    if not user_doc:
        raise HTTPException(status_code=404, detail="User not found")

    if not verify_password(payload.current_password, user_doc["hashed_password"]):
        raise HTTPException(status_code=401, detail="Current password is incorrect")

    updates = {}
    if payload.new_email:
        existing = await user_collection.find_one({"email": payload.new_email})
        if existing and str(existing["_id"]) != user["sub"]:
            raise HTTPException(status_code=400, detail="Email already in use")
        updates["email"] = payload.new_email
    if payload.new_password:
        updates["hashed_password"] = hash_password(payload.new_password)

    if not updates:
        raise HTTPException(status_code=400, detail="Nothing to update")

    await user_collection.update_one({"_id": ObjectId(user["sub"])}, {"$set": updates})
    return {"message": "Credentials updated successfully"}