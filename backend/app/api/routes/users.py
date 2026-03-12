from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()

class GoalData(BaseModel):
    goalName: str
    targetAmount: int
    currentSaved: int

@router.get("/current-goal", response_model=GoalData)
async def get_current_goal():
    """
    Simulated endpoint returning the user's current savings goal. 
    In the completed project, this would fetch from MongoDB using 'motor'.
    """
    return {
        "goalName": "MacBook Pro M4",
        "targetAmount": 2000,
        "currentSaved": 850
    }
