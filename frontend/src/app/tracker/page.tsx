"use client";

import React, { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import { getExpenses, addExpense, deleteExpense, updateIncome } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import {
    Plus,
    Trash2,
    Wallet,
    Settings,
    Calendar,
    Tag,
    Coins,
    Loader2,
    Filter,
    ArrowDownLeft,
    ArrowUpRight
} from "lucide-react";

interface Expense {
    id: string;
    amount: number;
    category: string;
    description: string;
    date: string;
}

const CATEGORIES = ["Food", "Transport", "Shopping", "Bills", "Entertainment", "Health", "Other"];

export default function TrackerPage() {
    const { user, refreshUser } = useAuth();
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [showAdd, setShowAdd] = useState(false);
    const [showSettings, setShowSettings] = useState(false);

    // Form states
    const [newExp, setNewExp] = useState({ amount: "", category: "Food", description: "", date: new Date().toISOString().split('T')[0] });
    const [settings, setSettings] = useState({ income: "", savingsGoal: "", budgetLimit: "" });

    useEffect(() => {
        fetchExpenses();
        if (user) {
            setSettings({
                income: user.monthly_income.toString(),
                savingsGoal: user.savings_goal.toString(),
                budgetLimit: user.budget_limit.toString(),
            });
        }
    }, [user]);

    const fetchExpenses = async () => {
        try {
            const res = await getExpenses();
            setExpenses(res.data.expenses);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleAddExpense = async (e: React.FormEvent) => {
        e.preventDefault();
        setActionLoading(true);
        try {
            await addExpense({
                ...newExp,
                amount: Number(newExp.amount)
            });
            setNewExp({ amount: "", category: "Food", description: "", date: new Date().toISOString().split('T')[0] });
            setShowAdd(false);
            fetchExpenses();
        } catch (err) {
            alert("Failed to add expense");
        } finally {
            setActionLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Remove this record?")) return;
        try {
            await deleteExpense(id);
            setExpenses(prev => prev.filter(e => e.id !== id));
        } catch (err) {
            alert("Failed to delete");
        }
    };

    const handleUpdateSettings = async (e: React.FormEvent) => {
        e.preventDefault();
        setActionLoading(true);
        try {
            await updateIncome({
                monthly_income: Number(settings.income),
                savings_goal: Number(settings.savingsGoal),
                budget_limit: Number(settings.budgetLimit)
            });
            await refreshUser();
            setShowSettings(false);
        } catch (err) {
            alert("Failed to update settings");
        } finally {
            setActionLoading(false);
        }
    };

    if (!user) return null;

    return (
        <div className="min-h-screen bg-slate-950 flex font-inter">
            <Sidebar />
            <main className="flex-1 md:ml-64 p-6 md:p-10 max-w-6xl mx-auto w-full">
                <header className="flex items-center justify-between mb-10">
                    <div>
                        <h1 className="text-3xl font-bold font-outfit text-white">Expense Tracker</h1>
                        <p className="text-slate-400 mt-1">Manage your daily spending & financial profile.</p>
                    </div>
                    <div className="flex items-center space-x-3">
                        <button
                            onClick={() => setShowSettings(!showSettings)}
                            className="p-3 rounded-xl glass-card hover:bg-slate-800 transition-colors text-slate-400 hover:text-white"
                        >
                            <Settings size={20} />
                        </button>
                        <button
                            onClick={() => setShowAdd(!showAdd)}
                            className="btn-primary py-3 flex items-center space-x-2"
                        >
                            <Plus size={20} />
                            <span className="hidden sm:inline">Add Expense</span>
                        </button>
                    </div>
                </header>

                {/* Global Stats bar */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    <div className="glass-card p-6 border-l-4 border-l-blue-500">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-bold text-slate-500 uppercase">Monthly Income</span>
                            <ArrowUpRight className="text-blue-500" size={16} />
                        </div>
                        <p className="text-2xl font-bold text-white">{user.currency} {user.monthly_income.toFixed(2)}</p>
                    </div>
                    <div className="glass-card p-6 border-l-4 border-l-red-500">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-bold text-slate-500 uppercase">Total Spent</span>
                            <ArrowDownLeft className="text-red-500" size={16} />
                        </div>
                        <p className="text-2xl font-bold text-white">
                            {user.currency} {expenses.reduce((acc, curr) => acc + curr.amount, 0).toFixed(2)}
                        </p>
                    </div>
                    <div className="glass-card p-6 border-l-4 border-l-cyan-500">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-bold text-slate-500 uppercase">Budget Limit</span>
                            <Coins className="text-cyan-500" size={16} />
                        </div>
                        <p className="text-2xl font-bold text-white">{user.currency} {user.budget_limit.toFixed(2)}</p>
                    </div>
                </div>

                {/* Settings Modal/Section */}
                {showSettings && (
                    <div className="glass-card p-8 mb-10 border-cyan-500/30 animate-in zoom-in-95 duration-200">
                        <h3 className="text-xl font-bold mb-6 flex items-center space-x-2">
                            <Settings size={20} className="text-cyan-400" />
                            <span>Update Financial Profile</span>
                        </h3>
                        <form onSubmit={handleUpdateSettings} className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-400">Monthly Income ({user.currency})</label>
                                <input
                                    type="number"
                                    value={settings.income}
                                    onChange={e => setSettings({ ...settings, income: e.target.value })}
                                    className="input-field w-full"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-400">Savings Target ({user.currency})</label>
                                <input
                                    type="number"
                                    value={settings.savingsGoal}
                                    onChange={e => setSettings({ ...settings, savingsGoal: e.target.value })}
                                    className="input-field w-full"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-400">Monthly Budget ({user.currency})</label>
                                <input
                                    type="number"
                                    value={settings.budgetLimit}
                                    onChange={e => setSettings({ ...settings, budgetLimit: e.target.value })}
                                    className="input-field w-full"
                                />
                            </div>
                            <div className="md:col-span-3 flex justify-end space-x-3">
                                <button type="button" onClick={() => setShowSettings(false)} className="btn-secondary">Cancel</button>
                                <button type="submit" disabled={actionLoading} className="btn-primary min-w-[120px]">
                                    {actionLoading ? <Loader2 className="animate-spin mx-auto" size={20} /> : "Save Profile"}
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Add Expense Form */}
                {showAdd && (
                    <div className="glass-card p-8 mb-10 border-blue-500/30 animate-in slide-in-from-top-4">
                        <h3 className="text-xl font-bold mb-6 flex items-center space-x-2 text-white">
                            <PlusCircle size={20} className="text-blue-400" />
                            <span>Log New Expense</span>
                        </h3>
                        <form onSubmit={handleAddExpense} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase">Amount ({user.currency})</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    required
                                    value={newExp.amount}
                                    onChange={e => setNewExp({ ...newExp, amount: e.target.value })}
                                    className="input-field w-full text-lg font-bold"
                                    placeholder="0.00"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase">Category</label>
                                <select
                                    value={newExp.category}
                                    onChange={e => setNewExp({ ...newExp, category: e.target.value })}
                                    className="input-field w-full"
                                >
                                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase">Description</label>
                                <input
                                    type="text"
                                    value={newExp.description}
                                    onChange={e => setNewExp({ ...newExp, description: e.target.value })}
                                    className="input-field w-full"
                                    placeholder="What was this for?"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase">Date</label>
                                <input
                                    type="date"
                                    value={newExp.date}
                                    onChange={e => setNewExp({ ...newExp, date: e.target.value })}
                                    className="input-field w-full"
                                />
                            </div>
                            <div className="lg:col-span-4 flex justify-end space-x-3 mt-4">
                                <button type="button" onClick={() => setShowAdd(false)} className="btn-secondary">Cancel</button>
                                <button type="submit" disabled={actionLoading} className="btn-primary min-w-[140px]">
                                    {actionLoading ? <Loader2 className="animate-spin mx-auto" size={20} /> : "Log Expense"}
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* List Section */}
                <div className="glass-card overflow-hidden">
                    <div className="p-6 border-b border-slate-800 flex items-center justify-between">
                        <h3 className="font-bold text-lg text-white font-outfit">Transactions</h3>
                        <div className="flex items-center space-x-2 text-sm text-slate-500">
                            <Filter size={14} />
                            <span>Sorting by date (newest)</span>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-slate-900 bg-slate-900/40 text-xs font-bold text-slate-500 uppercase tracking-widest">
                                    <th className="px-6 py-4">Date</th>
                                    <th className="px-6 py-4">Description</th>
                                    <th className="px-6 py-4">Category</th>
                                    <th className="px-6 py-4 text-right">Amount</th>
                                    <th className="px-6 py-4"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-900">
                                {expenses.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center text-slate-500 italic">
                                            No transactions recorded yet. Time to log your first expense!
                                        </td>
                                    </tr>
                                ) : (
                                    expenses.map(e => (
                                        <tr key={e.id} className="group hover:bg-slate-800/20 transition-colors">
                                            <td className="px-6 py-4 text-sm text-slate-400 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <Calendar size={14} className="mr-2 opacity-50" />
                                                    {new Date(e.date).toLocaleDateString()}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm font-medium text-white max-w-[200px] truncate">
                                                {e.description || "—"}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700">
                                                    <Tag size={10} className="mr-1 opacity-60" />
                                                    {e.category}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm font-bold text-right text-white">
                                                {user.currency} {e.amount.toFixed(2)}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button
                                                    onClick={() => handleDelete(e.id)}
                                                    className="p-2 text-slate-600 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    );
}

import { CheckCircle2, PlusCircle } from "lucide-react";
