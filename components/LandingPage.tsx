import React from 'react';
import type { View } from '../types';

interface LandingPageProps {
  setView: (view: View) => void;
}

// A style tag is used here for the complex keyframe animations 
// which are not easily representable with Tailwind's utility classes.
const AnimationStyles = () => (
    <style>{`
        @keyframes move-blob-1 {
            0% { transform: translate(-10%, -10%) scale(1); }
            25% { transform: translate(20%, -30%) scale(1.2); }
            50% { transform: translate(-20%, 20%) scale(0.8); }
            75% { transform: translate(10%, 30%) scale(1.1); }
            100% { transform: translate(-10%, -10%) scale(1); }
        }
        @keyframes move-blob-2 {
            0% { transform: translate(100%, 100%) scale(1); }
            25% { transform: translate(70%, 50%) scale(1.1); }
            50% { transform: translate(120%, 80%) scale(0.9); }
            75% { transform: translate(80%, 120%) scale(1.2); }
            100% { transform: translate(100%, 100%) scale(1); }
        }
        @keyframes move-blob-3 {
            0% { transform: translate(50%, -50%) scale(1); }
            50% { transform: translate(-30%, 20%) scale(1.3); }
            100% { transform: translate(50%, -50%) scale(1); }
        }
    `}</style>
);


export const LandingPage: React.FC<LandingPageProps> = ({ setView }) => {
    return (
        <div className="relative h-screen w-full overflow-hidden bg-slate-900">
            <AnimationStyles />
            <div className="absolute inset-0 z-0 opacity-50">
                {/* Blob 1 */}
                <div 
                    className="absolute top-0 left-0 w-96 h-96 sm:w-[32rem] sm:h-[32rem] lg:w-[48rem] lg:h-[48rem] bg-emerald-500 rounded-full mix-blend-lighten filter blur-3xl"
                    style={{ animation: 'move-blob-1 30s infinite alternate' }}
                ></div>
                 {/* Blob 2 */}
                <div 
                    className="absolute bottom-0 right-0 w-96 h-96 sm:w-[32rem] sm:h-[32rem] lg:w-[48rem] lg:h-[48rem] bg-teal-400 rounded-full mix-blend-lighten filter blur-3xl"
                     style={{ animation: 'move-blob-2 35s infinite alternate-reverse' }}
                ></div>
                {/* Blob 3 */}
                <div 
                    className="absolute top-1/2 left-1/2 w-80 h-80 sm:w-[28rem] sm:h-[28rem] lg:w-[40rem] lg:h-[40rem] -translate-x-1/2 -translate-y-1/2 bg-sky-400 rounded-full mix-blend-lighten filter blur-3xl"
                     style={{ animation: 'move-blob-3 25s infinite alternate' }}
                ></div>
            </div>

            <div className="relative z-10 h-full flex flex-col items-center justify-center text-center text-white px-4 sm:px-6 lg:px-8">
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold font-heading drop-shadow-lg">SortieEnsemble</h1>
                <p className="mt-4 text-lg md:text-xl max-w-3xl mx-auto drop-shadow-md text-slate-200">
                    Rejoignez la communauté et partagez des moments uniques. Découvrez, organisez et participez à des activités qui vous passionnent.
                </p>
                <div className="mt-8 flex flex-col sm:flex-row sm:justify-center gap-4">
                    <button 
                        onClick={() => setView({ type: 'AUTH', initialView: 'register' })}
                        className="px-8 py-3 bg-primary text-white font-bold rounded-full text-lg hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-primary-focus transition-all duration-300 transform hover:scale-105 shadow-xl"
                    >
                        Commencer l'aventure
                    </button>
                     <button 
                        onClick={() => setView({ type: 'AUTH', initialView: 'login' })}
                        className="px-8 py-3 bg-white/10 backdrop-blur-md border border-white/20 text-white font-bold rounded-full text-lg hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-white transition-all duration-300 transform hover:scale-105 shadow-xl"
                    >
                        Déjà un compte? Se connecter
                    </button>
                </div>
            </div>
        </div>
    );
};