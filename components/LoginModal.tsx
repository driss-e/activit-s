import React, { useState, useEffect } from 'react';
import type { User } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (user: User) => void;
  onRegister: (newUser: Omit<User, 'id' | 'avatar' | 'role'>) => void;
  users: User[];
  initialMode: 'login' | 'register';
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLogin, onRegister, users, initialMode }) => {
  const [mode, setMode] = useState(initialMode);
  
  // Login state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  
  // Register state
  const [registerName, setRegisterName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');

  const [error, setError] = useState('');

  const resetForms = () => {
      setLoginEmail('');
      setLoginPassword('');
      setRegisterName('');
      setRegisterEmail('');
      setRegisterPassword('');
      setError('');
  };

  useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
      resetForms();
    }
  }, [isOpen, initialMode]);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const user = users.find(u => u.email === loginEmail && u.password === loginPassword);
    if (user) {
      onLogin(user);
      onClose();
    } else {
      setError('Email ou mot de passe incorrect.');
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (users.some(u => u.email === registerEmail)) {
      setError('Un compte avec cet email existe déjà.');
      return;
    }
    onRegister({ name: registerName, email: registerEmail, password: registerPassword });
    onClose();
  };

  const switchMode = (newMode: 'login' | 'register') => {
      setMode(newMode);
      resetForms();
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-[100] flex justify-center items-center" aria-modal="true" role="dialog" onClick={onClose}>
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md relative m-4" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-500 hover:text-gray-800" aria-label="Fermer">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
        </button>
        
        <div className="flex border-b mb-6">
            <button 
                onClick={() => switchMode('login')}
                className={`flex-1 py-2 text-center font-semibold ${mode === 'login' ? 'text-primary border-b-2 border-primary' : 'text-gray-500'}`}
            >
                Connexion
            </button>
            <button 
                onClick={() => switchMode('register')}
                className={`flex-1 py-2 text-center font-semibold ${mode === 'register' ? 'text-primary border-b-2 border-primary' : 'text-gray-500'}`}
            >
                Inscription
            </button>
        </div>

        {error && <p className="bg-red-100 text-red-700 p-3 rounded-md mb-4 text-sm">{error}</p>}

        {mode === 'login' ? (
            <form onSubmit={handleLoginSubmit}>
                <div className="mb-4">
                    <label htmlFor="login-email" className="block text-sm font-medium text-gray-700">Adresse e-mail</label>
                    <input type="email" id="login-email" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} required autoComplete="email" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
                </div>
                <div className="mb-6">
                    <label htmlFor="login-password" className="block text-sm font-medium text-gray-700">Mot de passe</label>
                    <input type="password" id="login-password" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} required autoComplete="current-password" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
                </div>
                <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-focus">
                    Se connecter
                </button>
            </form>
        ) : (
            <form onSubmit={handleRegisterSubmit}>
                <div className="mb-4">
                    <label htmlFor="register-name" className="block text-sm font-medium text-gray-700">Nom complet</label>
                    <input type="text" id="register-name" value={registerName} onChange={(e) => setRegisterName(e.target.value)} required autoComplete="name" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
                </div>
                <div className="mb-4">
                    <label htmlFor="register-email" className="block text-sm font-medium text-gray-700">Adresse e-mail</label>
                    <input type="email" id="register-email" value={registerEmail} onChange={(e) => setRegisterEmail(e.target.value)} required autoComplete="email" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
                </div>
                <div className="mb-6">
                    <label htmlFor="register-password" className="block text-sm font-medium text-gray-700">Mot de passe</label>
                    <input type="password" id="register-password" value={registerPassword} onChange={(e) => setRegisterPassword(e.target.value)} required autoComplete="new-password" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
                </div>
                <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-focus">
                    Créer mon compte
                </button>
            </form>
        )}
      </div>
    </div>
  );
};