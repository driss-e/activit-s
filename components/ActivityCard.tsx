import React from 'react';
import type { Activity, View } from '../types';
import { CalendarIcon, LocationIcon, UsersIcon } from './icons';

interface ActivityCardProps {
  activity: Activity;
  setView: (view: View) => void;
}

export const ActivityCard: React.FC<ActivityCardProps> = ({ activity, setView }) => {
  const { id, title, image, date, location, participants, maxParticipants } = activity;

  const spotsLeft = maxParticipants - participants.length;
  const isFull = spotsLeft <= 0;
  
  const getBadgeColor = () => {
    if (isFull) return 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300';
    if (spotsLeft <= 3) return 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300';
    return 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-200';
  };

  return (
    <div
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer group border-t-4 border-primary dark:bg-slate-800"
      onClick={() => setView({ type: 'ACTIVITY_DETAIL', activityId: id })}
    >
      <div className="relative">
        <img className="h-48 w-full object-cover" src={image || 'https://via.placeholder.com/300'} alt={title} />
        <div className={`absolute top-2 right-2 px-2 py-1 rounded-md text-sm font-semibold ${getBadgeColor()}`}>
          {isFull ? 'Complet' : `${spotsLeft} place${spotsLeft > 1 ? 's' : ''} disponible${spotsLeft > 1 ? 's' : ''}`}
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-bold text-gray-900 group-hover:text-primary transition-colors dark:text-slate-100">{title}</h3>
        <div className="mt-2 space-y-2 text-sm text-gray-600 dark:text-slate-400">
          <div className="flex items-center">
            <CalendarIcon className="h-4 w-4 mr-2 text-gray-400 dark:text-slate-500" />
            <span>{new Date(date).toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
          </div>
          <div className="flex items-center">
            <LocationIcon className="h-4 w-4 mr-2 text-gray-400 dark:text-slate-500" />
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
          <div className="flex items-center">
            <UsersIcon className="h-4 w-4 mr-2 text-gray-400 dark:text-slate-500" />
            <span>{participants.length} / {maxParticipants} participants</span>
          </div>
        </div>
      </div>
    </div>
  );
};