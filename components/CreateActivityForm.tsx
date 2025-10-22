
import React, { useState } from 'react';
import type { Activity, User, View } from '../types';
import { ArrowLeftIcon } from './icons';


interface CreateActivityFormProps {
  currentUser: User | null;
  onCreateActivity: (activity: Omit<Activity, 'id' | 'participants' | 'comments'>) => void;
  setView: (view: View) => void;
}

export const CreateActivityForm: React.FC<CreateActivityFormProps> = ({ currentUser, onCreateActivity, setView }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [maxParticipants, setMaxParticipants] = useState(10);
  const [image, setImage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      alert("Vous devez être connecté pour créer une activité.");
      return;
    }

    const activityDate = new Date(`${date}T${time}`);

    onCreateActivity({
      title,
      description,
      location,
      date: activityDate,
      image: image || `https://picsum.photos/seed/${Date.now()}/800/600`,
      maxParticipants,
      organizer: { id: currentUser.id, name: currentUser.name, avatar: currentUser.avatar },
    });
  };

  if (!currentUser) {
    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
            <div className="bg-white p-8 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-4">Accès refusé</h2>
                <p>Veuillez vous connecter pour créer une nouvelle activité.</p>
                <button onClick={() => setView({type: 'DASHBOARD'})} className="mt-4 px-4 py-2 bg-primary text-white font-semibold rounded-md hover:bg-primary-hover">
                    Retour
                </button>
            </div>
        </div>
    );
  }

  return (
    <div className="container mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-8">
       <button onClick={() => setView({type: 'DASHBOARD'})} className="flex items-center gap-2 mb-6 text-primary hover:underline">
        <ArrowLeftIcon />
        Annuler
      </button>
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-lg space-y-6">
        <h2 className="text-3xl font-bold text-center text-gray-800">Créer une nouvelle activité</h2>
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">Titre de l'activité</label>
          <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
          <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} required rows={4} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"></textarea>
        </div>
        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700">Lieu</label>
          <input type="text" id="location" value={location} onChange={(e) => setLocation(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700">Date</label>
            <input type="date" id="date" value={date} onChange={(e) => setDate(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
          </div>
          <div>
            <label htmlFor="time" className="block text-sm font-medium text-gray-700">Heure</label>
            <input type="time" id="time" value={time} onChange={(e) => setTime(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
          </div>
        </div>
        <div>
          <label htmlFor="maxParticipants" className="block text-sm font-medium text-gray-700">Nombre de places</label>
          <input type="number" id="maxParticipants" value={maxParticipants} onChange={(e) => setMaxParticipants(parseInt(e.target.value, 10))} min="1" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
        </div>
        <div>
          <label htmlFor="image" className="block text-sm font-medium text-gray-700">URL de l'image (optionnel)</label>
          <input type="text" id="image" value={image} onChange={(e) => setImage(e.target.value)} placeholder="https://picsum.photos/..." className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
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
