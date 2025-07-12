import { User } from '../types';

export const isProfileComplete = (user: User | null): boolean => {
  if (!user) return false;
  
  // Check required fields for a complete profile
  const hasBasicInfo = Boolean(user.name && user.name.trim().length > 0);
  const hasSkillsOffered = Boolean(user.skillsOffered && user.skillsOffered.length > 0);
  const hasSkillsWanted = Boolean(user.skillsWanted && user.skillsWanted.length > 0);
  const hasAvailability = Boolean(user.availability && user.availability.trim().length > 0);
  
  return hasBasicInfo && hasSkillsOffered && hasSkillsWanted && hasAvailability;
};

export const isNewUser = (user: User | null): boolean => {
  if (!user) return true;
  
  // Consider a user "new" if they have minimal profile information
  const hasMinimalInfo = user.skillsOffered && user.skillsOffered.length === 0 &&
                         user.skillsWanted && user.skillsWanted.length === 0;
  
  return hasMinimalInfo;
};