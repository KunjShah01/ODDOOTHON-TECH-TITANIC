import React, { useState } from 'react';
import { X, Send } from 'lucide-react';
import { User } from '../types';
import { useAuthStore } from '../store/authStore';
import { useAppStore } from '../store/appStore';
import { SkillTag } from './SkillTag';
import toast from 'react-hot-toast';

interface SwapRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetUser: User | null;
}

export const SwapRequestModal: React.FC<SwapRequestModalProps> = ({
  isOpen,
  onClose,
  targetUser
}) => {
  const [selectedOfferedSkill, setSelectedOfferedSkill] = useState('');
  const [selectedWantedSkill, setSelectedWantedSkill] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { user } = useAuthStore();
  const { addSwapRequest } = useAppStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedOfferedSkill || !selectedWantedSkill) {
      toast.error('Please select skills for the swap');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newRequest = {
        id: Date.now().toString(),
        fromUserId: user!.id,
        toUserId: targetUser!.id,
        fromUser: user!,
        toUser: targetUser!,
        offeredSkill: selectedOfferedSkill,
        wantedSkill: selectedWantedSkill,
        message,
        status: 'pending' as const,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      addSwapRequest(newRequest);
      toast.success('Swap request sent successfully!');
      onClose();
      
      // Reset form
      setSelectedOfferedSkill('');
      setSelectedWantedSkill('');
      setMessage('');
    } catch (error) {
      toast.error('Failed to send request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen || !targetUser || !user) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto transition-colors duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white transition-colors duration-300">Request Skill Swap</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-300"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Target User Info */}
          <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-xl transition-colors duration-300">
            {targetUser.profilePhoto ? (
              <img
                src={targetUser.profilePhoto}
                alt={targetUser.name}
                className="w-12 h-12 rounded-xl object-cover"
              />
            ) : (
              <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                {targetUser.name.charAt(0)}
              </div>
            )}
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white transition-colors duration-300">{targetUser.name}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300">Skill exchange request</p>
            </div>
          </div>

          {/* Skill Selection */}
          <div className="space-y-4">
            {/* Your Offered Skill */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-300">
                Skill you'll offer
              </label>
              <select
                value={selectedOfferedSkill}
                onChange={(e) => setSelectedOfferedSkill(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-300"
                required
              >
                <option value="">Select a skill to offer</option>
                {user.skillsOffered.map((skill) => (
                  <option key={skill} value={skill}>{skill}</option>
                ))}
              </select>
            </div>

            {/* Wanted Skill */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-300">
                Skill you want to learn
              </label>
              <select
                value={selectedWantedSkill}
                onChange={(e) => setSelectedWantedSkill(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-300"
                required
              >
                <option value="">Select a skill to learn</option>
                {targetUser.skillsOffered.map((skill) => (
                  <option key={skill} value={skill}>{skill}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Preview */}
          {selectedOfferedSkill && selectedWantedSkill && (
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl transition-colors duration-300">
              <h4 className="text-sm font-medium text-blue-900 dark:text-blue-300 mb-2 transition-colors duration-300">Swap Preview:</h4>
              <div className="flex items-center justify-center space-x-3">
                <SkillTag skill={selectedOfferedSkill} variant="offered" />
                <span className="text-blue-600 dark:text-blue-400">↔</span>
                <SkillTag skill={selectedWantedSkill} variant="wanted" />
              </div>
            </div>
          )}

          {/* Message */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-300">
              Message (optional)
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Add a personal message to introduce yourself..."
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors duration-300"
              rows={3}
            />
          </div>

          {/* Actions */}
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-xl transition-colors duration-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !selectedOfferedSkill || !selectedWantedSkill}
              className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center space-x-2"
            >
              {isSubmitting ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Send Request</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};