import google.generativeai as genai
from config import settings

genai.configure(api_key=settings.gemini_api_key)
model = genai.GenerativeModel("gemini-1.5-flash")


def build_advisor_prompt(name: str, income: float, savings_goal: float, expenses: list[dict]) -> str:
    total_spent = sum(e.get("amount", 0) for e in expenses)
    expense_breakdown = "\n".join(
        f"  - {e.get('category', 'Other')}: RM{e.get('amount', 0):.2f}" for e in expenses
    ) or "  (No expenses recorded yet)"

    return f"""You are a friendly and empathetic AI Money Coach specialized for Southeast Asian users.
Your user is {name}.

Monthly Income: RM{income:.2f}
Monthly Savings Goal: RM{savings_goal:.2f}
Total Spent This Month: RM{total_spent:.2f}
Remaining Budget: RM{(income - total_spent):.2f}

Expense Breakdown:
{expense_breakdown}

Based on this financial snapshot, give personalized, actionable advice. 
- Suggest exactly how much they should save or invest each month
- Highlight any overspending categories
- Give 2-3 practical tips relevant to Southeast Asian daily life (e.g., hawker food vs restaurants, e-wallets, KWSP/EPF)  
- Keep the tone warm, encouraging and simple — avoid jargon
- Answer in English but you may use simple Malay/Bahasa phrases occasionally for warmth"""


def build_simplifier_prompt(term: str) -> str:
    return f"""You are a friendly financial educator for Southeast Asian users with limited finance knowledge.

Explain the financial term "{term}" in the simplest possible way:
1. Start with a one-sentence plain English definition
2. Give a relatable everyday example using Southeast Asian context (e.g., market, e-wallet, hawker stall, KWSP)
3. Explain why it matters to ordinary people
4. Give one tip on how to use this knowledge wisely

Keep the response to 4 short paragraphs. Use simple words, no jargon. Friendly and warm tone."""


def build_alert_prompt(name: str, income: float, budget_limit: float, total_spent: float, recent_expenses: list[dict]) -> str:
    pct = (total_spent / budget_limit * 100) if budget_limit > 0 else 0
    recent = "\n".join(
        f"  - {e.get('category', 'Other')}: RM{e.get('amount', 0):.2f} ({e.get('description', '')})"
        for e in recent_expenses[-5:]
    ) or "  (none)"

    return f"""You are an AI spending coach. Your user {name} has a monthly budget of RM{budget_limit:.2f}.
They have spent RM{total_spent:.2f} so far ({pct:.1f}% of budget).

Recent expenses:
{recent}

{'⚠️ They are OVER budget!' if total_spent > budget_limit else f'They have RM{(budget_limit - total_spent):.2f} remaining.'}

Write a short (2-3 sentence) spending nudge/alert message:
- If over budget: be gently firm, remind them of the impact, suggest one cut
- If 80-100% of budget used: warn them, celebrate progress, suggest caution
- If under 80%: give a small encouragement and a saving tip
Keep it conversational and supportive. Max 3 sentences."""


async def get_advisor_response(name: str, income: float, savings_goal: float, expenses: list[dict], user_message: str) -> str:
    context = build_advisor_prompt(name, income, savings_goal, expenses)
    full_prompt = f"{context}\n\nUser says: {user_message}\n\nRespond as the AI Money Coach:"
    response = model.generate_content(full_prompt)
    return response.text


async def simplify_term(term: str) -> str:
    prompt = build_simplifier_prompt(term)
    response = model.generate_content(prompt)
    return response.text


async def get_spending_alert(name: str, income: float, budget_limit: float, total_spent: float, recent_expenses: list[dict]) -> str:
    prompt = build_alert_prompt(name, income, budget_limit, total_spent, recent_expenses)
    response = model.generate_content(prompt)
    return response.text
