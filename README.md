<<<<<<< HEAD
# AI Money Coach - BorNEO HackWknd 2026

## Problem Statement

Despite the booming adoption of digital payments in the ASEAN region, there remains a critical "protection gap." Many users—particularly students and small business owners—lack the financial resilience necessary to navigate modern credit products. The convenience of "Buy Now, Pay Later" (BNPL) schemes and easy access to credit often lead to an accumulation of debt without a clear understanding of interest compounding or hidden fees. Our goal is to bridge this gap by providing an accessible, 24/7 AI "Money Coach" that analyzes spending patterns, elucidates the risks of modern debt instruments, and empowers users with personalized saving advice to build long-term financial resilience.

## Project Directory Structure

A professional, modular structure for the Full-Stack application:

```text
borneo-hackwknd-ai-coach/
├── frontend/                     # Next.js Application
│   ├── public/                   # Static assets (images, icons)
│   ├── src/
│   │   ├── app/                  # Next.js App Router (pages & API routes)
│   │   │   ├── dashboard/        # Dashboard for goal tracking
│   │   │   ├── layout.tsx        # Global layout
│   │   │   └── page.tsx          # Landing page
│   │   ├── components/           # Reusable UI components
│   │   │   ├── SavingsGoalProgressBar.tsx
│   │   │   └── ui/               # Base UI components (buttons, inputs)
│   │   ├── lib/                  # Utility functions and API helpers
│   │   │   └── api.ts            # Frontend API client for backend
│   │   └── styles/               # Tailwind CSS globals
│   ├── package.json
│   └── tailwind.config.ts
├── backend/                      # FastAPI Application
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py               # Application entry point
│   │   ├── api/
│   │   │   ├── routes/           # API Endpoints (e.g., ai_coach.py, users.py)
│   │   │   └── dependencies.py   # FastAPI dependencies (Auth, DB)
│   │   ├── core/
│   │   │   └── config.py         # Environment variables and config
│   │   ├── models/               # MongoDB models/schemas (Pydantic/Beanie)
│   │   │   ├── goal.py
│   │   │   └── user.py
│   │   └── services/             # Business logic (Gemini API integration)
│   │       └── gemini_service.py
│   ├── requirements.txt
│   └── .env.example
├── README.md                     # Project overview and run instructions
└── .gitignore
```
=======
# AI-for-Financial-Literacy
>>>>>>> e5faf4fdffb8bd8e0ae9ff1dba1a27ddfc2a74b6
