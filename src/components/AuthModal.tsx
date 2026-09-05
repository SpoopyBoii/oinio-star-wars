import React, { useState } from 'react';
import { X, Mail, Lock, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (isLogin) {
                const { error: signInError } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (signInError) throw signInError;
                toast.success('Clearance accepted. May the force be with you!');
            } else {
                const { error: signUpError } = await supabase.auth.signUp({
                    email,
                    password,
                });
                if (signUpError) throw signUpError;
                toast.success('Signature registered. Datapad access granted!');
            }
            handleClose();
        } catch (err: any) {
            const errorMessage = err.message || 'An error occurred. Please try again.';
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setEmail('');
        setPassword('');
        setError(null);
        setIsLogin(true);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={handleClose}
            />

            {/* Modal Content */}
            <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl z-10">
                <button
                    onClick={handleClose}
                    className="absolute right-6 top-6 text-slate-400 hover:text-white transition-colors"
                >
                    <X size={20} />
                </button>

                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-slate-100">
                        {isLogin ? 'Access Datapad' : 'Register Signature'}
                    </h2>
                    <p className="text-sm text-slate-400 mt-2">
                        {isLogin
                            ? 'Enter your credentials to access your secure records.'
                            : 'Create a new clearance code for your personal archive.'}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                            Email
                        </label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full rounded-full bg-slate-950 border border-slate-800 pl-12 pr-4 py-3 text-sm text-slate-100 focus:border-yellow-400 focus:outline-none focus:ring-1 focus:ring-yellow-400 transition-colors"
                                placeholder="commander@rebellion.com"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                            Password
                        </label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                minLength={6}
                                className="w-full rounded-full bg-slate-950 border border-slate-800 pl-12 pr-4 py-3 text-sm text-slate-100 focus:border-yellow-400 focus:outline-none focus:ring-1 focus:ring-yellow-400 transition-colors"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="text-sm text-red-400 bg-red-950/50 p-3 rounded-xl border border-red-900/50">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex items-center justify-center space-x-2 rounded-full bg-yellow-400 px-4 py-3 mt-6 text-sm font-bold text-slate-950 hover:bg-yellow-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        {loading ? (
                            <Loader2 size={18} className="animate-spin" />
                        ) : (
                            <span>{isLogin ? 'Sign In' : 'Sign Up'}</span>
                        )}
                    </button>
                </form>

                <div className="mt-6 text-center text-sm text-slate-400 border-t border-slate-800 pt-6">
                    {isLogin ? "Don't have clearance? " : "Already registered? "}
                    <button
                        onClick={() => {
                            setIsLogin(!isLogin);
                            setError(null);
                        }}
                        className="text-yellow-400 hover:text-yellow-300 font-semibold transition-colors"
                    >
                        {isLogin ? 'Sign up' : 'Sign in'}
                    </button>
                </div>
            </div>
        </div>
    );
};