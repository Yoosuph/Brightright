import React from 'react';
import Badge from './Badge';

export interface MetricProps {
  label: string;
  value: string | number;
  change?: {
    value: number;
    period: string;
  };
  icon?: React.ReactNode;
  description?: string;
  trend?: 'up' | 'down' | 'neutral';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const Metric: React.FC<MetricProps> = ({
  label,
  value,
  change,
  icon,
  description,
  trend,
  size = 'md',
  className = ''
}) => {
  const sizeClasses = {
    sm: {
      container: 'p-4',
      value: 'text-2xl',
      label: 'text-sm',
      description: 'text-xs'
    },
    md: {
      container: 'p-6',
      value: 'text-3xl',
      label: 'text-base',
      description: 'text-sm'
    },
    lg: {
      container: 'p-8',
      value: 'text-4xl',
      label: 'text-lg',
      description: 'text-base'
    }
  };

  const getTrendIcon = () => {
    if (!change) return null;
    
    const isPositive = change.value > 0;
    const isNegative = change.value < 0;
    
    if (isPositive) {
      return (
        <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
        </svg>
      );
    }
    
    if (isNegative) {
      return (
        <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M16.707 10.293a1 1 0 010 1.414l-6 6a1 1 0 01-1.414 0l-6-6a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l4.293-4.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
      );
    }
    
    return (
      <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
      </svg>
    );
  };

  const getChangeColor = () => {
    if (!change) return 'text-gray-500';
    if (change.value > 0) return 'text-green-500';
    if (change.value < 0) return 'text-red-500';
    return 'text-gray-500';
  };

  const currentSize = sizeClasses[size];

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow ${currentSize.container} ${className}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            {icon && <span className="text-brand-purple">{icon}</span>}
            <h3 className={`font-medium text-gray-600 dark:text-gray-400 ${currentSize.label}`}>
              {label}
            </h3>
          </div>
          
          <div className={`font-bold text-gray-900 dark:text-white ${currentSize.value} mb-1`}>
            {value}
          </div>
          
          {description && (
            <p className={`text-gray-500 dark:text-gray-400 ${currentSize.description}`}>
              {description}
            </p>
          )}
        </div>
        
        {change && (
          <div className="flex flex-col items-end gap-1">
            <div className={`flex items-center gap-1 ${getChangeColor()}`}>
              {getTrendIcon()}
              <span className="text-sm font-semibold">
                {change.value > 0 ? '+' : ''}{change.value}%
              </span>
            </div>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              vs {change.period}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Metric;