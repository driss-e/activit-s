import React, { useState, useEffect } from 'react';
import type { User } from '../types';
import { ArrowLeftIcon } from './icons';

interface ProfilePageProps {
  currentUser: User;
  onUpdateProfile: (userId: string, newName: string, newAvatar: string) => void;
  onBack: () => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ currentUser, onUpdateProfile, onBack }) => {
  const [name, setName] = useState(currentUser.name);
  const [avatar, setAvatar] = useState(currentUser.avatar);
  const [newAvatarFile, setNewAvatarFile] = useState<string | null>(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Reset form if currentUser changes
    setName(currentUser.name);
    setAvatar(currentUser.avatar);
    setNewAvatarFile(null);
  }, [currentUser]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // 2MB limit
        setMessage("L'image est trop volumineuse (max 2Mo).");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewAvatarFile(reader.result as string);
        setMessage('');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile(currentUser.id, name, newAvatarFile || avatar);
    setMessage('Profil mis à jour avec succès !');
  };

  return (
    <div className="container mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-8">
      <button onClick={onBack} className="flex items-center gap-2 mb-6 text-primary hover:underline">
        <ArrowLeftIcon />
        Retour
      </button>
      <div className="bg-white p-8 rounded-xl shadow-lg">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Mon Profil</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col items-center space-y-4">
            <img 
              src={newAvatarFile || avatar} 
              alt="Avatar"
              className="h-32 w-32 rounded-full object-cover ring-4 ring-primary/20"
            />
            <div>
              <label htmlFor="avatar-upload" className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                Changer d'avatar
              </label>
              <input id="avatar-upload" type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
            </div>
          </div>

          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nom</label>
            <input 
              type="text" 
              id="name" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              required 
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" 
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email (non modifiable)</label>
            <input 
              type="email" 
              id="email" 
              value={currentUser.email} 
              disabled 
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100 text-gray-500 sm:text-sm" 
            />
          </div>

          {message && (
            <div className={`p-3 rounded-md ${message.includes('succès') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {message}
            </div>
          )}

          <div>
            <button 
              type="submit" 
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-primary hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-focus"
            >
              Enregistrer les modifications
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
