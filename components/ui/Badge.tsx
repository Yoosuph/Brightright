import React from 'react';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'success' | 'warning' | 'error' | 'info' | 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const Badge: React.FC<BadgeProps> = ({ 
  children, 
  variant = 'secondary', 
  size = 'md',
  className = ''
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-full';
  
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-0.5 text-sm',
    lg: 'px-3 py-1 text-base'
  };
  
  const variantClasses = {
    primary: 'bg-brand-purple/20 text-brand-purple border border-brand-purple/30',
    secondary: 'bg-gray-500/20 text-gray-600 dark:text-gray-400 border border-gray-500/30',
    success: 'bg-green-500/20 text-green-600 dark:text-green-400 border border-green-500/30',
    warning: 'bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 border border-yellow-500/30',
    error: 'bg-red-500/20 text-red-600 dark:text-red-400 border border-red-500/30',
    info: 'bg-blue-500/20 text-blue-600 dark:text-blue-400 border border-blue-500/30'
  };

  const classes = `${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`;

  return (
    <span className={classes}>
      {children}
    </span>
  );
};

export default Badge;