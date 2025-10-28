import React, { useRef, useCallback } from 'react';
import type { Activity, View, User, Category } from '../types';
import { ActivityCard } from './ActivityCard';
import { SearchIcon, InboxIcon, LocationIcon } from './icons';

interface DashboardProps {
  activities: Activity[];
  setView: (view: View) => void;
  currentUser: User | null;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  locationFilter: string;
  setLocationFilter: (value: string) => void;
  dateFilter: 'all' | 'today' | 'this_week' | 'this_month';
  setDateFilter: (value: 'all' | 'today' | 'this_week' | 'this_month') => void;
  categoryFilter: Category | 'all';
  setCategoryFilter: (value: Category | 'all') => void;
  statusFilter: 'all' | 'approved' | 'pending';
  setStatusFilter: (value: 'all' | 'approved' | 'pending') => void;
  onLoadMore: () => void;
  hasMore: boolean;
  loading: boolean;
}

export const Dashboard: React.FC<DashboardProps> = ({
  activities,
  setView,
  currentUser,
  searchQuery,
  setSearchQuery,
  locationFilter,
  setLocationFilter,
  dateFilter,
  setDateFilter,
  categoryFilter,
  setCategoryFilter,
  statusFilter,
  setStatusFilter,
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

  const formInputClasses = "block w-full pl-10 pr-3 py-2 border border-stone-300 rounded-lg leading-5 bg-white placeholder-stone-500 focus:outline-none focus:placeholder-stone-400 focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm dark:bg-stone-700 dark:border-stone-600 dark:text-stone-200 dark:placeholder-stone-400";
  const selectClasses = "block w-full px-3 py-2 border border-stone-300 rounded-lg leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm dark:bg-stone-700 dark:border-stone-600 dark:text-stone-200";

  const hasActiveFilters = searchQuery || locationFilter || dateFilter !== 'all' || categoryFilter !== 'all' || (currentUser?.role === 'admin' && statusFilter !== 'all');

  return (
    <div className="bg-light min-h-screen dark:bg-dark">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm mb-8 dark:bg-stone-800 text-center">
            <h1 className="text-3xl sm:text-4xl font-bold font-heading text-stone-800 dark:text-stone-100">Découvrez les Prochaines Sorties</h1>
            <p className="mt-2 text-stone-600 dark:text-stone-400">Trouvez une activité qui vous passionne et rencontrez de nouvelles personnes.</p>
        </div>

        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm mb-8 dark:bg-stone-800 sticky top-[65px] z-40">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-center">
                {/* Main Search */}
                <div className="relative lg:col-span-1">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <SearchIcon className="h-5 w-5 text-stone-400 dark:text-stone-500" />
                    </div>
                    <input
                        type="text"
                        placeholder="Rechercher..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className={formInputClasses}
                    />
                </div>

                {/* Location Search */}
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <LocationIcon className="h-5 w-5 text-stone-400 dark:text-stone-500" />
                    </div>
                    <input
                        type="text"
                        placeholder="Lieu..."
                        value={locationFilter}
                        onChange={(e) => setLocationFilter(e.target.value)}
                        className={formInputClasses}
                    />
                </div>

                {/* Date Filter */}
                <div>
                    <select
                        value={dateFilter}
                        onChange={(e) => setDateFilter(e.target.value as any)}
                        className={selectClasses}
                        aria-label="Filtrer par date"
                    >
                        <option value="all">Toutes les dates</option>
                        <option value="today">Aujourd'hui</option>
                        <option value="this_week">Cette semaine</option>
                        <option value="this_month">Ce mois-ci</option>
                    </select>
                </div>

                {/* Category Filter */}
                <div>
                    <select
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value as any)}
                        className={selectClasses}
                        aria-label="Filtrer par catégorie"
                    >
                        <option value="all">Toutes les catégories</option>
                        <option value="Outdoors">Plein air</option>
                        <option value="Sports">Sports</option>
                        <option value="Culture">Culture</option>
                        <option value="Social">Social</option>
                    </select>
                </div>

                {/* Status Filter (Admin only) */}
                {currentUser?.role === 'admin' && (
                    <div>
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value as any)}
                            className={selectClasses}
                            aria-label="Filtrer par statut"
                        >
                            <option value="all">Tous les statuts</option>
                            <option value="approved">Approuvées</option>
                            <option value="pending">En attente</option>
                        </select>
                    </div>
                )}
            </div>
        </div>

        {activities.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {activities.map((activity, index) => {
                const isLastElement = activities.length === index + 1;
                return (
                  <div ref={isLastElement ? lastActivityElementRef : null} key={activity.id}>
                     <ActivityCard activity={activity} setView={setView} />
                  </div>
                );
              })}
            </div>
            {hasMore && (
              <div className="text-center py-8">
                <button 
                  onClick={onLoadMore}
                  disabled={loading}
                  className="px-6 py-2 bg-primary text-white font-semibold rounded-md hover:bg-primary-hover transition-colors disabled:bg-stone-400 disabled:cursor-wait flex items-center justify-center mx-auto"
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
              <div className="text-center py-8 text-stone-500 dark:text-stone-400">
                <p>Vous avez atteint la fin de la liste.</p>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-16">
            <div className="inline-block bg-primary/10 p-5 rounded-full">
              <InboxIcon className="h-12 w-12 text-primary" />
            </div>
            <h3 className="mt-4 text-xl font-semibold text-stone-800 dark:text-stone-200">Aucun résultat trouvé</h3>
            <p className="text-stone-500 mt-2 dark:text-stone-400">
              {hasActiveFilters
                ? "Essayez de modifier vos filtres ou votre recherche." 
                : "Il n'y a pas d'activités pour le moment."
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
};