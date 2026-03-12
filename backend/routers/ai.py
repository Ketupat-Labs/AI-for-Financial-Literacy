from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from services.db import get_db
from services import gemini as gemini_service
from routers.auth import get_current_user
from datetime import datetime

router = APIRouter(prefix="/ai", tags=["AI"])


class AdvisorMessage(BaseModel):
    message: str


class SimplifyRequest(BaseModel):
    term: str


@router.post("/advisor")
async def robo_advisor(payload: AdvisorMessage, current_user=Depends(get_current_user)):
    """AI Robo-Advisor chat — returns personalized financial advice."""
    db = get_db()
    month = datetime.utcnow().strftime("%Y-%m")
    cursor = db.expenses.find({"user_id": current_user["_id"], "date": {"$regex": f"^{month}"}})

    expenses = []
    async for doc in cursor:
        expenses.append({
            "category": doc.get("category", "Other"),
            "amount": doc.get("amount", 0),
            "description": doc.get("description", ""),
        })

    name = current_user.get("name", "Friend")
    income = current_user.get("monthly_income", 0)
    savings_goal = current_user.get("savings_goal", 0)

    try:
        reply = await gemini_service.get_advisor_response(
            name=name,
            income=income,
            savings_goal=savings_goal,
            expenses=expenses,
            user_message=payload.message,
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI error: {str(e)}")

    return {"reply": reply}


@router.post("/simplify")
async def simplify_term(payload: SimplifyRequest):
    """Explain a financial term in simple language."""
    term = payload.term.strip()
    if not term:
        raise HTTPException(status_code=400, detail="Term cannot be empty")
    try:
        explanation = await gemini_service.simplify_term(term)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI error: {str(e)}")
    return {"term": term, "explanation": explanation}


@router.get("/alerts")
async def spending_alerts(current_user=Depends(get_current_user)):
    """AI-generated spending nudge based on current month's budget usage."""
    db = get_db()
    month = datetime.utcnow().strftime("%Y-%m")
    cursor = db.expenses.find({"user_id": current_user["_id"], "date": {"$regex": f"^{month}"}}).sort("date", -1)

    expenses = []
    total_spent = 0
    async for doc in cursor:
        amount = doc.get("amount", 0)
        total_spent += amount
        expenses.append({
            "category": doc.get("category", "Other"),
            "amount": amount,
            "description": doc.get("description", ""),
        })

    name = current_user.get("name", "Friend")
    income = current_user.get("monthly_income", 0)
    budget_limit = current_user.get("budget_limit", 0) or income

    try:
        alert = await gemini_service.get_spending_alert(
            name=name,
            income=income,
            budget_limit=budget_limit,
            total_spent=total_spent,
            recent_expenses=expenses,
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI error: {str(e)}")

    pct = round((total_spent / budget_limit * 100) if budget_limit > 0 else 0, 1)
    return {
        "alert_message": alert,
        "total_spent": total_spent,
        "budget_limit": budget_limit,
        "budget_used_pct": pct,
        "status": "over" if total_spent > budget_limit else ("warning" if pct >= 80 else "ok"),
    }
