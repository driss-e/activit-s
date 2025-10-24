// FIX: Replaced placeholder content with a functional App component to serve as the application root.
import React, { useState, useEffect } from 'react';
import type { User, Activity, View, Comment as CommentType, ProfileUpdateData } from './types';
import { LandingPage } from './components/LandingPage';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { ActivityDetail } from './components/ActivityDetail';
import { CreateActivityForm } from './components/CreateActivityForm';
import { AdminPanel } from './components/AdminPanel';
import { ProfilePage } from './components/ProfilePage';

// --- MOCK DATA ---
// In a real app, this would come from an API.
const MOCK_USERS: User[] = [
  { id: '1', name: 'Alice', email: 'alice@example.com', password: 'password', role: 'admin', isVerified: true, avatar: 'https://i.pravatar.cc/150?u=1', hobbies: 'Hiking, Reading', instagram: 'alice_hikes', facebook: 'alice.hiker' },
  { id: '2', name: 'Bob', email: 'bob@example.com', password: 'password', role: 'user', isVerified: true, avatar: 'https://i.pravatar.cc/150?u=2', gender: 'male' },
  { id: '3', name: 'Charlie', email: 'charlie@example.com', password: 'password', role: 'user', isVerified: false, avatar: 'https://i.pravatar.cc/150?u=3' },
];

const MOCK_ACTIVITIES: Activity[] = [
  {
    id: 'a1',
    title: 'Randonnée au Mont-Royal',
    description: 'Une belle randonnée pour profiter de la nature et de la vue sur la ville. Ouvert à tous les niveaux.',
    location: 'Parc du Mont-Royal, Montréal, QC',
    date: new Date(new Date().setDate(new Date().getDate() + 7)),
    image: 'https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&q=80&w=1470',
    maxParticipants: 15,
    participants: ['1'],
    organizer: { id: '1', name: 'Alice', avatar: 'https://i.pravatar.cc/150?u=1' },
    comments: [
      { id: 'c1', author: { id: '2', name: 'Bob', avatar: 'https://i.pravatar.cc/150?u=2' }, text: 'Super idée !', rating: 5, createdAt: new Date() },
    ],
  },
  {
    id: 'a2',
    title: 'Atelier de Poterie',
    description: 'Venez créer vos propres poteries dans une ambiance conviviale. Matériel fourni.',
    location: 'Atelier Créatif, 123 Rue des Arts, Montréal, QC',
    date: new Date(new Date().setDate(new Date().getDate() + 14)),
    image: 'https://images.unsplash.com/photo-1565253540443-de3a6c9d4b02?auto=format&fit=crop&q=80&w=1470',
    maxParticipants: 8,
    participants: ['2'],
    organizer: { id: '2', name: 'Bob', avatar: 'https://i.pravatar.cc/150?u=2' },
    comments: [],
  },
   {
    id: 'a3',
    title: 'Pique-nique au Parc Lafontaine',
    description: 'Rejoignez-nous pour un pique-nique décontracté. Apportez votre plat préféré à partager !',
    location: 'Parc Lafontaine, Montréal, QC',
    date: new Date(new Date().setDate(new Date().getDate() - 2)), // Past event
    image: 'https://images.unsplash.com/photo-1594950645472-3c13a2283a38?auto=format&fit=crop&q=80&w=1470',
    maxParticipants: 20,
    participants: ['1', '2'],
    organizer: { id: '1', name: 'Alice', avatar: 'https://i.pravatar.cc/150?u=1' },
    comments: [
        { id: 'c2', author: { id: '2', name: 'Bob', avatar: 'https://i.pravatar.cc/150?u=2' }, text: 'C\'était génial, merci Alice !', rating: 5, createdAt: new Date(new Date().setDate(new Date().getDate() - 1)) },
    ],
  }
];

// --- MAIN APP COMPONENT ---

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [activities, setActivities] = useState<Activity[]>(MOCK_ACTIVITIES);
  const [view, setView] = useState<View>({ type: 'DASHBOARD' });

  // Simulate session persistence
  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
  }, []);

  const persistUser = (user: User | null) => {
    if (user) {
      localStorage.setItem('currentUser', JSON.stringify(user));
    } else {
      localStorage.removeItem('currentUser');
    }
    setCurrentUser(user);
  };

  // --- HANDLERS ---
  
  // Auth
  const handleLogin = async (email: string, password?: string) => {
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
        if (!user.isVerified) {
            throw new Error('Veuillez vérifier votre adresse e-mail avant de vous connecter.');
        }
        persistUser(user);
        setView({ type: 'DASHBOARD' });
    } else {
        throw new Error('Email ou mot de passe invalide.');
    }
  };

  const handleRegister = async (name: string, email: string, password?: string) => {
    if (users.some(u => u.email === email)) {
        throw new Error('Un utilisateur avec cet email existe déjà.');
    }
    const newUser: User = {
        id: String(users.length + 1),
        name,
        email,
        password,
        role: 'user',
        isVerified: false,
        avatar: `https://i.pravatar.cc/150?u=${users.length + 1}`,
    };
    setUsers(prev => [...prev, newUser]);
  };
  
  const handleLogout = () => {
    persistUser(null);
    setView({ type: 'DASHBOARD' }); // Will redirect to LandingPage
  };

  const handleVerifyEmail = async (email: string) => {
    setUsers(prevUsers => prevUsers.map(u => u.email === email ? { ...u, isVerified: true } : u));
    alert('Email vérifié ! Vous pouvez maintenant vous connecter.');
  }

  const handleResendVerificationEmail = async (email: string) => {
    alert(`Un e-mail de vérification a été renvoyé à ${email}. (Simulation)`);
  }

  const handleForgotPasswordRequest = async (email: string): Promise<string> => {
    const user = users.find(u => u.email === email);
    if (user) {
      const token = `demo-token-for-${user.id}`;
      setUsers(prev => prev.map(u => u.id === user.id ? { ...u, passwordResetToken: token } : u));
      return token;
    }
    return ''; // Don't reveal if user exists
  }
  
  const handleResetPassword = async (token: string, newPassword: string): Promise<void> => {
    const userIndex = users.findIndex(u => u.passwordResetToken === token);
    if (userIndex > -1) {
      const updatedUsers = [...users];
      updatedUsers[userIndex] = { ...updatedUsers[userIndex], password: newPassword, passwordResetToken: null };
      setUsers(updatedUsers);
    } else {
      throw new Error('Jeton de réinitialisation invalide ou expiré.');
    }
  }


  // Activities
  const handleCreateActivity = (activityData: Omit<Activity, 'id' | 'participants' | 'comments'>) => {
    const newActivity: Activity = {
      ...activityData,
      id: `a${Date.now()}`,
      participants: [],
      comments: [],
    };
    setActivities(prev => [newActivity, ...prev]);
    setView({ type: 'DASHBOARD' });
  };
  
  const handleJoinActivity = (activityId: string, userId: string) => {
    setActivities(prev => prev.map(act => 
      act.id === activityId 
        ? { ...act, participants: [...act.participants, userId] } 
        : act
    ));
  };
  
  const handleLeaveActivity = (activityId: string, userId: string) => {
     setActivities(prev => prev.map(act => 
      act.id === activityId 
        ? { ...act, participants: act.participants.filter(pId => pId !== userId) } 
        : act
    ));
  };

  const handleAddComment = (activityId: string, commentData: Omit<CommentType, 'id' | 'createdAt'>) => {
    const newComment: CommentType = {
        ...commentData,
        id: `c${Date.now()}`,
        createdAt: new Date(),
    }
    setActivities(prev => prev.map(act =>
        act.id === activityId
            ? { ...act, comments: [...act.comments, newComment] }
            : act
    ));
  };
  
  const handleUpdateProfile = (userId: string, data: ProfileUpdateData) => {
    const updateUser = (users: User[]) => users.map(u => u.id === userId ? {...u, ...data} : u);
    setUsers(updateUser);
    if (currentUser?.id === userId) {
      persistUser({...currentUser, ...data});
    }
  };


  // Admin
  const handleDeleteUser = (userId: string) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ?")) {
      setUsers(prev => prev.filter(u => u.id !== userId));
    }
  }
  
  const handleDeleteActivity = (activityId: string) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette activité ?")) {
      setActivities(prev => prev.filter(a => a.id !== activityId));
    }
  }

  const handleCreateActivityAdmin = (activityData: Omit<Activity, 'id' | 'participants' | 'comments'>, onSuccess?: () => void) => {
    handleCreateActivity(activityData);
    onSuccess?.();
  };

  const handleUpdateUserRole = (userId: string, newRole: 'user' | 'admin') => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
  };
  

  // --- RENDER LOGIC ---

  if (!currentUser) {
    return <LandingPage 
      onLogin={handleLogin} 
      onRegister={handleRegister} 
      onVerifyEmail={handleVerifyEmail}
      onResendVerificationEmail={handleResendVerificationEmail}
      onForgotPasswordRequest={handleForgotPasswordRequest}
      onResetPassword={handleResetPassword}
    />;
  }

  const renderView = () => {
    switch (view.type) {
      case 'DASHBOARD':
        return <Dashboard activities={activities} setView={setView} />;
      case 'ACTIVITY_DETAIL':
        const activity = activities.find(a => a.id === view.activityId);
        return activity ? <ActivityDetail 
          activity={activity} 
          currentUser={currentUser} 
          users={users}
          onJoin={handleJoinActivity}
          onLeave={handleLeaveActivity}
          onAddComment={handleAddComment}
          onBack={() => setView({ type: 'DASHBOARD' })}
        /> : <div>Activité non trouvée.</div>;
      case 'CREATE_ACTIVITY':
        return <CreateActivityForm 
          currentUser={currentUser} 
          onCreateActivity={handleCreateActivity} 
          onCancel={() => setView({ type: 'DASHBOARD' })}
        />;
      case 'ADMIN_PANEL':
        if (currentUser.role !== 'admin') return <div>Accès refusé.</div>;
        return <AdminPanel 
          users={users}
          activities={activities}
          currentUser={currentUser}
          onDeleteUser={handleDeleteUser}
          onDeleteActivity={handleDeleteActivity}
          onCreateActivity={handleCreateActivityAdmin}
          onUpdateUserRole={handleUpdateUserRole}
          onResendVerificationEmail={handleResendVerificationEmail}
        />
      case 'PROFILE':
        return <ProfilePage 
          currentUser={currentUser}
          onUpdateProfile={handleUpdateProfile}
          onBack={() => setView({ type: 'DASHBOARD' })}
        />
      default:
        return <Dashboard activities={activities} setView={setView} />;
    }
  };

  return (
    <div className="bg-light font-sans">
      <Header currentUser={currentUser} onLogout={handleLogout} setView={setView} />
      <main>
        {renderView()}
      </main>
    </div>
  );
};

export default App;
