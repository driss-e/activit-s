import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { ActivityDetail } from './components/ActivityDetail';
import { CreateActivityForm } from './components/CreateActivityForm';
import { AdminPanel } from './components/AdminPanel';
import { LandingPage } from './components/LandingPage';
import { AuthModal } from './components/LoginModal';
import type { Activity, User, View, Comment } from './types';

// --- MOCK DATA ---
const MOCK_USERS: User[] = [
    { id: '1', name: 'Alice', email: 'alice@example.com', password: 'password', avatar: 'https://picsum.photos/seed/alice/100/100', role: 'user' },
    { id: '2', name: 'Bob (Admin)', email: 'admin@example.com', password: 'admin', avatar: 'https://picsum.photos/seed/bob/100/100', role: 'admin' },
    { id: '3', name: 'Charlie', email: 'charlie@example.com', password: 'password', avatar: 'https://picsum.photos/seed/charlie/100/100', role: 'user' },
    { id: '4', name: 'Diana', email: 'diana@example.com', password: 'password', avatar: 'https://picsum.photos/seed/diana/100/100', role: 'user' },
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
  const [isAuthModalOpen, setAuthModalOpen] = useState(false);
  const [initialAuthMode, setInitialAuthMode] = useState<'login' | 'register'>('login');

  const handleLogin = useCallback((user: User) => {
    setCurrentUser(user);
    if (user.role === 'admin') {
      setView({ type: 'ADMIN_PANEL' });
    } else {
      setView({ type: 'DASHBOARD' });
    }
  }, []);

  const handleRegister = useCallback((newUser: Omit<User, 'id' | 'avatar' | 'role'>) => {
    const user: User = {
      ...newUser,
      id: `user_${Date.now()}`,
      avatar: `https://picsum.photos/seed/${newUser.name}/100/100`,
      role: 'user',
    };
    setUsers(prev => [...prev, user]);
    setCurrentUser(user);
    setView({ type: 'DASHBOARD' });
  }, []);

  const handleLogout = useCallback(() => {
    setCurrentUser(null);
    setView({ type: 'DASHBOARD' });
  }, []);

  const handleOpenLogin = () => {
    setInitialAuthMode('login');
    setAuthModalOpen(true);
  };
  const handleOpenRegister = () => {
    setInitialAuthMode('register');
    setAuthModalOpen(true);
  };

  const handleCreateActivity = useCallback((newActivityData: Omit<Activity, 'id' | 'participants' | 'comments'>, onSuccess?: () => void) => {
    const newActivity: Activity = {
      ...newActivityData,
      id: `act_${Date.now()}`,
      participants: [],
      comments: [],
    };
    setActivities(prev => [newActivity, ...prev]);
    if (onSuccess) {
      onSuccess();
    } else {
      setView({ type: 'DASHBOARD' });
    }
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
            participants: act.participants.filter(pId => pId !== userId),
            comments: act.comments.filter(comment => comment.author.id !== userId)
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

  if (!currentUser) {
    return (
      <>
        <LandingPage onLoginClick={handleOpenLogin} onRegisterClick={handleOpenRegister} />
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setAuthModalOpen(false)}
          onLogin={handleLogin}
          onRegister={handleRegister}
          users={users}
          initialMode={initialAuthMode}
        />
      </>
    );
  }

  const renderContent = () => {
    switch (view.type) {
      case 'ACTIVITY_DETAIL':
        const activity = activities.find(act => act.id === view.activityId);
        if (!activity) {
          setView({ type: 'DASHBOARD' });
          return null;
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
                  onCancel={() => setView({type: 'DASHBOARD'})}
                />;
      case 'ADMIN_PANEL':
        if(currentUser?.role !== 'admin') {
            setView({ type: 'DASHBOARD' });
            return <div className="text-center p-8">Accès refusé.</div>
        }
        return <AdminPanel 
                  users={users} 
                  activities={activities} 
                  onDeleteUser={handleDeleteUser} 
                  onDeleteActivity={handleDeleteActivity}
                  onCreateActivity={handleCreateActivity}
                  currentUser={currentUser}
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