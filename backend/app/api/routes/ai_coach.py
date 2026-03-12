from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import httpx
import os

router = APIRouter()

# Ollama Configuration
OLLAMA_URL = os.getenv("OLLAMA_URL", "http://localhost:11434/api/generate")
# You can change this to "mistral", "gemma2", etc. based on what models you have downloaded
OLLAMA_MODEL = os.getenv("OLLAMA_MODEL", "llama3")

class AdviceRequest(BaseModel):
    user_id: str
    recent_transactions_summary: str
    current_goal: str

class AdviceResponse(BaseModel):
    advice: str

@router.post("/advice", response_model=AdviceResponse)
async def get_ai_financial_advice(request: AdviceRequest):
    """
    Generate personalized financial advice using local Ollama instance.
    Analyzes recent transactions and current saving goals to provide actionable insights.
    """
    try:
        # Construct the prompt for the AI model
        prompt = f"""
        You are an expert, empathetic AI Money Coach. 
        A user has the following recent transaction summary: {request.recent_transactions_summary}.
        Their current financial goal is: {request.current_goal}.
        
        Provide concise, actionable, and personalized financial advice to help them 
        understand their spending, avoid debt traps like BNPL (Buy Now, Pay Later), 
        and build financial resilience to reach their goal.
        """
        
        # Call the local Ollama API
        async with httpx.AsyncClient() as client:
            response = await client.post(
                OLLAMA_URL,
                json={
                    "model": OLLAMA_MODEL,
                    "prompt": prompt,
                    "stream": False
                },
                timeout=30.0 # longer timeout since local models might take some time to process
            )
            response.raise_for_status()
            
        ollama_data = response.json()
        
        return AdviceResponse(advice=ollama_data.get("response", "Could not generate advice."))
        
    except Exception as e:
        # Log the error and return a 500 status
        print(f"Error generating AI advice with Ollama: {e}")
        raise HTTPException(status_code=500, detail="Failed to connect to local Ollama instance or generate advice.")
