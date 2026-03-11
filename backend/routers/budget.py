from fastapi import APIRouter, HTTPException, Depends
from datetime import datetime
from bson import ObjectId
from services.db import get_db
from models.budget import ExpenseCreate, IncomeUpdate
from routers.auth import get_current_user

router = APIRouter(prefix="/budget", tags=["Budget"])


def _serialize_expense(doc) -> dict:
    return {
        "id": str(doc["_id"]),
        "user_id": str(doc["user_id"]),
        "amount": doc["amount"],
        "category": doc["category"],
        "description": doc.get("description", ""),
        "date": doc.get("date", ""),
        "created_at": doc.get("created_at", ""),
    }


@router.get("/expenses")
async def list_expenses(month: str = None, current_user=Depends(get_current_user)):
    """List all expenses for the current user. Optionally filter by month (YYYY-MM)."""
    db = get_db()
    query = {"user_id": current_user["_id"]}
    if month:
        query["date"] = {"$regex": f"^{month}"}

    cursor = db.expenses.find(query).sort("date", -1)
    expenses = []
    async for doc in cursor:
        expenses.append(_serialize_expense(doc))

    # Compute summary
    total = sum(e["amount"] for e in expenses)
    by_category = {}
    for e in expenses:
        by_category[e["category"]] = by_category.get(e["category"], 0) + e["amount"]

    return {
        "expenses": expenses,
        "total_spent": total,
        "by_category": by_category,
        "budget_limit": current_user.get("budget_limit", 0),
        "monthly_income": current_user.get("monthly_income", 0),
    }


@router.post("/expenses", status_code=201)
async def add_expense(data: ExpenseCreate, current_user=Depends(get_current_user)):
    db = get_db()
    today = datetime.utcnow().strftime("%Y-%m-%d")
    doc = {
        "user_id": current_user["_id"],
        "amount": data.amount,
        "category": data.category,
        "description": data.description or "",
        "date": data.date or today,
        "created_at": datetime.utcnow().isoformat(),
    }
    result = await db.expenses.insert_one(doc)
    doc["_id"] = result.inserted_id
    return _serialize_expense(doc)


@router.delete("/expenses/{expense_id}")
async def delete_expense(expense_id: str, current_user=Depends(get_current_user)):
    db = get_db()
    try:
        oid = ObjectId(expense_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid expense ID")

    result = await db.expenses.delete_one({"_id": oid, "user_id": current_user["_id"]})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Expense not found")
    return {"message": "Expense deleted"}


@router.post("/income")
async def update_income(data: IncomeUpdate, current_user=Depends(get_current_user)):
    db = get_db()
    await db.users.update_one(
        {"_id": current_user["_id"]},
        {"$set": {
            "monthly_income": data.monthly_income,
            "savings_goal": data.savings_goal,
            "budget_limit": data.budget_limit,
            "currency": data.currency,
        }},
    )
    return {
        "message": "Financial profile updated",
        "monthly_income": data.monthly_income,
        "savings_goal": data.savings_goal,
        "budget_limit": data.budget_limit,
    }


@router.get("/summary")
async def get_summary(month: str = None, current_user=Depends(get_current_user)):
    """Get financial summary for current user."""
    db = get_db()
    if not month:
        month = datetime.utcnow().strftime("%Y-%m")
    query = {"user_id": current_user["_id"], "date": {"$regex": f"^{month}"}}
    cursor = db.expenses.find(query)

    total_spent = 0
    by_category = {}
    async for doc in cursor:
        total_spent += doc["amount"]
        cat = doc.get("category", "Other")
        by_category[cat] = by_category.get(cat, 0) + doc["amount"]

    income = current_user.get("monthly_income", 0)
    budget = current_user.get("budget_limit", 0) or income
    savings_goal = current_user.get("savings_goal", 0)

    return {
        "month": month,
        "monthly_income": income,
        "budget_limit": budget,
        "savings_goal": savings_goal,
        "total_spent": total_spent,
        "remaining": budget - total_spent,
        "savings_progress": max(0, income - total_spent),
        "budget_used_pct": round((total_spent / budget * 100) if budget > 0 else 0, 1),
        "by_category": by_category,
        "currency": current_user.get("currency", "MYR"),
    }
