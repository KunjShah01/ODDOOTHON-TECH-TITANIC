import React, { useState, useRef } from 'react';
import { Camera, MapPin, Globe, Lock, Save, X, CheckCircle } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { SkillTag } from '../components/SkillTag';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { isProfileComplete } from '../utils/profileValidation';
import toast from 'react-hot-toast';

export const Profile: React.FC = () => {
  const { user, updateProfile } = useAuthStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    name: user?.name || '',
    location: user?.location || '',
    profilePhoto: user?.profilePhoto || '',
    skillsOffered: user?.skillsOffered || [],
    skillsWanted: user?.skillsWanted || [],
    availability: user?.availability || 'evenings',
    isPublic: user?.isPublic ?? true
  });

  const [newSkillOffered, setNewSkillOffered] = useState('');
  const [newSkillWanted, setNewSkillWanted] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const profileComplete = isProfileComplete({ ...user, ...formData } as any);
  const availabilityOptions = [
    { value: 'mornings', label: 'Mornings' },
    { value: 'evenings', label: 'Evenings' },
    { value: 'weekends', label: 'Weekends' },
    { value: 'flexible', label: 'Flexible' }
  ];

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size must be less than 5MB');
        return;
      }

      if (!file.type.startsWith('image/')) {
        toast.error('Please select a valid image file');
        return;
      }

      // In a real app, you would upload to a server
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        handleInputChange('profilePhoto', dataUrl);
        toast.success('Photo uploaded successfully!');
      };
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = () => {
    handleInputChange('profilePhoto', '');
    toast.success('Photo removed');
  };

  const addSkill = (type: 'offered' | 'wanted', skill: string) => {
    if (!skill.trim()) return;

    const skillsArray = type === 'offered' ? formData.skillsOffered : formData.skillsWanted;
    
    if (skillsArray.includes(skill.trim())) {
      toast.error('Skill already added');
      return;
    }

    const newSkills = [...skillsArray, skill.trim()];
    handleInputChange(type === 'offered' ? 'skillsOffered' : 'skillsWanted', newSkills);
    
    if (type === 'offered') {
      setNewSkillOffered('');
    } else {
      setNewSkillWanted('');
    }
  };

  const removeSkill = (type: 'offered' | 'wanted', skillToRemove: string) => {
    const skillsArray = type === 'offered' ? formData.skillsOffered : formData.skillsWanted;
    const newSkills = skillsArray.filter(skill => skill !== skillToRemove);
    handleInputChange(type === 'offered' ? 'skillsOffered' : 'skillsWanted', newSkills);
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      toast.error('Name is required');
      return;
    }

    if (formData.skillsOffered.length === 0) {
      toast.error('Please add at least one skill you can offer');
      return;
    }

    if (formData.skillsWanted.length === 0) {
      toast.error('Please add at least one skill you want to learn');
      return;
    }

    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      updateProfile(formData);
      setHasChanges(false);
      
      if (profileComplete) {
        toast.success('Profile completed! You can now start connecting with other professionals.');
      } else {
        toast.success('Profile updated successfully!');
      }
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDiscard = () => {
    setFormData({
      name: user?.name || '',
      location: user?.location || '',
      profilePhoto: user?.profilePhoto || '',
      skillsOffered: user?.skillsOffered || [],
      skillsWanted: user?.skillsWanted || [],
      availability: user?.availability || 'evenings',
      isPublic: user?.isPublic ?? true
    });
    setHasChanges(false);
    setNewSkillOffered('');
    setNewSkillWanted('');
    toast.success('Changes discarded');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 transition-colors duration-300">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white transition-colors duration-300">Profile Settings</h1>
              <p className="text-gray-600 dark:text-gray-300 mt-1 transition-colors duration-300">Manage your profile information and skill preferences</p>
            </div>
            {profileComplete && (
              <div className="flex items-center space-x-2 text-green-600">
                <CheckCircle className="w-5 h-5" />
                <span className="text-sm font-medium">Profile Complete</span>
              </div>
            )}
          </div>
        </div>

        {/* Profile Completion Status */}
        {!profileComplete && (
          <div className="px-6 py-4 bg-amber-50 dark:bg-amber-900/20 border-b border-amber-200 dark:border-amber-800 transition-colors duration-300">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 border-2 border-amber-400 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-sm font-medium text-amber-800 dark:text-amber-300 transition-colors duration-300">
                Complete all required fields to start connecting with professionals
              </span>
            </div>
          </div>
        )}

        <div className="p-6 space-y-8">
          {/* Profile Photo Section */}
          <div className="flex flex-col sm:flex-row items-start space-y-4 sm:space-y-0 sm:space-x-6">
            <div className="relative">
              {formData.profilePhoto ? (
                <img
                  src={formData.profilePhoto}
                  alt="Profile"
                  className="w-24 h-24 rounded-2xl object-cover border-2 border-gray-200"
                />
              ) : (
                <div className="w-24 h-24 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-2xl font-bold">
                  {formData.name.charAt(0) || 'U'}
                </div>
              )}
              
              {formData.profilePhoto && (
                <button
                  onClick={removePhoto}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
            
            <div className="flex-1">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2 transition-colors duration-300">Profile Photo</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 transition-colors duration-300">
                Upload a professional photo to help others recognize you
              </p>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-xl transition-colors duration-300"
              >
                <Camera className="w-4 h-4" />
                <span>Upload Photo</span>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
              />
            </div>
          </div>

          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-300">
                Full Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Enter your full name"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors duration-300"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-300">
                Location
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5" />
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  placeholder="City, Country"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors duration-300"
                />
              </div>
            </div>
          </div>

          {/* Availability */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-300">
              Availability
            </label>
            <select
              value={formData.availability}
              onChange={(e) => handleInputChange('availability', e.target.value)}
              className="w-full md:w-64 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-300"
            >
              {availabilityOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Skills Offered */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-300">
              Skills I Can Offer *
            </label>
            <div className="flex flex-wrap gap-2 mb-3">
              {formData.skillsOffered.map((skill) => (
                <div key={skill} className="flex items-center">
                  <SkillTag skill={skill} variant="offered" />
                  <button
                    onClick={() => removeSkill('offered', skill)}
                    className="ml-1 w-5 h-5 text-red-500 hover:text-red-700"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex space-x-2">
              <input
                type="text"
                value={newSkillOffered}
                onChange={(e) => setNewSkillOffered(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addSkill('offered', newSkillOffered)}
                placeholder="Add a skill you can teach"
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors duration-300"
              />
              <button
                onClick={() => addSkill('offered', newSkillOffered)}
                className="px-4 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors"
              >
                Add
              </button>
            </div>
          </div>

          {/* Skills Wanted */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-300">
              Skills I Want to Learn *
            </label>
            <div className="flex flex-wrap gap-2 mb-3">
              {formData.skillsWanted.map((skill) => (
                <div key={skill} className="flex items-center">
                  <SkillTag skill={skill} variant="wanted" />
                  <button
                    onClick={() => removeSkill('wanted', skill)}
                    className="ml-1 w-5 h-5 text-red-500 hover:text-red-700"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex space-x-2">
              <input
                type="text"
                value={newSkillWanted}
                onChange={(e) => setNewSkillWanted(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addSkill('wanted', newSkillWanted)}
                placeholder="Add a skill you want to learn"
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors duration-300"
              />
              <button
                onClick={() => addSkill('wanted', newSkillWanted)}
                className="px-4 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors"
              >
                Add
              </button>
            </div>
          </div>

          {/* Profile Visibility */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 transition-colors duration-300">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {formData.isPublic ? (
                    <Globe className="w-5 h-5 text-green-600" />
                  ) : (
                    <Lock className="w-5 h-5 text-gray-600" />
                  )}
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white transition-colors duration-300">Profile Visibility</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300 transition-colors duration-300">
                      {formData.isPublic 
                        ? 'Your profile is visible to all users' 
                        : 'Your profile is private and only visible to you'
                      }
                    </p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isPublic}
                    onChange={(e) => handleInputChange('isPublic', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-6 pb-6 border-t border-gray-200 dark:border-gray-700 flex justify-center -mt-2">
              <button
                onClick={handleSave}
                disabled={isLoading || !hasChanges}
                className="flex-1 sm:flex-none px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center space-x-2"
              >
                {isLoading ? (
                  <LoadingSpinner size="sm" />
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Save Changes</span>
                  </>
                )}
              </button>
              
              <button
                onClick={handleDiscard}
                disabled={!hasChanges}
                className="flex-1 sm:flex-none px-6 py-3 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl transition-colors duration-300"
              >
                Discard Changes
              </button>
          </div>
        </div>
      </div>
  
  );
};