import React, { useState, useMemo } from 'react';
import type { Activity, View } from '../types';
import { ActivityCard } from './ActivityCard';

interface DashboardProps {
  activities: Activity[];
  setView: (view: View) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ activities, setView }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredAndSortedActivities = useMemo(() => {
    // FIX: Ensure activities exist before filtering and sorting to prevent runtime errors.
    return (activities || [])
      .filter(activity =>
        activity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        activity.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        activity.location.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort((a, b) => {
          // FIX: Convert dates to numbers for reliable comparison.
          return new Date(a.date).getTime() - new Date(b.date).getTime();
      });
  }, [activities, searchTerm]);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8 p-6 bg-white rounded-lg shadow-md">
        <input
          type="text"
          placeholder="Rechercher une activité..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      {filteredAndSortedActivities.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredAndSortedActivities.map(activity => (
            <ActivityCard key={activity.id} activity={activity} setView={setView} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <h3 className="text-xl font-semibold text-gray-700">Aucune activité trouvée</h3>
          <p className="text-gray-500 mt-2">Essayez d'ajuster vos filtres de recherche ou créez une nouvelle activité !</p>
        </div>
      )}
    </div>
  );
};
