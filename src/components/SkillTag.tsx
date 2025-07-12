import React from 'react';

interface SkillTagProps {
  skill: string;
  variant?: 'offered' | 'wanted' | 'neutral';
  size?: 'sm' | 'md';
}

export const SkillTag: React.FC<SkillTagProps> = ({ 
  skill, 
  variant = 'neutral',
  size = 'md'
}) => {
  const variantClasses = {
    offered: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-700',
    wanted: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-700',
    neutral: 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600'
  };

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1 text-sm'
  };

  return (
    <span className={`inline-flex items-center rounded-full border font-medium transition-colors duration-300 ${variantClasses[variant]} ${sizeClasses[size]}`}>
      {skill}
    </span>
  );
};