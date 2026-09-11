from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import client
from app.routes import products
from app.routes import auth
from app.routes import orders

app = FastAPI(title="Ecommers API")          # app created FIRST

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(products.router)          # THEN include all routers
app.include_router(auth.router)
app.include_router(orders.router)

@app.on_event("startup")
async def startup_check():
    await client.admin.command("ping")
    print("✅ MongoDB connected successfully")

@app.get("/")
def read_root():
    return {"message": "Ecommers API is running"}