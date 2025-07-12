import React from 'react';
import { AlertCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { isProfileComplete } from '../utils/profileValidation';

export const ProfileCompletionBanner: React.FC = () => {
  const { user } = useAuthStore();

  if (!user || isProfileComplete(user)) {
    return null;
  }

  const getMissingFields = () => {
    const missing = [];
    if (!user.name || user.name.trim().length === 0) missing.push('name');
    if (!user.skillsOffered || user.skillsOffered.length === 0) missing.push('skills offered');
    if (!user.skillsWanted || user.skillsWanted.length === 0) missing.push('skills wanted');
    if (!user.availability || user.availability.trim().length === 0) missing.push('availability');
    return missing;
  };

  const missingFields = getMissingFields();

  return (
    <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4 mb-6 transition-colors duration-300">
      <div className="flex items-start space-x-3">
        <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
        <div className="flex-1">
          <h3 className="text-sm font-medium text-amber-900 dark:text-amber-300 mb-1 transition-colors duration-300">
            Complete Your Profile
          </h3>
          <p className="text-sm text-amber-700 dark:text-amber-300 mb-3 transition-colors duration-300">
            Your profile is missing: {missingFields.join(', ')}. 
            Complete it to start connecting with other professionals.
          </p>
          <Link
            to="/profile"
            className="inline-flex items-center space-x-1 text-sm font-medium text-amber-800 dark:text-amber-300 hover:text-amber-900 dark:hover:text-amber-200 transition-colors duration-300"
          >
            <span>Complete Profile</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </div>
  );
};