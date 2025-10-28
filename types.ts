// FIX: Provide full content for `types.ts` to define data structures used across the application.
export type Category = 'Sports' | 'Culture' | 'Social' | 'Outdoors';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: 'member' | 'admin';
  status: 'active' | 'inactive' | 'deleted';
  createdAt: Date;
  phone?: string;
  gender?: 'male' | 'female' | 'prefer_not_to_say';
  hobbies?: string;
  instagram?: string;
  facebook?: string;
}

export interface Comment {
  id: string;
  author: {
    id: string;
    name: string;
    avatar: string;
  };
  text: string;
  rating: number;
  createdAt: Date;
}

export interface Activity {
  id:string;
  title: string;
  description: string;
  images: string[];
  date: Date;
  createdAt: Date;
  location: string;
  organizer: {
    id: string;
    name: string;
    avatar: string;
  };
  participants: string[]; // array of user IDs
  maxParticipants: number;
  comments: Comment[];
  category: Category;
  status: 'pending' | 'approved';
}

export interface AuditLogEntry {
  id: string;
  timestamp: Date;
  adminId: string;
  adminName: string;
  action: 'USER_SOFT_DELETE' | 'USER_RESTORE' | 'USER_STATUS_UPDATE' | 'ACTIVITY_DELETE' | 'ACTIVITY_APPROVE' | 'USER_ROLE_UPDATE';
  targetId: string;
  details: string;
  ipAddress: string;
  userAgent: string;
}

export type View =
  | { type: 'LANDING' }
  | { type: 'AUTH'; initialView: 'login' | 'register' | 'forgot-password' }
  | { type: 'DASHBOARD' }
  | { type: 'ACTIVITY_DETAIL'; activityId: string }
  | { type: 'CREATE_ACTIVITY' }
  | { type: 'PROFILE' }
  | { type: 'USER_PROFILE'; userId: string }
  | { type: 'ADMIN'; section: 'dashboard' | 'users' | 'activities' | 'audit' }
  | { type: 'ADMIN_LOGIN' };

export interface ProfileUpdateData {
    name: string;
    avatar: string;
    phone: string;
    gender: 'male' | 'female' | 'prefer_not_to_say';
    hobbies: string;
    instagram: string;
    facebook: string;
}