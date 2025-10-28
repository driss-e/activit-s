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
import { AuthPage } from './components/AuthPage';
import type { User, Activity, View, Comment, ProfileUpdateData, Category, AuditLogEntry } from './types';
import { initialActivities, initialUsers } from './data';

const ITEMS_PER_PAGE = 12;

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
            comments: act.comments.map((c: any) => ({ ...c, createdAt: new Date(c.createdAt) })),
        }));
    } catch (e) {
        return initialActivities;
    }
};

const parseAuditLogs = (data: string | null): AuditLogEntry[] => {
    if (!data) return [];
    try {
        const parsed = JSON.parse(data);
        return parsed.map((log: any) => ({
            ...log,
            timestamp: new Date(log.timestamp),
        }));
    } catch(e) {
        return [];
    }
};

const App: React.FC = () => {
    const [users, setUsers] = useState<User[]>(() => parseUsers(localStorage.getItem('users')));
    const [activities, setActivities] = useState<Activity[]>(() => parseActivities(localStorage.getItem('activities')));
    const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(() => parseAuditLogs(localStorage.getItem('auditLogs')));
    const [currentUser, setCurrentUser] = useState<User | null>(() => {
        const storedUser = localStorage.getItem('currentUser');
        if (storedUser) {
            const user = JSON.parse(storedUser);
            // find the full user object from the users list to ensure data is fresh
            return users.find(u => u.id === user.id) || null;
        }
        return null;
    });
    
    const [view, setView] = useState<View>({ type: 'LANDING' });

    // Filter states
    const [searchQuery, setSearchQuery] = useState('');
    const [locationFilter, setLocationFilter] = useState('');
    const [dateFilter, setDateFilter] = useState<'all' | 'today' | 'this_week' | 'this_month'>('all');
    const [categoryFilter, setCategoryFilter] = useState<Category | 'all'>('all');
    const [statusFilter, setStatusFilter] = useState<'all' | 'approved' | 'pending'>('all');

    // Pagination state
    const [displayedActivitiesCount, setDisplayedActivitiesCount] = useState(ITEMS_PER_PAGE);
    const [loading, setLoading] = useState(false);

    // Persist state to localStorage
    useEffect(() => { localStorage.setItem('users', JSON.stringify(users)); }, [users]);
    useEffect(() => { localStorage.setItem('activities', JSON.stringify(activities)); }, [activities]);
    useEffect(() => { localStorage.setItem('auditLogs', JSON.stringify(auditLogs)); }, [auditLogs]);
    useEffect(() => {
        if (currentUser) {
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
        } else {
            localStorage.removeItem('currentUser');
        }
    }, [currentUser]);

     // Reset filters and scroll when view changes
    useEffect(() => {
        if (view.type === 'DASHBOARD') {
            setSearchQuery('');
            setLocationFilter('');
            setDateFilter('all');
            setCategoryFilter('all');
            setStatusFilter(currentUser?.role === 'admin' ? 'all' : 'approved');
            setDisplayedActivitiesCount(ITEMS_PER_PAGE);
            window.scrollTo(0, 0);
        }
    }, [view, currentUser]);

    const activeUserIds = useMemo(() => 
        new Set(users.filter(u => u.status !== 'deleted').map(u => u.id)), 
        [users]
    );

    const filteredActivities = useMemo(() => {
        let result = [...activities];

        // Filter out activities from deleted users
        result = result.filter(a => activeUserIds.has(a.organizer.id));

        // Status filter (non-admins should only see approved activities)
        if (currentUser?.role !== 'admin') {
            result = result.filter(a => a.status === 'approved');
        } else {
            if (statusFilter !== 'all') {
                result = result.filter(a => a.status === statusFilter);
            }
        }
        
        // Search query filter
        if (searchQuery) {
            const lowerCaseQuery = searchQuery.toLowerCase();
            result = result.filter(a =>
                a.title.toLowerCase().includes(lowerCaseQuery) ||
                a.description.toLowerCase().includes(lowerCaseQuery)
            );
        }

        // Location filter
        if (locationFilter) {
            result = result.filter(a => a.location.toLowerCase().includes(locationFilter.toLowerCase()));
        }

        // Date filter
        const now = new Date();
        const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        
        if (dateFilter === 'today') {
            const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
            result = result.filter(a => a.date >= startOfToday && a.date <= endOfToday);
        } else if (dateFilter === 'this_week') {
            const endOfWeek = new Date(startOfToday);
            endOfWeek.setDate(startOfToday.getDate() + (7 - now.getDay()));
            endOfWeek.setHours(23, 59, 59);
            result = result.filter(a => a.date >= startOfToday && a.date <= endOfWeek);
        } else if (dateFilter === 'this_month') {
            const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
            result = result.filter(a => a.date >= startOfToday && a.date <= endOfMonth);
        }
        
        // Category filter
        if (categoryFilter !== 'all') {
            result = result.filter(a => a.category === categoryFilter);
        }
        
        // Sort by date (upcoming first)
        return result.sort((a, b) => a.date.getTime() - b.date.getTime());

    }, [activities, currentUser, searchQuery, locationFilter, dateFilter, categoryFilter, statusFilter, activeUserIds]);

    const paginatedActivities = useMemo(() => filteredActivities.slice(0, displayedActivitiesCount), [filteredActivities, displayedActivitiesCount]);
    const hasMoreActivities = useMemo(() => displayedActivitiesCount < filteredActivities.length, [displayedActivitiesCount, filteredActivities.length]);

    const handleLoadMore = useCallback(() => {
        setLoading(true);
        setTimeout(() => {
            setDisplayedActivitiesCount(prev => prev + ITEMS_PER_PAGE);
            setLoading(false);
        }, 500);
    }, []);

    // --- Handlers ---
    
    const logAdminAction = useCallback((action: AuditLogEntry['action'], targetId: string, details: string) => {
        if (currentUser?.role !== 'admin') return;
        const newLog: AuditLogEntry = {
            id: `log-${Date.now()}`,
            timestamp: new Date(),
            adminId: currentUser.id,
            adminName: currentUser.name,
            action,
            targetId,
            details,
            ipAddress: '127.0.0.1', // Mock IP
            userAgent: 'WebApp' // Mock User Agent
        };
        setAuditLogs(prev => [newLog, ...prev].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()));
    }, [currentUser]);


    const handleLogin = async (email: string, password?: string) => {
        // In a real app, this would be an API call
        const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
        if (user) {
            if (user.status === 'deleted') {
                throw new Error("Ce compte a été supprimé.");
            }
            if (user.status === 'inactive') {
                throw new Error("Votre compte est currently inactif. Veuillez contacter un administrateur.");
            }
            setCurrentUser(user);
            if (user.role === 'admin') {
                setView({ type: 'ADMIN', section: 'dashboard' });
            } else {
                setView({ type: 'DASHBOARD' });
            }
        } else {
            throw new Error("Email ou mot de passe invalide.");
        }
    };

    const handleLogout = () => {
        setCurrentUser(null);
        setView({ type: 'LANDING' });
    };

    const handleRegister = async (name: string, email: string, password?: string) => {
        if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
            throw new Error("Un compte existe déjà avec cet email.");
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

    const handleForgotPasswordRequest = async (email: string) => {
        // In a real app, this would trigger a password reset email
        console.log(`Password reset requested for: ${email}`);
        return `Si un compte existe pour ${email}, un email de réinitialisation a été envoyé.`;
    };

    const handleUpdateProfile = (userId: string, data: ProfileUpdateData) => {
        setUsers(prev => prev.map(u => u.id === userId ? { ...u, ...data } : u));
        if (currentUser?.id === userId) {
            setCurrentUser(prev => prev ? { ...prev, ...data } : null);
        }
    };
    
    const handleCreateActivity = (activityData: Omit<Activity, 'id' | 'participants' | 'comments' | 'createdAt' | 'status'>) => {
        const newActivity: Activity = {
            ...activityData,
            id: `activity-${Date.now()}`,
            participants: [activityData.organizer.id],
            comments: [],
            createdAt: new Date(),
            status: 'approved', // New activities are approved by default
        };
        setActivities(prev => [...prev, newActivity]);
        alert("Votre activité a été publiée avec succès et est maintenant visible !");
        setView({ type: 'DASHBOARD' });
    };

    const handleJoinActivity = (activityId: string, userId: string) => {
        setActivities(prev => prev.map(a => 
            a.id === activityId ? { ...a, participants: [...a.participants, userId] } : a
        ));
    };

    const handleLeaveActivity = (activityId: string, userId: string) => {
         setActivities(prev => prev.map(a => 
            a.id === activityId ? { ...a, participants: a.participants.filter(p => p !== userId) } : a
        ));
    };
    
    const handleAddComment = (activityId: string, comment: Omit<Comment, 'id' | 'createdAt'>) => {
        const newComment: Comment = {
            ...comment,
            id: `comment-${Date.now()}`,
            createdAt: new Date()
        };
        setActivities(prev => prev.map(a => 
            a.id === activityId ? { ...a, comments: [...a.comments, newComment] } : a
        ));
    };

    const handleDeleteUser = (userId: string) => {
        const user = users.find(u => u.id === userId);
        if (!user) return;
        setUsers(prev => prev.map(u => u.id === userId ? { ...u, status: 'deleted' } : u));
        logAdminAction('USER_SOFT_DELETE', userId, `Utilisateur marqué comme supprimé : ${user.name} (${user.email})`);
    };

    const handleUpdateUserStatus = (userId: string, status: User['status']) => {
        const user = users.find(u => u.id === userId);
        if (!user) return;
        setUsers(prev => prev.map(u => u.id === userId ? { ...u, status } : u));
        
        if(user.status === 'deleted' && status === 'inactive') {
             logAdminAction('USER_RESTORE', userId, `Utilisateur restauré : ${user.name}. Statut défini sur 'inactif'.`);
        } else {
            logAdminAction('USER_STATUS_UPDATE', userId, `Statut de ${user.name} mis à jour à : ${status}`);
        }
    };

     const handleUpdateUserRole = (userId: string, role: 'admin' | 'member') => {
        const user = users.find(u => u.id === userId);
        if (!user) return;
        setUsers(prev => prev.map(u => u.id === userId ? { ...u, role } : u));
        logAdminAction('USER_ROLE_UPDATE', userId, `Rôle de ${user.name} mis à jour à : ${role}`);
    };
    
    const handleDeleteActivity = (activityId: string) => {
        const activity = activities.find(a => a.id === activityId);
        setActivities(prev => prev.filter(a => a.id !== activityId));
        if(activity) {
            logAdminAction('ACTIVITY_DELETE', activityId, `Activité supprimée : "${activity.title}"`);
        }
    };

    const handleApproveActivity = (activityId: string) => {
        const activity = activities.find(a => a.id === activityId);
        setActivities(prev => prev.map(a => a.id === activityId ? { ...a, status: 'approved' } : a));
        if(activity) {
             logAdminAction('ACTIVITY_APPROVE', activityId, `Activité approuvée : "${activity.title}"`);
        }
    };

    // FIX: Moved dashboardProps declaration before renderContent to fix usage before declaration error.
    const dashboardProps = {
        activities: paginatedActivities,
        setView,
        currentUser,
        searchQuery, setSearchQuery,
        locationFilter, setLocationFilter,
        dateFilter, setDateFilter,
        categoryFilter, setCategoryFilter,
        statusFilter, setStatusFilter,
        onLoadMore: handleLoadMore,
        hasMore: hasMoreActivities,
        loading,
    };

    const renderContent = () => {
        if (!currentUser) {
            switch(view.type) {
                case 'AUTH':
                    return <AuthPage 
                        initialView={view.initialView} 
                        onLogin={handleLogin} 
                        onRegister={handleRegister} 
                        onForgotPasswordRequest={handleForgotPasswordRequest}
                        setView={setView} 
                    />;
                case 'ADMIN_LOGIN':
                    return <AdminLoginPage onLogin={handleLogin} setView={setView} />;
                case 'LANDING':
                default:
                    return <LandingPage setView={setView} />;
            }
        }

        switch (view.type) {
            case 'ACTIVITY_DETAIL': {
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
                        setView={setView}
                    />
                ) : <Dashboard {...dashboardProps} />;
            }
            case 'CREATE_ACTIVITY':
                return <CreateActivityForm currentUser={currentUser} onCreateActivity={handleCreateActivity} onCancel={() => setView({ type: 'DASHBOARD' })} />;
            case 'PROFILE':
                return <ProfilePage currentUser={currentUser} onUpdateProfile={handleUpdateProfile} onBack={() => setView({ type: 'DASHBOARD' })} />;
             case 'USER_PROFILE': {
                const user = users.find(u => u.id === view.userId);
                return user ? (
                    <UserProfilePage user={user} onBack={() => setView({ type: 'DASHBOARD' })} />
                ) : <Dashboard {...dashboardProps} />;
             }
            case 'ADMIN':
                return currentUser.role === 'admin' ? 
                    <AdminPanel 
                        users={users} 
                        activities={activities}
                        auditLogs={auditLogs.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())}
                        onDeleteUser={handleDeleteUser} 
                        onDeleteActivity={handleDeleteActivity}
                        onApproveActivity={handleApproveActivity}
                        onUpdateUserStatus={handleUpdateUserStatus}
                        onUpdateUserRole={handleUpdateUserRole}
                        currentSection={view.section}
                        setView={setView}
                        currentUser={currentUser}
                    /> : <Dashboard {...dashboardProps} />;
            case 'DASHBOARD':
            default:
                return <Dashboard {...dashboardProps} />;
        }
    };
    
    return (
        <>
            {view.type !== 'LANDING' && view.type !== 'AUTH' && view.type !== 'ADMIN_LOGIN' && (
                <Header currentUser={currentUser} setView={setView} onLogout={handleLogout} />
            )}
            <main>
                {renderContent()}
            </main>
        </>
    );
};

export default App;