<<<<<<< HEAD
import SavingsGoalProgressBar from '@/components/SavingsGoalProgressBar';
import AiCoachChat from '@/components/AiCoachChat';
import React from 'react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-8 font-sans">
      <main className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {/* Left Column - Hero & Copy */}
        <div className="flex flex-col space-y-6">
          <div className="inline-flex items-center space-x-2 bg-emerald-100/50 w-fit px-3 py-1 rounded-full text-emerald-700 text-sm font-medium border border-emerald-200">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span>AI Money Coach API Active</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight leading-tight">
            Build your <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-400">Financial Resilience</span>
          </h1>
          
          <p className="text-lg text-gray-600 leading-relaxed">
            Your 24/7 AI Money Coach analyzes your spending patterns, identifies BNPL risks, and provides personalized saving advice to help you reach your goals faster.
          </p>


        </div>

        {/* Right Column - Components */}
        <div className="flex flex-col space-y-8 items-center md:items-end w-full">
           <SavingsGoalProgressBar />
           
           <div className="w-full max-w-md mt-4">
              <AiCoachChat />
           </div>
        </div>
      </main>

      <footer className="mt-20 text-center text-gray-400 text-sm">
         Developed for BorNEO HackWknd 2026
      </footer>
    </div>
  );
=======
"use client";

import React from "react";
import Link from "next/link";
import { TrendingUp, ShieldCheck, Sparkles, MessageCircle, ArrowRight } from "lucide-react";

export default function LandingPage() {
    return (
        <div className="relative min-h-screen overflow-hidden">
            {/* Background Orbs */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-500/20 rounded-full blur-[120px] -z-10 animate-float" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[120px] -z-10" />

            {/* Nav */}
            <nav className="max-w-7xl mx-auto px-6 py-8 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/20">
                        <TrendingUp className="text-white w-6 h-6" />
                    </div>
                    <span className="font-outfit font-bold text-2xl tracking-tight text-white">
                        MoneyCoach<span className="text-cyan-400 font-black">.</span>
                    </span>
                </div>
                <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-slate-400">
                    <a href="#features" className="hover:text-white transition-colors">Features</a>
                    <a href="#about" className="hover:text-white transition-colors">About</a>
                    <Link href="/login" className="px-5 py-2 rounded-full border border-slate-700 hover:bg-slate-800 transition-all">Login</Link>
                    <Link href="/register" className="btn-primary">Get Started</Link>
                </div>
            </nav>

            {/* Hero */}
            <main className="max-w-7xl mx-auto px-6 pt-20 pb-32 text-center">
                <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-slate-900/50 border border-slate-800 text-cyan-400 text-sm font-medium mb-8">
                    <Sparkles size={16} />
                    <span>AI-Powered Financial Freedom for SE Asia</span>
                </div>

                <h1 className="font-outfit text-5xl md:text-7xl font-bold mb-6 tracking-tight leading-tight">
                    Master Your Money with <br />
                    <span className="text-gradient">AI Financial Coaching.</span>
                </h1>
                <p className="max-w-2xl mx-auto text-lg md:text-xl text-slate-400 mb-10 leading-relaxed">
                    The 24/7 personal advisor you didn't know you could afford.
                    Understand debt, crush your savings goals, and simplify the world of finance.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                    <Link href="/register" className="btn-primary py-4 px-10 text-lg flex items-center space-x-2">
                        <span>Start Saving Today</span>
                        <ArrowRight size={20} />
                    </Link>
                    <Link href="/login" className="btn-secondary py-4 px-10 text-lg">
                        Login to Dashboard
                    </Link>
                </div>

                {/* Feature Grid */}
                <div id="features" className="grid md:grid-cols-3 gap-8 mt-32 text-left">
                    <div className="glass-card glass-card-hover p-8 group">
                        <div className="w-12 h-12 bg-cyan-500/10 rounded-2xl flex items-center justify-center text-cyan-400 mb-6 group-hover:scale-110 transition-transform">
                            <MessageCircle size={24} />
                        </div>
                        <h3 className="font-outfit text-xl font-bold mb-3">AI Robo-Advisor</h3>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            Personalized investment and savings plans tailored to your local SEA income and goals.
                        </p>
                    </div>

                    <div className="glass-card glass-card-hover p-8 group">
                        <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-400 mb-6 group-hover:scale-110 transition-transform">
                            <ShieldCheck size={24} />
                        </div>
                        <h3 className="font-outfit text-xl font-bold mb-3">Spending Alerts</h3>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            Real-time nudges that stop you from overspending before it's too late. Budgeting made easy.
                        </p>
                    </div>

                    <div className="glass-card glass-card-hover p-8 group">
                        <div className="w-12 h-12 bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-400 mb-6 group-hover:scale-110 transition-transform">
                            <Lightbulb size={24} />
                        </div>
                        <h3 className="font-outfit text-xl font-bold mb-3">Finance Simplifier</h3>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            Complex terms like "Compound Interest" explained in plain words with local examples.
                        </p>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="max-w-7xl mx-auto px-6 py-12 border-t border-slate-900 text-center text-slate-500 text-sm">
                <p>© 2026 AI MoneyCoach. Empowering financial literacy in SE Asia.</p>
            </footer>
        </div>
    );
>>>>>>> e5faf4fdffb8bd8e0ae9ff1dba1a27ddfc2a74b6
}
