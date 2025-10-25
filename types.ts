// FIX: Provide full content for `types.ts` to define data structures used across the application.
export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: 'member' | 'admin';
  status: 'active' | 'inactive';
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
  id: string;
  title: string;
  description: string;
  image: string;
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
}

export type View =
  | { type: 'DASHBOARD' }
  | { type: 'ACTIVITY_DETAIL'; activityId: string }
  | { type: 'CREATE_ACTIVITY' }
  | { type: 'PROFILE' }
  | { type: 'USER_PROFILE'; userId: string }
  | { type: 'ADMIN'; section: 'dashboard' | 'users' | 'activities' }
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