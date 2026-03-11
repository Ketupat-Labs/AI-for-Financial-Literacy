import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const api = axios.create({ baseURL: BASE_URL });

api.interceptors.request.use((config) => {
    if (typeof window !== "undefined") {
        const token = localStorage.getItem("token");
        if (token) config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;

// ── Auth ────────────────────────────────────────────────────────
export const register = (data: {
    name: string;
    email: string;
    password: string;
    monthly_income?: number;
    savings_goal?: number;
    budget_limit?: number;
}) => api.post("/auth/register", data);

export const login = (email: string, password: string) =>
    api.post("/auth/login", { email, password });

export const getMe = () => api.get("/auth/me");

export const updateMe = (data: {
    monthly_income?: number;
    savings_goal?: number;
    budget_limit?: number;
    currency?: string;
}) => api.patch("/auth/me", data);

// ── Budget ──────────────────────────────────────────────────────
export const getExpenses = (month?: string) =>
    api.get("/budget/expenses", { params: month ? { month } : {} });

export const addExpense = (data: {
    amount: number;
    category: string;
    description?: string;
    date?: string;
}) => api.post("/budget/expenses", data);

export const deleteExpense = (id: string) =>
    api.delete(`/budget/expenses/${id}`);

export const updateIncome = (data: {
    monthly_income: number;
    savings_goal: number;
    budget_limit: number;
    currency?: string;
}) => api.post("/budget/income", data);

export const getSummary = (month?: string) =>
    api.get("/budget/summary", { params: month ? { month } : {} });

// ── AI ──────────────────────────────────────────────────────────
export const sendAdvisorMessage = (message: string) =>
    api.post("/ai/advisor", { message });

export const simplifyTerm = (term: string) =>
    api.post("/ai/simplify", { term });

export const getAlerts = () => api.get("/ai/alerts");
