import React, { useState } from 'react';
import type { View } from '../types';

interface AdminLoginPageProps {
    onLogin: (email: string, password?: string) => Promise<void>;
    setView: (view: View) => void;
}

export const AdminLoginPage: React.FC<AdminLoginPageProps> = ({ onLogin, setView }) => {
    const [email, setEmail] = useState('admin@example.com');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        try {
            await onLogin(email, password);
            // onLogin in App.tsx will handle redirection to the correct dashboard
        } catch (err: any) {
            setError(err.message);
        }
    };

    return (
        <div className="min-h-screen bg-light flex flex-col justify-center py-12 sm:px-6 lg:px-8 dark:bg-dark">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <h2 className="mt-6 text-center text-3xl font-extrabold font-heading text-stone-900 dark:text-stone-100">
                    Portail Administrateur
                </h2>
                <p className="mt-2 text-center text-sm text-stone-600 dark:text-stone-400">
                    Connectez-vous à votre compte administrateur
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow-xl rounded-lg sm:px-10 dark:bg-stone-800">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        {error && <div className="p-3 bg-red-100 text-red-700 rounded-md text-sm dark:bg-red-900/50 dark:text-red-300">{error}</div>}
                        
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-stone-700 dark:text-stone-300">
                                Adresse e-mail
                            </label>
                            <div className="mt-1">
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="appearance-none block w-full px-3 py-2 border border-stone-300 rounded-md shadow-sm placeholder-stone-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm dark:bg-stone-700 dark:border-stone-600 dark:text-stone-200"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-stone-700 dark:text-stone-300">
                                Mot de passe
                            </label>
                            <div className="mt-1">
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="appearance-none block w-full px-3 py-2 border border-stone-300 rounded-md shadow-sm placeholder-stone-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm dark:bg-stone-700 dark:border-stone-600 dark:text-stone-200"
                                />
                            </div>
                        </div>
                        
                        <div>
                            <button
                                type="submit"
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-focus"
                            >
                                Se connecter
                            </button>
                        </div>
                    </form>
                    <div className="mt-6">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-stone-300 dark:border-stone-600" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white text-stone-500 dark:bg-stone-800 dark:text-stone-400">
                                    Ou
                                </span>
                            </div>
                        </div>

                        <div className="mt-6 text-center">
                            <button
                                onClick={() => setView({ type: 'DASHBOARD' })}
                                className="font-medium text-primary hover:text-primary-hover"
                            >
                                Retour au tableau de bord
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};