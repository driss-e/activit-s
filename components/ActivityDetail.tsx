import React, { useState, useEffect, useMemo } from 'react';
import type { Activity, User, Comment as CommentType, View, Category } from '../types';
import { CalendarIcon, LocationIcon, UsersIcon, StarIcon, ArrowLeftIcon } from './icons';

interface ActivityDetailProps {
  activity: Activity;
  currentUser: User | null;
  users: User[];
  onJoin: (activityId: string, userId:string) => void;
  onLeave: (activityId: string, userId: string) => void;
  onAddComment: (activityId: string, comment: Omit<CommentType, 'id' | 'createdAt'>) => void;
  onBack: () => void;
  setView: (view: View) => void;
}

const categoryStyles: { [key in Category]: string } = {
  Outdoors: 'bg-green-500',
  Sports: 'bg-blue-500',
  Culture: 'bg-purple-500',
  Social: 'bg-pink-500',
};

const categoryDisplayNames: { [key in Category]: string } = {
    Outdoors: 'Plein air',
    Sports: 'Sports',
    Culture: 'Culture',
    Social: 'Social',
};


const StarRating: React.FC<{ rating: number; setRating?: (rating: number) => void }> = ({ rating, setRating }) => {
  return (
    <div className="flex items-center">
      {[1, 2, 3, 4, 5].map((star) => (
        <span key={star} onClick={() => setRating?.(star)}>
          <StarIcon
            className={`h-6 w-6 text-accent ${setRating ? 'cursor-pointer' : ''}`}
            filled={star <= rating}
          />
        </span>
      ))}
    </div>
  );
};


export const ActivityDetail: React.FC<ActivityDetailProps> = ({ activity, currentUser, users, onJoin, onLeave, onAddComment, onBack, setView }) => {
  const [newComment, setNewComment] = useState('');
  const [newRating, setNewRating] = useState(5);
  const [mainImage, setMainImage] = useState(activity?.images[0] || '');

  useEffect(() => {
    if (activity && activity.images.length > 0) {
        setMainImage(activity.images[0]);
    }
  }, [activity]);
  
  if (!activity) {
    return <div className="text-center p-8">Activité non trouvée.</div>;
  }
  
  const { id, title, description, images, date, location, participants, maxParticipants, organizer, comments, category } = activity;

  const isUserParticipating = currentUser ? participants.includes(currentUser.id) : false;
  const isFull = participants.length >= maxParticipants;
  const averageRating = comments.length > 0 ? comments.reduce((acc, c) => acc + c.rating, 0) / comments.length : 0;
  const categoryStyle = `${categoryStyles[category]} text-white`;

  // Filter out participants who have been soft-deleted
  const activeParticipants = useMemo(() => 
    participants.map(pId => users.find(u => u.id === pId))
                .filter((p): p is User => p !== undefined && p.status !== 'deleted'),
    [participants, users]
  );
  
  // Filter out comments from soft-deleted users
  const visibleComments = useMemo(() =>
    comments.filter(comment => {
        const author = users.find(u => u.id === comment.author.id);
        return author && author.status !== 'deleted';
    }).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()),
    [comments, users]
  );


  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim() && currentUser) {
      onAddComment(id, {
        author: { id: currentUser.id, name: currentUser.name, avatar: currentUser.avatar },
        text: newComment,
        rating: newRating,
      });
      setNewComment('');
      setNewRating(5);
    }
  };

  const handleUserClick = (userId: string) => {
    if (currentUser && currentUser.id === userId) {
      setView({ type: 'PROFILE' });
    } else {
      setView({ type: 'USER_PROFILE', userId });
    }
  };
  
  return (
    <div className="bg-light dark:bg-dark">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <button onClick={onBack} className="flex items-center gap-2 mb-6 text-primary hover:underline font-semibold">
                <ArrowLeftIcon className="w-5 h-5" />
                Retour aux activités
            </button>

            <div className="bg-white rounded-2xl shadow-xl overflow-hidden dark:bg-stone-800">
                <div className="relative h-64 md:h-80 w-full">
                    <img className="h-full w-full object-cover" src={mainImage} alt={title} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/20"></div>
                    <div className="absolute bottom-0 left-0 p-8 text-white">
                         <span className={`inline-block px-3 py-1 text-sm font-semibold rounded-full mb-2 ${categoryStyle}`}>
                            {categoryDisplayNames[category]}
                        </span>
                         <h2 className="text-3xl md:text-4xl font-bold font-heading">{title}</h2>
                         <div 
                            className="flex items-center gap-2 mt-2 text-sm text-stone-300 cursor-pointer w-fit"
                            onClick={() => handleUserClick(organizer.id)}
                        >
                            <span>Organisé par</span>
                            <img src={organizer.avatar} alt={organizer.name} className="h-6 w-6 rounded-full"/>
                            <strong className="hover:underline hover:text-white">{organizer.name}</strong>
                        </div>
                    </div>
                </div>
            
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-8">
                    <div className="lg:col-span-2">
                        <h3 className="text-xl font-bold font-heading text-stone-800 dark:text-stone-100 mb-4">À propos de l'activité</h3>
                        <p className="text-stone-600 dark:text-stone-300 leading-relaxed">{description}</p>
                        
                        {images.length > 1 && (
                            <div className="mt-8">
                                <h3 className="text-xl font-bold font-heading text-stone-800 dark:text-stone-100 mb-4">Galerie</h3>
                                <div className="flex flex-wrap gap-2">
                                    {images.map((imgSrc, index) => (
                                        <button 
                                            key={index} 
                                            onClick={() => setMainImage(imgSrc)}
                                            className={`w-24 h-24 rounded-md overflow-hidden focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary ${imgSrc === mainImage ? 'ring-2 ring-primary' : 'ring-1 ring-stone-300 dark:ring-stone-600'}`}
                                        >
                                            <img src={imgSrc} alt={`Galerie ${index + 1}`} className="w-full h-full object-cover" />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                        
                        <div className="mt-8">
                            <h3 className="text-xl font-bold font-heading text-stone-800 dark:text-stone-100 mb-4">Participants ({activeParticipants.length}/{maxParticipants})</h3>
                            <div className="flex items-center -space-x-2">
                               {activeParticipants.slice(0, 10).map(participant => (
                                    <img 
                                        key={participant.id}
                                        src={participant.avatar} 
                                        alt={participant.name} 
                                        title={participant.name}
                                        className="h-10 w-10 rounded-full ring-2 ring-white dark:ring-stone-800 cursor-pointer hover:scale-110 transition-transform"
                                        onClick={() => handleUserClick(participant.id)}
                                    />
                                ))}
                                {activeParticipants.length > 10 && (
                                    <div className="h-10 w-10 rounded-full bg-stone-200 flex items-center justify-center ring-2 ring-white dark:bg-stone-700 dark:ring-stone-800 text-sm font-semibold text-stone-600 dark:text-stone-300">
                                        +{activeParticipants.length - 10}
                                    </div>
                                )}
                                {activeParticipants.length === 0 && <p className="text-stone-500 dark:text-stone-400 ml-2">Personne n'est encore inscrit.</p>}
                            </div>
                        </div>
                    </div>
                    
                    <div className="lg:col-span-1">
                        <div className="bg-stone-50 dark:bg-stone-900/50 p-6 rounded-xl space-y-4">
                           <div className="flex items-start text-stone-700 dark:text-stone-300">
                                <CalendarIcon className="h-5 w-5 mr-4 mt-1 text-primary flex-shrink-0" />
                                <div>
                                    <p className="font-semibold">{date.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
                                    <p className="text-sm">{date.toLocaleTimeString('fr-FR', { timeStyle: 'short' })}</p>
                                </div>
                            </div>
                            <div className="flex items-start text-stone-700 dark:text-stone-300">
                                <LocationIcon className="h-5 w-5 mr-4 mt-1 text-primary flex-shrink-0" />
                                <div>
                                    <p className="font-semibold">Lieu</p>
                                    <a 
                                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm hover:underline hover:text-primary-hover transition-colors"
                                    >
                                    {location}
                                    </a>
                                </div>
                            </div>
                             <div className="flex items-start text-stone-700 dark:text-stone-300">
                                <UsersIcon className="h-5 w-5 mr-4 mt-1 text-primary flex-shrink-0" />
                                <div>
                                    <p className="font-semibold">{isFull ? 'Complet' : `${maxParticipants - activeParticipants.length} places restantes`}</p>
                                    <p className="text-sm">{activeParticipants.length} / {maxParticipants} participants</p>
                                </div>
                            </div>
                        </div>
                         <div className="mt-6">
                            {currentUser ? (
                                isUserParticipating ? (
                                <button onClick={() => onLeave(id, currentUser.id)} className="w-full px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors shadow-md hover:shadow-lg">
                                    Annuler ma participation
                                </button>
                                ) : (
                                <button onClick={() => onJoin(id, currentUser.id)} disabled={isFull} className="w-full px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary-hover disabled:bg-stone-400 disabled:cursor-not-allowed transition-colors shadow-md hover:shadow-lg">
                                    {isFull ? 'Complet' : 'Rejoindre l\'activité'}
                                </button>
                                )
                            ) : (
                                <p className="text-center text-stone-500 bg-stone-100 p-3 rounded-md dark:bg-stone-700 dark:text-stone-400">Veuillez vous connecter pour participer.</p>
                            )}
                        </div>
                    </div>
                </div>
            
                <div className="p-8 border-t border-stone-200 bg-light dark:bg-dark/50 dark:border-stone-700">
                    <h3 className="text-xl font-bold font-heading mb-4 dark:text-stone-200">Commentaires et avis ({visibleComments.length})</h3>
                    {currentUser && isUserParticipating && (
                        <form onSubmit={handleCommentSubmit} className="mb-6 p-4 bg-white rounded-lg shadow-sm dark:bg-stone-700">
                            <h4 className="font-semibold mb-2 dark:text-stone-200">Laissez votre avis</h4>
                            <div className="mb-2">
                                <StarRating rating={newRating} setRating={setNewRating} />
                            </div>
                            <textarea
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                placeholder="Votre commentaire..."
                                className="w-full p-2 border border-stone-300 rounded-md focus:ring-primary focus:border-primary dark:bg-stone-600 dark:border-stone-500 dark:text-stone-200 dark:placeholder-stone-400"
                                rows={3}
                                required
                            ></textarea>
                            <button type="submit" className="mt-2 px-4 py-2 bg-secondary text-white font-semibold rounded-md hover:bg-slate-700 dark:hover:bg-slate-600 transition-colors">
                                Envoyer
                            </button>
                        </form>
                    )}

                    <div className="space-y-4">
                        {visibleComments.length > 0 ? visibleComments.map(comment => (
                        <div key={comment.id} className="flex items-start space-x-4 p-4 bg-white rounded-lg shadow-sm dark:bg-stone-700">
                            <img 
                                src={comment.author.avatar} 
                                alt={comment.author.name} 
                                className="h-12 w-12 rounded-full cursor-pointer hover:ring-2 hover:ring-primary"
                                onClick={() => handleUserClick(comment.author.id)}
                            />
                            <div className="flex-1">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <p 
                                            className="font-semibold cursor-pointer hover:underline dark:text-stone-200"
                                            onClick={() => handleUserClick(comment.author.id)}
                                        >{comment.author.name}</p>
                                        <p className="text-xs text-stone-500 dark:text-stone-400">{comment.createdAt.toLocaleDateString()}</p>
                                    </div>
                                    <StarRating rating={comment.rating} />
                                </div>
                            <p className="mt-1 text-stone-700 dark:text-stone-300">{comment.text}</p>
                            </div>
                        </div>
                        )) : <p className="text-stone-500 dark:text-stone-400 text-center py-4">Aucun commentaire pour le moment.</p>}
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};