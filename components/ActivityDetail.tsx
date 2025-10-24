

import React, { useState } from 'react';
import type { Activity, User, Comment as CommentType, View } from '../types';
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

const StarRating: React.FC<{ rating: number; setRating?: (rating: number) => void }> = ({ rating, setRating }) => {
  return (
    <div className="flex items-center">
      {/* FIX: Wrap StarIcon in a span to handle the click event and key prop, resolving the prop type error. */}
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
  
  if (!activity) {
    return <div className="text-center p-8">Activité non trouvée.</div>;
  }
  
  const { id, title, description, image, date, location, participants, maxParticipants, organizer, comments } = activity;

  const isUserParticipating = currentUser ? participants.includes(currentUser.id) : false;
  const isFull = participants.length >= maxParticipants;
  const averageRating = comments.length > 0 ? comments.reduce((acc, c) => acc + c.rating, 0) / comments.length : 0;

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

  const getParticipantDetails = (userId: string) => users.find(u => u.id === userId);

  const handleUserClick = (userId: string) => {
    if (currentUser && currentUser.id === userId) {
      setView({ type: 'PROFILE' });
    } else {
      setView({ type: 'USER_PROFILE', userId });
    }
  };

  const UserDisplay: React.FC<{ user: Pick<User, 'id' | 'name' | 'avatar'>; size?: 'sm' | 'md' }> = ({ user, size = 'md' }) => (
     <div 
        className="flex flex-col items-center text-center w-20 cursor-pointer group"
        onClick={() => handleUserClick(user.id)}
    >
        <img 
            src={user.avatar} 
            alt={user.name} 
            className={`${size === 'md' ? 'h-12 w-12' : 'h-10 w-10'} rounded-full group-hover:ring-2 group-hover:ring-primary transition-all`}
        />
        <span className="text-xs mt-1 text-gray-600 truncate group-hover:text-primary dark:text-slate-400 dark:group-hover:text-primary-hover">{user.name}</span>
    </div>
  );


  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button onClick={onBack} className="flex items-center gap-2 mb-6 text-primary hover:underline">
        <ArrowLeftIcon />
        Retour au tableau de bord
      </button>

      <div className="bg-white rounded-xl shadow-2xl overflow-hidden dark:bg-slate-800">
        <div className="md:flex">
          <div className="md:flex-shrink-0">
            <img className="h-64 w-full object-cover md:h-full md:w-96" src={image} alt={title} />
          </div>
          <div className="p-8 flex-grow">
            <div className="flex justify-between items-start">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-slate-100">{title}</h2>
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-slate-400">
                <StarIcon className="h-5 w-5 text-accent" filled />
                <span>{averageRating.toFixed(1)} ({comments.length} avis)</span>
              </div>
            </div>

            <div 
                className="flex items-center gap-2 mt-2 text-sm text-gray-500 cursor-pointer dark:text-slate-400"
                onClick={() => handleUserClick(organizer.id)}
            >
                <span>Organisé par</span>
                <img src={organizer.avatar} alt={organizer.name} className="h-6 w-6 rounded-full"/>
                <strong className="hover:underline hover:text-primary">{organizer.name}</strong>
            </div>

            <p className="mt-4 text-gray-600 dark:text-slate-300">{description}</p>
            
            <div className="mt-6 space-y-4">
              <div className="flex items-center text-gray-700 dark:text-slate-300">
                <CalendarIcon className="h-5 w-5 mr-3 text-primary" />
                <span>{date.toLocaleString('fr-FR', { dateStyle: 'full', timeStyle: 'short' })}</span>
              </div>
              <div className="flex items-center text-gray-700 dark:text-slate-300">
                <LocationIcon className="h-5 w-5 mr-3 text-primary" />
                <a 
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline hover:text-primary-hover transition-colors"
                >
                  {location}
                </a>
              </div>
              <div className="flex items-center text-gray-700 dark:text-slate-300">
                <UsersIcon className="h-5 w-5 mr-3 text-primary" />
                <span>{participants.length} / {maxParticipants} participants</span>
              </div>
            </div>

            <div className="mt-8">
              {currentUser ? (
                isUserParticipating ? (
                  <button onClick={() => onLeave(id, currentUser.id)} className="w-full px-6 py-3 bg-red-600 text-white font-semibold rounded-md hover:bg-red-700 transition-colors">
                    Annuler ma participation
                  </button>
                ) : (
                  <button onClick={() => onJoin(id, currentUser.id)} disabled={isFull} className="w-full px-6 py-3 bg-primary text-white font-semibold rounded-md hover:bg-primary-hover disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors">
                    {isFull ? 'Complet' : 'Rejoindre l\'activité'}
                  </button>
                )
              ) : (
                <p className="text-center text-gray-500 bg-gray-100 p-3 rounded-md dark:bg-slate-700 dark:text-slate-400">Veuillez vous connecter pour participer.</p>
              )}
            </div>
          </div>
        </div>
        
        <div className="p-8 border-t border-gray-200 dark:border-slate-700">
            <h3 className="text-xl font-semibold mb-4 dark:text-slate-200">Participants ({participants.length})</h3>
            <div className="flex flex-wrap gap-4">
                {participants.map(pId => {
                    const participant = getParticipantDetails(pId);
                    return participant ? <UserDisplay key={pId} user={participant} /> : null
                })}
                 {participants.length === 0 && <p className="text-gray-500 dark:text-slate-400">Personne n'est encore inscrit.</p>}
            </div>
        </div>

        <div className="p-8 border-t border-gray-200 bg-light dark:bg-slate-900/50 dark:border-slate-700">
          <h3 className="text-xl font-semibold mb-4 dark:text-slate-200">Commentaires et avis</h3>
          {currentUser && isUserParticipating && (
             <form onSubmit={handleCommentSubmit} className="mb-6 p-4 bg-white rounded-lg shadow dark:bg-slate-700">
                <h4 className="font-semibold mb-2 dark:text-slate-200">Laissez votre avis</h4>
                <div className="mb-2">
                    <StarRating rating={newRating} setRating={setNewRating} />
                </div>
                <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Votre commentaire..."
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary dark:bg-slate-600 dark:border-slate-500 dark:text-slate-200 dark:placeholder-slate-400"
                    rows={3}
                    required
                ></textarea>
                <button type="submit" className="mt-2 px-4 py-2 bg-secondary text-white font-semibold rounded-md hover:bg-slate-700 dark:hover:bg-slate-600 transition-colors">
                    Envoyer
                </button>
             </form>
          )}

          <div className="space-y-4">
            {comments.length > 0 ? comments.slice().sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()).map(comment => (
              <div key={comment.id} className="flex items-start space-x-4 p-4 bg-white rounded-lg shadow-sm dark:bg-slate-700">
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
                                className="font-semibold cursor-pointer hover:underline dark:text-slate-200"
                                onClick={() => handleUserClick(comment.author.id)}
                            >{comment.author.name}</p>
                            <p className="text-xs text-gray-500 dark:text-slate-400">{comment.createdAt.toLocaleDateString()}</p>
                        </div>
                        <StarRating rating={comment.rating} />
                    </div>
                  <p className="mt-1 text-gray-700 dark:text-slate-300">{comment.text}</p>
                </div>
              </div>
            )) : <p className="text-gray-500 dark:text-slate-400">Aucun commentaire pour le moment.</p>}
          </div>
        </div>
      </div>
    </div>
  );
};