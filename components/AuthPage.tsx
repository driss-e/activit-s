import React, { useState, useEffect } from 'react';
import type { View } from '../types';
import { Logo } from './Logo';
import { auth } from '../firebase';
import { 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    sendPasswordResetEmail,
    type User as FirebaseUser
} from 'firebase/auth';

interface AuthPageProps {
  initialView: 'login' | 'register' | 'forgot-password';
  onRegister: (firebaseUser: FirebaseUser, name: string) => Promise<void>;
  setView: (view: View) => void;
}

type AuthView = 'login' | 'register' | 'forgot-password';

export const AuthPage: React.FC<AuthPageProps> = ({
  initialView,
  onRegister,
  setView,
}) => {
    const [authView, setAuthView] = useState<AuthView>(initialView);
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setAuthView(initialView);
    }, [initialView]);

    const formInputClasses = "mt-1 block w-full px-3 py-2 border border-stone-300 rounded-lg shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-stone-700 dark:border-stone-600 dark:text-stone-200";
    const primaryButtonClasses = "w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-focus disabled:bg-primary/50 disabled:cursor-not-allowed";
    const secondaryButtonClasses = "font-medium text-primary hover:text-primary-hover";


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setMessage(null);
        setIsLoading(true);

        try {
            if (authView === 'login') {
                await signInWithEmailAndPassword(auth, email, password);
                // onAuthStateChanged in App.tsx will handle redirection
            } else if (authView === 'register') {
                if (password !== confirmPassword) {
                    throw new Error('Les mots de passe ne correspondent pas.');
                }
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                await onRegister(userCredential.user, name);
                // onAuthStateChanged in App.tsx will handle redirection
            } else if (authView === 'forgot-password') {
                await sendPasswordResetEmail(auth, email);
                setMessage(`Si un compte existe pour ${email}, un email de réinitialisation a été envoyé.`);
                setAuthView('login');
            }
        } catch (err: any) {
             switch (err.code) {
                case 'auth/user-not-found':
                case 'auth/wrong-password':
                case 'auth/invalid-credential':
                    setError('Email ou mot de passe invalide.');
                    break;
                case 'auth/email-already-in-use':
                    setError('Un compte existe déjà avec cet email.');
                    break;
                case 'auth/weak-password':
                    setError('Le mot de passe doit contenir au moins 6 caractères.');
                    break;
                case 'auth/invalid-email':
                    setError('Veuillez entrer une adresse email valide.');
                    break;
                default:
                    setError(err.message || 'Une erreur est survenue.');
                    break;
            }
        } finally {
            setIsLoading(false);
        }
    };

    const renderForm = () => {
        switch(authView) {
            case 'forgot-password':
                return (
                     <form onSubmit={handleSubmit} className="space-y-6">
                        <h2 className="text-2xl font-bold font-heading text-center text-stone-800 dark:text-stone-200">Mot de passe oublié</h2>
                         <p className="text-sm text-center text-stone-500 dark:text-stone-400">Entrez votre email pour recevoir un lien de réinitialisation.</p>
                        <div>
                            <label className="block text-sm font-medium text-stone-700 dark:text-stone-300">Email</label>
                            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className={formInputClasses}/>
                        </div>
                        <button type="submit" className={primaryButtonClasses} disabled={isLoading}>
                            {isLoading ? 'Envoi...' : 'Envoyer le lien'}
                        </button>
                         <div className="text-sm text-center">
                            <button type="button" onClick={() => setAuthView('login')} className={secondaryButtonClasses}>
                                Retour à la connexion
                            </button>
                        </div>
                    </form>
                );
            case 'register':
                return (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <h2 className="text-2xl font-bold font-heading text-center text-stone-800 dark:text-stone-200">Créer un compte</h2>
                        <div>
                            <label className="block text-sm font-medium text-stone-700 dark:text-stone-300">Nom complet</label>
                            <input type="text" value={name} onChange={e => setName(e.target.value)} required className={formInputClasses}/>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-stone-700 dark:text-stone-300">Email</label>
                            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className={formInputClasses}/>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-stone-700 dark:text-stone-300">Mot de passe</label>
                            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required className={formInputClasses}/>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-stone-700 dark:text-stone-300">Confirmer le mot de passe</label>
                            <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required className={formInputClasses}/>
                        </div>
                        <button type="submit" className={primaryButtonClasses} disabled={isLoading}>
                            {isLoading ? 'Création...' : "S'inscrire"}
                        </button>
                        <div className="text-sm text-center">
                            <p className="text-stone-600 dark:text-stone-400">
                                Déjà un compte?{' '}
                                <button type="button" onClick={() => setAuthView('login')} className={secondaryButtonClasses}>
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
                        <h2 className="text-2xl font-bold font-heading text-center text-stone-800 dark:text-stone-200">Se connecter</h2>
                        <div>
                            <label className="block text-sm font-medium text-stone-700 dark:text-stone-300">Email</label>
                            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className={formInputClasses}/>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-stone-700 dark:text-stone-300">Mot de passe</label>
                            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required className={formInputClasses}/>
                        </div>
                        <div className="flex items-center justify-end">
                            <div className="text-sm">
                                <button type="button" onClick={() => setAuthView('forgot-password')} className={secondaryButtonClasses}>
                                    Mot de passe oublié?
                                </button>
                            </div>
                        </div>
                        <button type="submit" className={primaryButtonClasses} disabled={isLoading}>
                            {isLoading ? 'Connexion...' : 'Connexion'}
                        </button>
                        <div className="text-sm text-center">
                             <p className="text-stone-600 dark:text-stone-400">
                                Pas encore de compte?{' '}
                                <button type="button" onClick={() => setAuthView('register')} className={secondaryButtonClasses}>
                                    Créer un compte
                                </button>
                            </p>
                        </div>
                    </form>
                );
        }
    }
    
    return (
        <div className="min-h-screen bg-light flex flex-col justify-center py-12 sm:px-6 lg:px-8 dark:bg-dark">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div onClick={() => setView({ type: 'LANDING' })} className="cursor-pointer">
                    <Logo className="h-12 w-auto mx-auto text-stone-800 dark:text-stone-100" />
                </div>
            </div>
            <main className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white/90 backdrop-blur-sm py-8 px-4 shadow-2xl rounded-2xl sm:px-10 dark:bg-stone-800/90">
                    {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm dark:bg-red-900/50 dark:text-red-300">{error}</div>}
                    {message && <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md text-sm dark:bg-green-900/50 dark:text-green-300">{message}</div>}
                    {renderForm()}
                </div>
            </main>
        </div>
    );
};