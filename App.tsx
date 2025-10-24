import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { ActivityDetail } from './components/ActivityDetail';
import { CreateActivityForm } from './components/CreateActivityForm';
import { AdminPanel } from './components/AdminPanel';
import { ProfilePage } from './components/ProfilePage';
import { LandingPage } from './components/LandingPage';
import type { User, Activity, View, Comment, ProfileUpdateData } from './types';

// FIX: Define initial data directly within the App to ensure it's available on first load.
const initialUsers: User[] = [
    { id: 'u1', name: 'Alice', email: 'alice@example.com', password: 'password', role: 'admin', avatar: 'https://i.pravatar.cc/150?u=u1', isVerified: true },
    { id: 'u2', name: 'Bob', email: 'bob@example.com', password: 'password', role: 'user', avatar: 'https://i.pravatar.cc/150?u=u2', isVerified: true },
    { id: 'u3', name: 'Charlie', email: 'charlie@example.com', password: 'password', role: 'user', avatar: 'https://i.pravatar.cc/150?u=u3', isVerified: false },
];

const initialActivities: Activity[] = [
    {
      id: 'a1',
      title: 'Randonnée au Mont-Royal',
      description: 'Une belle randonnée pour profiter de la nature en plein cœur de la ville. Apportez de l\'eau et de bonnes chaussures !',
      location: 'Parc du Mont-Royal, Montréal',
      date: new Date('2024-08-15T10:00:00'),
      image: 'https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&w=800&q=60',
      maxParticipants: 15,
      participants: ['u1', 'u2'],
      organizer: { id: 'u1', name: 'Alice', avatar: 'https://i.pravatar.cc/150?u=u1' },
      comments: [
        { id: 'c1', author: { id: 'u2', name: 'Bob', avatar: 'https://i.pravatar.cc/150?u=u2' }, text: 'Super sortie, j\'ai hâte !', rating: 5, createdAt: new Date() }
      ],
    },
    {
      id: 'a2',
      title: 'Soirée jeux de société',
      description: 'Venez découvrir de nouveaux jeux ou rejouer à vos classiques préférés. Ambiance conviviale garantie.',
      location: 'Le Colonel Moutarde, 4430 rue St-Denis',
      date: new Date('2024-08-20T19:00:00'),
      image: 'https://images.unsplash.com/photo-1577897113369-8a1a3a7f8f2b?auto=format&fit=crop&w=800&q=60',
      maxParticipants: 8,
      participants: [],
      organizer: { id: 'u2', name: 'Bob', avatar: 'https://i.pravatar.cc/150?u=u2' },
      comments: [],
    }
];


const App: React.FC = () => {
    const [users, setUsers] = useState<User[]>(() => {
        try {
            const savedUsers = localStorage.getItem('users');
            return savedUsers ? JSON.parse(savedUsers, (key, value) => {
                if (key === 'passwordResetExpires' && value) return new Date(value);
                return value;
            }) : initialUsers;
        } catch {
            return initialUsers;
        }
    });

    const [activities, setActivities] = useState<Activity[]>(() => {
        try {
            const savedActivities = localStorage.getItem('activities');
            return savedActivities ? JSON.parse(savedActivities, (key, value) => {
                if (key === 'date' || key === 'createdAt') return new Date(value);
                return value;
            }) : initialActivities;
        } catch {
            return initialActivities;
        }
    });

    const [currentUser, setCurrentUser] = useState<User | null>(() => {
        try {
            const savedUser = localStorage.getItem('currentUser');
            return savedUser ? JSON.parse(savedUser) : null;
        } catch {
            return null;
        }
    });

    const [view, setView] = useState<View>({ type: 'DASHBOARD' });

    useEffect(() => {
        localStorage.setItem('users', JSON.stringify(users));
    }, [users]);
    
    useEffect(() => {
        localStorage.setItem('activities', JSON.stringify(activities));
    }, [activities]);
    
    useEffect(() => {
        if (currentUser) {
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
        } else {
            localStorage.removeItem('currentUser');
        }
    }, [currentUser]);
    
    // Auth Handlers
    const handleLogin = async (email: string, password?: string) => {
        const user = users.find(u => u.email === email && u.password === password);
        if (user) {
            if (!user.isVerified) {
                throw new Error("Veuillez vérifier votre adresse e-mail avant de vous connecter.");
            }
            setCurrentUser(user);
            setView({ type: 'DASHBOARD' });
        } else {
            throw new Error("Email ou mot de passe incorrect.");
        }
    };
    
    const handleLogout = () => {
        setCurrentUser(null);
        setView({ type: 'DASHBOARD' });
    };

    const handleRegister = async (name: string, email: string, password?: string) => {
        if (users.some(u => u.email === email)) {
            throw new Error("Un utilisateur avec cet email existe déjà.");
        }
        const newUser: User = {
            id: `u${users.length + 1}`,
            name,
            email,
            password,
            role: 'user',
            avatar: `https://i.pravatar.cc/150?u=u${users.length + 1}`,
            isVerified: false,
            verificationToken: `vtoken${Date.now()}`,
        };
        setUsers(prev => [...prev, newUser]);
    };
    
    const handleVerifyEmail = async (email: string) => {
        setUsers(prevUsers => prevUsers.map(u => u.email === email ? { ...u, isVerified: true, verificationToken: null } : u));
        alert('Email vérifié ! Vous pouvez maintenant vous connecter.');
    };
    
    const handleResendVerificationEmail = async (email: string) => {
        console.log(`Resending verification email to ${email}`);
    };

    const handleForgotPasswordRequest = async (email: string): Promise<string> => {
        const user = users.find(u => u.email === email);
        if (user) {
            const token = `resettoken${Date.now()}`;
            const expires = new Date(Date.now() + 3600000); // 1 hour
            setUsers(prev => prev.map(u => u.id === user.id ? { ...u, passwordResetToken: token, passwordResetExpires: expires } : u));
            return token;
        }
        return "";
    };
    
    const handleResetPassword = async (token: string, newPassword: string) => {
        const user = users.find(u => u.passwordResetToken === token && u.passwordResetExpires && new Date(u.passwordResetExpires) > new Date());
        if (!user) {
            throw new Error("Jeton de réinitialisation invalide ou expiré.");
        }
        setUsers(prev => prev.map(u => u.id === user.id ? { ...u, password: newPassword, passwordResetToken: null, passwordResetExpires: null } : u));
    };


    // Activity Handlers
    const handleJoinActivity = (activityId: string, userId: string) => {
        setActivities(prev => prev.map(act =>
            act.id === activityId ? { ...act, participants: [...act.participants, userId] } : act
        ));
    };
    
    const handleLeaveActivity = (activityId: string, userId: string) => {
        setActivities(prev => prev.map(act =>
            act.id === activityId ? { ...act, participants: act.participants.filter(pId => pId !== userId) } : act
        ));
    };

    const handleAddComment = (activityId: string, comment: Omit<Comment, 'id' | 'createdAt'>) => {
        const newComment: Comment = {
            ...comment,
            id: `c${Date.now()}`,
            createdAt: new Date(),
        };
        setActivities(prev => prev.map(act =>
            act.id === activityId ? { ...act, comments: [...act.comments, newComment] } : act
        ));
    };

    const handleCreateActivity = (activityData: Omit<Activity, 'id' | 'participants' | 'comments'>, onSuccess?: () => void) => {
        const newActivity: Activity = {
            ...activityData,
            id: `a${Date.now()}`,
            participants: [activityData.organizer.id],
            comments: [],
        };
        setActivities(prev => [newActivity, ...prev]);
        setView({ type: 'DASHBOARD' });
        onSuccess?.();
    };

    // Admin Handlers
    const handleDeleteUser = (userId: string) => {
        if (window.confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ?")) {
            setUsers(prev => prev.filter(u => u.id !== userId));
        }
    };
    
    const handleDeleteActivity = (activityId: string) => {
        if (window.confirm("Êtes-vous sûr de vouloir supprimer cette activité ?")) {
            setActivities(prev => prev.filter(a => a.id !== activityId));
            setView({ type: 'DASHBOARD' });
        }
    };
    
    const handleUpdateUserRole = (userId: string, newRole: 'user' | 'admin') => {
        setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
    };

    // Profile Handlers
    const handleUpdateProfile = (userId: string, data: ProfileUpdateData) => {
        const updateUser = (u: User) => {
            if (u.id === userId) {
                const updated = { ...u, ...data };
                if (currentUser?.id === userId) {
                  setCurrentUser(updated);
                }
                return updated;
            }
            return u;
        };
        setUsers(prev => prev.map(updateUser));
    };
    
    const renderContent = () => {
        switch (view.type) {
            case 'ACTIVITY_DETAIL':
                const activity = activities.find(a => a.id === view.activityId);
                return activity ? (
                    <ActivityDetail
                        activity={activity}
                        currentUser={currentUser}
                        users={users}
                        onJoin={handleJoinActivity}
                        onLeave={handleLeaveActivity}
                        onAddComment={handleAddComment}
                        onBack={() => setView({ type: 'DASHBOARD' })}
                    />
                ) : <div>Activité non trouvée</div>;
            case 'CREATE_ACTIVITY':
                return <CreateActivityForm 
                    currentUser={currentUser} 
                    onCreateActivity={handleCreateActivity}
                    onCancel={() => setView({ type: 'DASHBOARD' })}
                />;
            case 'ADMIN_PANEL':
                return currentUser?.role === 'admin' ? (
                  <AdminPanel
                    users={users}
                    activities={activities}
                    currentUser={currentUser}
                    onDeleteUser={handleDeleteUser}
                    onDeleteActivity={handleDeleteActivity}
                    onCreateActivity={handleCreateActivity}
                    onUpdateUserRole={handleUpdateUserRole}
                    onResendVerificationEmail={handleResendVerificationEmail}
                 />) : <div>Accès refusé</div>;
            case 'PROFILE':
                return currentUser ? (
                    <ProfilePage 
                        currentUser={currentUser}
                        onUpdateProfile={handleUpdateProfile}
                        onBack={() => setView({ type: 'DASHBOARD' })}
                    />
                ) : <div>Utilisateur non trouvé</div>;
            case 'DASHBOARD':
            default:
                return <Dashboard activities={activities} setView={setView} />;
        }
    };

    if (!currentUser) {
        return <LandingPage 
            onLogin={handleLogin}
            onRegister={handleRegister}
            onForgotPasswordRequest={handleForgotPasswordRequest}
            onResetPassword={handleResetPassword}
            onResendVerificationEmail={handleResendVerificationEmail}
            onVerifyEmail={handleVerifyEmail}
        />;
    }

    return (
        <div className="bg-slate-50 min-h-screen">
            <Header currentUser={currentUser} onLogout={handleLogout} setView={setView} />
            <main>
                {renderContent()}
            </main>
        </div>
    );
};

export default App;
