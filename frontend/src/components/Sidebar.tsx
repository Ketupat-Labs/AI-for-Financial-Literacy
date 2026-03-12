"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
    LayoutDashboard,
    MessageSquareQuote,
    History,
    Lightbulb,
    Settings,
    LogOut,
    TrendingUp,
    Wallet
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const Sidebar = () => {
    const pathname = usePathname();
    const router = useRouter();
    const { logout, user } = useAuth();

    const links = [
        { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
        { name: "AI Advisor", href: "/advisor", icon: MessageSquareQuote },
        { name: "Tracker", href: "/tracker", icon: Wallet },
        { name: "Simplifier", href: "/simplifier", icon: Lightbulb },
    ];

    const handleLogout = () => {
        logout();
        router.push("/");
    };

    if (!user) return null;

    return (
        <aside className="w-64 glass-card border-l-0 border-t-0 border-b-0 rounded-none h-screen fixed left-0 top-0 z-40 hidden md:flex flex-col">
            <div className="p-6">
                <Link href="/dashboard" className="flex items-center space-x-2">
                    <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/20">
                        <TrendingUp className="text-white w-6 h-6" />
                    </div>
                    <span className="font-outfit font-bold text-xl tracking-tight text-white">
                        MoneyCoach<span className="text-cyan-400 font-black">.</span>
                    </span>
                </Link>
            </div>

            <nav className="flex-1 px-4 space-y-2 mt-4">
                {links.map((link) => {
                    const Icon = link.icon;
                    const isActive = pathname === link.href;
                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`sidebar-link ${isActive ? "sidebar-link-active" : ""}`}
                        >
                            <Icon size={20} />
                            <span className="font-medium">{link.name}</span>
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-slate-800">
                <div className="flex items-center space-x-3 p-3 rounded-xl bg-slate-800/20 mb-4">
                    <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-cyan-400 font-bold">
                        {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 overflow-hidden">
                        <p className="text-sm font-semibold truncate">{user.name}</p>
                        <p className="text-xs text-slate-500 truncate">{user.email}</p>
                    </div>
                </div>

                <button
                    onClick={handleLogout}
                    className="w-full sidebar-link text-red-500 hover:text-red-400 hover:bg-red-500/10"
                >
                    <LogOut size={20} />
                    <span className="font-medium">Logout</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
迫于篇幅，我将把其他页面代码放在后面
