
// FIX: Provide full content for the Header component.
import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import type { User, View } from '../types';
import { SunIcon, MoonIcon } from './icons';

interface HeaderProps {
  currentUser: User | null;
  setView: (view: View) => void;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({ currentUser, setView, onLogout }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="bg-white shadow-md dark:bg-slate-800 sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <h1 
              className="text-2xl font-bold text-primary cursor-pointer"
              onClick={() => setView({ type: 'DASHBOARD' })}
            >
              SortieEnsemble
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-gray-500 hover:bg-gray-100 dark:text-slate-400 dark:hover:bg-slate-700"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? <SunIcon className="h-6 w-6" /> : <MoonIcon className="h-6 w-6" />}
            </button>
            {currentUser ? (
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setView({ type: 'CREATE_ACTIVITY' })}
                  className="px-4 py-2 bg-primary text-white font-semibold rounded-lg shadow hover:bg-primary-hover hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-focus transition-all duration-200"
                >
                  Créer une activité
                </button>
                <div className="relative group">
                    <button onClick={() => setView({ type: 'PROFILE' })} className="flex items-center space-x-2">
                        <img src={currentUser.avatar} alt={currentUser.name} className="h-9 w-9 rounded-full" />
                    </button>
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20 hidden group-hover:block dark:bg-slate-700">
                        <button onClick={() => setView({ type: 'PROFILE' })} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-slate-200 dark:hover:bg-slate-600">
                            Mon Profil
                        </button>
                        {currentUser.role === 'admin' && (
                          <button 
                            onClick={() => setView({ type: 'ADMIN', section: 'dashboard' })} 
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-slate-200 dark:hover:bg-slate-600"
                          >
                            Administration
                          </button>
                        )}
                        <button onClick={onLogout} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-slate-200 dark:hover:bg-slate-600">
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
