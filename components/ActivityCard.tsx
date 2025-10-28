import React from 'react';
import type { Activity, View, Category } from '../types';
import { CalendarIcon, LocationIcon, UsersIcon } from './icons';

interface ActivityCardProps {
  activity: Activity;
  setView: (view: View) => void;
}

const categoryStyles: { [key in Category]: { bg: string; text: string } } = {
  Outdoors: { bg: 'bg-green-100 dark:bg-green-900/50', text: 'text-green-800 dark:text-green-300' },
  Sports: { bg: 'bg-blue-100 dark:bg-blue-900/50', text: 'text-blue-800 dark:text-blue-300' },
  Culture: { bg: 'bg-purple-100 dark:bg-purple-900/50', text: 'text-purple-800 dark:text-purple-300' },
  Social: { bg: 'bg-pink-100 dark:bg-pink-900/50', text: 'text-pink-800 dark:text-pink-300' },
};

const categoryDisplayNames: { [key in Category]: string } = {
    Outdoors: 'Plein air',
    Sports: 'Sports',
    Culture: 'Culture',
    Social: 'Social',
};

export const ActivityCard: React.FC<ActivityCardProps> = ({ activity, setView }) => {
  const { id, title, images, date, location, participants, maxParticipants, category } = activity;

  const spotsLeft = maxParticipants - participants.length;
  const isFull = spotsLeft <= 0;
  
  const getBadgeInfo = () => {
    if (isFull) return { text: 'Complet', color: 'bg-red-500/80 text-white' };
    if (spotsLeft <= 3) return { text: `${spotsLeft} place${spotsLeft > 1 ? 's' : ''}`, color: 'bg-accent/80 text-white' };
    return { text: `${participants.length} / ${maxParticipants}`, color: 'bg-black/50 text-white' };
  };

  const badge = getBadgeInfo();
  const categoryStyle = categoryStyles[category];

  return (
    <div
      className="bg-white rounded-xl shadow-sm overflow-hidden transition-all duration-300 cursor-pointer group hover:shadow-xl hover:-translate-y-1 dark:bg-stone-800"
      onClick={() => setView({ type: 'ACTIVITY_DETAIL', activityId: id })}
    >
      <div className="relative overflow-hidden">
        <img className="h-48 w-full object-cover transition-transform duration-300 group-hover:scale-110" src={images[0] || 'https://via.placeholder.com/300'} alt={title} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <div className={`absolute bottom-2 right-2 px-2 py-1 rounded-full text-xs font-bold ${badge.color}`}>
          {badge.text}
        </div>
      </div>
      <div className="p-4">
        <div className={`inline-block px-2 py-1 text-xs font-semibold rounded-full mb-2 ${categoryStyle.bg} ${categoryStyle.text}`}>
            {categoryDisplayNames[category]}
        </div>
        <h3 className="text-lg font-bold font-heading text-stone-900 group-hover:text-primary transition-colors dark:text-stone-100">{title}</h3>
        <div className="mt-2 space-y-2 text-sm text-stone-600 dark:text-stone-400">
          <div className="flex items-center">
            <CalendarIcon className="h-4 w-4 mr-2 text-stone-400 dark:text-stone-500 flex-shrink-0" />
            <span className="truncate">{new Date(date).toLocaleDateString('fr-FR', { weekday: 'long', month: 'long', day: 'numeric' })}</span>
          </div>
          <div className="flex items-center">
            <LocationIcon className="h-4 w-4 mr-2 text-stone-400 dark:text-stone-500 flex-shrink-0" />
            <a 
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="truncate hover:underline"
              onClick={(e) => e.stopPropagation()} // Prevent card click when clicking link
            >
              {location}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};