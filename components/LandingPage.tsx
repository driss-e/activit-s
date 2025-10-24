import React, { useState } from 'react';

interface LandingPageProps {
  onLogin: (email: string, password?: string) => Promise<void>;
  onRegister: (name: string, email: string, password?: string) => Promise<void>;
  onForgotPasswordRequest: (email: string) => Promise<string>;
  onResetPassword: (token: string, newPassword: string) => Promise<void>;
  onResendVerificationEmail: (email: string) => Promise<void>;
  onVerifyEmail: (email: string) => Promise<void>; // Demo only
}

export const LandingPage: React.FC<LandingPageProps> = ({ onLogin, onRegister, onForgotPasswordRequest, onResetPassword, onResendVerificationEmail, onVerifyEmail }) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [view, setView] = useState<'auth' | 'forgot' | 'reset' | 'pendingVerification'>('auth');

  // Form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // App state
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [resetToken, setResetToken] = useState<string | null>(null);
  const [pendingVerificationEmail, setPendingVerificationEmail] = useState<string | null>(null);


  const clearFormState = () => {
    setName('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setError('');
    setInfo('');
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setInfo('');
    setIsLoading(true);
    try {
        await onLogin(email, password);
    } catch (err: any) {
        if (err.message && err.message.includes('vérifier votre adresse e-mail')) {
          setPendingVerificationEmail(email);
        }
        setError(err.message || 'Une erreur est survenue.');
    } finally {
        setIsLoading(false);
    }
  };
  
  const handleRegisterSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (password !== confirmPassword) {
          setError("Les mots de passe ne correspondent pas.");
          return;
      }
      setError('');
      setInfo('');
      setIsLoading(true);
      try {
          await onRegister(name, email, password);
          setPendingVerificationEmail(email);
          setView('pendingVerification');
          clearFormState();
      } catch (err: any) {
          setError(err.message || 'Une erreur est survenue.');
      } finally {
          setIsLoading(false);
      }
  };

  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setInfo('');
    setIsLoading(true);
    try {
      const token = await onForgotPasswordRequest(email);
      // For this demo, we immediately proceed if a token was generated
      if (token) {
        setResetToken(token);
        setView('reset');
        setInfo("Un lien de réinitialisation vous a été envoyé. Pour cette démo, veuillez définir votre nouveau mot de passe ci-dessous.");
      } else {
        setInfo('Si un compte avec cet email existe, nous avons envoyé un lien pour réinitialiser votre mot de passe.');
      }
    } catch (err: any) {
        setError(err.message || 'Une erreur est survenue.');
    } finally {
        setIsLoading(false);
    }
  };

  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
        setError("Les mots de passe ne correspondent pas.");
        return;
    }
    if (!resetToken) {
        setError("Aucun jeton de réinitialisation valide. Veuillez recommencer.");
        return;
    }
    setError('');
    setInfo('');
    setIsLoading(true);
    try {
        await onResetPassword(resetToken, password);
        setView('auth');
        setMode('login');
        clearFormState();
        setInfo("Votre mot de passe a été réinitialisé avec succès. Vous pouvez maintenant vous connecter.");
    } catch (err: any) {
        setError(err.message || 'Une erreur est survenue.');
    } finally {
        setIsLoading(false);
    }
  };
  
  const handleResendClick = async () => {
    if (!pendingVerificationEmail) return;
    setError('');
    setInfo('');
    setIsLoading(true);
    try {
        await onResendVerificationEmail(pendingVerificationEmail);
        setInfo("Un nouvel e-mail de vérification a été envoyé.");
    } catch(err) {
        setError("Une erreur est survenue lors du renvoi de l'e-mail.");
    } finally {
        setIsLoading(false);
    }
  }
  
  const FormInput = ({ id, label, type, value, onChange, autoComplete }) => (
      <div>
        <label htmlFor={id} className="block text-sm font-medium text-gray-700">{label}</label>
        <div className="mt-1">
          <input
            id={id}
            name={id}
            type={type}
            autoComplete={autoComplete}
            required
            value={value}
            onChange={onChange}
            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
          />
        </div>
      </div>
  );

  const renderAuthForms = () => (
    <>
      <div>
        <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            {mode === 'login' ? 'Connectez-vous à votre compte' : 'Créez votre compte'}
        </h2>
      </div>
      <div className="mt-8">
        <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                <button
                    onClick={() => { setMode('login'); clearFormState(); }}
                    className={`${mode === 'login' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                >
                    Connexion
                </button>
                <button
                    onClick={() => { setMode('register'); clearFormState(); }}
                    className={`${mode === 'register' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                >
                    Inscription
                </button>
            </nav>
        </div>
      
        <div className="mt-6">
          <form onSubmit={mode === 'login' ? handleLoginSubmit : handleRegisterSubmit} className="space-y-6">
            {mode === 'register' && (
                <FormInput id="name" label="Nom complet" type="text" value={name} onChange={e => setName(e.target.value)} autoComplete="name" />
            )}
            <FormInput id="email" label="Adresse e-mail" type="email" value={email} onChange={e => setEmail(e.target.value)} autoComplete="email" />
            <FormInput id="password" label="Mot de passe" type="password" value={password} onChange={e => setPassword(e.target.value)} autoComplete={mode === 'login' ? "current-password" : "new-password"} />
            {mode === 'register' && (
                 <FormInput id="confirm-password" label="Confirmer le mot de passe" type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} autoComplete="new-password" />
            )}
            
            {mode === 'login' && (
                <div className="flex items-center justify-end">
                    <div className="text-sm">
                        <a href="#" onClick={(e) => { e.preventDefault(); setView('forgot'); clearFormState(); }} className="font-medium text-primary hover:text-primary-hover">
                            Mot de passe oublié ?
                        </a>
                    </div>
                </div>
            )}

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-focus disabled:bg-opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Chargement...' : (mode === 'login' ? 'Se connecter' : 'S\'inscrire')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );

  const renderForgotForm = () => (
    <>
       <div>
        <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Réinitialiser le mot de passe</h2>
        <p className="mt-2 text-sm text-gray-600">
            Entrez votre adresse e-mail et nous vous enverrons des instructions (simulées) pour réinitialiser votre mot de passe.
        </p>
      </div>
       <div className="mt-8">
            <form onSubmit={handleForgotSubmit} className="space-y-6">
                <FormInput id="email" label="Adresse e-mail" type="email" value={email} onChange={e => setEmail(e.target.value)} autoComplete="email" />
                <div>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-hover disabled:bg-opacity-50"
                  >
                    {isLoading ? 'Envoi...' : 'Envoyer les instructions'}
                  </button>
                </div>
                 <div className="text-sm text-center">
                    <a href="#" onClick={(e) => { e.preventDefault(); setView('auth'); clearFormState(); }} className="font-medium text-primary hover:text-primary-hover">
                        Retour à la connexion
                    </a>
                </div>
            </form>
       </div>
    </>
  );

  const renderResetForm = () => (
     <>
       <div>
        <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Définir un nouveau mot de passe</h2>
        <p className="mt-2 text-sm text-gray-600">Veuillez créer un nouveau mot de passe sécurisé.</p>
      </div>
       <div className="mt-8">
            <form onSubmit={handleResetSubmit} className="space-y-6">
                <FormInput id="password" label="Nouveau mot de passe" type="password" value={password} onChange={e => setPassword(e.target.value)} autoComplete="new-password" />
                <FormInput id="confirm-password" label="Confirmer le nouveau mot de passe" type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} autoComplete="new-password" />
                <div>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-hover disabled:bg-opacity-50"
                  >
                    {isLoading ? 'Mise à jour...' : 'Mettre à jour le mot de passe'}
                  </button>
                </div>
            </form>
       </div>
    </>
  );

  const renderPendingVerification = () => (
     <>
       <div>
        <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Vérifiez votre boîte de réception</h2>
        <p className="mt-2 text-sm text-gray-600">
            Un e-mail de vérification a été envoyé à <strong className="text-gray-800">{pendingVerificationEmail}</strong>. Veuillez cliquer sur le lien dans l'e-mail pour activer votre compte.
        </p>
      </div>
       <div className="mt-8 space-y-4">
          <div className="p-4 bg-amber-50 border-l-4 border-amber-400 text-amber-700">
            <h3 className="font-bold">Pour la démo</h3>
            <p>Dans une vraie application, vous cliqueriez sur un lien dans votre e-mail. Ici, cliquez simplement sur le bouton ci-dessous pour simuler la vérification.</p>
          </div>

           <button
              onClick={() => onVerifyEmail(pendingVerificationEmail!)}
              disabled={isLoading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 disabled:bg-opacity-50"
            >
              {isLoading ? 'Vérification...' : 'Simuler la vérification par e-mail'}
            </button>

            <div className="text-sm text-center">
                <span>Vous n'avez pas reçu l'e-mail ? </span>
                <button 
                  onClick={handleResendClick} 
                  disabled={isLoading}
                  className="font-medium text-primary hover:text-primary-hover disabled:text-gray-400"
                >
                    Renvoyer l'e-mail
                </button>
            </div>
            <div className="text-sm text-center">
                <a href="#" onClick={(e) => { e.preventDefault(); setView('auth'); clearFormState(); }} className="font-medium text-primary hover:text-primary-hover">
                    Retour à la connexion
                </a>
            </div>
       </div>
    </>
  );


  return (
    <div className="min-h-screen bg-slate-50 flex">
      <div className="relative w-0 flex-1 hidden lg:block">
        <img
          className="absolute inset-0 h-full w-full object-cover"
          src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=1471"
          alt="Group of friends having fun"
        />
        <div className="absolute inset-0 bg-primary opacity-60"></div>
         <div className="absolute inset-0 flex flex-col justify-center items-center text-white p-12 text-center">
            <h1 className="text-5xl font-extrabold tracking-tight">SortieEnsemble</h1>
            <p className="mt-4 text-xl max-w-md">Créez, partagez et participez à des activités inoubliables.</p>
        </div>
      </div>
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
            
            {error && (
                <div className="p-3 mb-4 bg-red-50 border-l-4 border-red-400">
                    <p className="text-sm text-red-700">{error}</p>
                     {pendingVerificationEmail && (
                        <button onClick={handleResendClick} className="mt-2 text-sm font-bold text-red-800 hover:underline">
                            Renvoyer l'e-mail de vérification
                        </button>
                    )}
                </div>
            )}
            {info && (
                 <div className="p-3 mb-4 bg-blue-50 border-l-4 border-blue-400">
                    <p className="text-sm text-blue-700">{info}</p>
                </div>
            )}

            {view === 'auth' && renderAuthForms()}
            {view === 'forgot' && renderForgotForm()}
            {view === 'reset' && renderResetForm()}
            {view === 'pendingVerification' && renderPendingVerification()}
        </div>
      </div>
    </div>
  );
};