import React, { useState } from 'react';
import type { Activity, User } from '../types';
import { ArrowLeftIcon } from './icons';

interface CreateActivityFormProps {
  currentUser: User | null;
  onCreateActivity: (activity: Omit<Activity, 'id' | 'participants' | 'comments'>) => void;
  onCancel: () => void;
}

export const CreateActivityForm: React.FC<CreateActivityFormProps> = ({ currentUser, onCreateActivity, onCancel }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [maxParticipants, setMaxParticipants] = useState(10);
  const [image, setImage] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        if (file.size > 2 * 1024 * 1024) { // 2MB limit
            alert("Le fichier est trop volumineux. Veuillez choisir une image de moins de 2 Mo.");
            return;
        }
        const reader = new FileReader();
        reader.onloadend = () => {
          setImage(reader.result as string);
        };
        reader.onerror = () => {
            alert("Erreur lors de la lecture du fichier.");
        }
        reader.readAsDataURL(file);
      }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      alert("Vous devez être connecté pour créer une activité.");
      return;
    }
    if (!image) {
        alert("Veuillez télécharger une image pour l'activité.");
        return;
    }

    const activityDate = new Date(`${date}T${time}`);

    onCreateActivity({
      title,
      description,
      location,
      date: activityDate,
      image,
      maxParticipants,
      organizer: { id: currentUser.id, name: currentUser.name, avatar: currentUser.avatar },
    });
  };

  if (!currentUser) {
    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
            <div className="bg-white p-8 rounded-lg shadow-md dark:bg-slate-800">
                <h2 className="text-2xl font-bold mb-4 dark:text-slate-200">Accès refusé</h2>
                <p className="dark:text-slate-300">Veuillez vous connecter pour créer une nouvelle activité.</p>
                <button onClick={onCancel} className="mt-4 px-4 py-2 bg-primary text-white font-semibold rounded-md hover:bg-primary-hover">
                    Retour
                </button>
            </div>
        </div>
    );
  }

  return (
    <div className="container mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-8">
       <button onClick={onCancel} className="flex items-center gap-2 mb-6 text-primary hover:underline">
        <ArrowLeftIcon />
        Annuler
      </button>
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-lg space-y-6 dark:bg-slate-800">
        <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-slate-100">Créer une nouvelle activité</h2>
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-slate-300">Titre de l'activité</label>
          <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm dark:bg-slate-700 dark:border-slate-600 dark:text-slate-200" />
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-slate-300">Description</label>
          <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} required rows={4} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm dark:bg-slate-700 dark:border-slate-600 dark:text-slate-200"></textarea>
        </div>
        
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-slate-300">Image d'illustration</label>
            <div className="border border-gray-300 rounded-md p-4 bg-slate-50 dark:border-slate-600 dark:bg-slate-700/50">
                <div className="w-full h-48 mb-4 bg-slate-200 rounded-md flex items-center justify-center overflow-hidden dark:bg-slate-700">
                    {image ? (
                        <img src={image} alt="Aperçu de l'activité" className="w-full h-full object-cover" />
                    ) : (
                        <div className="text-gray-400 text-center dark:text-slate-500">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                            <p className="mt-2 text-sm">Aperçu de l'image</p>
                        </div>
                    )}
                </div>
                 <div>
                    <label htmlFor="image-upload" className="w-full cursor-pointer inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-secondary hover:bg-slate-700 dark:hover:bg-slate-600">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                        Choisir un fichier...
                    </label>
                    <input id="image-upload" type="file" accept="image/png, image/jpeg, image/webp" className="hidden" onChange={handleFileChange} />
                    <p className="text-xs text-gray-500 mt-2 dark:text-slate-400">PNG, JPG, WEBP. Max 2Mo.</p>
                 </div>
            </div>
        </div>

        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-slate-300">Lieu</label>
          <input type="text" id="location" value={location} onChange={(e) => setLocation(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm dark:bg-slate-700 dark:border-slate-600 dark:text-slate-200" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 dark:text-slate-300">Date</label>
            <input type="date" id="date" value={date} onChange={(e) => setDate(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm dark:bg-slate-700 dark:border-slate-600 dark:text-slate-200" />
          </div>
          <div>
            <label htmlFor="time" className="block text-sm font-medium text-gray-700 dark:text-slate-300">Heure</label>
            <input type="time" id="time" value={time} onChange={(e) => setTime(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm dark:bg-slate-700 dark:border-slate-600 dark:text-slate-200" />
          </div>
        </div>
        <div>
          <label htmlFor="maxParticipants" className="block text-sm font-medium text-gray-700 dark:text-slate-300">Nombre de places</label>
          <input type="number" id="maxParticipants" value={maxParticipants} onChange={(e) => setMaxParticipants(parseInt(e.target.value, 10))} min="1" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm dark:bg-slate-700 dark:border-slate-600 dark:text-slate-200" />
        </div>
        
        <div>
          <button type="submit" className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-primary hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-focus">
            Publier l'activité
          </button>
        </div>
      </form>
    </div>
  );
};