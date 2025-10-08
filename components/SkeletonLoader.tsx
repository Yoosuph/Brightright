import React from 'react';

interface SkeletonProps {
  className?: string;
  width?: string | number;
  height?: string | number;
  rounded?: boolean;
  animate?: boolean;
}

const Skeleton: React.FC<SkeletonProps> = ({ 
  className = '',
  width,
  height,
  rounded = false,
  animate = true
}) => {
  const style: React.CSSProperties = {};
  if (width) style.width = width;
  if (height) style.height = height;

  return (
    <div 
      className={`bg-gray-200 dark:bg-gray-700 ${
        animate ? 'animate-pulse' : ''
      } ${
        rounded ? 'rounded-full' : 'rounded'
      } ${className}`}
      style={style}
    />
  );
};

// Pre-built skeleton components for common UI patterns
export const SkeletonCard: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`p-6 bg-white dark:bg-dark-card rounded-lg border border-gray-200 dark:border-gray-700 ${className}`}>
    <div className="space-y-4">
      <div className="flex items-center space-x-3">
        <Skeleton width={40} height={40} rounded />
        <div className="flex-1 space-y-2">
          <Skeleton height={16} width="60%" />
          <Skeleton height={14} width="40%" />
        </div>
      </div>
      <div className="space-y-3">
        <Skeleton height={12} />
        <Skeleton height={12} width="80%" />
        <Skeleton height={12} width="90%" />
      </div>
    </div>
  </div>
);

export const SkeletonTable: React.FC<{ rows?: number; columns?: number; className?: string }> = ({ 
  rows = 5, 
  columns = 4, 
  className = '' 
}) => (
  <div className={`bg-white dark:bg-dark-card rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden ${className}`}>
    {/* Header */}
    <div className="p-4 border-b border-gray-200 dark:border-gray-700">
      <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
        {Array.from({ length: columns }, (_, i) => (
          <Skeleton key={`header-${i}`} height={16} width="80%" />
        ))}
      </div>
    </div>
    
    {/* Rows */}
    <div className="divide-y divide-gray-200 dark:divide-gray-700">
      {Array.from({ length: rows }, (_, rowIndex) => (
        <div key={`row-${rowIndex}`} className="p-4">
          <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
            {Array.from({ length: columns }, (_, colIndex) => (
              <Skeleton key={`cell-${rowIndex}-${colIndex}`} height={14} />
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
);

export const SkeletonChart: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`p-6 bg-white dark:bg-dark-card rounded-lg border border-gray-200 dark:border-gray-700 ${className}`}>
    <div className="space-y-4">
      {/* Chart title */}
      <div className="flex items-center justify-between">
        <Skeleton height={20} width="30%" />
        <Skeleton height={32} width={80} />
      </div>
      
      {/* Chart area */}
      <div className="space-y-2">
        <div className="h-64 flex items-end justify-between space-x-2">
          {Array.from({ length: 12 }, (_, i) => (
            <Skeleton 
              key={i} 
              width={20} 
              height={Math.random() * 200 + 60}
              className="flex-shrink-0" 
            />
          ))}
        </div>
        
        {/* X-axis labels */}
        <div className="flex justify-between">
          {Array.from({ length: 6 }, (_, i) => (
            <Skeleton key={`label-${i}`} height={12} width={40} />
          ))}
        </div>
      </div>
    </div>
  </div>
);

export const SkeletonStats: React.FC<{ count?: number; className?: string }> = ({ 
  count = 4, 
  className = '' 
}) => (
  <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-${Math.min(count, 4)} gap-6 ${className}`}>
    {Array.from({ length: count }, (_, i) => (
      <div 
        key={i} 
        className="p-6 bg-white dark:bg-dark-card rounded-lg border border-gray-200 dark:border-gray-700"
      >
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Skeleton height={16} width="60%" />
            <Skeleton width={24} height={24} />
          </div>
          <Skeleton height={32} width="40%" />
          <div className="flex items-center space-x-2">
            <Skeleton height={12} width={60} />
            <Skeleton height={12} width={80} />
          </div>
        </div>
      </div>
    ))}
  </div>
);

export const SkeletonList: React.FC<{ items?: number; showAvatar?: boolean; className?: string }> = ({ 
  items = 6, 
  showAvatar = true,
  className = '' 
}) => (
  <div className={`bg-white dark:bg-dark-card rounded-lg border border-gray-200 dark:border-gray-700 divide-y divide-gray-200 dark:divide-gray-700 ${className}`}>
    {Array.from({ length: items }, (_, i) => (
      <div key={i} className="p-4">
        <div className="flex items-center space-x-4">
          {showAvatar && (
            <Skeleton width={48} height={48} rounded />
          )}
          <div className="flex-1 space-y-2">
            <div className="flex items-center justify-between">
              <Skeleton height={16} width="40%" />
              <Skeleton height={14} width={60} />
            </div>
            <Skeleton height={14} width="80%" />
            <Skeleton height={12} width="60%" />
          </div>
        </div>
      </div>
    ))}
  </div>
);

export default Skeleton;