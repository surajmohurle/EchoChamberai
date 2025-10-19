import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Loader from './components/Loader';
import Dashboard from './components/Dashboard';
import AuthPage from './components/AuthPage';
import VerifyEmailPage from './components/VerifyEmailPage';
import HomePage from './components/HomePage';
import { generateContentAssets } from './services/geminiService';
import { authService, User } from './services/authService';
import { GeneratedAssets, InputType } from './types';

const Footer: React.FC = () => (
    <footer className="py-8 mt-auto border-t border-border-color">
        <div className="container mx-auto px-4 text-center text-sm text-text-secondary">
             <p className="mt-4 text-xs">
                Powered by <a href="https://ai.google.dev/" target="_blank" rel="noopener noreferrer" className="font-semibold text-primary hover:underline">Google Gemini</a>
            </p>
        </div>
    </footer>
);


const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedAssets, setGeneratedAssets] = useState<GeneratedAssets | null>(null);
  
  // Auth State
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authView, setAuthView] = useState<'app' | 'auth' | 'verify'>('auth');
  const [userEmailForVerification, setUserEmailForVerification] = useState<string>('');


  useEffect(() => {
    const user = authService.getCurrentUser();
    if (user) {
      setCurrentUser(user);
      setAuthView('app');
    }
  }, []);


  const determineInputType = (input: string, file?: File): InputType => {
    if (file) {
      if (file.type.startsWith('audio/')) return InputType.AUDIO;
      if (file.type.startsWith('video/')) return InputType.YOUTUBE; 
    }
    if (input.includes('youtube.com') || input.includes('youtu.be')) {
      return InputType.YOUTUBE;
    }
    try {
      new URL(input);
      return InputType.BLOG;
    } catch (_) {
      // Not a valid URL
    }
    return InputType.UNKNOWN;
  };

  const handleSubmit = async (input: string, file?: File) => {
    setIsLoading(true);
    setError(null);
    setGeneratedAssets(null);
    
    const inputType = determineInputType(input, file);

    if (inputType === InputType.UNKNOWN) {
        setError("Invalid input. Please provide a valid YouTube URL, blog post URL, or an audio/video file.");
        setIsLoading(false);
        return;
    }

    try {
      const result = await generateContentAssets(inputType, file ? file.name : input, file);
      setGeneratedAssets(result);
    } catch (e: any) {
      setError(e.message || "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };
  
  const resetApp = () => {
    setGeneratedAssets(null);
    setError(null);
    setIsLoading(false);
  }
  
  // --- Auth Handlers ---
  const handleLoginSuccess = (user: User) => {
      setCurrentUser(user);
      setAuthView('app');
  };

  const handleSignupSuccess = (email: string) => {
      setUserEmailForVerification(email);
      setAuthView('verify');
  };

  const handleLogout = () => {
      authService.logOut();
      setCurrentUser(null);
      setAuthView('auth');
  };


  const renderMainContent = () => {
    if(isLoading) return <Loader />;

    if(error) {
        return (
            <div className="my-8 max-w-2xl mx-auto bg-red-50 border border-red-200 text-red-800 px-4 py-4 rounded-lg relative text-center shadow-md animate-fade-in-up" role="alert">
                <div className="flex items-center justify-center space-x-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <strong className="font-bold text-lg">An Error Occurred</strong>
                </div>
                <p className="mt-2 text-sm">{error}</p>
                <button onClick={resetApp} className="mt-4 font-bold text-primary hover:underline text-sm">
                    Try Again
                </button>
            </div>
        )
    }

    if(generatedAssets) {
        return (
            <>
                <Dashboard assets={generatedAssets} />
                <div className="text-center my-12 animate-fade-in-up" style={{animationDelay: '0.5s'}}>
                    <button 
                        onClick={resetApp}
                        className="bg-primary hover:bg-primary-hover text-white font-bold py-3 px-8 rounded-lg transition-all transform hover:scale-105 shadow-lg text-lg flex items-center justify-center mx-auto space-x-2"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        <span>Analyze New Content</span>
                    </button>
                </div>
            </>
        )
    }

    return <HomePage onSubmit={handleSubmit} isLoading={isLoading} />;
  }
  
  const renderAppView = () => {
    switch (authView) {
        case 'app':
            return renderMainContent();
        case 'verify':
            return <VerifyEmailPage email={userEmailForVerification} onVerifySuccess={handleLoginSuccess} onBackToLogin={() => setAuthView('auth')} />;
        case 'auth':
        default:
            return <AuthPage onLoginSuccess={handleLoginSuccess} onSignupSuccess={handleSignupSuccess} />;
    }
  }


  return (
    <div className="min-h-screen bg-background text-text-primary font-sans flex flex-col">
      <Header user={currentUser} onLogout={handleLogout} />
      <main className="container mx-auto px-4 flex-grow w-full flex">
        <div className="w-full">
            {renderAppView()}
        </div>
      </main>
      <Footer/>
    </div>
  );
};

export default App;
