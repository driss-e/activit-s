import React, { useState, useMemo } from 'react';
import type { User, Activity, View, AuditLogEntry } from '../types';
import { 
    UsersGroupIcon, 
    ClipboardListIcon, 
    CalendarIcon, 
    SearchIcon, 
    TrashIcon,
    CheckIcon,
    EyeIcon,
    EyeOffIcon,
    ChartBarIcon,
    ShieldCheckIcon,
    SwitchHorizontalIcon,
    DownloadIcon,
    ReplyIcon
} from './icons';
import { BarChart, LineChart } from './charts';

interface AdminPanelProps {
  users: User[];
  activities: Activity[];
  auditLogs: AuditLogEntry[];
  onDeleteUser: (userId: string) => void;
  onDeleteActivity: (activityId: string) => void;
  onApproveActivity: (activityId: string) => void;
  onUpdateUserStatus: (userId: string, status: User['status']) => void;
  onUpdateUserRole: (userId: string, role: 'admin' | 'member') => void;
  currentSection: 'dashboard' | 'users' | 'activities' | 'audit';
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
        return { label, value: count };
    });
};

const AdminDashboard: React.FC<{ users: User[], activities: Activity[] }> = ({ users, activities }) => {
    const activeUsers = users.filter(u => u.status === 'active').length;
    const upcomingActivities = activities.filter(a => a.date > new Date()).length;
    const recentActivities = [...activities].sort((a,b) => b.createdAt.getTime() - a.createdAt.getTime()).slice(0, 5);
    
    const userRegistrationData = groupDataByMonth(users);
    const activityCreationData = groupDataByMonth(activities);

    return (
        <div className="space-y-8">
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Total Utilisateurs" value={users.length} icon={<UsersGroupIcon className="h-6 w-6" />} />
                <StatCard title="Utilisateurs Actifs" value={activeUsers} icon={<UsersGroupIcon className="h-6 w-6 text-green-500" />} />
                <StatCard title="Total Activités" value={activities.length} icon={<ClipboardListIcon className="h-6 w-6" />} />
                <StatCard title="Activités à venir" value={upcomingActivities} icon={<CalendarIcon className="h-6 w-6" />} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <BarChart data={userRegistrationData} title="Nouveaux utilisateurs par mois" />
                <LineChart data={activityCreationData} title="Activités créées par mois" />
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md dark:bg-stone-800">
                <h3 className="text-xl font-semibold mb-4 dark:text-stone-200">Activités Récentes</h3>
                <ul className="divide-y divide-stone-200 dark:divide-stone-700">
                    {recentActivities.map(activity => (
                        <li key={activity.id} className="py-3 flex items-center justify-between gap-2">
                            <div className="flex items-center gap-3 min-w-0">
                                <img className="h-10 w-10 rounded-md object-cover flex-shrink-0" src={activity.images[0]} alt={activity.title} />
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
};

// Helper to escape CSV fields
const escapeCSV = (field: any): string => {
  if (field === null || field === undefined) {
    return '';
  }
  const stringField = String(field);
  // If the field contains a comma, a double quote, or a newline, wrap it in double quotes
  if (/[",\n]/.test(stringField)) {
    return `"${stringField.replace(/"/g, '""')}"`;
  }
  return stringField;
};

const UserManagement: React.FC<{ users: User[], onUpdateUserStatus: AdminPanelProps['onUpdateUserStatus'], onDeleteUser: AdminPanelProps['onDeleteUser'], onUpdateUserRole: AdminPanelProps['onUpdateUserRole'], currentUser: User }> = ({ users, onUpdateUserStatus, onDeleteUser, onUpdateUserRole, currentUser }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [showDeleted, setShowDeleted] = useState(false);

    const filteredUsers = useMemo(() => 
        users
            .filter(user => showDeleted || user.status !== 'deleted')
            .filter(user => 
                user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                user.email.toLowerCase().includes(searchTerm.toLowerCase())
            ), 
        [users, searchTerm, showDeleted]
    );

    const handleStatusToggle = (user: User) => {
        const newStatus = user.status === 'active' ? 'inactive' : 'active';
        const action = newStatus === 'active' ? 'activer' : 'désactiver';
        if (window.confirm(`Êtes-vous sûr de vouloir ${action} l'utilisateur "${user.name}" ?`)) {
            onUpdateUserStatus(user.id, newStatus);
        }
    }

    const handleDelete = (user: User) => {
        if (window.confirm(`Cette action marquera l'utilisateur "${user.name}" comme supprimé et désactivera son compte. Êtes-vous sûr ?`)) {
            onDeleteUser(user.id);
        }
    }

    const handleRestore = (user: User) => {
        if (window.confirm(`Voulez-vous restaurer l'utilisateur "${user.name}" ? Son statut sera défini sur "inactif".`)) {
            onUpdateUserStatus(user.id, 'inactive');
        }
    };
    
    const handleRoleToggle = (user: User) => {
        const newRole = user.role === 'admin' ? 'member' : 'admin';
        const action = newRole === 'admin' ? 'promouvoir en administrateur' : 'rétrograder en membre';
        if (window.confirm(`Êtes-vous sûr de vouloir ${action} l'utilisateur "${user.name}" ?`)) {
            onUpdateUserRole(user.id, newRole);
        }
    }

    const handleExportUsers = () => {
        const csvHeaders = ['ID', 'Nom', 'Email', 'Rôle', 'Statut', 'Date Inscription'];
        const csvRows = filteredUsers.map(user => [
            escapeCSV(user.id),
            escapeCSV(user.name),
            escapeCSV(user.email),
            escapeCSV(user.role),
            escapeCSV(user.status),
            escapeCSV(user.createdAt.toISOString().split('T')[0])
        ].join(','));
        
        const csvContent = [csvHeaders.join(','), ...csvRows].join('\n');
        
        const blob = new Blob([`\uFEFF${csvContent}`], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', 'export_utilisateurs.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };
    
    const statusDisplay: { [key in User['status']]: { text: string; classes: string; } } = {
        active: { text: 'Actif', classes: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300' },
        inactive: { text: 'Inactif', classes: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300' },
        deleted: { text: 'Supprimé', classes: 'bg-stone-100 text-stone-800 dark:bg-stone-700 dark:text-stone-300' },
    };

    return (
        <div className="bg-white dark:bg-stone-800 p-6 rounded-lg shadow-md">
            <div className="flex flex-col sm:flex-row justify-between items-start mb-4 gap-4">
                <h3 className="text-xl font-semibold dark:text-stone-200">Gérer les Utilisateurs ({filteredUsers.length})</h3>
                 <div className="w-full sm:w-auto flex flex-col sm:flex-row gap-2">
                     <div className="relative flex-grow">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <SearchIcon className="h-5 w-5 text-stone-400" />
                        </div>
                        <input 
                            type="text"
                            placeholder="Rechercher..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="block w-full pl-10 pr-3 py-2 border border-stone-300 rounded-md leading-5 bg-white placeholder-stone-500 focus:outline-none focus:placeholder-stone-400 focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm dark:bg-stone-700 dark:border-stone-600 dark:text-stone-200"
                        />
                    </div>
                     <button onClick={handleExportUsers} className="flex-shrink-0 inline-flex items-center justify-center px-4 py-2 border border-stone-300 text-sm font-medium rounded-md text-stone-700 bg-white hover:bg-stone-50 dark:bg-stone-700 dark:text-stone-300 dark:border-stone-600 dark:hover:bg-stone-600">
                        <DownloadIcon className="h-5 w-5 mr-2 -ml-1" />
                        Exporter
                    </button>
                 </div>
            </div>
            <div className="mb-4">
                <label className="flex items-center space-x-2 text-sm text-stone-600 dark:text-stone-400">
                    <input
                        type="checkbox"
                        checked={showDeleted}
                        onChange={e => setShowDeleted(e.target.checked)}
                        className="rounded text-primary focus:ring-primary-focus"
                    />
                    <span>Afficher les utilisateurs supprimés</span>
                </label>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-stone-200 dark:divide-stone-700">
                    <thead className="bg-stone-50 dark:bg-stone-700/50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider dark:text-stone-300">Utilisateur</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider dark:text-stone-300">Rôle</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider dark:text-stone-300">Statut</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider dark:text-stone-300">Inscrit le</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-stone-500 uppercase tracking-wider dark:text-stone-300">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-stone-200 dark:bg-stone-800 dark:divide-stone-700">
                        {filteredUsers.map(user => (
                            <tr key={user.id} className={user.status === 'deleted' ? 'opacity-60' : ''}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0 h-10 w-10">
                                            <img className="h-10 w-10 rounded-full" src={user.avatar} alt="" />
                                        </div>
                                        <div className="ml-4">
                                            <div className="text-sm font-medium text-stone-900 dark:text-stone-200">{user.name}</div>
                                            <div className="text-sm text-stone-500 dark:text-stone-400">{user.email}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-stone-500 dark:text-stone-400">{user.role === 'admin' ? 'Admin' : 'Membre'}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusDisplay[user.status].classes}`}>
                                        {statusDisplay[user.status].text}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-stone-500 dark:text-stone-400">{user.createdAt.toLocaleDateString()}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                    {user.status === 'deleted' ? (
                                         <button onClick={() => handleRestore(user)} title="Restaurer l'utilisateur" className="text-green-600 hover:text-green-900 dark:text-green-500 dark:hover:text-green-400 p-1 rounded-full hover:bg-green-100 dark:hover:bg-green-900/50">
                                            <ReplyIcon className="h-5 w-5"/>
                                        </button>
                                    ) : (
                                        <>
                                            <button 
                                                onClick={() => handleRoleToggle(user)} 
                                                disabled={user.id === currentUser.id}
                                                title={user.role === 'admin' ? 'Rétrograder en membre' : 'Promouvoir en admin'} 
                                                className="text-stone-600 hover:text-primary dark:text-stone-400 dark:hover:text-primary-hover p-1 rounded-full hover:bg-stone-100 dark:hover:bg-stone-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                <SwitchHorizontalIcon className="h-5 w-5"/>
                                            </button>
                                            <button onClick={() => handleStatusToggle(user)} title={user.status === 'active' ? 'Désactiver' : 'Activer'} className="text-stone-600 hover:text-primary dark:text-stone-400 dark:hover:text-primary-hover p-1 rounded-full hover:bg-stone-100 dark:hover:bg-stone-700">
                                                {user.status === 'active' ? <EyeOffIcon className="h-5 w-5"/> : <EyeIcon className="h-5 w-5"/>}
                                            </button>
                                            <button onClick={() => handleDelete(user)} title="Supprimer" className="text-red-600 hover:text-red-900 dark:text-red-500 dark:hover:text-red-400 p-1 rounded-full hover:bg-red-100 dark:hover:bg-red-900/50">
                                                <TrashIcon className="h-5 w-5"/>
                                            </button>
                                        </>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const ActivityManagement: React.FC<{ activities: Activity[], onApproveActivity: AdminPanelProps['onApproveActivity'], onDeleteActivity: AdminPanelProps['onDeleteActivity'] }> = ({ activities, onApproveActivity, onDeleteActivity }) => {
    const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved'>('all');
    const filteredActivities = useMemo(() =>
        activities.filter(activity => statusFilter === 'all' || activity.status === statusFilter)
    , [activities, statusFilter]);

     const handleDelete = (activity: Activity) => {
        if (window.confirm(`Voulez-vous vraiment supprimer l'activité "${activity.title}" ?`)) {
            onDeleteActivity(activity.id);
        }
    }

    const handleExportActivities = () => {
        const csvHeaders = ['ID', 'Titre', 'Date', 'Lieu', 'Organisateur (Nom)', 'Participants', 'Places Max', 'Catégorie', 'Statut', 'Date Création'];
        const csvRows = filteredActivities.map(activity => [
            escapeCSV(activity.id),
            escapeCSV(activity.title),
            escapeCSV(activity.date.toISOString()),
            escapeCSV(activity.location),
            escapeCSV(activity.organizer.name),
            escapeCSV(activity.participants.length),
            escapeCSV(activity.maxParticipants),
            escapeCSV(activity.category),
            escapeCSV(activity.status),
            escapeCSV(activity.createdAt.toISOString())
        ].join(','));

        const csvContent = [csvHeaders.join(','), ...csvRows].join('\n');

        const blob = new Blob([`\uFEFF${csvContent}`], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', 'export_activites.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="bg-white dark:bg-stone-800 p-6 rounded-lg shadow-md">
             <div className="flex flex-col sm:flex-row justify-between items-start mb-4 gap-4">
                <h3 className="text-xl font-semibold dark:text-stone-200">Gérer les Activités ({filteredActivities.length})</h3>
                <div className="w-full sm:w-auto flex flex-col sm:flex-row gap-2">
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value as any)}
                        className="block w-full px-3 py-2 border border-stone-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm dark:bg-stone-700 dark:border-stone-600 dark:text-stone-200"
                    >
                        <option value="all">Tous les statuts</option>
                        <option value="pending">En attente</option>
                        <option value="approved">Approuvées</option>
                    </select>
                     <button onClick={handleExportActivities} className="flex-shrink-0 inline-flex items-center justify-center px-4 py-2 border border-stone-300 text-sm font-medium rounded-md text-stone-700 bg-white hover:bg-stone-50 dark:bg-stone-700 dark:text-stone-300 dark:border-stone-600 dark:hover:bg-stone-600">
                        <DownloadIcon className="h-5 w-5 mr-2 -ml-1" />
                        Exporter
                    </button>
                </div>
            </div>
             <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-stone-200 dark:divide-stone-700">
                    <thead className="bg-stone-50 dark:bg-stone-700/50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider dark:text-stone-300">Activité</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider dark:text-stone-300">Organisateur</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider dark:text-stone-300">Date</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider dark:text-stone-300">Statut</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-stone-500 uppercase tracking-wider dark:text-stone-300">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-stone-200 dark:bg-stone-800 dark:divide-stone-700">
                        {filteredActivities.map(activity => (
                            <tr key={activity.id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0 h-10 w-10">
                                            <img className="h-10 w-10 rounded-md object-cover" src={activity.images[0]} alt={activity.title} />
                                        </div>
                                        <div className="ml-4">
                                            <div className="text-sm font-medium text-stone-900 dark:text-stone-200 truncate max-w-xs">{activity.title}</div>
                                            <div className="text-sm text-stone-500 dark:text-stone-400 truncate max-w-xs">{activity.location}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-stone-500 dark:text-stone-400">{activity.organizer.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-stone-500 dark:text-stone-400">{activity.date.toLocaleDateString()}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${activity.status === 'approved' ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300'}`}>
                                        {activity.status === 'approved' ? 'Approuvée' : 'En attente'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                    {activity.status === 'pending' && (
                                        <button onClick={() => onApproveActivity(activity.id)} title="Approuver" className="text-green-600 hover:text-green-900 dark:text-green-500 dark:hover:text-green-400 p-1 rounded-full hover:bg-green-100 dark:hover:bg-green-900/50">
                                            <CheckIcon className="h-5 w-5"/>
                                        </button>
                                    )}
                                    <button onClick={() => handleDelete(activity)} title="Supprimer" className="text-red-600 hover:text-red-900 dark:text-red-500 dark:hover:text-red-400 p-1 rounded-full hover:bg-red-100 dark:hover:bg-red-900/50">
                                        <TrashIcon className="h-5 w-5"/>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const AuditLogManagement: React.FC<{ logs: AuditLogEntry[] }> = ({ logs }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredLogs = useMemo(() => {
        if (!searchTerm) return logs;
        const lowerCaseSearch = searchTerm.toLowerCase();
        return logs.filter(log => 
            log.adminName.toLowerCase().includes(lowerCaseSearch) ||
            log.action.toLowerCase().includes(lowerCaseSearch) ||
            log.details.toLowerCase().includes(lowerCaseSearch) ||
            log.ipAddress.includes(lowerCaseSearch) ||
            log.targetId.includes(lowerCaseSearch)
        );
    }, [logs, searchTerm]);

    return (
        <div className="bg-white dark:bg-stone-800 p-6 rounded-lg shadow-md">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
                <h3 className="text-xl font-semibold dark:text-stone-200">Journal d'audit ({filteredLogs.length})</h3>
                <div className="relative w-full sm:w-auto">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <SearchIcon className="h-5 w-5 text-stone-400" />
                    </div>
                    <input 
                        type="text"
                        placeholder="Rechercher dans les logs..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="block w-full pl-10 pr-3 py-2 border border-stone-300 rounded-md leading-5 bg-white placeholder-stone-500 focus:outline-none focus:placeholder-stone-400 focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm dark:bg-stone-700 dark:border-stone-600 dark:text-stone-200"
                    />
                </div>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-stone-200 dark:divide-stone-700">
                    <thead className="bg-stone-50 dark:bg-stone-700/50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider dark:text-stone-300">Date</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider dark:text-stone-300">Admin</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider dark:text-stone-300">Action</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider dark:text-stone-300">Détails</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider dark:text-stone-300">IP</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider dark:text-stone-300">User Agent</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-stone-200 dark:bg-stone-800 dark:divide-stone-700">
                        {filteredLogs.map(log => (
                            <tr key={log.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-stone-500 dark:text-stone-400">
                                    {log.timestamp.toLocaleString('fr-FR')}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-stone-900 dark:text-stone-200">{log.adminName}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-stone-500 dark:text-stone-400">{log.action}</td>
                                <td className="px-6 py-4 whitespace-normal text-sm text-stone-700 dark:text-stone-300 max-w-sm">{log.details}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-stone-500 dark:text-stone-400">{log.ipAddress}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-stone-500 dark:text-stone-400 truncate max-w-xs">{log.userAgent}</td>
                            </tr>
                        ))}
                         {filteredLogs.length === 0 && (
                            <tr>
                                <td colSpan={6} className="text-center py-8 text-stone-500 dark:text-stone-400">
                                    Aucun log trouvé.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};


export const AdminPanel: React.FC<AdminPanelProps> = ({ users, activities, auditLogs, onDeleteUser, onDeleteActivity, onApproveActivity, onUpdateUserStatus, onUpdateUserRole, currentSection, setView, currentUser }) => {

    const renderContent = () => {
        switch (currentSection) {
            case 'users':
                return <UserManagement users={users} onUpdateUserStatus={onUpdateUserStatus} onDeleteUser={onDeleteUser} onUpdateUserRole={onUpdateUserRole} currentUser={currentUser} />;
            case 'activities':
                return <ActivityManagement activities={activities} onApproveActivity={onApproveActivity} onDeleteActivity={onDeleteActivity} />;
            case 'audit':
                return <AuditLogManagement logs={auditLogs} />;
            case 'dashboard':
            default:
                return <AdminDashboard users={users} activities={activities} />;
        }
    };
    
    const TabButton: React.FC<{ section: 'dashboard' | 'users' | 'activities' | 'audit'; label: string; icon: React.ReactNode }> = ({ section, label, icon }) => {
        const isActive = currentSection === section;
        return (
             <button
                onClick={() => setView({ type: 'ADMIN', section })}
                className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    isActive 
                    ? 'bg-primary text-white shadow-sm' 
                    : 'text-stone-600 hover:bg-stone-100 dark:text-stone-300 dark:hover:bg-stone-700'
                }`}
            >
                {icon}
                <span className="hidden sm:inline">{label}</span>
            </button>
        )
    }

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h2 className="text-3xl font-bold font-heading mb-6 dark:text-stone-100">Panneau d'administration</h2>
          <div className="mb-6">
            <div className="bg-white dark:bg-stone-800 p-2 rounded-xl shadow-sm inline-flex space-x-1">
                <TabButton section="dashboard" label="Tableau de bord" icon={<ChartBarIcon className="h-5 w-5"/>} />
                <TabButton section="users" label="Utilisateurs" icon={<UsersGroupIcon className="h-5 w-5"/>} />
                <TabButton section="activities" label="Activités" icon={<ClipboardListIcon className="h-5 w-5"/>} />
                <TabButton section="audit" label="Journal d'audit" icon={<ShieldCheckIcon className="h-5 w-5"/>} />
            </div>
          </div>
          {renderContent()}
        </div>
    );
};