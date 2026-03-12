"use client";

import React, { useState } from "react";
import Sidebar from "@/components/Sidebar";
import { simplifyTerm } from "@/lib/api";
import {
    Lightbulb,
    Search,
    Sparkles,
    Loader2,
    BookOpen,
    ArrowRight,
    TrendingUp,
    ShieldCheck,
    ChevronRight
} from "lucide-react";
import ReactMarkdown from "react-markdown";

const SUGGESTIONS = [
    "Compound Interest",
    "Insurtech",
    "KWSP / EPF",
    "Buy Now Pay Later (BNPL)",
    "Unit Trust",
    "Capital Gains Tax"
];

export default function SimplifierPage() {
    const [term, setTerm] = useState("");
    const [explanation, setExplanation] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSimplify = async (e?: React.FormEvent, selectedTerm?: string) => {
        e?.preventDefault();
        const targetTerm = selectedTerm || term.trim();
        if (!targetTerm || loading) return;

        setTerm(targetTerm);
        setExplanation("");
        setLoading(true);
        setError("");

        try {
            const res = await simplifyTerm(targetTerm);
            setExplanation(res.data.explanation);
        } catch (err) {
            setError("I couldn't get an explanation right now. Please try again later!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 flex font-inter">
            <Sidebar />
            <main className="flex-1 md:ml-64 p-6 md:p-10 max-w-5xl mx-auto w-full">
                <header className="mb-12 text-center">
                    <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-6">
                        <BookOpen size={16} />
                        <span>Finance Simplifier</span>
                    </div>
                    <h1 className="text-4xl font-bold font-outfit text-white mb-4 tracking-tight">
                        Financial Terms, <span className="text-gradient">Simplified.</span>
                    </h1>
                    <p className="text-slate-400 max-w-2xl mx-auto text-lg leading-relaxed">
                        Don't let complex jargon stop you from building wealth. Get plain-English explanations with real SEA examples.
                    </p>
                </header>

                {/* Search Section */}
                <div className="max-w-3xl mx-auto mb-16 px-4">
                    <form onSubmit={(e) => handleSimplify(e)} className="relative group mb-8">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-indigo-600/20 blur-2xl opacity-0 group-focus-within:opacity-100 transition-opacity" />
                        <div className="relative glass-card border-slate-800 focus-within:border-blue-500/50 flex items-center p-2 rounded-2xl">
                            <div className="pl-4 text-slate-500">
                                <Search size={22} />
                            </div>
                            <input
                                type="text"
                                value={term}
                                onChange={(e) => setTerm(e.target.value)}
                                placeholder="Enter a financial term (e.g. Compound Interest)..."
                                className="flex-1 bg-transparent border-none focus:ring-0 px-4 py-4 text-white text-lg placeholder-slate-600"
                            />
                            <button
                                type="submit"
                                disabled={!term.trim() || loading}
                                className="btn-primary py-3 px-8 flex items-center space-x-2 rounded-xl"
                            >
                                {loading ? <Loader2 className="animate-spin" size={20} /> : (
                                    <>
                                        <span>Simplify</span>
                                        <ArrowRight size={18} />
                                    </>
                                )}
                            </button>
                        </div>
                    </form>

                    <div className="flex flex-wrap items-center justify-center gap-3">
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-widest mr-2">Try these:</span>
                        {SUGGESTIONS.map(s => (
                            <button
                                key={s}
                                onClick={() => handleSimplify(undefined, s)}
                                className="px-4 py-1.5 rounded-full text-sm bg-slate-900 border border-slate-800 text-slate-400 hover:text-blue-400 hover:border-blue-500/30 hover:bg-slate-800 transition-all"
                            >
                                {s}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Result Area */}
                {loading ? (
                    <div className="max-w-3xl mx-auto glass-card p-12 flex flex-col items-center justify-center">
                        <div className="relative w-20 h-20 mb-6">
                            <div className="absolute inset-0 border-4 border-blue-500/20 rounded-full" />
                            <div className="absolute inset-0 border-4 border-transparent border-t-blue-500 rounded-full animate-spin" />
                            <div className="absolute inset-0 flex items-center justify-center text-blue-500">
                                <Sparkles size={32} className="animate-pulse" />
                            </div>
                        </div>
                        <p className="text-slate-400 animate-pulse font-medium">Gemini is translating jargon into plain English...</p>
                    </div>
                ) : explanation ? (
                    <div className="max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700">
                        <div className="glass-card p-8 md:p-12 border-blue-500/10 shadow-2xl shadow-blue-500/5 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-6 opacity-10 pointer-events-none">
                                <Lightbulb size={120} className="text-blue-400" />
                            </div>

                            <div className="flex items-center space-x-3 mb-8">
                                <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-400">
                                    <Sparkles size={20} />
                                </div>
                                <h2 className="text-3xl font-bold text-white font-outfit uppercase tracking-tight">{term}</h2>
                            </div>

                            <div className="prose prose-invert max-w-none text-slate-300 leading-relaxed text-lg">
                                <ReactMarkdown className="simplifier-content">
                                    {explanation}
                                </ReactMarkdown>
                            </div>

                            <div className="mt-12 pt-8 border-t border-slate-800/50 flex flex-col md:flex-row items-center justify-between gap-4">
                                <div className="flex items-center space-x-2 text-sm text-slate-500">
                                    <ShieldCheck size={16} className="text-emerald-500" />
                                    <span>Verified AI explanation for SE Asia context</span>
                                </div>
                                <button
                                    onClick={() => { setTerm(""); setExplanation(""); }}
                                    className="text-blue-400 hover:text-white transition-colors text-sm font-semibold flex items-center space-x-1"
                                >
                                    <span>Explain another term</span>
                                    <ChevronRight size={16} />
                                </button>
                            </div>
                        </div>
                    </div>
                ) : error ? (
                    <div className="max-w-3xl mx-auto glass-card p-8 border-red-500/20 text-center">
                        <p className="text-red-400">{error}</p>
                    </div>
                ) : null}
            </main>

            <style jsx global>{`
        .simplifier-content p { margin-bottom: 1.5rem; }
        .simplifier-content p:last-child { margin-bottom: 0; }
        .simplifier-content strong { color: #60a5fa; font-weight: 700; }
      `}</style>
        </div>
    );
}
