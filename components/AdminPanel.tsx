import React, { useState } from 'react';
import type { Activity, User } from '../types';
import { CreateActivityForm } from './CreateActivityForm';
import { PlusIcon } from './icons';

interface AdminPanelProps {
  users: User[];
  activities: Activity[];
  currentUser: User | null;
  onDeleteUser: (userId: string) => void;
  onDeleteActivity: (activityId: string) => void;
  onCreateActivity: (activity: Omit<Activity, 'id' | 'participants' | 'comments'>, onSuccess?: () => void) => void;
  onUpdateUserRole: (userId: string, newRole: 'user' | 'admin') => void;
  onResendVerificationEmail: (email: string) => Promise<void>;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ users, activities, onDeleteUser, onDeleteActivity, onCreateActivity, currentUser, onUpdateUserRole, onResendVerificationEmail }) => {
  const [isCreating, setIsCreating] = useState(false);
  const [notification, setNotification] = useState('');

  const handleResendVerification = async (email: string) => {
    await onResendVerificationEmail(email);
    setNotification(`E-mail de vérification renvoyé à ${email}.`);
    setTimeout(() => setNotification(''), 4000);
  };

  if (isCreating) {
    return (
      <CreateActivityForm
        currentUser={currentUser}
        onCreateActivity={(activityData) => {
          onCreateActivity(activityData, () => setIsCreating(false));
        }}
        onCancel={() => setIsCreating(false)}
      />
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h2 className="text-3xl font-bold tracking-tight text-gray-900 mb-4">Panneau d'administration</h2>
      
      {notification && (
        <div className="mb-4 p-3 bg-green-100 text-green-800 rounded-md transition-opacity duration-300">
            {notification}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Users Section */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4">Utilisateurs ({users.length})</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rôle</th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map(user => (
                  <tr key={user.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <img className="h-10 w-10 rounded-full" src={user.avatar} alt={user.name} />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{user.name}</div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {user.isVerified ? (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          Vérifié
                        </span>
                      ) : (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                          Non vérifié
                        </span>
                      )}
                    </td>
                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <select
                        value={user.role}
                        onChange={(e) => onUpdateUserRole(user.id, e.target.value as 'user' | 'admin')}
                        disabled={user.id === currentUser?.id}
                        className="block w-full pl-3 pr-10 py-1 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md disabled:bg-gray-100 disabled:cursor-not-allowed"
                      >
                        <option value="user">Utilisateur</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-3">
                        {!user.isVerified && (
                          <button 
                            onClick={() => handleResendVerification(user.email)} 
                            className="text-indigo-600 hover:text-indigo-900 text-xs"
                          >
                            Renvoyer la vérification
                          </button>
                        )}
                        {user.id !== currentUser?.id && (
                          <button onClick={() => onDeleteUser(user.id)} className="text-red-600 hover:text-red-900">Supprimer</button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Activities Section */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">Activités ({activities.length})</h3>
            <button
              onClick={() => setIsCreating(true)}
              className="flex items-center gap-2 px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-focus"
            >
              <PlusIcon className="h-4 w-4" />
              Ajouter
            </button>
          </div>
           <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Titre</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Participants</th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {activities.map(activity => (
                  <tr key={activity.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{activity.title}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{activity.participants.length} / {activity.maxParticipants}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button onClick={() => onDeleteActivity(activity.id)} className="text-red-600 hover:text-red-900">Supprimer</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};