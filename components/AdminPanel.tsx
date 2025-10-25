// FIX: Provide full content for the AdminPanel component.
import React, { useState } from 'react';
import type { User, Activity, View } from '../types';
import { UsersGroupIcon, ClipboardListIcon, CalendarIcon } from './icons';
import { BarChart, LineChart } from './charts';

interface AdminPanelProps {
  users: User[];
  activities: Activity[];
  onDeleteUser: (userId: string) => void;
  onDeleteActivity: (activityId: string) => void;
  onUpdateUserStatus: (userId: string, status: 'active' | 'inactive') => void;
  currentSection: 'dashboard' | 'users' | 'activities';
  setView: (view: View) => void;
  currentUser: User;
}

const StatCard: React.FC<{ title: string; value: number | string; icon: React.ReactNode }> = ({ title, value, icon }) => (
    <div className="bg-white dark:bg-stone-800 p-6 rounded-xl shadow-sm flex items-center gap-4">
        <div className="bg-primary/10 text-primary p-3 rounded-full">
            {icon}
        </div>
        <div>
            <p className="text-sm text-stone-500 dark:text-stone-400">{title}</p>
            <p className="text-2xl font-bold text-stone-800 dark:text-stone-100">{value}</p>
        </div>
    </div>
);

// Helper function to group data by month
const groupDataByMonth = (items: (User | Activity)[]) => {
    const counts: { [key: string]: { year: number; month: number; count: number } } = {};
    
    items.forEach(item => {
        const date = item.createdAt;
        const year = date.getFullYear();
        const month = date.getMonth(); // 0-11
        const key = `${year}-${month}`;
        
        if (!counts[key]) {
            counts[key] = { year, month, count: 0 };
        }
        counts[key].count++;
    });

    const monthFormatter = new Intl.DateTimeFormat('fr-FR', { month: 'short', year: '2-digit' });

    // Sort keys based on year and month
    const sortedKeys = Object.keys(counts).sort((a, b) => {
        const [aYear, aMonth] = a.split('-').map(Number);
        const [bYear, bMonth] = b.split('-').map(Number);
        if (aYear !== bYear) return aYear - bYear;
        return aMonth - bMonth;
    });

    return sortedKeys.map(key => {
        const { year, month, count } = counts[key];
        const labelDate = new Date(year, month);
        const label = monthFormatter.format(labelDate).replace(/\s/g, '');
        return {
            label,
            value: count
        };
    });
};


export const AdminPanel: React.FC<AdminPanelProps> = ({ users, activities, onDeleteUser, onDeleteActivity, onUpdateUserStatus, currentSection, setView, currentUser }) => {

    const renderContent = () => {
        switch (currentSection) {
            case 'users':
                return <UserManagement users={users} onDeleteUser={onDeleteUser} onUpdateUserStatus={onUpdateUserStatus} currentUser={currentUser} />;
            case 'activities':
                return <ActivityManagement activities={activities} onDeleteActivity={onDeleteActivity} />;
            case 'dashboard':
            default:
                const activeUsers = users.filter(u => u.status === 'active').length;
                const upcomingActivities = activities.filter(a => a.date > new Date()).length;
                const recentActivities = [...activities].sort((a,b) => b.createdAt.getTime() - a.createdAt.getTime()).slice(0, 5);
                
                const userRegistrationData = groupDataByMonth(users);
                const activityCreationData = groupDataByMonth(activities);

                return (
                    <div>
                         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <StatCard title="Total Utilisateurs" value={users.length} icon={<UsersGroupIcon className="h-6 w-6" />} />
                            <StatCard title="Utilisateurs Actifs" value={activeUsers} icon={<UsersGroupIcon className="h-6 w-6 text-green-500" />} />
                            <StatCard title="Total Activités" value={activities.length} icon={<ClipboardListIcon className="h-6 w-6" />} />
                            <StatCard title="Activités à venir" value={upcomingActivities} icon={<CalendarIcon className="h-6 w-6" />} />
                        </div>

                        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <BarChart data={userRegistrationData} title="Nouveaux utilisateurs par mois" />
                            <LineChart data={activityCreationData} title="Activités créées par mois" />
                        </div>

                        <div className="mt-8 bg-white p-6 rounded-lg shadow-md dark:bg-stone-800">
                            <h3 className="text-xl font-semibold mb-4 dark:text-stone-200">Activités Récentes</h3>
                            <ul className="divide-y divide-stone-200 dark:divide-stone-700">
                                {recentActivities.map(activity => (
                                    <li key={activity.id} className="py-3 flex items-center justify-between gap-2">
                                        <div className="flex items-center gap-3 min-w-0">
                                            <img className="h-10 w-10 rounded-md object-cover flex-shrink-0" src={activity.image} alt={activity.title} />
                                            <div className="min-w-0">
                                                <p className="text-sm font-medium text-stone-900 dark:text-stone-200 truncate">{activity.title}</p>
                                                <p className="text-sm text-stone-500 dark:text-stone-400 truncate">{activity.location}</p>
                                            </div>
                                        </div>
                                        <span className="text-sm text-stone-500 dark:text-stone-400">{activity.createdAt.toLocaleDateString()}</span>
                                    </li>
                                ))}
                                {recentActivities.length === 0 && <p className="text-center text-stone-500 dark:text-stone-400 py-4">Aucune activité récente.</p>}
                            </ul>
                        </div>
                    </div>
                );
        }
    };
    
    const TabButton: React.FC<{ section: 'dashboard' | 'users' | 'activities'; label: string }> = ({ section, label }) => {
        const isActive = currentSection === section;
        return (
             <button
                onClick={() => setView({ type: 'ADMIN', section })}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                    isActive 
                    ? 'bg-primary text-white' 
                    : 'text-stone-600 hover:bg-stone-100 dark:text-stone-300 dark:hover:bg-stone-700'
                }`}
            >
                {label}
            </button>
        )
    }

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h2 className="text-3xl font-bold font-heading mb-4 dark:text-stone-100">Panneau d'administration</h2>
          <div className="mb-6 border-b border-stone-200 dark:border-stone-700">
            <nav className="flex space-x-2" aria-label="Tabs">
                <TabButton section="dashboard" label="Tableau de bord" />
                <TabButton section="users" label="Utilisateurs" />
                <TabButton section="activities" label="Activités" />
            </nav>
          </div>
          {renderContent()}
        </div>
    );
};


const UserManagement: React.FC<{ users: User[], onDeleteUser: (userId: string) => void, onUpdateUserStatus: (userId: string, status: 'active' | 'inactive') => void, currentUser: User }> = ({ users, onDeleteUser, onUpdateUserStatus, currentUser }) => {
    const [userStatusFilter, setUserStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');

    const filteredUsers = users.filter(user => {
        if (userStatusFilter === 'all') return true;
        return user.status === userStatusFilter;
    });
    
    const FilterButton: React.FC<{
        filter: 'all' | 'active' | 'inactive';
        label: string;
    }> = ({ filter, label }) => {
        const isActive = userStatusFilter === filter;
        return (
            <button
                onClick={() => setUserStatusFilter(filter)}
                className={`px-3 py-1.5 text-sm font-semibold rounded-md transition-colors ${
                  isActive
                    ? 'bg-primary text-white shadow'
                    : 'text-stone-600 hover:bg-white/60 dark:text-stone-300 dark:hover:bg-stone-600/80'
                }`}
            >
                {label}
            </button>
        );
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md dark:bg-stone-800">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
                <h3 className="text-xl font-semibold dark:text-stone-200">Gérer les Utilisateurs ({filteredUsers.length})</h3>
                <div className="flex space-x-1 rounded-lg bg-stone-100 p-1 dark:bg-stone-900/50">
                    <FilterButton filter="all" label="Tous" />
                    <FilterButton filter="active" label="Actif" />
                    <FilterButton filter="inactive" label="Inactif" />
                </div>
            </div>
            <div className="max-h-96 overflow-y-auto">
            <ul className="divide-y divide-stone-200 dark:divide-stone-700">
                {filteredUsers.map(user => (
                <li key={user.id} className="py-3 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                        <img className="h-10 w-10 rounded-full flex-shrink-0" src={user.avatar} alt={user.name} />
                        <div className="min-w-0">
                            <p className="text-sm font-medium text-stone-900 dark:text-stone-200 truncate">{user.name}</p>
                            <p className="text-sm text-stone-500 dark:text-stone-400 truncate">{user.email}</p>
                        </div>
                    </div>

                    <div className="hidden md:block">
                        <p className="text-sm text-stone-500 dark:text-stone-400">
                            {user.createdAt.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </p>
                    </div>
                    
                    <div className="flex items-center gap-2 flex-shrink-0">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300'}`}>
                            {user.status === 'active' ? 'Actif' : 'Inactif'}
                        </span>
                        {user.id !== currentUser.id && (
                            <>
                                <button
                                    onClick={() => onUpdateUserStatus(user.id, user.status === 'active' ? 'inactive' : 'active')}
                                    className="text-sm font-medium text-primary hover:text-primary-hover"
                                >
                                    {user.status === 'active' ? 'Désactiver' : 'Activer'}
                                </button>
                                <button
                                    onClick={() => window.confirm(`Supprimer l'utilisateur ${user.name} ?`) && onDeleteUser(user.id)}
                                    className="text-sm font-medium text-red-600 hover:text-red-800 dark:text-red-500 dark:hover:text-red-400"
                                >
                                    Supprimer
                                </button>
                            </>
                        )}
                    </div>
                </li>
                ))}
            </ul>
            </div>
        </div>
    );
};

const ActivityManagement: React.FC<{ activities: Activity[], onDeleteActivity: (activityId: string) => void }> = ({ activities, onDeleteActivity }) => (
     <div className="bg-white p-6 rounded-lg shadow-md dark:bg-stone-800">
        <h3 className="text-xl font-semibold mb-4 dark:text-stone-200">Gérer les Activités ({activities.length})</h3>
        <div className="max-h-96 overflow-y-auto">
        <ul className="divide-y divide-stone-200 dark:divide-stone-700">
            {activities.map(activity => (
            <li key={activity.id} className="py-3 flex items-center justify-between gap-2">
                <div className="flex items-center gap-3 min-w-0">
                <img className="h-10 w-10 rounded-md object-cover flex-shrink-0" src={activity.image} alt={activity.title} />
                <div className="min-w-0">
                    <p className="text-sm font-medium text-stone-900 dark:text-stone-200 truncate">{activity.title}</p>
                    <p className="text-sm text-stone-500 dark:text-stone-400 truncate">{activity.location}</p>
                </div>
                </div>
                <button
                onClick={() => window.confirm(`Supprimer l'activité "${activity.title}" ?`) && onDeleteActivity(activity.id)}
                className="text-sm font-medium text-red-600 hover:text-red-800 dark:text-red-500 dark:hover:text-red-400 flex-shrink-0"
                >
                Supprimer
                </button>
            </li>
            ))}
        </ul>
        </div>
    </div>
);