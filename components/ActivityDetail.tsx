import React, { useState } from 'react';
import type { Activity, User, Comment as CommentType } from '../types';
import { CalendarIcon, LocationIcon, UsersIcon, StarIcon, ArrowLeftIcon } from './icons';

interface ActivityDetailProps {
  activity: Activity;
  currentUser: User | null;
  users: User[];
  onJoin: (activityId: string, userId:string) => void;
  onLeave: (activityId: string, userId: string) => void;
  onAddComment: (activityId: string, comment: Omit<CommentType, 'id' | 'createdAt'>) => void;
  onBack: () => void;
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


export const ActivityDetail: React.FC<ActivityDetailProps> = ({ activity, currentUser, users, onJoin, onLeave, onAddComment, onBack }) => {
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

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button onClick={onBack} className="flex items-center gap-2 mb-6 text-primary hover:underline">
        <ArrowLeftIcon />
        Retour au tableau de bord
      </button>

      <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
        <div className="md:flex">
          <div className="md:flex-shrink-0">
            <img className="h-64 w-full object-cover md:h-full md:w-96" src={image} alt={title} />
          </div>
          <div className="p-8 flex-grow">
            <div className="flex justify-between items-start">
              <h2 className="text-3xl font-bold text-gray-900">{title}</h2>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <StarIcon className="h-5 w-5 text-accent" filled />
                <span>{averageRating.toFixed(1)} ({comments.length} avis)</span>
              </div>
            </div>

            <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
                <span>Organisé par</span>
                <img src={organizer.avatar} alt={organizer.name} className="h-6 w-6 rounded-full"/>
                <strong>{organizer.name}</strong>
            </div>

            <p className="mt-4 text-gray-600">{description}</p>
            
            <div className="mt-6 space-y-4">
              <div className="flex items-center text-gray-700">
                <CalendarIcon className="h-5 w-5 mr-3 text-primary" />
                <span>{date.toLocaleString('fr-FR', { dateStyle: 'full', timeStyle: 'short' })}</span>
              </div>
              <div className="flex items-center text-gray-700">
                <LocationIcon className="h-5 w-5 mr-3 text-primary" />
                <span>{location}</span>
              </div>
              <div className="flex items-center text-gray-700">
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
                <p className="text-center text-gray-500 bg-gray-100 p-3 rounded-md">Veuillez vous connecter pour participer.</p>
              )}
            </div>
          </div>
        </div>
        
        <div className="p-8 border-t border-gray-200">
            <h3 className="text-xl font-semibold mb-4">Participants ({participants.length})</h3>
            <div className="flex flex-wrap gap-4">
                {participants.map(pId => {
                    const participant = getParticipantDetails(pId);
                    return participant ? (
                        <div key={pId} className="flex flex-col items-center text-center w-20">
                            <img src={participant.avatar} alt={participant.name} className="h-12 w-12 rounded-full" />
                            <span className="text-xs mt-1 text-gray-600 truncate">{participant.name}</span>
                        </div>
                    ) : null
                })}
                 {participants.length === 0 && <p className="text-gray-500">Personne n'est encore inscrit.</p>}
            </div>
        </div>

        <div className="p-8 border-t border-gray-200 bg-light">
          <h3 className="text-xl font-semibold mb-4">Commentaires et avis</h3>
          {currentUser && isUserParticipating && (
             <form onSubmit={handleCommentSubmit} className="mb-6 p-4 bg-white rounded-lg shadow">
                <h4 className="font-semibold mb-2">Laissez votre avis</h4>
                <div className="mb-2">
                    <StarRating rating={newRating} setRating={setNewRating} />
                </div>
                <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Votre commentaire..."
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                    rows={3}
                    required
                ></textarea>
                <button type="submit" className="mt-2 px-4 py-2 bg-secondary text-white font-semibold rounded-md hover:bg-slate-700 transition-colors">
                    Envoyer
                </button>
             </form>
          )}

          <div className="space-y-4">
            {comments.length > 0 ? comments.slice().sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()).map(comment => (
              <div key={comment.id} className="flex items-start space-x-4 p-4 bg-white rounded-lg shadow-sm">
                <img src={comment.author.avatar} alt={comment.author.name} className="h-12 w-12 rounded-full" />
                <div className="flex-1">
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="font-semibold">{comment.author.name}</p>
                            <p className="text-xs text-gray-500">{comment.createdAt.toLocaleDateString()}</p>
                        </div>
                        <StarRating rating={comment.rating} />
                    </div>
                  <p className="mt-1 text-gray-700">{comment.text}</p>
                </div>
              </div>
            )) : <p className="text-gray-500">Aucun commentaire pour le moment.</p>}
          </div>
        </div>
      </div>
    </div>
  );
};