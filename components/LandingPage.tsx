import React from 'react';

interface LandingPageProps {
  onLoginClick: () => void;
  onRegisterClick: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onLoginClick, onRegisterClick }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-4">
        <div 
            className="absolute inset-0 bg-cover bg-center opacity-10"
            style={{backgroundImage: "url('https://www.toptal.com/designers/subtlepatterns/uploads/double-bubble-outline.png')"}}
        ></div>
        <div className="text-center z-10 max-w-2xl">
            <h1 className="text-5xl md:text-6xl font-extrabold text-primary mb-4">
                Bienvenue sur SortieEnsemble
            </h1>
            <p className="text-lg md:text-xl text-slate-600 mb-8">
                Organisez et participez à des activités de groupe inoubliables. Randonnées, pique-niques, visites culturelles et bien plus encore vous attendent.
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                <button
                    onClick={onLoginClick}
                    className="w-full sm:w-auto px-8 py-3 bg-primary text-white font-bold rounded-lg shadow-lg hover:bg-primary-hover transform hover:scale-105 transition-all duration-300 ease-in-out"
                >
                    Se connecter
                </button>
                <button
                    onClick={onRegisterClick}
                    className="w-full sm:w-auto px-8 py-3 bg-secondary text-white font-bold rounded-lg shadow-lg hover:bg-slate-700 transform hover:scale-105 transition-all duration-300 ease-in-out"
                >
                    Créer un compte
                </button>
            </div>
        </div>
        <footer className="absolute bottom-0 py-4 text-center text-sm text-gray-500">
            <p>&copy; {new Date().getFullYear()} SortieEnsemble. Tous droits réservés.</p>
        </footer>
    </div>
  );
};
