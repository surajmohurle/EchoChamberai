import React, { useState } from 'react';
import { authService, User } from '../services/authService';

interface AuthPageProps {
    onLoginSuccess: (user: User) => void;
    onSignupSuccess: (email: string) => void;
}

const AuthPage: React.FC<AuthPageProps> = ({ onLoginSuccess, onSignupSuccess }) => {
    const [isLoginView, setIsLoginView] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isLoading || !email || !password) return;

        setIsLoading(true);
        setError(null);

        try {
            if (isLoginView) {
                const result = await authService.logIn(email, password);
                if (result.success && result.user) {
                    onLoginSuccess(result.user);
                } else {
                    setError(result.message);
                }
            } else {
                const result = await authService.signUp(email, password);
                if (result.success) {
                    onSignupSuccess(email);
                } else {
                    setError(result.message);
                }
            }
        } catch (err: any) {
            setError(err.message || 'An unexpected error occurred.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full max-w-md mx-auto py-12 md:py-24 animate-fade-in-up flex flex-col justify-center">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-extrabold text-text-primary tracking-tight">
                    {isLoginView ? 'Welcome Back' : 'Create an Account'}
                </h2>
                <p className="mt-2 text-sm text-text-secondary">
                    {isLoginView ? 'Log in to continue to Echo Chamber AI.' : 'Get started by creating a new account.'}
                </p>
            </div>

            <div className="bg-surface shadow-2xl rounded-2xl p-4 lg:p-8 ring-1 ring-border-color/50">
                <div className="flex border-b border-border-color mb-6">
                    <button
                        onClick={() => { setIsLoginView(true); setError(null); }}
                        className={`w-1/2 py-3 font-semibold text-sm transition-colors ${isLoginView ? 'text-primary border-b-2 border-primary' : 'text-text-secondary hover:text-text-primary'}`}
                    >
                        Log In
                    </button>
                    <button
                        onClick={() => { setIsLoginView(false); setError(null); }}
                        className={`w-1/2 py-3 font-semibold text-sm transition-colors ${!isLoginView ? 'text-primary border-b-2 border-primary' : 'text-text-secondary hover:text-text-primary'}`}
                    >
                        Sign Up
                    </button>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                        <div className="bg-red-50 text-red-700 p-3 rounded-lg text-sm text-center">
                            {error}
                        </div>
                    )}
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-text-primary mb-1">
                            Email address
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-3 py-2 bg-slate-100 text-text-primary border border-border-color rounded-lg focus:ring-1 focus:ring-primary focus:border-primary transition-all"
                            placeholder="you@example.com"
                        />
                    </div>
                    <div>
                        <label htmlFor="password"  className="block text-sm font-medium text-text-primary mb-1">
                            Password
                        </label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            autoComplete={isLoginView ? "current-password" : "new-password"}
                            required
                            minLength={6}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-3 py-2 bg-slate-100 text-text-primary border border-border-color rounded-lg focus:ring-1 focus:ring-primary focus:border-primary transition-all"
                            placeholder="••••••••"
                        />
                    </div>
                     <button
                        type="submit"
                        disabled={isLoading || !email || !password}
                        className="w-full bg-primary hover:bg-primary-hover disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-[1.02] flex items-center justify-center shadow-lg text-base space-x-3"
                        >
                        {isLoading ? (
                            <>
                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                <span>Processing...</span>
                            </>
                        ) : (
                            <span>{isLoginView ? 'Log In' : 'Create Account'}</span>
                        )}
                        </button>
                </form>
            </div>
        </div>
    );
};

export default AuthPage;
