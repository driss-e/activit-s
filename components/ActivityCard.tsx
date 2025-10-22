
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

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:-translate-y-1 transition-transform duration-300 ease-in-out flex flex-col">
      <img className="h-56 w-full object-cover" src={image} alt={title} />
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-xl font-semibold mb-2 text-gray-800">{title}</h3>
        <div className="space-y-3 text-gray-600 text-sm mb-4">
          <div className="flex items-center">
            <CalendarIcon className="h-4 w-4 mr-2 text-primary" />
            <span>{date.toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} à {date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
          <div className="flex items-center">
            <LocationIcon className="h-4 w-4 mr-2 text-primary" />
            <span>{location}</span>
          </div>
          <div className="flex items-center">
            <UsersIcon className="h-4 w-4 mr-2 text-primary" />
            <span>{spotsLeft} / {maxParticipants} places restantes</span>
          </div>
        </div>
        <div className="mt-auto">
            <button
                onClick={() => setView({ type: 'ACTIVITY_DETAIL', activityId: id })}
                className="w-full px-4 py-2 bg-primary text-white font-semibold rounded-md hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-focus transition-colors"
            >
                Voir les détails
            </button>
        </div>
      </div>
    </div>
  );
};
