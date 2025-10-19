import React, { useState } from 'react';
import { authService, User } from '../services/authService';

interface VerifyEmailPageProps {
    email: string;
    onVerifySuccess: (user: User) => void;
    onBackToLogin: () => void;
}

const VerifyEmailPage: React.FC<VerifyEmailPageProps> = ({ email, onVerifySuccess, onBackToLogin }) => {
    const [isVerifying, setIsVerifying] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleVerification = async () => {
        setIsVerifying(true);
        setError(null);
        try {
            const result = await authService.verifyEmail(email);
            if (result.success && result.user) {
                onVerifySuccess(result.user);
            } else {
                setError("Verification failed. The link may have expired or is invalid.");
            }
        } catch (err) {
            setError("An unexpected error occurred during verification.");
        } finally {
            setIsVerifying(false);
        }
    };


    return (
        <div className="w-full max-w-lg mx-auto py-12 md:py-24 animate-fade-in-up flex flex-col justify-center text-center">
             <div className="bg-surface shadow-2xl rounded-2xl p-8 lg:p-12 ring-1 ring-border-color/50">
                 <div className="mx-auto bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center ring-4 ring-primary/20">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                 </div>

                <h2 className="text-2xl md:text-3xl font-extrabold text-text-primary tracking-tight mt-6">
                    Verify Your Email
                </h2>
                <p className="mt-4 text-text-secondary">
                    We've sent a verification link to <strong className="text-text-primary">{email}</strong>. Please check your inbox and click the link to activate your account.
                </p>
                
                 {error && (
                    <div className="bg-red-50 text-red-700 p-3 rounded-lg text-sm text-center mt-6">
                        {error}
                    </div>
                )}
                
                <div className="mt-8">
                    <p className="text-xs text-text-secondary/80 mb-2">For demonstration purposes:</p>
                     <button
                        onClick={handleVerification}
                        disabled={isVerifying}
                        className="w-full bg-secondary hover:bg-emerald-700 disabled:bg-slate-300 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-[1.02] flex items-center justify-center shadow-lg text-base space-x-3"
                        >
                        {isVerifying ? (
                             <>
                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                <span>Verifying...</span>
                            </>
                        ) : (
                            <span>Simulate Clicking Verification Link</span>
                        )}
                    </button>
                </div>
                
                 <div className="mt-8 text-sm">
                    <button onClick={onBackToLogin} className="text-primary hover:underline font-semibold">
                        &larr; Back to Log In
                    </button>
                </div>
            </div>
        </div>
    );
}

export default VerifyEmailPage;
