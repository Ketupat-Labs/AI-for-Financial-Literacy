from pydantic import BaseModel, EmailStr
from typing import Optional


class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str
    monthly_income: float = 0.0
    savings_goal: float = 0.0
    budget_limit: float = 0.0
    currency: str = "MYR"


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserUpdate(BaseModel):
    name: Optional[str] = None
    monthly_income: Optional[float] = None
    savings_goal: Optional[float] = None
    budget_limit: Optional[float] = None
    currency: Optional[str] = None


class UserResponse(BaseModel):
    id: str
    name: str
    email: str
    monthly_income: float
    savings_goal: float
    budget_limit: float
    currency: str
