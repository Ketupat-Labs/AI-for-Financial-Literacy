"use client";

import React, { useState, useRef, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import { sendAdvisorMessage } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { MessageSquare, Send, Sparkles, User, Loader2, Bot } from "lucide-react";
import ReactMarkdown from "react-markdown";

interface Message {
    role: "user" | "bot";
    content: string;
}

export default function AdvisorPage() {
    const { user } = useAuth();
    const [messages, setMessages] = useState<Message[]>([
        { role: "bot", content: "Hello! I'm your AI Money Coach. I've looked at your current spending and income. How can I help you save more today?" }
    ]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, loading]);

    const handleSend = async (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!input.trim() || loading) return;

        const userMsg = input.trim();
        setInput("");
        setMessages(prev => [...prev, { role: "user", content: userMsg }]);
        setLoading(true);

        try {
            const res = await sendAdvisorMessage(userMsg);
            setMessages(prev => [...prev, { role: "bot", content: res.data.reply }]);
        } catch (err) {
            setMessages(prev => [...prev, { role: "bot", content: "I'm having trouble connecting to my brain right now. Please try again in a moment! 🙏" }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 flex font-inter">
            <Sidebar />
            <main className="flex-1 md:ml-64 flex flex-col h-screen overflow-hidden">
                {/* Header */}
                <header className="p-6 border-b border-slate-900 bg-slate-950/50 backdrop-blur-md flex items-center justify-between z-10">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-cyan-500/10 rounded-xl flex items-center justify-center text-cyan-400">
                            <Sparkles size={20} />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold font-outfit text-white">Robo-Advisor</h1>
                            <p className="text-xs text-slate-400">Powered by Gemini AI • Active 24/7</p>
                        </div>
                    </div>
                </header>

                {/* Chat Area */}
                <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth">
                    {messages.map((msg, idx) => (
                        <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-4 duration-300`}>
                            <div className={`flex max-w-[85%] md:max-w-[70%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'ml-3 bg-blue-600' : 'mr-3 bg-slate-800'}`}>
                                    {msg.role === 'user' ? <User size={16} className="text-white" /> : <Bot size={16} className="text-cyan-400" />}
                                </div>
                                <div className={`p-4 rounded-2xl text-sm leading-relaxed ${msg.role === 'user' ? 'bg-blue-600 text-white rounded-tr-none shadow-lg shadow-blue-600/10' : 'glass-card rounded-tl-none border-slate-800/80 text-slate-200'}`}>
                                    <ReactMarkdown className="markdown-chat">
                                        {msg.content}
                                    </ReactMarkdown>
                                </div>
                            </div>
                        </div>
                    ))}
                    {loading && (
                        <div className="flex justify-start">
                            <div className="flex max-w-[70%]">
                                <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mr-3 bg-slate-800">
                                    <Bot size={16} className="text-cyan-400" />
                                </div>
                                <div className="p-4 rounded-2xl glass-card rounded-tl-none flex items-center space-x-2">
                                    <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                                    <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                                    <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce" />
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Input Area */}
                <div className="p-6 bg-slate-950">
                    <form onSubmit={handleSend} className="max-w-4xl mx-auto relative group">
                        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-blue-600/20 blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity" />
                        <div className="relative glass-card border-slate-800 focus-within:border-cyan-500/50 flex items-center p-2">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Ask about your budget, savings goals, or debt..."
                                className="flex-1 bg-transparent border-none focus:ring-0 px-4 py-2 text-white placeholder-slate-500 text-sm"
                            />
                            <button
                                type="submit"
                                disabled={!input.trim() || loading}
                                className="w-10 h-10 bg-cyan-500 text-white rounded-xl flex items-center justify-center hover:bg-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                            >
                                <Send size={18} />
                            </button>
                        </div>
                        <p className="text-[10px] text-center text-slate-600 mt-3 uppercase tracking-widest font-bold">
                            Tip: ask "how much should I save if I want to buy a house in 5 years?"
                        </p>
                    </form>
                </div>
            </main>

            <style jsx global>{`
        .markdown-chat p { margin-bottom: 0.75rem; }
        .markdown-chat p:last-child { margin-bottom: 0; }
        .markdown-chat ul, .markdown-chat ol { margin-left: 1.25rem; margin-bottom: 1rem; list-style-type: disc; }
        .markdown-chat li { margin-bottom: 0.25rem; }
        .markdown-chat strong { color: #22d3ee; }
      `}</style>
        </div>
    );
}
