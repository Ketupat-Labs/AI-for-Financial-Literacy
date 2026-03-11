from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class ExpenseCreate(BaseModel):
    amount: float
    category: str  # Food, Transport, Shopping, Bills, Entertainment, Health, Other
    description: Optional[str] = ""
    date: Optional[str] = None  # ISO date string, defaults to today


class ExpenseResponse(BaseModel):
    id: str
    user_id: str
    amount: float
    category: str
    description: str
    date: str
    created_at: str


class IncomeUpdate(BaseModel):
    monthly_income: float
    savings_goal: float
    budget_limit: float
    currency: Optional[str] = "MYR"
