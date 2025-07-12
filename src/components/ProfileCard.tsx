import React from 'react';
import { Star, MapPin, Clock, MessageSquare } from 'lucide-react';
import { User } from '../types';
import { SkillTag } from './SkillTag';
import { useAuthStore } from '../store/authStore';

interface ProfileCardProps {
  user: User;
  onRequestClick: (user: User) => void;
  onViewProfile: (user: User) => void;
}

export const ProfileCard: React.FC<ProfileCardProps> = ({ 
  user, 
  onRequestClick, 
  onViewProfile 
}) => {
  const { isAuthenticated } = useAuthStore();

  const availabilityColors = {
    'evenings': 'text-blue-600 bg-blue-50',
    'weekends': 'text-purple-600 bg-purple-50',
    'flexible': 'text-emerald-600 bg-emerald-50',
    'mornings': 'text-orange-600 bg-orange-50'
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden border border-gray-100 dark:border-gray-700">
      {/* Profile Header */}
      <div className="p-6 pb-4">
        <div className="flex items-start space-x-4">
          <div className="relative">
            {user.profilePhoto ? (
              <img
                src={user.profilePhoto}
                alt={user.name}
                className="w-16 h-16 rounded-2xl object-cover border-2 border-white shadow-md"
              />
            ) : (
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-xl font-bold shadow-md">
                {user.name.charAt(0)}
              </div>
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate transition-colors duration-300">{user.name}</h3>
            
            {user.location && (
              <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm mt-1 transition-colors duration-300">
                <MapPin className="w-3 h-3 mr-1" />
                {user.location}
              </div>
            )}
            
            <div className="flex items-center mt-2">
              <div className="flex items-center">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span className="text-sm font-medium text-gray-900 dark:text-white ml-1 transition-colors duration-300">
                  {user.averageRating.toFixed(1)}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400 ml-1 transition-colors duration-300">
                  ({user.reviewCount} reviews)
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Skills Section */}
      <div className="px-6 pb-4">
        <div className="space-y-3">
          <div>
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-300">Skills Offered</h4>
            <div className="flex flex-wrap gap-1.5">
              {user.skillsOffered.slice(0, 3).map((skill) => (
                <SkillTag key={skill} skill={skill} variant="offered" size="sm" />
              ))}
              {user.skillsOffered.length > 3 && (
                <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 px-2 py-1 rounded-full transition-colors duration-300">
                  +{user.skillsOffered.length - 3} more
                </span>
              )}
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-300">Skills Wanted</h4>
            <div className="flex flex-wrap gap-1.5">
              {user.skillsWanted.slice(0, 3).map((skill) => (
                <SkillTag key={skill} skill={skill} variant="wanted" size="sm" />
              ))}
              {user.skillsWanted.length > 3 && (
                <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 px-2 py-1 rounded-full transition-colors duration-300">
                  +{user.skillsWanted.length - 3} more
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-t border-gray-100 dark:border-gray-600 transition-colors duration-300">
        <div className="flex items-center justify-between">
          <div className="flex items-center text-sm">
            <Clock className="w-4 h-4 text-gray-400 dark:text-gray-500 mr-1" />
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${availabilityColors[user.availability as keyof typeof availabilityColors] || 'text-gray-600 bg-gray-100'}`}>
              {user.availability}
            </span>
          </div>
          
          <div className="flex space-x-2">
            <button
              onClick={() => onViewProfile(user)}
              className="px-3 py-1.5 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors duration-300"
            >
              View Profile
            </button>
            <button
              onClick={() => isAuthenticated ? onRequestClick(user) : null}
              disabled={!isAuthenticated}
              className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-all ${
                isAuthenticated 
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 transform hover:scale-105' 
                  : 'bg-gray-200 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
              }`}
            >
              <MessageSquare className="w-3 h-3 mr-1 inline" />
              Request
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};