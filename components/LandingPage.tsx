import React, { useState, useEffect } from 'react';

// Props based on App.tsx
interface LandingPageProps {
  onLogin: (email: string, password?: string) => Promise<void>;
  onRegister: (name: string, email: string, password?: string) => Promise<void>;
  onForgotPasswordRequest: (email: string) => Promise<string>;
  onResetPassword: (token: string, newPassword: string) => Promise<void>;
}

type AuthView = 'login' | 'register' | 'forgot-password' | 'reset-password';

export const LandingPage: React.FC<LandingPageProps> = ({
  onLogin,
  onRegister,
  onForgotPasswordRequest,
  onResetPassword,
}) => {
    const [view, setView] = useState<AuthView>('login');
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [token, setToken] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);
    
    // Check for URL params on mount
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const resetToken = params.get('reset_token');

        if (resetToken) {
            setToken(resetToken);
            setView('reset-password');
        }
    }, []);


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setMessage(null);

        try {
            if (view === 'login') {
                await onLogin(email, password);
            } else if (view === 'register') {
                if (password !== confirmPassword) {
                    throw new Error('Les mots de passe ne correspondent pas.');
                }
                await onRegister(name, email, password);
                // User is now logged in directly by the App component
            } else if (view === 'forgot-password') {
                await onForgotPasswordRequest(email);
                setMessage(`Si un compte existe pour ${email}, un email de réinitialisation a été envoyé.`);
                setView('login');
            } else if (view === 'reset-password' && token) {
                if (password !== confirmPassword) {
                    throw new Error('Les mots de passe ne correspondent pas.');
                }
                await onResetPassword(token, password);
                setMessage('Votre mot de passe a été réinitialisé. Vous pouvez maintenant vous connecter.');
                setView('login');
            }
        } catch (err: any) {
             setError(err.message);
        }
    };

    const renderForm = () => {
        switch(view) {
            case 'reset-password':
                return (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-slate-200">Réinitialiser le mot de passe</h2>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300">Nouveau mot de passe</label>
                            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#3e5622] focus:border-[#3e5622] dark:bg-slate-700 dark:border-slate-600 dark:text-slate-200"/>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300">Confirmer le mot de passe</label>
                            <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#3e5622] focus:border-[#3e5622] dark:bg-slate-700 dark:border-slate-600 dark:text-slate-200"/>
                        </div>
                        <button type="submit" className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#3e5622] hover:bg-[#5a7d33] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#3e5622]">
                            Enregistrer
                        </button>
                    </form>
                );
            case 'forgot-password':
                return (
                     <form onSubmit={handleSubmit} className="space-y-6">
                        <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-slate-200">Mot de passe oublié</h2>
                         <p className="text-sm text-center text-gray-500 dark:text-slate-400">Entrez votre email pour recevoir un lien de réinitialisation.</p>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300">Email</label>
                            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#3e5622] focus:border-[#3e5622] dark:bg-slate-700 dark:border-slate-600 dark:text-slate-200"/>
                        </div>
                        <button type="submit" className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#3e5622] hover:bg-[#5a7d33] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#3e5622]">
                            Envoyer le lien
                        </button>
                         <div className="text-sm text-center">
                            <button type="button" onClick={() => setView('login')} className="font-medium text-[#3e5622] hover:text-[#5a7d33]">
                                Retour à la connexion
                            </button>
                        </div>
                    </form>
                );
            case 'register':
                return (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-slate-200">Créer un compte</h2>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300">Nom complet</label>
                            <input type="text" value={name} onChange={e => setName(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#3e5622] focus:border-[#3e5622] dark:bg-slate-700 dark:border-slate-600 dark:text-slate-200"/>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300">Email</label>
                            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#3e5622] focus:border-[#3e5622] dark:bg-slate-700 dark:border-slate-600 dark:text-slate-200"/>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300">Mot de passe</label>
                            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#3e5622] focus:border-[#3e5622] dark:bg-slate-700 dark:border-slate-600 dark:text-slate-200"/>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300">Confirmer le mot de passe</label>
                            <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#3e5622] focus:border-[#3e5622] dark:bg-slate-700 dark:border-slate-600 dark:text-slate-200"/>
                        </div>
                        <button type="submit" className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#3e5622] hover:bg-[#5a7d33] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#3e5622]">
                            S'inscrire
                        </button>
                        <div className="text-sm text-center">
                            <p className="text-gray-600 dark:text-slate-400">
                                Déjà un compte?{' '}
                                <button type="button" onClick={() => setView('login')} className="font-medium text-[#3e5622] hover:text-[#5a7d33]">
                                    Se connecter
                                </button>
                            </p>
                        </div>
                    </form>
                );
            case 'login':
            default:
                return (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-slate-200">Se connecter</h2>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300">Email</label>
                            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#3e5622] focus:border-[#3e5622] dark:bg-slate-700 dark:border-slate-600 dark:text-slate-200"/>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300">Mot de passe</label>
                            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#3e5622] focus:border-[#3e5622] dark:bg-slate-700 dark:border-slate-600 dark:text-slate-200"/>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="text-sm">
                                <button type="button" onClick={() => setView('forgot-password')} className="font-medium text-[#3e5622] hover:text-[#5a7d33]">
                                    Mot de passe oublié?
                                </button>
                            </div>
                        </div>
                        <button type="submit" className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#3e5622] hover:bg-[#5a7d33] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#3e5622]">
                            Connexion
                        </button>
                        <div className="text-sm text-center">
                             <p className="text-gray-600 dark:text-slate-400">
                                Pas encore de compte?{' '}
                                <button type="button" onClick={() => setView('register')} className="font-medium text-[#3e5622] hover:text-[#5a7d33]">
                                    Créer un compte
                                </button>
                            </p>
                        </div>
                    </form>
                );
        }
    }
    
    return (
        <div className="min-h-screen bg-light flex flex-col justify-center py-12 sm:px-6 lg:px-8 dark:bg-slate-900">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                 <h1 className="text-center text-4xl font-extrabold text-[#3e5622]">SortieEnsemble</h1>
                 <p className="mt-2 text-center text-sm text-gray-600 dark:text-slate-400">
                    Trouvez et organisez des activités avec des gens qui partagent vos passions.
                 </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow-xl rounded-lg sm:px-10 dark:bg-slate-800">
                    {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm dark:bg-red-900/50 dark:text-red-300">{error}</div>}
                    {message && <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md text-sm dark:bg-green-900/50 dark:text-green-300">{message}</div>}
                    {renderForm()}
                </div>
            </div>
        </div>
    );
};