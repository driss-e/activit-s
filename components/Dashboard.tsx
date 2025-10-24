import React from 'react';
import type { Activity, View } from '../types';
import { ActivityCard } from './ActivityCard';

interface DashboardProps {
  activities: Activity[];
  setView: (view: View) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onLoadMore: () => void;
  hasMore: boolean;
}

export const Dashboard: React.FC<DashboardProps> = ({ activities, setView, searchQuery, onSearchChange, onLoadMore, hasMore }) => {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8 p-6 bg-white rounded-lg shadow-md">
        <input
          type="text"
          placeholder="Rechercher une activité..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      {activities.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {activities.map(activity => (
              <ActivityCard key={activity.id} activity={activity} setView={setView} />
            ))}
          </div>
          {hasMore && (
            <div className="mt-10 text-center">
              <button
                onClick={onLoadMore}
                className="px-6 py-3 bg-secondary text-white font-semibold rounded-md hover:bg-slate-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500"
              >
                Charger plus d'activités
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-16">
          <h3 className="text-xl font-semibold text-gray-700">
            {searchQuery ? "Aucun résultat trouvé" : "Aucune activité pour le moment"}
          </h3>
          <p className="text-gray-500 mt-2">
            {searchQuery
              ? "Essayez de modifier votre recherche."
              : "Revenez plus tard ou créez une nouvelle activité !"}
          </p>
        </div>
      )}
    </div>
  );
};
