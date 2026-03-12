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
}
