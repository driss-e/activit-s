// FIX: Provide full content for the main App component.
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { ActivityDetail } from './components/ActivityDetail';
import { CreateActivityForm } from './components/CreateActivityForm';
import { ProfilePage } from './components/ProfilePage';
import { UserProfilePage } from './components/UserProfilePage';
import { AdminPanel } from './components/AdminPanel';
import { LandingPage } from './components/LandingPage';
import { AdminLoginPage } from './components/AdminLoginPage';
import type { User, Activity, View, Comment, ProfileUpdateData } from './types';
import { initialActivities, initialUsers } from './data';

// Helper to parse users with dates from localStorage
const parseUsers = (data: string | null): User[] => {
    if (!data) return initialUsers;
    try {
        const parsed = JSON.parse(data);
        return parsed.map((user: any) => ({
            ...user,
            createdAt: new Date(user.createdAt),
        }));
    } catch (e) {
        return initialUsers;
    }
};


// Helper to parse activities with dates from localStorage
const parseActivities = (data: string | null): Activity[] => {
    if (!data) return initialActivities;
    try {
        const parsed = JSON.parse(data);
        return parsed.map((act: any) => ({
            ...act,
            date: new Date(act.date),
            createdAt: new Date(act.createdAt),
            comments: act.comments.map((c: any) => ({ ...c, createdAt: new Date(c.createdAt) }))
        }));
    } catch (e) {
        return initialActivities;
    }
};


const App: React.FC = () => {
    const [users, setUsers] = useState<User[]>(() => parseUsers(localStorage.getItem('users')));
    const [activities, setActivities] = useState<Activity[]>(() => parseActivities(localStorage.getItem('activities')));

    const [currentUser, setCurrentUser] = useState<User | null>(() => {
        const saved = localStorage.getItem('currentUser');
        return saved ? JSON.parse(saved) : null;
    });

    const [view, setView] = useState<View>({ type: 'DASHBOARD' });

    // Search and filter state
    const [searchQuery, setSearchQuery] = useState('');
    const [filterNext7Days, setFilterNext7Days] = useState(false);
    
    // Infinite scroll state
    const [displayedActivities, setDisplayedActivities] = useState<Activity[]>([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const ACTIVITIES_PER_PAGE = 8;


    // Persist state to localStorage
    useEffect(() => { localStorage.setItem('users', JSON.stringify(users)); }, [users]);
    useEffect(() => { localStorage.setItem('activities', JSON.stringify(activities)); }, [activities]);
    useEffect(() => {
        if (currentUser) {
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
        } else {
            localStorage.removeItem('currentUser');
        }
    }, [currentUser]);

    const filteredActivities = useMemo(() => {
        let result = activities;
        
        // Admins see all activities, regular users only see approved ones
        if (currentUser?.role !== 'admin') {
            result = result.filter(activity => activity.status === 'approved');
        }

        result = result.filter(activity => 
            activity.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            activity.description.toLowerCase().includes(searchQuery.toLowerCase())
        );
        
        const now = new Date();
        now.setHours(0, 0, 0, 0);

        if (filterNext7Days) {
            const sevenDaysFromNow = new Date();
            sevenDaysFromNow.setDate(now.getDate() + 7);
            result = result.filter(activity => activity.date >= now && activity.date <= sevenDaysFromNow);
        }
        
        result.sort((a, b) => a.date.getTime() - b.date.getTime());

        return result;
    }, [activities, searchQuery, filterNext7Days, currentUser]);
    
    useEffect(() => {
        setPage(1); // Reset page on filter change
        const newDisplayed = filteredActivities.slice(0, ACTIVITIES_PER_PAGE);
        setDisplayedActivities(newDisplayed);
        setHasMore(filteredActivities.length > ACTIVITIES_PER_PAGE);
    }, [filteredActivities]);

    const handleLoadMore = useCallback(() => {
        if (hasMore && !loading) {
            setLoading(true);
            // Simulate network delay to show loading state
            setTimeout(() => {
                const currentLength = displayedActivities.length;
                const newActivities = filteredActivities.slice(currentLength, currentLength + ACTIVITIES_PER_PAGE);
                setDisplayedActivities(prev => [...prev, ...newActivities]);
                setHasMore(currentLength + newActivities.length < filteredActivities.length);
                setLoading(false);
            }, 500);
        }
    }, [hasMore, loading, displayedActivities, filteredActivities]);

    const handleLogin = async (email: string, password?: string) => {
        const user = users.find(u => u.email === email);
        if (!user) {
            throw new Error("Utilisateur ou mot de passe incorrect.");
        }

        if (user.status === 'inactive') {
            throw new Error("Ce compte est inactif. Veuillez contacter un administrateur.");
        }

        if (user.role === 'admin') {
            if (email === 'admin@example.com' && password === 'adminpassword') {
                setCurrentUser(user);
                setView({ type: 'ADMIN', section: 'dashboard' });
            } else {
                throw new Error("Utilisateur ou mot de passe incorrect.");
            }
        } else {
            // Simplified login for regular users (no password check)
            setCurrentUser(user);
            setView({ type: 'DASHBOARD' });
        }
    };

    const handleRegister = async (name: string, email: string, password?: string) => {
        if (users.some(u => u.email === email)) {
            throw new Error("Cet email est déjà utilisé.");
        }
        const newUser: User = {
            id: `user-${Date.now()}`,
            name,
            email,
            avatar: `https://i.pravatar.cc/150?u=${email}`,
            role: 'member',
            status: 'active',
            createdAt: new Date(),
        };
        setUsers(prev => [...prev, newUser]);
        setCurrentUser(newUser);
        setView({ type: 'DASHBOARD' });
    };

    const handleLogout = () => {
        setCurrentUser(null);
    };

    const handleJoin = (activityId: string, userId: string) => {
        setActivities(acts => acts.map(act => act.id === activityId ? { ...act, participants: [...act.participants, userId] } : act));
    };

    const handleLeave = (activityId: string, userId: string) => {
        setActivities(acts => acts.map(act => act.id === activityId ? { ...act, participants: act.participants.filter(pId => pId !== userId) } : act));
    };

    const handleAddComment = (activityId: string, comment: Omit<Comment, 'id' | 'createdAt'>) => {
        const newComment: Comment = {
            ...comment,
            id: `comment-${Date.now()}`,
            createdAt: new Date(),
        };
        setActivities(acts => acts.map(act => act.id === activityId ? { ...act, comments: [...act.comments, newComment] } : act));
    };

    const handleCreateActivity = (activityData: Omit<Activity, 'id' | 'participants' | 'comments' | 'createdAt' | 'status'>) => {
        const newActivity: Activity = {
            ...activityData,
            id: `activity-${Date.now()}`,
            participants: [],
            comments: [],
            createdAt: new Date(),
            status: 'pending',
        };
        setActivities(prev => [newActivity, ...prev]);
        alert("Votre activité a été soumise pour approbation. Elle sera visible une fois validée par un administrateur.");
        setView({ type: 'DASHBOARD' });
    };

    const handleUpdateProfile = (userId: string, data: ProfileUpdateData) => {
        const updateUser = (u: User) => u.id === userId ? { ...u, ...data } : u;
        setUsers(users.map(updateUser));
        if (currentUser?.id === userId) {
            setCurrentUser(updateUser(currentUser));
        }
    };

    const handleDeleteUser = (userId: string) => {
        setUsers(prev => prev.filter(u => u.id !== userId));
        setActivities(prevActivities => {
            const activitiesToKeep = prevActivities.filter(act => act.organizer.id !== userId);
            return activitiesToKeep.map(act => ({
                ...act,
                participants: act.participants.filter(pId => pId !== userId),
                comments: act.comments.filter(c => c.author.id !== userId)
            }));
        });
    };

    const handleDeleteActivity = (activityId: string) => {
        setActivities(prev => prev.filter(a => a.id !== activityId));
    };

    const handleApproveActivity = (activityId: string) => {
        setActivities(prev => prev.map(act => act.id === activityId ? { ...act, status: 'approved' } : act));
    };

    const handleUpdateUserStatus = (userId: string, status: 'active' | 'inactive') => {
        setUsers(prevUsers => prevUsers.map(user => user.id === userId ? { ...user, status } : user));
    };


    if (!currentUser) {
         if (view.type === 'ADMIN_LOGIN' || (view.type === 'ADMIN' && currentUser?.role !== 'admin')) {
            return <AdminLoginPage onLogin={handleLogin} setView={setView} />;
        }
        return <LandingPage onLogin={handleLogin} onRegister={handleRegister} onForgotPasswordRequest={async () => "token"} onResetPassword={async () => {}} />;
    }

    const renderView = () => {
        // Guard: If a logged-in user is not an admin, redirect them to the dashboard
        // if they try to access any admin-related pages.
        if (currentUser.role !== 'admin' && (view.type === 'ADMIN' || view.type === 'ADMIN_LOGIN')) {
            return <Dashboard 
                activities={displayedActivities} 
                setView={setView} 
                searchQuery={searchQuery} 
                setSearchQuery={setSearchQuery} 
                filterNext7Days={filterNext7Days} 
                setFilterNext7Days={setFilterNext7Days} 
                onLoadMore={handleLoadMore} 
                hasMore={hasMore} 
                loading={loading} 
            />;
        }
    
        switch (view.type) {
            case 'ACTIVITY_DETAIL':
                const activity = activities.find(a => a.id === view.activityId);
                return activity ? <ActivityDetail activity={activity} currentUser={currentUser} users={users} onJoin={handleJoin} onLeave={handleLeave} onAddComment={handleAddComment} onBack={() => setView({type: 'DASHBOARD'})} setView={setView} /> : <div>Activité non trouvée</div>;
            case 'CREATE_ACTIVITY':
                return <CreateActivityForm currentUser={currentUser} onCreateActivity={handleCreateActivity} onCancel={() => setView({type: 'DASHBOARD'})} />;
            case 'PROFILE':
                return <ProfilePage currentUser={currentUser} onUpdateProfile={handleUpdateProfile} onBack={() => setView({type: 'DASHBOARD'})} />;
            case 'USER_PROFILE':
                const user = users.find(u => u.id === view.userId);
                const lastView: View = { type: 'DASHBOARD' }; // A simple back logic
                return user ? <UserProfilePage user={user} onBack={() => setView(lastView)} /> : <div>Utilisateur non trouvé</div>;
            case 'ADMIN_LOGIN':
                // If we reach here, the user MUST be an admin (due to the guard above).
                // An admin seeing a login page should be redirected to their panel.
                return <AdminPanel users={users} activities={activities} onDeleteUser={handleDeleteUser} onDeleteActivity={handleDeleteActivity} onApproveActivity={handleApproveActivity} onUpdateUserStatus={handleUpdateUserStatus} currentSection={'dashboard'} setView={setView} currentUser={currentUser} />;
            case 'ADMIN':
                 // The guard already ensures only admins can reach this.
                 return <AdminPanel users={users} activities={activities} onDeleteUser={handleDeleteUser} onDeleteActivity={handleDeleteActivity} onApproveActivity={handleApproveActivity} onUpdateUserStatus={handleUpdateUserStatus} currentSection={view.section} setView={setView} currentUser={currentUser} />;
            case 'DASHBOARD':
            default:
                return <Dashboard 
                    activities={displayedActivities} 
                    setView={setView} 
                    searchQuery={searchQuery} 
                    setSearchQuery={setSearchQuery} 
                    filterNext7Days={filterNext7Days} 
                    setFilterNext7Days={setFilterNext7Days} 
                    onLoadMore={handleLoadMore} 
                    hasMore={hasMore} 
                    loading={loading} 
                />;
        }
    };

    return (
        <div className="bg-light dark:bg-dark">
            <Header currentUser={currentUser} setView={setView} onLogout={handleLogout} />
            <main>
                {renderView()}
            </main>
        </div>
    );
};

export default App;