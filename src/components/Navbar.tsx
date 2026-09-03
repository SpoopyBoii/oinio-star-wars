import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Users, Globe, Rocket } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { AuthModal } from './AuthModal';

export const Navbar: React.FC = () => {
    const { user, signOut } = useAuth();
    const [isAuthOpen, setIsAuthOpen] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const location = useLocation();

    const navLinks = [
        { name: 'People', path: '/', icon: <Users size={20} /> },
        { name: 'Planets', path: '/planets', icon: <Globe size={20} /> },
        { name: 'Starships', path: '/starships', icon: <Rocket size={20} /> },
    ];

    return (
        <>
            <nav className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-40">
                <div className="w-full px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">

                        {/* Left Side: Animated Burger Menu & Brand */}
                        <div className="flex items-center">
                            <button
                                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                                className="pr-4 mr-4 border-r border-slate-700 text-slate-300 hover:text-white transition-colors"
                                aria-label="Toggle menu"
                            >
                                <div className={`transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'rotate-90 text-yellow-400' : 'rotate-0'}`}>
                                    <Menu size={24} />
                                </div>
                            </button>
                            <Link to="/" className="text-xl font-starwars tracking-widest text-yellow-400 hover:text-yellow-300 transition-colors">
                                Sw-ExploreR
                            </Link>
                        </div>

                        {/* Right Side: Auth Buttons */}
                        <div className="flex items-center">
                            {user ? (
                                <div className="flex items-center space-x-4">
                                    <span className="text-xs text-slate-400 hidden sm:inline">
                                        {user.email}
                                    </span>
                                    <button
                                        onClick={() => signOut()}
                                        className="rounded-full border border-slate-700 bg-slate-800 px-5 py-2 text-xs font-medium text-slate-200 hover:bg-slate-700 transition-colors"
                                    >
                                        Sign Out
                                    </button>
                                </div>
                            ) : (
                                <button
                                    onClick={() => setIsAuthOpen(true)}
                                    className="rounded-full bg-yellow-400 px-6 py-2 text-sm font-bold text-slate-950 hover:bg-yellow-300 transition-colors"
                                >
                                    Sign In
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            {/* Animated Overlay Container */}
            <div
                className={`fixed inset-0 z-50 flex transition-opacity duration-300 ease-in-out ${isSidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                    }`}
            >
                {/* Fading Backdrop */}
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-all duration-300 ease-in-out"
                    onClick={() => setIsSidebarOpen(false)}
                />

                {/* Sliding Side Panel */}
                <div
                    className={`relative w-72 bg-slate-900 border-r border-slate-800 h-full shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out z-10 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
                        }`}
                >
                    <div className="flex items-center justify-between p-4 border-b border-slate-800">
                        <span className="text-lg font-bold text-yellow-400">Menu</span>
                        <button
                            onClick={() => setIsSidebarOpen(false)}
                            className="text-slate-400 hover:text-white transition-colors"
                        >
                            <X size={24} />
                        </button>
                    </div>

                    <div className="flex flex-col py-4">
                        {navLinks.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                onClick={() => setIsSidebarOpen(false)}
                                className={`flex items-center space-x-4 px-6 py-4 text-sm font-medium transition-colors ${location.pathname === link.path
                                    ? 'bg-slate-800/50 text-yellow-400 border-r-4 border-yellow-400'
                                    : 'text-slate-300 hover:text-white hover:bg-slate-800/30'
                                    }`}
                            >
                                {link.icon}
                                <span>{link.name}</span>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>

            <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
        </>
    );
};