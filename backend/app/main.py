from fastapi import FastAPI, APIRouter
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes import users
from app.api.routes import ai_coach

app = FastAPI(
    title="AI Money Coach API",
    description="Backend for the BorNEO HackWknd 2026 AI Financial Literacy App",
    version="1.0.0"
)

# Enable CORS for the Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(users.router, prefix="/api/users", tags=["users"])
app.include_router(ai_coach.router, prefix="/api/ai-coach", tags=["ai-coach"])

@app.get("/")
def read_root():
    return {"message": "Welcome to the AI Money Coach API"}
