import React, { useState } from 'react';
import type { User, Activity, View, Comment as CommentType } from './types';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { ActivityDetail } from './components/ActivityDetail';
import { CreateActivityForm } from './components/CreateActivityForm';
import { AdminPanel } from './components/AdminPanel';
import { LandingPage } from './components/LandingPage';
import { ProfilePage } from './components/ProfilePage';

// --- DUMMY DATA ---
// A simple UUID generator
const uuid = () => `id_${Math.random().toString(36).substr(2, 9)}`;

const DUMMY_USERS: User[] = [
  { id: 'user_1', name: 'Alice', avatar: `https://i.pravatar.cc/150?u=user_1`, role: 'user', email: 'alice@example.com', password: 'password', passwordResetToken: null, passwordResetExpires: null, isVerified: true },
  { id: 'user_2', name: 'Bob', avatar: `https://i.pravatar.cc/150?u=user_2`, role: 'user', email: 'bob@example.com', password: 'password', passwordResetToken: null, passwordResetExpires: null, isVerified: true },
  { id: 'user_3', name: 'Charlie', avatar: `https://i.pravatar.cc/150?u=user_3`, role: 'admin', email: 'admin@example.com', password: 'admin', passwordResetToken: null, passwordResetExpires: null, isVerified: true },
  { id: 'user_4', name: 'Diana', avatar: `https://i.pravatar.cc/150?u=user_4`, role: 'user', email: 'diana@example.com', password: 'password', passwordResetToken: null, passwordResetExpires: null, isVerified: true },
];

const DUMMY_ACTIVITIES: Activity[] = [
  {
    id: 'activity_1',
    title: 'Randonnée au Mont-Royal',
    description: 'Une belle randonnée pour profiter du grand air et de la vue sur la ville. Ouvert à tous les niveaux. N\'oubliez pas vos bouteilles d\'eau !',
    location: 'Parc du Mont-Royal, Montréal',
    date: new Date(new Date().setDate(new Date().getDate() + 7)),
    image: 'https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&q=80&w=1470',
    maxParticipants: 15,
    participants: ['user_1', 'user_3'],
    organizer: { id: 'user_3', name: 'Charlie', avatar: DUMMY_USERS[2].avatar },
    comments: [
      { id: uuid(), author: { id: 'user_1', name: 'Alice', avatar: DUMMY_USERS[0].avatar }, text: 'Super idée, j\'ai hâte !', rating: 5, createdAt: new Date() },
    ],
  },
  {
    id: 'activity_2',
    title: 'Soirée jeux de société',
    description: 'Venez découvrir de nouveaux jeux ou rejouer à vos classiques préférés. Apportez vos snacks à partager !',
    location: 'Café Ludik, 456 Rue Imaginaire',
    date: new Date(new Date().setDate(new Date().getDate() + 10)),
    image: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&q=80&w=1470',
    maxParticipants: 8,
    participants: [],
    organizer: { id: 'user_2', name: 'Bob', avatar: DUMMY_USERS[1].avatar },
    comments: [],
  },
   {
    id: 'activity_3',
    title: 'Atelier de poterie',
    description: 'Mettez les mains à la pâte et créez votre propre poterie. Aucun prérequis nécessaire, juste de la bonne humeur !',
    location: 'Studio Argile, 789 Avenue des Arts',
    date: new Date(new Date().setDate(new Date().getDate() + 12)),
    image: 'https://images.unsplash.com/photo-1512101037431-7ee1764bd4d1?auto=format&fit=crop&q=80&w=1470',
    maxParticipants: 10,
    participants: ['user_4'],
    organizer: { id: 'user_1', name: 'Alice', avatar: DUMMY_USERS[0].avatar },
    comments: [],
  },
  {
    id: 'activity_4',
    title: 'Cinéma en plein air',
    description: 'Projection du film "Le Fabuleux Destin d\'Amélie Poulain" sous les étoiles. Apportez vos chaises et couvertures.',
    location: 'Parc La Fontaine',
    date: new Date(new Date().setDate(new Date().getDate() + 15)),
    image: 'https://images.unsplash.com/photo-1543485885-8451128362a9?auto=format&fit=crop&q=80&w=1470',
    maxParticipants: 50,
    participants: ['user_1', 'user_2', 'user_4'],
    organizer: { id: 'user_3', name: 'Charlie', avatar: DUMMY_USERS[2].avatar },
    comments: [],
  },
  {
    id: 'activity_5',
    title: 'Cours de cuisine italienne',
    description: 'Apprenez à faire des pâtes fraîches et un tiramisu authentique avec un vrai chef italien.',
    location: 'La Cucina, 101 Rue de la Gastronomie',
    date: new Date(new Date().setDate(new Date().getDate() + 20)),
    image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&q=80&w=1470',
    maxParticipants: 12,
    participants: [],
    organizer: { id: 'user_2', name: 'Bob', avatar: DUMMY_USERS[1].avatar },
    comments: [],
  },
  {
    id: 'activity_6',
    title: 'Visite guidée du Vieux-Port',
    description: 'Découvrez l\'histoire fascinante du Vieux-Port de Montréal avec un guide passionné.',
    location: 'Vieux-Port de Montréal',
    date: new Date(new Date().setDate(new Date().getDate() + 25)),
    image: 'https://images.unsplash.com/photo-1598053222168-5452f1e6ead5?auto=format&fit=crop&q=80&w=1471',
    maxParticipants: 20,
    participants: ['user_1'],
    organizer: { id: 'user_4', name: 'Diana', avatar: DUMMY_USERS[3].avatar },
    comments: [],
  },
];
// --- END DUMMY DATA ---

const ACTIVITIES_PER_PAGE = 3;

const App: React.FC = () => {
  const [users, setUsers] = useState<User[]>(DUMMY_USERS);
  const [activities, setActivities] = useState<Activity[]>(DUMMY_ACTIVITIES);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [view, setView] = useState<View>({ type: 'DASHBOARD' });
  const [visibleActivitiesCount, setVisibleActivitiesCount] = useState(ACTIVITIES_PER_PAGE);

  const handleLogin = (email: string, password?: string): Promise<void> => {
    return new Promise((resolve, reject) => {
        const user = users.find(u => u.email === email && u.password === password);
        if (user) {
          if (!user.isVerified) {
            reject(new Error("Veuillez vérifier votre adresse e-mail avant de vous connecter."));
            return;
          }
          setCurrentUser(user);
          if (user.role === 'admin') {
            setView({ type: 'ADMIN_PANEL' });
          } else {
            setView({ type: 'DASHBOARD' });
          }
          resolve();
        } else {
          reject(new Error("Email ou mot de passe incorrect."));
        }
    });
  };

  const handleRegister = (name: string, email: string, password?: string): Promise<void> => {
      return new Promise((resolve, reject) => {
        if (users.some(u => u.email === email)) {
            reject(new Error("Un utilisateur avec cet email existe déjà."));
            return;
        }

        const newUser: User = {
            id: uuid(),
            name,
            email,
            password,
            avatar: `https://i.pravatar.cc/150?u=${uuid()}`,
            role: 'user',
            isVerified: false,
            verificationToken: `verify_${uuid()}`
        };
        // In a real app, you would send an email with the verification link here.
        console.log(`Verification token for ${email}: ${newUser.verificationToken}`);
        setUsers(prev => [...prev, newUser]);
        resolve();
      });
  };
  
  const handleResendVerificationEmail = (email: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      setUsers(currentUsers => {
        const userIndex = currentUsers.findIndex(u => u.email === email);
        if (userIndex !== -1 && !currentUsers[userIndex].isVerified) {
          const updatedUsers = [...currentUsers];
          const newVerificationToken = `verify_${uuid()}`;
          updatedUsers[userIndex] = { ...updatedUsers[userIndex], verificationToken: newVerificationToken };
          console.log(`NEW Verification token for ${email}: ${newVerificationToken}`);
          return updatedUsers;
        }
        return currentUsers;
      });
      resolve();
    });
  };
  
  // This is a demo-only function to simulate clicking the email link
  const handleVerifyEmail = (email: string): Promise<void> => {
      return new Promise((resolve, reject) => {
        let verifiedUser: User | null = null;
        setUsers(currentUsers => {
          const userIndex = currentUsers.findIndex(u => u.email === email);
          if (userIndex !== -1) {
            const updatedUsers = [...currentUsers];
            verifiedUser = { ...updatedUsers[userIndex], isVerified: true, verificationToken: null };
            updatedUsers[userIndex] = verifiedUser;
            return updatedUsers;
          }
          return currentUsers;
        });
        
        if (verifiedUser) {
          setCurrentUser(verifiedUser);
          setView({ type: 'DASHBOARD' });
          resolve();
        } else {
          reject(new Error("Utilisateur non trouvé."));
        }
      });
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setView({ type: 'DASHBOARD' });
  };
  
  const handleForgotPasswordRequest = (email: string): Promise<string> => {
    return new Promise((resolve) => {
      let token = '';
      setUsers(prevUsers => {
          const userIndex = prevUsers.findIndex(u => u.email === email);
          if (userIndex !== -1) {
              token = `reset_${uuid()}`;
              const expires = new Date(Date.now() + 3600 * 1000); // 1 hour expiration
              const updatedUsers = [...prevUsers];
              updatedUsers[userIndex] = {
                  ...updatedUsers[userIndex],
                  passwordResetToken: token,
                  passwordResetExpires: expires,
              };
              return updatedUsers;
          }
          return prevUsers; // User not found, do nothing to prevent email enumeration
      });
      // In a real app, you'd email the link with the token here.
      // We resolve regardless to show a consistent message to the user.
      resolve(token);
    });
  };

  const handleResetPassword = (token: string, newPassword: string): Promise<void> => {
    return new Promise((resolve, reject) => {
        let userFound = false;
        setUsers(prevUsers => {
            const userIndex = prevUsers.findIndex(u => u.passwordResetToken === token);

            if (userIndex === -1) {
                return prevUsers; // Return original state, reject will be called after
            }
            
            const user = prevUsers[userIndex];
            if (!user.passwordResetExpires || new Date() > user.passwordResetExpires) {
                // Token expired, clear it
                const updatedUsers = [...prevUsers];
                 updatedUsers[userIndex] = { ...user, passwordResetToken: null, passwordResetExpires: null };
                 return updatedUsers;
            }

            userFound = true;
            const updatedUsers = [...prevUsers];
            updatedUsers[userIndex] = {
                ...user,
                password: newPassword,
                passwordResetToken: null,
                passwordResetExpires: null,
            };
            return updatedUsers;
        });

        if (userFound) {
            resolve();
        } else {
            reject(new Error("Le jeton de réinitialisation est invalide ou a expiré."));
        }
    });
  };

  const handleUpdateProfile = (userId: string, newName: string, newAvatar: string) => {
    let updatedUser: User | undefined;
    setUsers(prevUsers => prevUsers.map(user => {
      if (user.id === userId) {
        updatedUser = { ...user, name: newName, avatar: newAvatar };
        return updatedUser;
      }
      return user;
    }));

    if (currentUser?.id === userId && updatedUser) {
      setCurrentUser(updatedUser);
    }

    setActivities(prevActivities => prevActivities.map(activity => {
      const updatedActivity = { ...activity };
      if (activity.organizer.id === userId) {
        updatedActivity.organizer = { id: userId, name: newName, avatar: newAvatar };
      }
      updatedActivity.comments = activity.comments.map(comment => {
        if (comment.author.id === userId) {
          return { ...comment, author: { id: userId, name: newName, avatar: newAvatar } };
        }
        return comment;
      });
      return updatedActivity;
    }));
  };

  const handleUpdateUserRole = (userId: string, newRole: 'user' | 'admin') => {
    setUsers(prevUsers =>
      prevUsers.map(user =>
        user.id === userId ? { ...user, role: newRole } : user
      )
    );
  };

  const handleJoinActivity = (activityId: string, userId: string) => {
    setActivities(prev =>
      prev.map(act =>
        act.id === activityId && act.participants.length < act.maxParticipants && !act.participants.includes(userId)
          ? { ...act, participants: [...act.participants, userId] }
          : act
      )
    );
  };

  const handleLeaveActivity = (activityId: string, userId: string) => {
    setActivities(prev =>
      prev.map(act =>
        act.id === activityId
          ? { ...act, participants: act.participants.filter(pId => pId !== userId) }
          : act
      )
    );
  };

  const handleAddComment = (activityId: string, comment: Omit<CommentType, 'id' | 'createdAt'>) => {
    setActivities(prev =>
      prev.map(act =>
        act.id === activityId
          ? { ...act, comments: [...act.comments, { ...comment, id: uuid(), createdAt: new Date() }] }
          : act
      )
    );
  };

  const handleCreateActivity = (activityData: Omit<Activity, 'id' | 'participants' | 'comments'>, onSuccess?: () => void) => {
      const newActivity: Activity = {
        ...activityData,
        id: uuid(),
        participants: [],
        comments: [],
      };
      setActivities(prev => [newActivity, ...prev]);
      setView({ type: 'DASHBOARD' });
      onSuccess?.();
  };
  
  const handleDeleteUser = (userId: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
        setUsers(prev => prev.filter(u => u.id !== userId));
        setActivities(prev => prev.map(act => ({
            ...act,
            participants: act.participants.filter(pId => pId !== userId),
            comments: act.comments.filter(c => c.author.id !== userId)
        })));
    }
  };
  
  const handleDeleteActivity = (activityId: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette activité ?')) {
        setActivities(prev => prev.filter(act => act.id !== activityId));
    }
  };
  
  const handleLoadMoreActivities = () => {
    setVisibleActivitiesCount(prev => prev + ACTIVITIES_PER_PAGE);
  };

  if (!currentUser) {
    return (
      <LandingPage 
        onLogin={handleLogin} 
        onRegister={handleRegister} 
        onForgotPasswordRequest={handleForgotPasswordRequest}
        onResetPassword={handleResetPassword}
        onResendVerificationEmail={handleResendVerificationEmail}
        onVerifyEmail={handleVerifyEmail}
      />
    );
  }

  const renderContent = () => {
    switch (view.type) {
      case 'DASHBOARD':
        const visibleActivities = activities.slice(0, visibleActivitiesCount);
        const hasMoreActivities = visibleActivitiesCount < activities.length;
        return <Dashboard 
          activities={visibleActivities} 
          setView={setView} 
          onLoadMore={handleLoadMoreActivities}
          hasMore={hasMoreActivities}
        />;
      case 'ACTIVITY_DETAIL':
        const activity = activities.find(a => a.id === view.activityId);
        if (!activity) {
            return <div className="text-center p-8">Activité non trouvée. Revenez au <button onClick={() => setView({type: 'DASHBOARD'})} className="text-primary underline">tableau de bord</button>.</div>
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
       case 'PROFILE':
        return <ProfilePage
          currentUser={currentUser}
          onUpdateProfile={handleUpdateProfile}
          onBack={() => setView({ type: 'DASHBOARD' })}
        />;
      case 'ADMIN_PANEL':
        if(currentUser.role !== 'admin') {
            return <div>Accès refusé</div>
        }
        return <AdminPanel 
            users={users} 
            activities={activities}
            onDeleteUser={handleDeleteUser}
            onDeleteActivity={handleDeleteActivity}
            onCreateActivity={handleCreateActivity}
            currentUser={currentUser}
            onUpdateUserRole={handleUpdateUserRole}
            onResendVerificationEmail={handleResendVerificationEmail}
        />;
      default:
        return <Dashboard activities={activities.slice(0, visibleActivitiesCount)} setView={setView} onLoadMore={handleLoadMoreActivities} hasMore={visibleActivitiesCount < activities.length} />;
    }
  };

  return (
    <div className="bg-light min-h-screen">
      <Header currentUser={currentUser} onLogout={handleLogout} setView={setView} />
      <main>
        {renderContent()}
      </main>
    </div>
  );
};

export default App;