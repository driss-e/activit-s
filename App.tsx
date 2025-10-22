import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { ActivityDetail } from './components/ActivityDetail';
import { CreateActivityForm } from './components/CreateActivityForm';
import { AdminPanel } from './components/AdminPanel';
import type { Activity, User, View, Comment } from './types';

// --- MOCK DATA ---
const MOCK_USERS: User[] = [
    { id: '1', name: 'Alice', avatar: 'https://picsum.photos/seed/alice/100/100', role: 'user' },
    { id: '2', name: 'Bob (Admin)', avatar: 'https://picsum.photos/seed/bob/100/100', role: 'admin' },
    { id: '3', name: 'Charlie', avatar: 'https://picsum.photos/seed/charlie/100/100', role: 'user' },
    { id: '4', name: 'Diana', avatar: 'https://picsum.photos/seed/diana/100/100', role: 'user' },
];

const MOCK_ACTIVITIES: Activity[] = [
  {
    id: 'act1',
    title: 'Randonnée au Pic Saint-Loup',
    description: 'Une superbe randonnée pour admirer le lever du soleil depuis le sommet du Pic Saint-Loup. Prévoir de bonnes chaussures et de l\'eau. Niveau intermédiaire.',
    location: 'Pic Saint-Loup, Occitanie',
    date: new Date('2024-08-15T06:00:00'),
    image: 'https://picsum.photos/seed/hike/800/600',
    maxParticipants: 15,
    participants: ['1', '3'],
    organizer: MOCK_USERS[1],
    comments: [
        { id: 'c1', author: MOCK_USERS[0], text: 'Superbe vue, j\'ai adoré !', rating: 5, createdAt: new Date('2024-07-10T10:00:00') },
        { id: 'c2', author: MOCK_USERS[2], text: 'Un peu difficile mais ça valait le coup.', rating: 4, createdAt: new Date('2024-07-11T12:30:00') },
    ],
  },
  {
    id: 'act2',
    title: 'Pique-nique et Pétanque au parc',
    description: 'Rejoignez-nous pour un après-midi détente au Parc Monceau. Apportez quelque chose à partager et votre meilleure triplette !',
    location: 'Parc Monceau, Paris',
    date: new Date('2024-08-20T12:30:00'),
    image: 'https://picsum.photos/seed/picnic/800/600',
    maxParticipants: 20,
    participants: ['4'],
    organizer: MOCK_USERS[3],
    comments: [],
  },
  {
    id: 'act3',
    title: 'Visite du Musée du Louvre',
    description: 'Exploration des collections permanentes du Louvre. Rendez-vous devant la Pyramide. Billet à prendre en avance.',
    location: 'Musée du Louvre, Paris',
    date: new Date('2024-09-05T14:00:00'),
    image: 'https://picsum.photos/seed/museum/800/600',
    maxParticipants: 10,
    participants: ['1', '2', '3', '4'],
    organizer: MOCK_USERS[0],
    comments: [],
  },
];


function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activities, setActivities] = useState<Activity[]>(MOCK_ACTIVITIES);
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [view, setView] = useState<View>({ type: 'DASHBOARD' });

  const handleLogin = useCallback((user: User) => {
    setCurrentUser(user);
  }, []);

  const handleLogout = useCallback(() => {
    setCurrentUser(null);
  }, []);

  const handleCreateActivity = useCallback((newActivityData: Omit<Activity, 'id' | 'participants' | 'comments'>) => {
    const newActivity: Activity = {
      ...newActivityData,
      id: `act_${Date.now()}`,
      participants: [],
      comments: [],
    };
    setActivities(prev => [newActivity, ...prev]);
    setView({ type: 'DASHBOARD' });
  }, []);

  const handleJoinActivity = useCallback((activityId: string, userId: string) => {
    setActivities(prev => prev.map(act => 
      act.id === activityId && !act.participants.includes(userId) && act.participants.length < act.maxParticipants
        ? { ...act, participants: [...act.participants, userId] }
        : act
    ));
  }, []);

  const handleLeaveActivity = useCallback((activityId: string, userId: string) => {
    setActivities(prev => prev.map(act => 
      act.id === activityId
        ? { ...act, participants: act.participants.filter(pId => pId !== userId) }
        : act
    ));
  }, []);

  const handleAddComment = useCallback((activityId: string, commentData: Omit<Comment, 'id' | 'createdAt'>) => {
    const newComment: Comment = {
      ...commentData,
      id: `c_${Date.now()}`,
      createdAt: new Date(),
    };
    setActivities(prev => prev.map(act =>
      act.id === activityId
        ? { ...act, comments: [...act.comments, newComment] }
        : act
    ));
  }, []);

  const handleDeleteUser = useCallback((userId: string) => {
    const organizedActivities = activities.filter(act => act.organizer.id === userId);
    let confirmMessage = "Êtes-vous sûr de vouloir supprimer cet utilisateur ? Cette action est irréversible.";

    if (organizedActivities.length > 0) {
        confirmMessage += `\n\nAttention : Cet utilisateur organise ${organizedActivities.length} activité(s). La suppression de cet utilisateur entraînera également la suppression de ces activités.`;
    }

    if (window.confirm(confirmMessage)) {
      setUsers(prev => prev.filter(u => u.id !== userId));
      
      setActivities(prev => 
        prev
          .filter(act => act.organizer.id !== userId) 
          .map(act => ({
            ...act,
            participants: act.participants.filter(pId => pId !== userId)
          }))
      );

      if (currentUser?.id === userId) {
        handleLogout();
      }
    }
  }, [activities, currentUser, handleLogout]);

  const handleDeleteActivity = useCallback((activityId: string) => {
     if (window.confirm("Êtes-vous sûr de vouloir supprimer cette activité ?")) {
       setActivities(prev => prev.filter(act => act.id !== activityId));
     }
  }, []);

  const renderContent = () => {
    switch (view.type) {
      case 'ACTIVITY_DETAIL':
        const activity = activities.find(act => act.id === view.activityId);
        if (!activity) {
          return <div className="text-center p-8">Activité non trouvée.</div>;
        }
        return <ActivityDetail
                  activity={activity}
                  currentUser={currentUser}
                  users={users}
                  onJoin={handleJoinActivity}
                  onLeave={handleLeaveActivity}
                  onAddComment={handleAddComment}
                  onBack={() => setView({type: 'DASHBOARD'})}
                />;
      case 'CREATE_ACTIVITY':
        return <CreateActivityForm
                  currentUser={currentUser}
                  onCreateActivity={handleCreateActivity}
                  setView={setView}
                />;
      case 'ADMIN_PANEL':
        if(currentUser?.role !== 'admin') {
            return <div className="text-center p-8">Accès refusé.</div>
        }
        return <AdminPanel 
                  users={users} 
                  activities={activities} 
                  onDeleteUser={handleDeleteUser} 
                  onDeleteActivity={handleDeleteActivity}
                />;
      case 'DASHBOARD':
      default:
        return <Dashboard activities={activities} setView={setView} />;
    }
  };

  return (
    <div className="min-h-screen bg-light">
      <Header 
        currentUser={currentUser}
        onLogin={handleLogin}
        onLogout={handleLogout}
        setView={setView}
      />
      <main>
        {renderContent()}
      </main>
      <footer className="bg-white mt-12 py-4 border-t">
        <div className="container mx-auto px-4 text-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} SortieEnsemble. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
