import React, { useState, useEffect, useRef } from 'react';

interface DataRefreshProps {
  onRefresh: () => Promise<void>;
  autoRefreshIntervals?: number[]; // in seconds
  defaultInterval?: number; // in seconds
  isLoading?: boolean;
  lastUpdated?: Date;
  className?: string;
}

const IconRefresh: React.FC<{ className?: string; spinning?: boolean }> = ({ 
  className, 
  spinning = false 
}) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    className={`${className} ${spinning ? 'animate-spin' : ''}`} 
    fill="none" 
    viewBox="0 0 24 24" 
    stroke="currentColor"
  >
    <path 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      strokeWidth={2} 
      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" 
    />
  </svg>
);

const IconPlay: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M19 10a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const IconPause: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const IconChevronDown: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </svg>
);

const formatTimeAgo = (date: Date): string => {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
  if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  return `${seconds} second${seconds > 1 ? 's' : ''} ago`;
};

const DataRefresh: React.FC<DataRefreshProps> = ({
  onRefresh,
  autoRefreshIntervals = [30, 60, 300, 900], // 30s, 1m, 5m, 15m
  defaultInterval = 300, // 5 minutes
  isLoading = false,
  lastUpdated,
  className = '',
}) => {
  const [isAutoRefreshEnabled, setIsAutoRefreshEnabled] = useState(false);
  const [refreshInterval, setRefreshInterval] = useState(defaultInterval);
  const [showIntervalDropdown, setShowIntervalDropdown] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(refreshInterval);
  
  const intervalRef = useRef<NodeJS.Timeout>();
  const countdownRef = useRef<NodeJS.Timeout>();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowIntervalDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isAutoRefreshEnabled) {
      startAutoRefresh();
    } else {
      stopAutoRefresh();
    }

    return () => stopAutoRefresh();
  }, [isAutoRefreshEnabled, refreshInterval]);

  const startAutoRefresh = () => {
    stopAutoRefresh();
    setTimeRemaining(refreshInterval);
    
    // Start countdown
    countdownRef.current = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          // Trigger refresh
          onRefresh();
          return refreshInterval; // Reset countdown
        }
        return prev - 1;
      });
    }, 1000);

    // Set main refresh interval
    intervalRef.current = setInterval(() => {
      onRefresh();
    }, refreshInterval * 1000);
  };

  const stopAutoRefresh = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = undefined;
    }
    if (countdownRef.current) {
      clearInterval(countdownRef.current);
      countdownRef.current = undefined;
    }
  };

  const handleManualRefresh = async () => {
    if (isLoading) return;
    
    await onRefresh();
    
    // Reset countdown if auto-refresh is enabled
    if (isAutoRefreshEnabled) {
      setTimeRemaining(refreshInterval);
    }
  };

  const toggleAutoRefresh = () => {
    setIsAutoRefreshEnabled(!isAutoRefreshEnabled);
  };

  const handleIntervalChange = (newInterval: number) => {
    setRefreshInterval(newInterval);
    setTimeRemaining(newInterval);
    setShowIntervalDropdown(false);
  };

  const formatInterval = (seconds: number): string => {
    if (seconds < 60) return `${seconds}s`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
    return `${Math.floor(seconds / 3600)}h`;
  };

  const formatCountdown = (seconds: number): string => {
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      {/* Manual Refresh Button */}
      <button
        onClick={handleManualRefresh}
        disabled={isLoading}
        className="flex items-center space-x-2 px-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        title="Refresh data"
      >
        <IconRefresh 
          className="h-4 w-4" 
          spinning={isLoading} 
        />
        <span className="hidden sm:inline">
          {isLoading ? 'Refreshing...' : 'Refresh'}
        </span>
      </button>

      {/* Auto-refresh Controls */}
      <div className="flex items-center space-x-2">
        <button
          onClick={toggleAutoRefresh}
          className={`p-1.5 rounded-md transition-colors ${
            isAutoRefreshEnabled
              ? 'bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
          title={isAutoRefreshEnabled ? 'Disable auto-refresh' : 'Enable auto-refresh'}
        >
          {isAutoRefreshEnabled ? (
            <IconPause className="h-4 w-4" />
          ) : (
            <IconPlay className="h-4 w-4" />
          )}
        </button>

        {/* Interval Selector */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setShowIntervalDropdown(!showIntervalDropdown)}
            className="flex items-center space-x-1 px-2 py-1.5 text-xs bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md transition-colors"
          >
            <span>{formatInterval(refreshInterval)}</span>
            <IconChevronDown className="h-3 w-3" />
          </button>

          {showIntervalDropdown && (
            <div className="absolute top-full right-0 mt-1 w-24 bg-white dark:bg-dark-card border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-50">
              <div className="p-1">
                {autoRefreshIntervals.map(interval => (
                  <button
                    key={interval}
                    onClick={() => handleIntervalChange(interval)}
                    className={`w-full text-left px-2 py-1.5 text-xs rounded-sm transition-colors ${
                      refreshInterval === interval
                        ? 'bg-brand-purple text-white'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    {formatInterval(interval)}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Status Indicator */}
      <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
        {isAutoRefreshEnabled && (
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="hidden sm:inline">
              Next: {formatCountdown(timeRemaining)}
            </span>
          </div>
        )}
        
        {lastUpdated && (
          <div className="hidden md:flex items-center space-x-1">
            <span>Updated:</span>
            <span className="font-medium">
              {formatTimeAgo(lastUpdated)}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default DataRefresh;