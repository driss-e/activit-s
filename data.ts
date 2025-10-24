import type { User, Activity } from './types';

export const initialUsers: User[] = [
  {
    id: 'user-1',
    name: 'Alice',
    email: 'alice@example.com',
    avatar: 'https://i.pravatar.cc/150?u=alice@example.com',
    role: 'member',
    status: 'active',
    hobbies: 'Hiking, Photography',
    instagram: 'alice_hikes',
  },
  {
    id: 'user-2',
    name: 'Bob',
    email: 'bob@example.com',
    avatar: 'https://i.pravatar.cc/150?u=bob@example.com',
    role: 'member',
    status: 'active',
    gender: 'male',
    hobbies: 'Cooking, Board Games',
    facebook: 'bob.cooks',
  },
  {
    id: 'user-3',
    name: 'Charlie',
    email: 'charlie@example.com',
    avatar: 'https://i.pravatar.cc/150?u=charlie@example.com',
    role: 'member',
    status: 'inactive',
    phone: '555-1234',
  },
  {
    id: 'admin-1',
    name: 'Admin User',
    email: 'admin@example.com',
    avatar: 'https://i.pravatar.cc/150?u=admin@example.com',
    role: 'admin',
    status: 'active',
    gender: 'prefer_not_to_say',
  },
];

const tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);
tomorrow.setHours(10, 0, 0, 0);

const nextWeek = new Date();
nextWeek.setDate(nextWeek.getDate() + 7);
nextWeek.setHours(18, 30, 0, 0);

const tenDaysLater = new Date();
tenDaysLater.setDate(tenDaysLater.getDate() + 10);
tenDaysLater.setHours(9, 0, 0, 0);

export const initialActivities: Activity[] = [
  {
    id: 'activity-1',
    title: 'Randonnée au Mont Royal',
    description: 'Une belle randonnée pour profiter de la nature et de la vue sur la ville. Apportez de l\'eau et de bonnes chaussures.',
    image: 'https://images.unsplash.com/photo-1551632811-561732d1e306?q=80&w=2070&auto=format&fit=crop',
    date: tomorrow,
    location: 'Parc du Mont-Royal, Montréal, QC',
    organizer: { id: 'user-1', name: 'Alice', avatar: 'https://i.pravatar.cc/150?u=alice@example.com' },
    participants: ['user-1', 'user-2'],
    maxParticipants: 10,
    comments: [
      {
        id: 'comment-1',
        author: { id: 'user-2', name: 'Bob', avatar: 'https://i.pravatar.cc/150?u=bob@example.com' },
        text: 'J\'ai hâte ! La météo s\'annonce parfaite.',
        rating: 5,
        createdAt: new Date(Date.now() - 86400000), // 1 day ago
      },
    ],
  },
  {
    id: 'activity-2',
    title: 'Soirée Jeux de Société',
    description: 'Rejoignez-nous pour une soirée de jeux de société. Apportez vos jeux préférés si vous le souhaitez !',
    image: 'https://images.unsplash.com/photo-1577897245043-d2d0b5168434?q=80&w=2070&auto=format&fit=crop',
    date: nextWeek,
    location: 'Le Colonel Moutarde, 4430 rue St-Denis, Montréal, QC',
    organizer: { id: 'user-2', name: 'Bob', avatar: 'https://i.pravatar.cc/150?u=bob@example.com' },
    participants: ['user-2'],
    maxParticipants: 8,
    comments: [],
  },
  {
    id: 'activity-3',
    title: 'Visite au Musée des Beaux-Arts',
    description: 'Explorons ensemble les nouvelles expositions du musée. Entrée gratuite ce jour-là.',
    image: 'https://images.unsplash.com/photo-1582563266993-871b88a8d234?q=80&w=2070&auto=format&fit=crop',
    date: tenDaysLater,
    location: '1380 Sherbrooke O, Montréal, QC H3G 1J5',
    organizer: { id: 'user-1', name: 'Alice', avatar: 'https://i.pravatar.cc/150?u=alice@example.com' },
    participants: ['user-1', 'user-2', 'user-3'],
    maxParticipants: 15,
    comments: [
      {
        id: 'comment-2',
        author: { id: 'user-3', name: 'Charlie', avatar: 'https://i.pravatar.cc/150?u=charlie@example.com' },
        text: 'Super idée, je serai là !',
        rating: 4,
        createdAt: new Date(Date.now() - 172800000), // 2 days ago
      },
       {
        id: 'comment-3',
        author: { id: 'user-2', name: 'Bob', avatar: 'https://i.pravatar.cc/150?u=bob@example.com' },
        text: 'Très bonne initiative !',
        rating: 5,
        createdAt: new Date(Date.now() - 259200000), // 3 days ago
      },
    ],
  },
];