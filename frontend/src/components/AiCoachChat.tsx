'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Bot, User, Loader2, AlertCircle } from 'lucide-react';

interface Message {
  id: string;
  role: 'ai' | 'user';
  content: string;
}

export default function AiCoachChat() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'ai',
      content: "Hello! I'm your AI Money Coach. Paste your recent transactions or ask me a financial question. I'll analyze it against your current goal to give you personalized advice and warn you against BNPL traps."
    }
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput('');
    setError(null);
    
    // Add User Message to UI instantly
    const newMessages = [...messages, { id: Date.now().toString(), role: 'user' as const, content: userMessage }];
    setMessages(newMessages);
    setLoading(true);

    try {
      const response = await fetch('http://localhost:8000/api/ai-coach/advice', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: "demo-user-123",
          recent_transactions_summary: userMessage,
          current_goal: "MacBook Pro M4 ($2000)" // Hardcoded context for now
        }),
      });

      if (!response.ok) {
        throw new Error('Backend responded with an error. Is Ollama running on localhost:11434?');
      }

      const data = await response.json();
      
      setMessages((prev) => [
        ...prev,
        { id: (Date.now() + 1).toString(), role: 'ai', content: data.advice }
      ]);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to connect to AI Coach API.');
      
      // Add a fallback hackathon demonstration message if API key isn't set
      setMessages((prev) => [
        ...prev,
        { 
          id: (Date.now() + 1).toString(), 
          role: 'ai', 
          content: "*(Simulated Demo)* I noticed you spent $400 on BNPL tech gadgets recently. The compounded interest can hurt your savings rate. Try allocating 10% of those payments to your MacBook fund instead!" 
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[500px] w-full max-w-xl bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-100 overflow-hidden font-sans">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-500 to-teal-500 p-4 border-b border-white/20 flex items-center gap-3 shrink-0">
        <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-md border border-white/30">
          <Bot className="w-6 h-6 text-white" />
        </div>
        <div>
           <h2 className="font-bold text-white tracking-tight">AI Money Coach</h2>
           <p className="text-emerald-100 text-xs flex items-center gap-1">
             <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse" /> Online
           </p>
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="bg-amber-50 p-3 flex items-start text-amber-700 text-sm border-b border-amber-100 shrink-0">
          <AlertCircle className="w-5 h-5 mr-2 shrink-0" />
          <p>{error} - Showing cached demo response.</p>
        </div>
      )}

      {/* Chat History */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50 relative">
         {/* Decorative background logo */}
         <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03]">
            <Bot className="w-64 h-64" />
         </div>

        {messages.map((msg) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex gap-2 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                msg.role === 'user' ? 'bg-gray-800 text-white' : 'bg-emerald-100 text-emerald-600'
              }`}>
                {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-5 h-5" />}
              </div>
              
              <div className={`p-3 rounded-2xl text-sm leading-relaxed shadow-sm ${
                msg.role === 'user' 
                  ? 'bg-gray-800 text-white rounded-tr-none' 
                  : 'bg-white text-gray-700 rounded-tl-none border border-gray-100'
              }`}>
                {msg.content}
              </div>
            </div>
          </motion.div>
        ))}
        {loading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
             <div className="flex gap-2">
                <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                   <Loader2 className="w-4 h-4 text-emerald-500 animate-spin" />
                </div>
                <div className="p-4 bg-white rounded-2xl rounded-tl-none border border-gray-100 shadow-sm flex items-center gap-1">
                   <div className="w-2 h-2 bg-emerald-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                   <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                   <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
             </div>
          </motion.div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-gray-100 shrink-0">
        <form onSubmit={handleSendMessage} className="flex gap-2 relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
            placeholder="Type your spending behavior or ask a question..."
            className="flex-1 min-w-0 bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl focus:ring-emerald-500 focus:border-emerald-500 block p-3 pr-12 transition-colors disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors disabled:opacity-50 disabled:hover:bg-emerald-500 flex items-center justify-center group"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />}
          </button>
        </form>
        <p className="text-[10px] text-gray-400 text-center mt-2">
           Powered by Local Ollama API
        </p>
      </div>
    </div>
  );
}
