import type { User, Activity } from './types';

export const initialUsers: User[] = [
  {
    id: 'user-1',
    name: 'Alice',
    email: 'alice@example.com',
    avatar: 'https://i.pravatar.cc/150?u=alice@example.com',
    role: 'member',
    status: 'active',
    createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000), // 60 days ago
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
    createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000), // 45 days ago
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
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
    phone: '555-1234',
  },
  {
    id: 'admin-1',
    name: 'Admin User',
    email: 'admin@example.com',
    avatar: 'https://i.pravatar.cc/150?u=admin@example.com',
    role: 'admin',
    status: 'active',
    createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000), // 90 days ago
    gender: 'prefer_not_to_say',
  },
];

// Date helpers
const createDate = (daysOffset: number, hour: number, minute: number) => {
    const date = new Date();
    date.setDate(date.getDate() + daysOffset);
    date.setHours(hour, minute, 0, 0);
    return date;
};

const tomorrow = createDate(1, 10, 0);
const twoDaysLater = createDate(2, 11, 30);
const fourDaysLater = createDate(4, 13, 0);
const nextWeek = createDate(7, 18, 30);
const eightDaysLater = createDate(8, 19, 0);
const tenDaysLater = createDate(10, 9, 0);
const twelveDaysLater = createDate(12, 14, 0);
const fifteenDaysLater = createDate(15, 11, 0);
const twentyDaysLater = createDate(20, 20, 30);
const fiveDaysAgo = createDate(-5, 21, 0);


export const initialActivities: Activity[] = [
  {
    id: 'activity-1',
    title: 'Randonnée au Mont Royal',
    description: 'Une belle randonnée pour profiter de la nature et de la vue sur la ville. Apportez de l\'eau et de bonnes chaussures.',
    image: 'https://images.unsplash.com/photo-1551632811-561732d1e306?q=80&w=2070&auto=format&fit=crop',
    date: tomorrow,
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
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
    id: 'activity-5',
    title: 'Brunch Convivial au Le Cartet',
    description: 'Commençons le week-end avec un délicieux brunch. Le Cartet est connu pour son ambiance et ses plats savoureux. Réservation nécessaire !',
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=1974&auto=format&fit=crop',
    date: twoDaysLater,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    location: 'Le Cartet, 106 McGill St, Montreal, Quebec H2Y 2E5',
    organizer: { id: 'user-1', name: 'Alice', avatar: 'https://i.pravatar.cc/150?u=alice@example.com' },
    participants: ['user-1', 'user-2', 'admin-1'],
    maxParticipants: 4,
    comments: [],
  },
  {
    id: 'activity-4',
    title: 'Picnic et Frisbee au Parc La Fontaine',
    description: 'Profitons d\'un après-midi ensoleillé avec un pique-nique. Apportez vos collations préférées à partager et un frisbee pour des jeux amusants !',
    image: 'https://images.unsplash.com/photo-1524350876685-274059332603?q=80&w=2071&auto=format&fit=crop',
    date: fourDaysLater,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    location: 'Parc La Fontaine, Montréal, QC',
    organizer: { id: 'user-2', name: 'Bob', avatar: 'https://i.pravatar.cc/150?u=bob@example.com' },
    participants: ['user-2'],
    maxParticipants: 20,
    comments: [],
  },
  {
    id: 'activity-2',
    title: 'Soirée Jeux de Société',
    description: 'Rejoignez-nous pour une soirée de jeux de société. Apportez vos jeux préférés si vous le souhaitez !',
    image: 'https://images.unsplash.com/photo-1577897245043-d2d0b5168434?q=80&w=2070&auto=format&fit=crop',
    date: nextWeek,
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    location: 'Le Colonel Moutarde, 4430 rue St-Denis, Montréal, QC',
    organizer: { id: 'user-2', name: 'Bob', avatar: 'https://i.pravatar.cc/150?u=bob@example.com' },
    participants: ['user-2'],
    maxParticipants: 8,
    comments: [],
  },
  {
    id: 'activity-8',
    title: 'Escalade de Bloc Intérieure',
    description: 'Que vous soyez débutant ou grimpeur expérimenté, venez nous rejoindre pour une session d\'escalade de bloc. C\'est un excellent entraînement et très amusant!',
    image: 'https://images.unsplash.com/photo-1571019614242-c5c57128e053?q=80&w=2070&auto=format&fit=crop',
    date: eightDaysLater,
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), // 4 days ago
    location: 'Bloc Shop Chabanel, 2190 Rue Chabanel O, Montréal, QC',
    organizer: { id: 'user-2', name: 'Bob', avatar: 'https://i.pravatar.cc/150?u=bob@example.com' },
    participants: ['user-2', 'user-1'],
    maxParticipants: 10,
    comments: [],
  },
  {
    id: 'activity-3',
    title: 'Visite au Musée des Beaux-Arts',
    description: 'Explorons ensemble les nouvelles expositions du musée. Entrée gratuite ce jour-là.',
    image: 'https://images.unsplash.com/photo-1582563266993-871b88a8d234?q=80&w=2070&auto=format&fit=crop',
    date: tenDaysLater,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
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
  {
    id: 'activity-6',
    title: 'Atelier de Poterie pour Débutants',
    description: 'Découvrez la joie de créer avec de l\'argile. Cet atelier est parfait pour les débutants. Tout le matériel est fourni.',
    image: 'https://images.unsplash.com/photo-1512101271133-3a55c82270ce?q=80&w=2069&auto=format&fit=crop',
    date: twelveDaysLater,
    createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000), // 6 days ago
    location: 'Atelier Forma, 1821 rue Atateken, Montréal, QC',
    organizer: { id: 'user-1', name: 'Alice', avatar: 'https://i.pravatar.cc/150?u=alice@example.com' },
    participants: ['user-1', 'admin-1'],
    maxParticipants: 6,
    comments: [],
  },
  {
    id: 'activity-7',
    title: 'Tour à Vélo sur le Canal Lachine',
    description: 'Une balade à vélo pittoresque le long du canal de Lachine. Le chemin est plat et convient à tous les niveaux. Nous nous arrêterons pour une glace au retour.',
    image: 'https://images.unsplash.com/photo-1496151419423-b7a4993183b6?q=80&w=2070&auto=format&fit=crop',
    date: fifteenDaysLater,
    createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000), // 8 days ago
    location: 'Piste cyclable du Canal de Lachine, Montréal, QC',
    organizer: { id: 'user-2', name: 'Bob', avatar: 'https://i.pravatar.cc/150?u=bob@example.com' },
    participants: ['user-2', 'user-1'],
    maxParticipants: 12,
    comments: [],
  },
  {
    id: 'activity-9',
    title: 'Cinéma en Plein Air: Film Classique',
    description: 'Regardons un film classique sous les étoiles. Apportez une couverture ou une chaise. Du pop-corn sera disponible !',
    image: 'https://images.unsplash.com/photo-1542037104857-e6793e854932?q=80&w=2070&auto=format&fit=crop',
    date: twentyDaysLater,
    createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000), // 12 days ago
    location: 'Cinéma sous les étoiles, Parc de la Paix, Montréal, QC',
    organizer: { id: 'user-1', name: 'Alice', avatar: 'https://i.pravatar.cc/150?u=alice@example.com' },
    participants: ['user-1', 'user-2'],
    maxParticipants: 50,
    comments: [],
  },
  {
    id: 'activity-10',
    title: 'Concert de Jazz au Dièse Onze',
    description: 'Une soirée relaxante avec du jazz live dans un des meilleurs clubs de Montréal.',
    image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=2070&auto=format&fit=crop',
    date: fiveDaysAgo,
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), // 15 days ago
    location: 'Dièse Onze, 4115-A St Denis St, Montreal, Quebec H2W 2M7',
    organizer: { id: 'user-1', name: 'Alice', avatar: 'https://i.pravatar.cc/150?u=alice@example.com' },
    participants: ['user-1', 'user-2'],
    maxParticipants: 10,
    comments: [
      {
        id: 'comment-4',
        author: { id: 'user-2', name: 'Bob', avatar: 'https://i.pravatar.cc/150?u=bob@example.com' },
        text: 'C\'était une soirée incroyable, la musique était fantastique !',
        rating: 5,
        createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), // 4 days ago
      }
    ],
  },
];