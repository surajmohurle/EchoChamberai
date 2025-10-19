import React from 'react';
import { User } from '../services/authService';

interface HeaderProps {
    user: User | null;
    onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, onLogout }) => {
  return (
    <header className="py-3 border-b border-border-color bg-background/80 backdrop-blur-sm sticky top-0 z-40">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold text-text-primary tracking-tight">
            <span className="bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
              Echo Chamber AI
            </span>
          </h1>
        </div>
         
        {user ? (
            <div className="flex items-center space-x-4">
                <span className="text-sm text-text-secondary hidden sm:block">{user.email}</span>
                <button 
                    onClick={onLogout}
                    className="text-sm font-semibold text-primary hover:text-primary-hover bg-primary/10 hover:bg-primary/20 px-3 py-1.5 rounded-md transition-colors"
                >
                    Log Out
                </button>
            </div>
        ) : (
             <p className="hidden md:block text-sm text-text-secondary font-medium">
                The All-in-One Multimodal Content Atomizer
            </p>
        )}
      </div>
    </header>
  );
};

export default Header;
