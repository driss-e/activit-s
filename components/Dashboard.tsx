import React, { useRef, useCallback } from 'react';
import type { Activity, View } from '../types';
import { ActivityCard } from './ActivityCard';
import { SearchIcon, InboxIcon } from './icons';

interface DashboardProps {
  activities: Activity[];
  setView: (view: View) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filterNext7Days: boolean;
  setFilterNext7Days: (value: boolean) => void;
  onLoadMore: () => void;
  hasMore: boolean;
  loading: boolean;
}

export const Dashboard: React.FC<DashboardProps> = ({
  activities,
  setView,
  searchQuery,
  setSearchQuery,
  filterNext7Days,
  setFilterNext7Days,
  onLoadMore,
  hasMore,
  loading
}) => {
  const observer = useRef<IntersectionObserver | null>(null);
  const lastActivityElementRef = useCallback((node: HTMLDivElement) => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        onLoadMore();
      }
    });
    if (node) observer.current.observe(node);
  }, [hasMore, onLoadMore, loading]);


  return (
    <div className="bg-light min-h-screen dark:bg-slate-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md mb-8 dark:bg-slate-800">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="relative flex-grow">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <SearchIcon className="h-5 w-5 text-gray-400 dark:text-slate-500" />
                    </div>
                    <input
                        type="text"
                        placeholder="Rechercher par titre ou description..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm dark:bg-slate-700 dark:border-slate-600 dark:text-slate-200 dark:placeholder-slate-400"
                    />
                </div>
                <div className="flex-shrink-0 flex items-center space-x-2">
                    <input
                        id="filter-7-days"
                        type="checkbox"
                        checked={filterNext7Days}
                        onChange={(e) => setFilterNext7Days(e.target.checked)}
                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary dark:bg-slate-600 dark:border-slate-500"
                    />
                    <label 
                        htmlFor="filter-7-days" 
                        className="text-sm text-gray-700 dark:text-slate-300">
                        Dans les 7 prochains jours
                    </label>
                </div>
            </div>
        </div>

        {activities.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {activities.map((activity, index) => {
                if (activities.length === index + 1) {
                  return (
                    <div ref={lastActivityElementRef} key={activity.id}>
                       <ActivityCard activity={activity} setView={setView} />
                    </div>
                  );
                } else {
                  return <ActivityCard key={activity.id} activity={activity} setView={setView} />;
                }
              })}
            </div>
            {hasMore && (
              <div className="text-center py-8">
                <button 
                  onClick={onLoadMore}
                  disabled={loading}
                  className="px-6 py-2 bg-primary text-white font-semibold rounded-md hover:bg-primary-hover transition-colors disabled:bg-slate-400 disabled:cursor-wait flex items-center justify-center mx-auto"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Chargement...
                    </>
                  ) : (
                    "Charger plus d'activités"
                  )}
                </button>
              </div>
            )}
             {!hasMore && activities.length > 0 && (
              <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                <p>Vous avez atteint la fin de la liste.</p>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-16">
            <div className="inline-block bg-primary/10 p-5 rounded-full">
              <InboxIcon className="h-12 w-12 text-primary" />
            </div>
            <h3 className="mt-4 text-xl font-semibold text-gray-800 dark:text-slate-200">Aucun résultat trouvé</h3>
            <p className="text-gray-500 mt-2 dark:text-slate-400">
              {searchQuery || filterNext7Days ? "Essayez de modifier vos filtres ou votre recherche." : "Il n'y a pas d'activités pour le moment."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};