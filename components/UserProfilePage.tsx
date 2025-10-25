import React from 'react';
import type { User } from '../types';
import { ArrowLeftIcon, InstagramIcon, FacebookIcon } from './icons';

interface UserProfilePageProps {
  user: User;
  onBack: () => void;
}

export const UserProfilePage: React.FC<UserProfilePageProps> = ({ user, onBack }) => {

  const renderSocialLink = (platform: 'instagram' | 'facebook', value?: string) => {
    if (!value) return null;
    const url = platform === 'instagram' ? `https://instagram.com/${value}` : `https://facebook.com/${value}`;
    const Icon = platform === 'instagram' ? InstagramIcon : FacebookIcon;
    return (
        <a href={url} target="_blank" rel="noopener noreferrer" className="text-stone-500 hover:text-primary dark:text-stone-400 dark:hover:text-primary-hover">
            <Icon className="h-6 w-6" />
        </a>
    );
  };

  return (
    <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
      <button onClick={onBack} className="flex items-center gap-2 mb-6 text-primary hover:underline font-semibold">
        <ArrowLeftIcon />
        Retour
      </button>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden dark:bg-stone-800">
        <div className="p-8">
            <div className="md:flex md:items-center md:gap-8">
                <div className="md:w-1/3 text-center mb-6 md:mb-0">
                    <img src={user.avatar} alt={user.name} className="h-40 w-40 rounded-full mx-auto shadow-md" />
                </div>
                <div className="md:w-2/3">
                    <h2 className="text-3xl font-bold font-heading text-stone-800 dark:text-stone-100">{user.name}</h2>
                    <p className="text-stone-500 mt-1 dark:text-stone-400">{user.role === 'admin' ? 'Administrateur' : 'Membre'}</p>
                     <div className="mt-4 flex items-center gap-4">
                        {renderSocialLink('instagram', user.instagram)}
                        {renderSocialLink('facebook', user.facebook)}
                     </div>
                </div>
            </div>
            
            <div className="mt-8 border-t pt-6 dark:border-stone-700">
                 <h3 className="text-lg font-semibold text-stone-700 mb-2 dark:text-stone-300">Hobbies</h3>
                 <p className="text-stone-600 dark:text-stone-400">{user.hobbies || 'Non spécifié'}</p>
            </div>
        </div>
      </div>
    </div>
  );
};