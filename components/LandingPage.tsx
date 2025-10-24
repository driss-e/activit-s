import React, { useState, useEffect } from 'react';

// Props based on App.tsx
interface LandingPageProps {
  onLogin: (email: string, password?: string) => Promise<void>;
  onRegister: (name: string, email: string, password?: string) => Promise<void>;
  onVerifyEmail: (email: string) => Promise<void>;
  onResendVerificationEmail: (email: string) => Promise<void>;
  onForgotPasswordRequest: (email: string) => Promise<string>;
  onResetPassword: (token: string, newPassword: string) => Promise<void>;
}

type AuthView = 'login' | 'register' | 'forgot-password' | 'reset-password' | 'awaiting-verification';

export const LandingPage: React.FC<LandingPageProps> = ({
  onLogin,
  onRegister,
  onVerifyEmail,
  onResendVerificationEmail,
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
        const verifyEmail = params.get('verify_email');
        const resetToken = params.get('reset_token');

        if (verifyEmail) {
            onVerifyEmail(verifyEmail).catch(err => setError(err.message));
            // Maybe show a success message and prompt to login.
            setMessage('Votre email a été vérifié. Vous pouvez maintenant vous connecter.');
            setView('login');
        } else if (resetToken) {
            setToken(resetToken);
            setView('reset-password');
        }
    }, [onVerifyEmail]);


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
                setMessage(`Un email de vérification a été envoyé à ${email}. Veuillez consulter votre boîte de réception.`);
                setView('awaiting-verification');
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
            case 'awaiting-verification':
                return (
                    <div className="text-center">
                        <h2 className="text-2xl font-bold mb-4 text-gray-800">Vérifiez votre e-mail</h2>
                        <p className="text-gray-600 mb-4">{message}</p>
                        <button onClick={() => email && onResendVerificationEmail(email)} className="text-sm text-primary hover:underline">
                            Renvoyer l'e-mail de vérification
                        </button>
                        <button onClick={() => setView('login')} className="mt-6 w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-focus">
                            Retour à la connexion
                        </button>
                    </div>
                );
            case 'reset-password':
                return (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <h2 className="text-2xl font-bold text-center text-gray-800">Réinitialiser le mot de passe</h2>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Nouveau mot de passe</label>
                            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"/>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Confirmer le mot de passe</label>
                            <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"/>
                        </div>
                        <button type="submit" className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-focus">
                            Enregistrer
                        </button>
                    </form>
                );
            case 'forgot-password':
                return (
                     <form onSubmit={handleSubmit} className="space-y-6">
                        <h2 className="text-2xl font-bold text-center text-gray-800">Mot de passe oublié</h2>
                         <p className="text-sm text-center text-gray-500">Entrez votre email pour recevoir un lien de réinitialisation.</p>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Email</label>
                            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"/>
                        </div>
                        <button type="submit" className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-focus">
                            Envoyer le lien
                        </button>
                         <div className="text-sm text-center">
                            <button type="button" onClick={() => setView('login')} className="font-medium text-primary hover:text-primary-hover">
                                Retour à la connexion
                            </button>
                        </div>
                    </form>
                );
            case 'register':
                return (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <h2 className="text-2xl font-bold text-center text-gray-800">Créer un compte</h2>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Nom complet</label>
                            <input type="text" value={name} onChange={e => setName(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"/>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Email</label>
                            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"/>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Mot de passe</label>
                            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"/>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Confirmer le mot de passe</label>
                            <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"/>
                        </div>
                        <button type="submit" className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-focus">
                            S'inscrire
                        </button>
                        <div className="text-sm text-center">
                            <p className="text-gray-600">
                                Déjà un compte?{' '}
                                <button type="button" onClick={() => setView('login')} className="font-medium text-primary hover:text-primary-hover">
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
                        <h2 className="text-2xl font-bold text-center text-gray-800">Se connecter</h2>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Email</label>
                            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"/>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Mot de passe</label>
                            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"/>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="text-sm">
                                <button type="button" onClick={() => setView('forgot-password')} className="font-medium text-primary hover:text-primary-hover">
                                    Mot de passe oublié?
                                </button>
                            </div>
                        </div>
                        <button type="submit" className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-focus">
                            Connexion
                        </button>
                        <div className="text-sm text-center">
                             <p className="text-gray-600">
                                Pas encore de compte?{' '}
                                <button type="button" onClick={() => setView('register')} className="font-medium text-primary hover:text-primary-hover">
                                    Créer un compte
                                </button>
                            </p>
                        </div>
                    </form>
                );
        }
    }
    
    return (
        <div className="min-h-screen bg-light flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                 <h1 className="text-center text-4xl font-extrabold text-primary">SortieEnsemble</h1>
                 <p className="mt-2 text-center text-sm text-gray-600">
                    Trouvez et organisez des activités avec des gens qui partagent vos passions.
                 </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow-xl rounded-lg sm:px-10">
                    {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">{error}</div>}
                    {message && <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md text-sm">{message}</div>}
                    {renderForm()}
                </div>
            </div>
        </div>
    );
};
