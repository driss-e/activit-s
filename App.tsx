import React, { useState, useEffect, useMemo } from 'react';
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

const createMockActivities = (): Activity[] => {
    const activities: Activity[] = [];
    for (let i = 0; i < 20; i++) {
        const date = new Date();
        date.setDate(date.getDate() + (i * 2) - 5); // Spread dates around today
        const participantsCount = Math.floor(Math.random() * 10);
        activities.push({
            id: `a${i + 1}`,
            title: `Activité #${i + 1}: ${['Découverte', 'Atelier', 'Sortie', 'Rencontre'][i % 4]}`,
            description: `Description de l'activité #${i + 1}. Une expérience unique à ne pas manquer.`,
            location: ['Parc Lafontaine', 'Mont-Royal', 'Vieux-Port', 'Plateau Mont-Royal'][i % 4] + ', Montréal',
            date: date,
            image: `https://picsum.photos/seed/${i + 1}/600/400`,
            maxParticipants: 10,
            participants: Array.from({ length: participantsCount }, (_, k) => String((k % 3) + 1)),
            organizer: { id: '1', name: 'Alice', avatar: 'https://i.pravatar.cc/150?u=1' },
            comments: [],
        });
    }
    return activities.sort((a,b) => b.date.getTime() - a.date.getTime());
}


// --- MAIN APP COMPONENT ---

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [activities, setActivities] = useState<Activity[]>(createMockActivities());
  const [view, setView] = useState<View>({ type: 'DASHBOARD' });
  
  // State for search, filter and pagination
  const [searchQuery, setSearchQuery] = useState('');
  const [filterNext7Days, setFilterNext7Days] = useState(false);
  const [visibleActivitiesCount, setVisibleActivitiesCount] = useState(8);

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
    setActivities(prev => [newActivity, ...prev].sort((a, b) => b.date.getTime() - a.date.getTime()));
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

  const handleLoadMore = () => {
    setVisibleActivitiesCount(prev => prev + 8);
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
  
  const filteredActivities = useMemo(() => {
    let result = activities;

    if (searchQuery) {
        result = result.filter(activity =>
            activity.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            activity.description.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }
    
    if (filterNext7Days) {
        const now = new Date();
        const oneWeekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
        result = result.filter(activity => {
            const activityDate = new Date(activity.date);
            return activityDate >= now && activityDate <= oneWeekFromNow;
        });
    }

    return result;
  }, [activities, searchQuery, filterNext7Days]);


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
        const visibleActivities = filteredActivities.slice(0, visibleActivitiesCount);
        return <Dashboard 
            activities={visibleActivities} 
            setView={setView} 
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            filterNext7Days={filterNext7Days}
            setFilterNext7Days={setFilterNext7Days}
            onLoadMore={handleLoadMore}
            hasMore={visibleActivitiesCount < filteredActivities.length}
        />;
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
        return <Dashboard 
            activities={filteredActivities.slice(0, visibleActivitiesCount)} 
            setView={setView}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            filterNext7Days={filterNext7Days}
            setFilterNext7Days={setFilterNext7Days}
            onLoadMore={handleLoadMore}
            hasMore={visibleActivitiesCount < filteredActivities.length}
         />;
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