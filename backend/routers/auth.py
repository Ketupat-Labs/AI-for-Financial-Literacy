from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from services.db import get_db
from models.user import UserCreate, UserLogin, UserUpdate, UserResponse
from utils.jwt import hash_password, verify_password, create_access_token, decode_token

router = APIRouter(prefix="/auth", tags=["Authentication"])
security = HTTPBearer()


async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    payload = decode_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    db = get_db()
    user = await db.users.find_one({"email": payload.get("sub")})
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    return user


@router.post("/register", status_code=201)
async def register(data: UserCreate):
    db = get_db()
    existing = await db.users.find_one({"email": data.email})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    user_doc = {
        "name": data.name,
        "email": data.email,
        "password": hash_password(data.password),
        "monthly_income": data.monthly_income,
        "savings_goal": data.savings_goal,
        "budget_limit": data.budget_limit,
        "currency": data.currency,
    }
    result = await db.users.insert_one(user_doc)
    token = create_access_token({"sub": data.email})
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": str(result.inserted_id),
            "name": data.name,
            "email": data.email,
            "monthly_income": data.monthly_income,
            "savings_goal": data.savings_goal,
            "budget_limit": data.budget_limit,
            "currency": data.currency,
        },
    }


@router.post("/login")
async def login(data: UserLogin):
    db = get_db()
    user = await db.users.find_one({"email": data.email})
    if not user or not verify_password(data.password, user["password"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    token = create_access_token({"sub": data.email})
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": str(user["_id"]),
            "name": user["name"],
            "email": user["email"],
            "monthly_income": user.get("monthly_income", 0),
            "savings_goal": user.get("savings_goal", 0),
            "budget_limit": user.get("budget_limit", 0),
            "currency": user.get("currency", "MYR"),
        },
    }


@router.get("/me")
async def get_me(current_user=Depends(get_current_user)):
    return {
        "id": str(current_user["_id"]),
        "name": current_user["name"],
        "email": current_user["email"],
        "monthly_income": current_user.get("monthly_income", 0),
        "savings_goal": current_user.get("savings_goal", 0),
        "budget_limit": current_user.get("budget_limit", 0),
        "currency": current_user.get("currency", "MYR"),
    }


@router.patch("/me")
async def update_me(data: UserUpdate, current_user=Depends(get_current_user)):
    db = get_db()
    update_data = {k: v for k, v in data.model_dump().items() if v is not None}
    if not update_data:
        raise HTTPException(status_code=400, detail="No data provided")
    await db.users.update_one({"_id": current_user["_id"]}, {"$set": update_data})
    updated = await db.users.find_one({"_id": current_user["_id"]})
    return {
        "id": str(updated["_id"]),
        "name": updated["name"],
        "email": updated["email"],
        "monthly_income": updated.get("monthly_income", 0),
        "savings_goal": updated.get("savings_goal", 0),
        "budget_limit": updated.get("budget_limit", 0),
        "currency": updated.get("currency", "MYR"),
    }
