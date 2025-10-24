import React, { useEffect, useRef } from 'react';
import type { Activity, View } from '../types';
import { ActivityCard } from './ActivityCard';

interface DashboardProps {
  activities: Activity[];
  setView: (view: View) => void;
  onLoadMore: () => void;
  hasMore: boolean;
}

export const Dashboard: React.FC<DashboardProps> = ({ activities, setView, onLoadMore, hasMore }) => {
  const observerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          onLoadMore();
        }
      },
      { threshold: 1.0 }
    );

    const currentObserverRef = observerRef.current;
    if (currentObserverRef) {
      observer.observe(currentObserverRef);
    }

    return () => {
      if (currentObserverRef) {
        observer.unobserve(currentObserverRef);
      }
    };
  }, [hasMore, onLoadMore]);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h2 className="text-3xl font-bold tracking-tight text-gray-900 mb-8">Prochaines sorties</h2>
      {activities.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {activities.map(activity => (
              <ActivityCard key={activity.id} activity={activity} setView={setView} />
            ))}
          </div>
          
          <div ref={observerRef} className="h-20 flex justify-center items-center">
            {hasMore && (
              <div className="flex items-center space-x-2 text-secondary">
                <svg className="animate-spin h-5 w-5 text-secondary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Chargement...</span>
              </div>
            )}
          </div>
        </>
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
