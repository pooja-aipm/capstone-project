import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { Layers, Bell } from 'lucide-react';

export default function AppLayout() {
    const navItems = [
        { label: 'Dashboard', path: '/dashboard' },
        { label: 'Candidates', path: '/candidates' },
    ];

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            {/* Top Navigation */}
            <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
                <div className="max-w-[1400px] mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center space-x-12">
                        <div className="flex items-center space-x-2">
                            <div className="bg-primary-600 text-white p-1 rounded-md">
                                <Layers size={18} />
                            </div>
                            <span className="font-bold text-lg text-slate-900 tracking-tight">Recruit-AI</span>
                        </div>

                        <nav className="flex items-center space-x-1">
                            {navItems.map((item) => (
                                <NavLink
                                    key={item.path}
                                    to={item.path}
                                    className={({ isActive }) =>
                                        `px-4 py-2 text-sm font-medium rounded-md transition-colors ${isActive
                                            ? 'text-primary-600 bg-primary-50'
                                            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                                        }`
                                    }
                                >
                                    {item.label}
                                </NavLink>
                            ))}
                        </nav>
                    </div>

                    <div className="flex items-center space-x-4">
                        <button className="text-slate-400 hover:text-slate-600 focus:outline-none">
                            <Bell size={20} />
                        </button>
                        <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-sm">
                            JD
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="flex-1 max-w-[1400px] w-full mx-auto p-6 md:p-8">
                <Outlet />
            </main>
        </div>
    );
}
