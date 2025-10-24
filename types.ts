export interface User {
  id: string;
  name: string;
  avatar: string;
  role: 'user' | 'admin';
  email: string;
  password?: string;
  passwordResetToken?: string | null;
  passwordResetExpires?: Date | null;
  isVerified: boolean;
  verificationToken?: string | null;
}

export interface Comment {
  id: string;
  author: Pick<User, 'id' | 'name' | 'avatar'>;
  text: string;
  rating: number;
  createdAt: Date;
}

export interface Activity {
  id: string;
  title: string;
  description: string;
  location: string;
  date: Date;
  image: string;
  maxParticipants: number;
  participants: string[]; // Array of User IDs
  comments: Comment[];
  organizer: Pick<User, 'id' | 'name' | 'avatar'>;
}

export type View = 
  | { type: 'DASHBOARD' }
  | { type: 'ACTIVITY_DETAIL'; activityId: string }
  | { type: 'CREATE_ACTIVITY' }
  | { type: 'ADMIN_PANEL' }
  | { type: 'PROFILE' };