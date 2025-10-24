// FIX: Replaced placeholder content with a functional Dashboard component.
import React, { useState, useMemo } from 'react';
import type { Activity, View } from '../types';
import { ActivityCard } from './ActivityCard';
import { SearchIcon, InboxIcon } from './icons';

interface DashboardProps {
  activities: Activity[];
  setView: (view: View) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ activities, setView }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');

  const filteredActivities = useMemo(() => {
    return activities
      .filter(activity => {
        const matchesSearch = activity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          activity.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          activity.location.toLowerCase().includes(searchTerm.toLowerCase());
        
        const now = new Date();
        if (filter === 'upcoming') {
          return matchesSearch && new Date(activity.date) >= now;
        }
        if (filter === 'past') {
          return matchesSearch && new Date(activity.date) < now;
        }
        return matchesSearch;
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [activities, searchTerm, filter]);

  return (
    <div className="bg-light min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="relative flex-grow">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <SearchIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        placeholder="Rechercher une activité..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm"
                    />
                </div>
                <div className="flex-shrink-0">
                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-white"
                    >
                        <option value="all">Toutes les activités</option>
                        <option value="upcoming">À venir</option>
                        <option value="past">Passées</option>
                    </select>
                </div>
            </div>
        </div>

        {filteredActivities.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredActivities.map((activity) => (
              <ActivityCard key={activity.id} activity={activity} setView={setView} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="inline-block bg-primary/10 p-5 rounded-full">
              <InboxIcon className="h-12 w-12 text-primary" />
            </div>
            <h3 className="mt-4 text-xl font-semibold text-gray-800">Aucune activité trouvée</h3>
            <p className="text-gray-500 mt-2">
              {searchTerm ? "Essayez de modifier votre recherche." : "Il n'y a pas d'activités pour le moment. Pourquoi ne pas en créer une ?"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};