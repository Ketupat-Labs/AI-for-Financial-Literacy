"use client";

import React, { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import { getSummary, getAlerts } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import {
    TrendingUp,
    Wallet,
    AlertTriangle,
    CheckCircle2,
    ArrowRight,
    ChevronRight,
    PlusCircle,
    HelpCircle,
    PiggyBank
} from "lucide-react";
import Link from "next/link";

interface Summary {
    monthly_income: number;
    budget_limit: number;
    savings_goal: number;
    total_spent: number;
    remaining: number;
    budget_used_pct: number;
    currency: string;
}

interface Alert {
    alert_message: string;
    status: "ok" | "warning" | "over";
}

export default function Dashboard() {
    const { user, loading: authLoading } = useAuth();
    const [summary, setSummary] = useState<Summary | null>(null);
    const [alert, setAlert] = useState<Alert | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            const fetchData = async () => {
                try {
                    const [sRes, aRes] = await Promise.all([getSummary(), getAlerts()]);
                    setSummary(sRes.data);
                    setAlert(aRes.data);
                } catch (err) {
                    console.error("Failed to fetch dashboard data", err);
                } finally {
                    setLoading(false);
                }
            };
            fetchData();
        }
    }, [user]);

    if (authLoading || loading) return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="w-12 h-12 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin" />
        </div>
    );

    if (!user) return null;

    const budgetColor = alert?.status === "over" ? "text-red-500" : (alert?.status === "warning" ? "text-amber-500" : "text-emerald-500");
    const budgetBg = alert?.status === "over" ? "bg-red-500/10" : (alert?.status === "warning" ? "bg-amber-500/10" : "bg-emerald-500/10");

    return (
        <div className="min-h-screen bg-slate-950 flex">
            <Sidebar />
            <main className="flex-1 md:ml-64 p-6 md:p-10">
                <header className="flex flex-col md:flex-row md:items-center justify-between mb-10 space-y-4 md:space-y-0">
                    <div>
                        <h1 className="text-3xl font-bold font-outfit text-white">Hello, {user.name} 👋</h1>
                        <p className="text-slate-400 mt-1">Here's your financial snapshot for {new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}.</p>
                    </div>
                    <Link href="/tracker" className="btn-primary flex items-center space-x-2">
                        <PlusCircle size={20} />
                        <span>Add Expense</span>
                    </Link>
                </header>

                {/* AI Alert Section */}
                {alert && (
                    <div className={`p-6 rounded-2xl border mb-10 flex items-start space-x-4 animate-in fade-in slide-in-from-top-4 duration-700 ${budgetBg} ${alert.status === 'over' ? 'border-red-500/20' : 'border-cyan-500/20'}`}>
                        <div className={`p-3 rounded-xl ${alert.status === 'over' ? 'bg-red-500/20 text-red-500' : 'bg-cyan-500/20 text-cyan-400'}`}>
                            <AlertTriangle size={24} />
                        </div>
                        <div className="flex-1">
                            <h3 className="font-bold text-lg mb-1 flex items-center space-x-2">
                                <span>AI Spending Nudge</span>
                                <Sparkles size={16} className="text-cyan-400" />
                            </h3>
                            <p className="text-slate-300 leading-relaxed italic">"{alert.alert_message}"</p>
                        </div>
                    </div>
                )}

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                    <StatCard
                        title="Monthly Income"
                        value={summary?.monthly_income || 0}
                        icon={<Wallet className="text-blue-400" />}
                        currency={summary?.currency}
                    />
                    <StatCard
                        title="Total Spent"
                        value={summary?.total_spent || 0}
                        icon={<TrendingUp className="text-red-400" />}
                        currency={summary?.currency}
                        subtitle={`${summary?.budget_used_pct || 0}% of budget`}
                    />
                    <StatCard
                        title="Goal Progress"
                        value={summary?.monthly_income ? (summary.monthly_income - summary.total_spent) : 0}
                        icon={<PiggyBank className="text-emerald-400" />}
                        currency={summary?.currency}
                        subtitle={`Target: ${summary?.currency} ${summary?.savings_goal}`}
                    />
                    <StatCard
                        title="Remaining"
                        value={summary?.remaining || 0}
                        icon={<CheckCircle2 className="text-cyan-400" />}
                        currency={summary?.currency}
                        isHighlight={true}
                    />
                </div>

                {/* Middle Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Budget Progress */}
                    <div className="lg:col-span-2 glass-card p-8">
                        <h3 className="text-xl font-bold font-outfit mb-6">Budget Utilization</h3>
                        <div className="space-y-6">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-slate-400 uppercase tracking-wider font-semibold">Current Usage</span>
                                <span className={`font-bold ${budgetColor}`}>{summary?.budget_used_pct}% used</span>
                            </div>
                            <div className="h-4 w-full bg-slate-800 rounded-full overflow-hidden">
                                <div
                                    className={`h-full transition-all duration-1000 ease-out ${alert?.status === 'over' ? 'bg-red-500' : 'bg-gradient-to-r from-cyan-400 to-blue-600'}`}
                                    style={{ width: `${Math.min(100, summary?.budget_used_pct || 0)}%` }}
                                />
                            </div>
                            <p className="text-sm text-slate-400 leading-relaxed italic">
                                {alert?.status === 'over'
                                    ? "You've exceeded your set limit. Let's look at where we can cut back."
                                    : alert?.status === 'warning'
                                        ? "Careful! You're approaching your limit for the month."
                                        : "Great job! You're well within your budget limits so far."}
                            </p>
                        </div>

                        <div className="mt-10 pt-8 border-t border-slate-800 flex items-center justify-between">
                            <div>
                                <p className="text-sm text-slate-500">Savings Potential</p>
                                <p className="text-2xl font-bold font-outfit text-white">
                                    {summary?.currency} {Math.max(0, (summary?.monthly_income || 0) - (summary?.total_spent || 0)).toFixed(2)}
                                </p>
                            </div>
                            <Link href="/advisor" className="flex items-center space-x-1 text-cyan-400 hover:text-cyan-300 font-medium transition-colors">
                                <span>Ask Advisor</span>
                                <ChevronRight size={18} />
                            </Link>
                        </div>
                    </div>

                    {/* Quick Shortcuts */}
                    <div className="space-y-6">
                        <h3 className="text-xl font-bold font-outfit mb-2">Quick Actions</h3>
                        <QuickActionCard
                            href="/advisor"
                            title="Robo-Advisor"
                            desc="Get personalized saving tips"
                            icon={<MessageCircle size={20} className="text-cyan-400" />}
                        />
                        <QuickActionCard
                            href="/simplifier"
                            title="Finance Simplifier"
                            desc="Explain 'Compound Interest'..."
                            icon={<HelpCircle size={20} className="text-blue-400" />}
                        />
                    </div>
                </div>
            </main>
        </div>
    );
}

function StatCard({ title, value, icon, currency = "RM", subtitle, isHighlight = false }: any) {
    return (
        <div className={`glass-card p-6 ${isHighlight ? 'gradient-border' : ''}`}>
            <div className={isHighlight ? 'gradient-border-content p-5 h-full' : ''}>
                <div className="flex items-center justify-between mb-4">
                    <p className="text-sm text-slate-400 font-medium uppercase tracking-wider">{title}</p>
                    <div className="p-2 rounded-lg bg-slate-800/50">{icon}</div>
                </div>
                <div className="flex items-baseline space-x-1">
                    <span className="text-slate-500 text-sm font-semibold">{currency}</span>
                    <p className="text-2xl font-bold font-outfit text-white">{value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                </div>
                {subtitle && <p className="text-xs text-slate-500 mt-2">{subtitle}</p>}
            </div>
        </div>
    );
}

function QuickActionCard({ href, title, desc, icon }: any) {
    return (
        <Link href={href} className="flex items-center p-4 glass-card glass-card-hover group">
            <div className="p-3 rounded-xl bg-slate-800/50 mr-4 group-hover:bg-slate-700 transition-colors">
                {icon}
            </div>
            <div className="flex-1">
                <h4 className="font-bold text-white group-hover:text-cyan-400 transition-colors">{title}</h4>
                <p className="text-xs text-slate-500">{desc}</p>
            </div>
            <ArrowRight size={16} className="text-slate-600 group-hover:text-cyan-400 transition-all group-hover:translate-x-1" />
        </Link>
    );
}

import { Sparkles, MessageCircle } from "lucide-react";
