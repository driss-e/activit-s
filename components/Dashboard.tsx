
import React from 'react';
import type { Activity, View } from '../types';
import { ActivityCard } from './ActivityCard';

interface DashboardProps {
  activities: Activity[];
  setView: (view: View) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ activities, setView }) => {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h2 className="text-3xl font-bold tracking-tight text-gray-900 mb-8">Prochaines sorties</h2>
      {activities.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {activities.map(activity => (
            <ActivityCard key={activity.id} activity={activity} setView={setView} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-lg shadow">
          <h3 className="text-xl font-semibold text-gray-700">Aucune activité pour le moment.</h3>
          <p className="text-gray-500 mt-2">Pourquoi ne pas en créer une ?</p>
          <button
            onClick={() => setView({ type: 'CREATE_ACTIVITY' })}
            className="mt-6 px-6 py-2 bg-primary text-white font-semibold rounded-md hover:bg-primary-hover transition-colors"
          >
            Créer une activité
          </button>
        </div>
      )}
    </div>
  );
};
