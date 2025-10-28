// FIX: Provide full content for the Header component.
import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import type { User, View } from '../types';
import { SunIcon, MoonIcon } from './icons';
import { Logo } from './Logo';

interface HeaderProps {
  currentUser: User | null;
  setView: (view: View) => void;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({ currentUser, setView, onLogout }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="bg-light/80 dark:bg-dark/80 backdrop-blur-sm sticky top-0 z-50 border-b border-stone-200/80 dark:border-stone-800/80">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <div onClick={() => setView({ type: 'DASHBOARD' })} className="cursor-pointer">
                <Logo className="h-8 w-auto text-stone-800 dark:text-stone-100" />
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-stone-500 hover:bg-stone-200/50 dark:text-stone-400 dark:hover:bg-stone-700/50 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? <SunIcon className="h-6 w-6" /> : <MoonIcon className="h-6 w-6" />}
            </button>
            {currentUser ? (
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setView({ type: 'CREATE_ACTIVITY' })}
                  className="px-4 py-2 bg-primary text-white font-semibold rounded-lg shadow-sm hover:bg-primary-hover hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-focus transition-all duration-200 hidden sm:block"
                >
                  Créer une activité
                </button>
                <div className="relative group">
                    <button className="flex items-center space-x-2">
                        <img src={currentUser.avatar} alt={currentUser.name} className="h-9 w-9 rounded-full ring-2 ring-offset-2 ring-offset-light dark:ring-offset-dark ring-primary/50" />
                    </button>
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg py-1 z-20 hidden group-hover:block dark:bg-stone-800 border dark:border-stone-700 transition-opacity duration-300">
                        <button onClick={() => setView({ type: 'PROFILE' })} className="block w-full text-left px-4 py-2 text-sm text-stone-700 hover:bg-stone-100 dark:text-stone-200 dark:hover:bg-stone-700">
                            Mon Profil
                        </button>
                        {currentUser.role === 'admin' ? (
                          <button 
                            onClick={() => setView({ type: 'ADMIN', section: 'dashboard' })} 
                            className="block w-full text-left px-4 py-2 text-sm text-stone-700 hover:bg-stone-100 dark:text-stone-200 dark:hover:bg-stone-700"
                          >
                            Administration
                          </button>
                        ) : (
                           <button
                            onClick={() => {
                                onLogout();
                                setView({ type: 'ADMIN_LOGIN' });
                            }}
                            className="block w-full text-left px-4 py-2 text-sm text-stone-700 hover:bg-stone-100 dark:text-stone-200 dark:hover:bg-stone-700"
                           >
                             Portail Admin
                           </button>
                        )}
                        <button onClick={onLogout} className="block w-full text-left px-4 py-2 text-sm text-stone-700 hover:bg-stone-100 dark:text-stone-200 dark:hover:bg-stone-700">
                            Déconnexion
                        </button>
                    </div>
                </div>
              </div>
            ) : (
             null
            )}
          </div>
        </div>
      </div>
    </header>
  );
};