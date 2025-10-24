import React, { useState } from 'react';
import type { User, View } from '../types';
import { PlusIcon } from './icons';

interface HeaderProps {
  currentUser: User;
  onLogout: () => void;
  setView: (view: View) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentUser, onLogout, setView }) => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  return (
    <>
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex-shrink-0">
              <h1 
                onClick={() => setView({ type: 'DASHBOARD' })} 
                className="text-2xl font-bold text-primary cursor-pointer hover:text-primary-hover transition-colors"
              >
                SortieEnsemble
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setView({ type: 'CREATE_ACTIVITY' })}
                className="hidden sm:flex items-center justify-center gap-2 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-focus transition-all"
              >
                <PlusIcon className="h-5 w-5" />
                Créer une activité
              </button>
              <div className="relative">
                <div className="flex items-center space-x-3">
                  <span className="text-sm font-medium hidden sm:block">Bonjour, {currentUser.name}</span>
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="h-10 w-10 rounded-full cursor-pointer"
                    onClick={() => setDropdownOpen(!isDropdownOpen)}
                  />
                </div>
                {isDropdownOpen && (
                  <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                      <>
                        <a
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            setView({ type: 'PROFILE' });
                            setDropdownOpen(false);
                          }}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Mon Profil
                        </a>
                        {currentUser.role === 'admin' && (
                          <a
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              setView({ type: 'ADMIN_PANEL' });
                              setDropdownOpen(false);
                            }}
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            Panel Admin
                          </a>
                        )}
                        <a
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            onLogout();
                            setDropdownOpen(false);
                          }}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Se déconnecter
                        </a>
                      </>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};