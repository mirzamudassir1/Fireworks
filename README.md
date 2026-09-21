# 🎆 The Cracker City — Fireworks Ecommerce Store

A full-stack ecommerce web app built for a friend's fireworks business, doubling as a personal portfolio project. Customers can browse products and check out; the admin has full control over the product catalog and order list.

**Live site:** https://crackercity.vercel.app/       
**(Login/signup)** https://ecommers-gamma-two.vercel.app 
               
**Live API:**  https://fireworks-oxud.onrender.com/docs

---

## Features

### Customers
- Sign up / log in (JWT-based auth)
- Browse products with images, prices, and descriptions
- Add items to cart, adjust quantities
- Checkout with phone number capture and order confirmation

### Admin
- Dedicated admin account (seeded manually, not via public signup)
- Full CRUD on products (add / edit / delete)
- View all customer orders with contact phone numbers
- Delete unwanted order records

---

## Tech Stack

**Frontend:** React (Vite), React Router
**Backend:** FastAPI (Python), Motor (async MongoDB driver)
**Database:** MongoDB Atlas
**Auth:** JWT (python-jose), bcrypt password hashing (passlib)
**Image hosting:** Cloudinary
**Deployment:** Vercel (frontend), Render (backend)

---

## Project Structure

```
ecommers/
├── backend/
│   ├── app/
│   │   ├── main.py          # FastAPI entrypoint
│   │   ├── database.py      # MongoDB connection
│   │   ├── auth.py          # Password hashing + JWT helpers
│   │   ├── dependencies.py  # Auth/role guards
│   │   ├── models/          # Pydantic schemas
│   │   └── routes/          # API endpoints (auth, products, orders)
│   ├── create_admin.py      # One-time script to seed the admin account
│   └── requirements.txt
└── frontend/
    ├── src/
    │   ├── api/              # Axios calls to the backend
    │   ├── context/          # Auth + Cart state
    │   ├── pages/            # Login, Signup, Products, Cart, Admin
    │   └── components/       # Shared UI (Footer, etc.)
    └── package.json
```

---

## Running Locally

**Backend:**
```bash
cd backend
python -m venv venv
venv\Scripts\activate        # Windows
pip install -r requirements.txt
# add your MongoDB URI to a .env file as MONGO_URI=...
uvicorn app.main:app --reload --port 8080
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

---

## Created by

**Mirza Mudassir**
