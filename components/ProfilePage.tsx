import React, { useState, useEffect } from 'react';
import type { User, ProfileUpdateData } from '../types';
import { ArrowLeftIcon, InstagramIcon, FacebookIcon } from './icons';

interface ProfilePageProps {
  currentUser: User;
  onUpdateProfile: (userId: string, data: ProfileUpdateData) => void;
  onBack: () => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ currentUser, onUpdateProfile, onBack }) => {
  const [formData, setFormData] = useState<ProfileUpdateData>({
    name: currentUser.name || '',
    avatar: currentUser.avatar || '',
    phone: currentUser.phone || '',
    gender: currentUser.gender || 'prefer_not_to_say',
    hobbies: currentUser.hobbies || '',
    instagram: currentUser.instagram || '',
    facebook: currentUser.facebook || '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [notification, setNotification] = useState('');

  useEffect(() => {
    setFormData({
      name: currentUser.name || '',
      avatar: currentUser.avatar || '',
      phone: currentUser.phone || '',
      gender: currentUser.gender || 'prefer_not_to_say',
      hobbies: currentUser.hobbies || '',
      instagram: currentUser.instagram || '',
      facebook: currentUser.facebook || '',
    });
  }, [currentUser]);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        if (file.size > 2 * 1024 * 1024) { // 2MB limit
            alert("Le fichier est trop volumineux. Veuillez choisir une image de moins de 2 Mo.");
            return;
        }
        const reader = new FileReader();
        reader.onloadend = () => {
          setFormData(prev => ({ ...prev, avatar: reader.result as string }));
        };
        reader.readAsDataURL(file);
      }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile(currentUser.id, formData);
    setIsEditing(false);
    setNotification('Profil mis à jour avec succès !');
    setTimeout(() => setNotification(''), 3000);
  };

  const handleCancel = () => {
    setFormData({
      name: currentUser.name || '',
      avatar: currentUser.avatar || '',
      phone: currentUser.phone || '',
      gender: currentUser.gender || 'prefer_not_to_say',
      hobbies: currentUser.hobbies || '',
      instagram: currentUser.instagram || '',
      facebook: currentUser.facebook || '',
    });
    setIsEditing(false);
  };
  
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

      {notification && (
        <div className="mb-4 p-3 bg-green-100 text-green-800 rounded-md transition-opacity duration-300 dark:bg-green-900/50 dark:text-green-300">
            {notification}
        </div>
      )}

      <div className="bg-white rounded-xl shadow-lg overflow-hidden dark:bg-stone-800">
        <div className="p-8">
            <div className="md:flex md:items-center md:gap-8">
                <div className="md:w-1/3 text-center mb-6 md:mb-0">
                    <img src={formData.avatar} alt={formData.name} className="h-40 w-40 rounded-full mx-auto shadow-md" />
                    {isEditing && (
                        <div className="mt-4">
                            <label htmlFor="avatar-upload" className="cursor-pointer text-sm text-primary hover:underline font-semibold">
                                Changer de photo
                            </label>
                            <input id="avatar-upload" type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                        </div>
                    )}
                </div>
                <div className="md:w-2/3">
                    <div className="flex justify-between items-start">
                        <h2 className="text-3xl font-bold font-heading text-stone-800 dark:text-stone-100">{currentUser.name}</h2>
                        {!isEditing && (
                             <button onClick={() => setIsEditing(true)} className="px-4 py-2 border border-stone-300 text-sm font-medium rounded-md text-stone-700 bg-white hover:bg-stone-50 dark:bg-stone-700 dark:text-stone-300 dark:border-stone-600 dark:hover:bg-stone-600">
                                Modifier le profil
                            </button>
                        )}
                    </div>
                    <p className="text-stone-500 mt-1 dark:text-stone-400">{currentUser.email}</p>
                     <div className="mt-4 flex items-center gap-4">
                        {renderSocialLink('instagram', currentUser.instagram)}
                        {renderSocialLink('facebook', currentUser.facebook)}
                     </div>
                </div>
            </div>
            
            <form onSubmit={handleSubmit} className="mt-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-stone-700 dark:text-stone-300">Nom complet</label>
                        <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} disabled={!isEditing} className="mt-1 block w-full px-3 py-2 border border-stone-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm disabled:bg-stone-100 dark:bg-stone-700 dark:border-stone-600 dark:text-stone-200 dark:disabled:bg-stone-700/50" />
                    </div>
                     <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-stone-700 dark:text-stone-300">Téléphone</label>
                        <input type="tel" name="phone" id="phone" value={formData.phone || ''} onChange={handleChange} disabled={!isEditing} className="mt-1 block w-full px-3 py-2 border border-stone-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm disabled:bg-stone-100 dark:bg-stone-700 dark:border-stone-600 dark:text-stone-200 dark:disabled:bg-stone-700/50" />
                    </div>
                     <div>
                        <label htmlFor="gender" className="block text-sm font-medium text-stone-700 dark:text-stone-300">Genre</label>
                        <select name="gender" id="gender" value={formData.gender} onChange={handleChange} disabled={!isEditing} className="mt-1 block w-full px-3 py-2 border border-stone-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm disabled:bg-stone-100 dark:bg-stone-700 dark:border-stone-600 dark:text-stone-200 dark:disabled:bg-stone-700/50">
                            <option value="prefer_not_to_say">Ne pas préciser</option>
                            <option value="male">Homme</option>
                            <option value="female">Femme</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="hobbies" className="block text-sm font-medium text-stone-700 dark:text-stone-300">Hobbies</label>
                        <input type="text" name="hobbies" id="hobbies" value={formData.hobbies || ''} onChange={handleChange} disabled={!isEditing} className="mt-1 block w-full px-3 py-2 border border-stone-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm disabled:bg-stone-100 dark:bg-stone-700 dark:border-stone-600 dark:text-stone-200 dark:disabled:bg-stone-700/50" />
                    </div>
                     <div>
                        <label htmlFor="instagram" className="block text-sm font-medium text-stone-700 dark:text-stone-300">Instagram (pseudo)</label>
                        <input type="text" name="instagram" id="instagram" value={formData.instagram || ''} onChange={handleChange} disabled={!isEditing} className="mt-1 block w-full px-3 py-2 border border-stone-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm disabled:bg-stone-100 dark:bg-stone-700 dark:border-stone-600 dark:text-stone-200 dark:disabled:bg-stone-700/50" />
                    </div>
                     <div>
                        <label htmlFor="facebook" className="block text-sm font-medium text-stone-700 dark:text-stone-300">Facebook (ID de profil)</label>
                        <input type="text" name="facebook" id="facebook" value={formData.facebook || ''} onChange={handleChange} disabled={!isEditing} className="mt-1 block w-full px-3 py-2 border border-stone-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm disabled:bg-stone-100 dark:bg-stone-700 dark:border-stone-600 dark:text-stone-200 dark:disabled:bg-stone-700/50" />
                    </div>
                </div>

                {isEditing && (
                    <div className="mt-8 flex justify-end gap-4">
                        <button type="button" onClick={handleCancel} className="px-6 py-2 border border-stone-300 text-sm font-medium rounded-md text-stone-700 bg-white hover:bg-stone-50 dark:bg-stone-600 dark:text-stone-300 dark:border-stone-500 dark:hover:bg-stone-500">
                            Annuler
                        </button>
                        <button type="submit" className="px-6 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-focus">
                            Enregistrer
                        </button>
                    </div>
                )}
            </form>
        </div>
      </div>
    </div>
  );
};