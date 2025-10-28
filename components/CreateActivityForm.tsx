import React, { useState } from 'react';
import type { Activity, User, Category } from '../types';
import { ArrowLeftIcon, XIcon } from './icons';

interface CreateActivityFormProps {
  currentUser: User | null;
  onCreateActivity: (activity: Omit<Activity, 'id' | 'participants' | 'comments' | 'createdAt' | 'status'>) => void;
  onCancel: () => void;
}

export const CreateActivityForm: React.FC<CreateActivityFormProps> = ({ currentUser, onCreateActivity, onCancel }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [maxParticipants, setMaxParticipants] = useState(10);
  const [images, setImages] = useState<string[]>([]);
  const [category, setCategory] = useState<Category>('Outdoors');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files) {
        const filesArray = Array.from(files);
        const imagePromises: Promise<string>[] = [];

        if (filesArray.length + images.length > 5) {
            alert("Vous ne pouvez télécharger que 5 images au maximum.");
            return;
        }

        filesArray.forEach(file => {
            if (file.size > 2 * 1024 * 1024) { // 2MB limit
                alert(`Le fichier ${file.name} est trop volumineux (max 2 Mo).`);
                return;
            }
            const reader = new FileReader();
            imagePromises.push(new Promise((resolve, reject) => {
                reader.onloadend = () => resolve(reader.result as string);
                reader.onerror = reject;
                reader.readAsDataURL(file);
            }));
        });

        Promise.all(imagePromises)
            .then(newImages => {
                setImages(prev => [...prev, ...newImages]);
            })
            .catch(() => alert("Erreur lors de la lecture des fichiers."));
      }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      alert("Vous devez être connecté pour créer une activité.");
      return;
    }
    if (images.length === 0) {
        alert("Veuillez télécharger au moins une image pour l'activité.");
        return;
    }

    const activityDate = new Date(`${date}T${time}`);

    onCreateActivity({
      title,
      description,
      location,
      date: activityDate,
      images,
      maxParticipants,
      category,
      organizer: { id: currentUser.id, name: currentUser.name, avatar: currentUser.avatar },
    });
  };

  if (!currentUser) {
    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
            <div className="bg-white p-8 rounded-lg shadow-md dark:bg-stone-800">
                <h2 className="text-2xl font-bold mb-4 dark:text-stone-200">Accès refusé</h2>
                <p className="dark:text-stone-300">Veuillez vous connecter pour créer une nouvelle activité.</p>
                <button onClick={onCancel} className="mt-4 px-4 py-2 bg-primary text-white font-semibold rounded-md hover:bg-primary-hover">
                    Retour
                </button>
            </div>
        </div>
    );
  }
  
  const formInputClasses = "mt-1 block w-full px-3 py-2 border border-stone-300 rounded-lg shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm dark:bg-stone-700 dark:border-stone-600 dark:text-stone-200";
  const formLabelClasses = "block text-sm font-medium text-stone-700 dark:text-stone-300";

  return (
    <div className="container mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-8">
       <button onClick={onCancel} className="flex items-center gap-2 mb-6 text-primary hover:underline font-semibold">
        <ArrowLeftIcon className="w-5 h-5"/>
        Annuler
      </button>
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-lg space-y-6 dark:bg-stone-800">
        <h2 className="text-3xl font-bold font-heading text-center text-stone-800 dark:text-stone-100">Créer une nouvelle activité</h2>
        <div>
          <label htmlFor="title" className={formLabelClasses}>Titre de l'activité</label>
          <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} required className={formInputClasses} />
        </div>
        <div>
          <label htmlFor="description" className={formLabelClasses}>Description</label>
          <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} required rows={4} className={formInputClasses}></textarea>
        </div>
        
        <div>
            <label className={formLabelClasses + " mb-1"}>Images de l'activité (la première sera la principale)</label>
            <div className="border border-dashed border-stone-300 rounded-lg p-4 bg-stone-50 dark:border-stone-600 dark:bg-stone-700/50">
                <div className="w-full h-48 mb-4 bg-stone-200 rounded-md flex items-center justify-center overflow-hidden dark:bg-stone-700">
                    {images.length > 0 ? (
                        <img src={images[0]} alt="Aperçu principal de l'activité" className="w-full h-full object-cover" />
                    ) : (
                        <div className="text-stone-400 text-center dark:text-stone-500">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                            <p className="mt-2 text-sm">Aperçu de l'image</p>
                        </div>
                    )}
                </div>
                 {images.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                        {images.map((imgSrc, index) => (
                            <div key={index} className="relative w-20 h-20 rounded-md overflow-hidden border-2 border-stone-300">
                                <img src={imgSrc} alt={`Aperçu ${index + 1}`} className="w-full h-full object-cover" />
                                <button 
                                    type="button" 
                                    onClick={() => setImages(prev => prev.filter((_, i) => i !== index))}
                                    className="absolute top-0 right-0 bg-red-600 text-white rounded-full p-0.5 m-1 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-white"
                                    aria-label={`Supprimer l'image ${index + 1}`}
                                >
                                   <XIcon className="h-4 w-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
                 <div>
                    <label htmlFor="image-upload" className="w-full cursor-pointer inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-secondary hover:bg-slate-700 dark:hover:bg-slate-600">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                        {images.length > 0 ? "Ajouter d'autres images..." : "Choisir des fichiers..."}
                    </label>
                    <input id="image-upload" type="file" multiple accept="image/png, image/jpeg, image/webp" className="hidden" onChange={handleFileChange} />
                    <p className="text-xs text-stone-500 mt-2 dark:text-stone-400">PNG, JPG, WEBP. Max 2Mo. Jusqu'à 5 images.</p>
                 </div>
            </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="location" className={formLabelClasses}>Lieu</label>
              <input type="text" id="location" value={location} onChange={(e) => setLocation(e.target.value)} required className={formInputClasses} />
            </div>
            <div>
                <label htmlFor="category" className={formLabelClasses}>Catégorie</label>
                <select id="category" value={category} onChange={(e) => setCategory(e.target.value as Category)} required className={formInputClasses}>
                    <option value="Outdoors">Plein air</option>
                    <option value="Sports">Sports</option>
                    <option value="Culture">Culture</option>
                    <option value="Social">Social</option>
                </select>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="date" className={formLabelClasses}>Date</label>
            <input type="date" id="date" value={date} onChange={(e) => setDate(e.target.value)} required className={formInputClasses} />
          </div>
          <div>
            <label htmlFor="time" className={formLabelClasses}>Heure</label>
            <input type="time" id="time" value={time} onChange={(e) => setTime(e.target.value)} required className={formInputClasses} />
          </div>
        </div>
        <div>
          <label htmlFor="maxParticipants" className={formLabelClasses}>Nombre de places</label>
          <input type="number" id="maxParticipants" value={maxParticipants} onChange={(e) => setMaxParticipants(parseInt(e.target.value, 10))} min="1" required className={formInputClasses} />
        </div>
        
        <div>
          <button type="submit" className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-lg font-medium text-white bg-primary hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-focus transition-transform hover:scale-105">
            Publier l'activité
          </button>
        </div>
      </form>
    </div>
  );
};