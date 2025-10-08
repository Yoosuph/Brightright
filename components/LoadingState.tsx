import React from 'react';

interface LoadingStateProps {
  type?: 'spinner' | 'dots' | 'pulse' | 'bars' | 'skeleton';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  message?: string;
  className?: string;
  fullScreen?: boolean;
  overlay?: boolean;
}

const LoadingSpinner: React.FC<{ className?: string; color?: string }> = ({ 
  className = '', 
  color = 'text-brand-purple' 
}) => (
  <svg
    className={`animate-spin ${color} ${className}`}
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    />
  </svg>
);

const LoadingDots: React.FC<{ className?: string; color?: string }> = ({ 
  className = '', 
  color = 'bg-brand-purple' 
}) => (
  <div className={`flex space-x-1 ${className}`}>
    {[0, 1, 2].map((i) => (
      <div
        key={i}
        className={`w-2 h-2 ${color} rounded-full animate-bounce`}
        style={{
          animationDelay: `${i * 0.1}s`,
          animationDuration: '0.6s',
        }}
      />
    ))}
  </div>
);

const LoadingPulse: React.FC<{ className?: string; color?: string }> = ({ 
  className = '', 
  color = 'bg-brand-purple' 
}) => (
  <div className={`flex justify-center ${className}`}>
    <div className={`w-8 h-8 ${color} rounded-full animate-pulse opacity-75`} />
  </div>
);

const LoadingBars: React.FC<{ className?: string; color?: string }> = ({ 
  className = '', 
  color = 'bg-brand-purple' 
}) => (
  <div className={`flex items-end space-x-1 ${className}`}>
    {[0, 1, 2, 3, 4].map((i) => (
      <div
        key={i}
        className={`w-1 ${color} rounded-sm animate-pulse`}
        style={{
          height: `${Math.random() * 20 + 10}px`,
          animationDelay: `${i * 0.1}s`,
          animationDuration: '1s',
        }}
      />
    ))}
  </div>
);

const LoadingSkeleton: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`animate-pulse ${className}`}>
    <div className="space-y-3">
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6" />
    </div>
  </div>
);

const LoadingState: React.FC<LoadingStateProps> = ({
  type = 'spinner',
  size = 'md',
  color = 'primary',
  message,
  className = '',
  fullScreen = false,
  overlay = false,
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12',
  };

  const colorClasses = {
    primary: 'text-brand-purple bg-brand-purple',
    secondary: 'text-gray-600 dark:text-gray-400 bg-gray-600 dark:bg-gray-400',
    success: 'text-green-600 bg-green-600',
    warning: 'text-yellow-600 bg-yellow-600',
    error: 'text-red-600 bg-red-600',
  };

  const sizeClass = sizeClasses[size];
  const colorClass = colorClasses[color];

  const renderLoadingElement = () => {
    switch (type) {
      case 'dots':
        return <LoadingDots className={sizeClass} color={colorClass} />;
      case 'pulse':
        return <LoadingPulse className={sizeClass} color={colorClass} />;
      case 'bars':
        return <LoadingBars className={sizeClass} color={colorClass} />;
      case 'skeleton':
        return <LoadingSkeleton className={sizeClass} />;
      case 'spinner':
      default:
        return <LoadingSpinner className={sizeClass} color={colorClass} />;
    }
  };

  const content = (
    <div className={`flex flex-col items-center justify-center space-y-3 ${className}`}>
      {renderLoadingElement()}
      {message && (
        <p className={`text-center font-medium ${
          size === 'sm' ? 'text-xs' : 
          size === 'md' ? 'text-sm' : 
          size === 'lg' ? 'text-base' : 'text-lg'
        } text-gray-600 dark:text-gray-400`}>
          {message}
        </p>
      )}
    </div>
  );

  if (fullScreen || overlay) {
    const containerClasses = fullScreen 
      ? 'fixed inset-0 bg-white dark:bg-dark-bg z-50'
      : 'absolute inset-0 bg-white/80 dark:bg-dark-bg/80 backdrop-blur-sm z-40';

    return (
      <div className={`${containerClasses} flex items-center justify-center`}>
        {content}
      </div>
    );
  }

  return content;
};

// Pre-configured loading states for common use cases
export const PageLoadingState: React.FC<{ message?: string }> = ({ 
  message = 'Loading...' 
}) => (
  <LoadingState
    type="spinner"
    size="lg"
    message={message}
    className="py-12"
  />
);

export const CardLoadingState: React.FC<{ message?: string }> = ({ 
  message 
}) => (
  <LoadingState
    type="skeleton"
    size="md"
    message={message}
    className="p-6"
  />
);

export const ButtonLoadingState: React.FC<{ message?: string }> = ({ 
  message = 'Loading...' 
}) => (
  <LoadingState
    type="spinner"
    size="sm"
    message={message}
    className="py-2"
  />
);

export const TableLoadingState: React.FC<{ rows?: number }> = ({ 
  rows = 5 
}) => (
  <div className="space-y-3">
    {Array.from({ length: rows }, (_, i) => (
      <div key={i} className="animate-pulse">
        <div className="grid grid-cols-4 gap-4">
          {Array.from({ length: 4 }, (_, j) => (
            <div key={j} className="h-4 bg-gray-200 dark:bg-gray-700 rounded" />
          ))}
        </div>
      </div>
    ))}
  </div>
);

export const ChartLoadingState: React.FC<{ message?: string }> = ({ 
  message = 'Loading chart...' 
}) => (
  <div className="flex flex-col items-center justify-center h-64 space-y-4">
    <div className="flex items-end space-x-1">
      {Array.from({ length: 8 }, (_, i) => (
        <div
          key={i}
          className="w-4 bg-gray-200 dark:bg-gray-700 rounded-sm animate-pulse"
          style={{
            height: `${Math.random() * 100 + 20}px`,
            animationDelay: `${i * 0.1}s`,
          }}
        />
      ))}
    </div>
    <p className="text-sm text-gray-600 dark:text-gray-400">{message}</p>
  </div>
);

// Loading state with progress indicator
export const ProgressLoadingState: React.FC<{
  progress: number;
  message?: string;
}> = ({ progress, message = 'Loading...' }) => (
  <div className="flex flex-col items-center space-y-4">
    <div className="w-full max-w-xs bg-gray-200 dark:bg-gray-700 rounded-full h-2">
      <div
        className="bg-brand-purple h-2 rounded-full transition-all duration-300"
        style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
      />
    </div>
    <p className="text-sm text-gray-600 dark:text-gray-400">
      {message} ({Math.round(progress)}%)
    </p>
  </div>
);

export default LoadingState;