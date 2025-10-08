import React, { useState, useEffect, useCallback, useRef } from 'react';
import Button from './Button';

interface NotificationData {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'mention';
  title: string;
  message: string;
  timestamp: Date;
  isRead: boolean;
  isSticky?: boolean;
  actionText?: string;
  actionUrl?: string;
  metadata?: Record<string, any>;
}

interface AlertRule {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  triggers: {
    keywords: string[];
    platforms: string[];
    sentiments: string[];
    competitors: string[];
    thresholds: {
      visibilityScore?: { min?: number; max?: number };
      mentionCount?: { min?: number; max?: number };
      sentimentChange?: { min?: number; max?: number };
    };
  };
  actions: {
    notify: boolean;
    email?: boolean;
    webhook?: string;
  };
  frequency: 'immediate' | 'hourly' | 'daily' | 'weekly';
  createdAt: Date;
  lastTriggered?: Date;
}

interface NotificationSystemProps {
  onNotificationClick?: (notification: NotificationData) => void;
  maxNotifications?: number;
  enableRealTime?: boolean;
  enableAlertRules?: boolean;
}

const IconBell: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM11 17H5l5 5v-5z" />
  </svg>
);

const IconSettings: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const IconX: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const IconCheck: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

const IconPlus: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
);

const getNotificationIcon = (type: string) => {
  switch (type) {
    case 'success': return '✅';
    case 'warning': return '⚠️';
    case 'error': return '❌';
    case 'mention': return '💬';
    default: return 'ℹ️';
  }
};

const getNotificationColor = (type: string) => {
  switch (type) {
    case 'success': return 'border-green-500 bg-green-50 dark:bg-green-900/20';
    case 'warning': return 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20';
    case 'error': return 'border-red-500 bg-red-50 dark:bg-red-900/20';
    case 'mention': return 'border-blue-500 bg-blue-50 dark:bg-blue-900/20';
    default: return 'border-gray-500 bg-gray-50 dark:bg-gray-900/20';
  }
};

const formatTimeAgo = (date: Date): string => {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (minutes > 0) return `${minutes}m ago`;
  return 'Just now';
};

// Enhanced Toast Notification Component
const EnhancedToast: React.FC<{
  notification: NotificationData;
  onClose: () => void;
  onAction?: () => void;
  position: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
}> = ({ notification, onClose, onAction, position }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [progress, setProgress] = useState(100);
  const timeoutRef = useRef<NodeJS.Timeout>();
  const progressRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    // Slide in animation
    setIsVisible(true);

    if (!notification.isSticky) {
      // Auto dismiss after 5 seconds unless sticky
      const duration = 5000;
      const interval = 50;
      const decrement = 100 / (duration / interval);

      progressRef.current = setInterval(() => {
        setProgress(prev => {
          if (prev <= 0) {
            clearInterval(progressRef.current!);
            handleClose();
            return 0;
          }
          return prev - decrement;
        });
      }, interval);
    }

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (progressRef.current) clearInterval(progressRef.current);
    };
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300); // Wait for slide out animation
  };

  const positionClasses = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
  };

  return (
    <div
      className={`fixed ${positionClasses[position]} z-50 transform transition-all duration-300 ${
        isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
      }`}
    >
      <div className={`w-80 rounded-lg shadow-lg border-l-4 ${getNotificationColor(notification.type)} backdrop-blur-sm`}>
        {/* Progress bar */}
        {!notification.isSticky && (
          <div className="h-1 bg-gray-200 dark:bg-gray-700 rounded-t-lg overflow-hidden">
            <div
              className="h-full bg-brand-purple transition-all duration-75 ease-linear"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}

        <div className="p-4">
          <div className="flex items-start space-x-3">
            <span className="text-xl flex-shrink-0">
              {getNotificationIcon(notification.type)}
            </span>

            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                {notification.title}
              </h4>
              <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
                {notification.message}
              </p>
              
              <div className="flex items-center justify-between mt-3">
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {formatTimeAgo(notification.timestamp)}
                </span>

                <div className="flex space-x-2">
                  {notification.actionText && (
                    <button
                      onClick={onAction}
                      className="text-xs text-brand-purple hover:text-brand-purple/80 font-medium"
                    >
                      {notification.actionText}
                    </button>
                  )}
                  
                  <button
                    onClick={handleClose}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-1"
                  >
                    <IconX className="h-3 w-3" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Notification Center Component
const NotificationCenter: React.FC<{
  notifications: NotificationData[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onClearAll: () => void;
  onNotificationClick?: (notification: NotificationData) => void;
}> = ({ notifications, onMarkAsRead, onMarkAllAsRead, onClearAll, onNotificationClick }) => {
  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="w-80 bg-white dark:bg-dark-card border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Notifications
          </h3>
          {unreadCount > 0 && (
            <span className="bg-brand-purple text-white text-xs px-2 py-1 rounded-full">
              {unreadCount}
            </span>
          )}
        </div>

        {notifications.length > 0 && (
          <div className="flex space-x-2 mt-2">
            {unreadCount > 0 && (
              <button
                onClick={onMarkAllAsRead}
                className="text-xs text-brand-purple hover:text-brand-purple/80 font-medium"
              >
                Mark all as read
              </button>
            )}
            <button
              onClick={onClearAll}
              className="text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            >
              Clear all
            </button>
          </div>
        )}
      </div>

      {/* Notifications List */}
      <div className="max-h-80 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="p-8 text-center text-gray-500 dark:text-gray-400">
            <IconBell className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-sm">No notifications yet</p>
            <p className="text-xs mt-1">You'll see updates about your brand visibility here</p>
          </div>
        ) : (
          notifications.map(notification => (
            <div
              key={notification.id}
              className={`p-3 border-b border-gray-100 dark:border-gray-700 last:border-b-0 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${
                !notification.isRead ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''
              }`}
              onClick={() => {
                if (!notification.isRead) {
                  onMarkAsRead(notification.id);
                }
                onNotificationClick?.(notification);
              }}
            >
              <div className="flex items-start space-x-3">
                <span className="text-lg flex-shrink-0 mt-0.5">
                  {getNotificationIcon(notification.type)}
                </span>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className={`text-sm ${!notification.isRead ? 'font-semibold' : 'font-medium'} text-gray-900 dark:text-white truncate`}>
                      {notification.title}
                    </h4>
                    <span className="text-xs text-gray-500 dark:text-gray-400 flex-shrink-0 ml-2">
                      {formatTimeAgo(notification.timestamp)}
                    </span>
                  </div>

                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                    {notification.message}
                  </p>

                  <div className="flex items-center justify-between mt-2">
                    {notification.actionText && (
                      <button className="text-xs text-brand-purple hover:text-brand-purple/80 font-medium">
                        {notification.actionText}
                      </button>
                    )}
                    
                    {!notification.isRead && (
                      <div className="w-2 h-2 bg-brand-purple rounded-full flex-shrink-0" />
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

// Alert Rules Management Component
const AlertRulesManager: React.FC<{
  rules: AlertRule[];
  onCreateRule: (rule: Omit<AlertRule, 'id' | 'createdAt'>) => void;
  onUpdateRule: (id: string, updates: Partial<AlertRule>) => void;
  onDeleteRule: (id: string) => void;
}> = ({ rules, onCreateRule, onUpdateRule, onDeleteRule }) => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingRule, setEditingRule] = useState<string | null>(null);

  const [newRule, setNewRule] = useState<Omit<AlertRule, 'id' | 'createdAt'>>({
    name: '',
    description: '',
    enabled: true,
    triggers: {
      keywords: [],
      platforms: [],
      sentiments: [],
      competitors: [],
      thresholds: {},
    },
    actions: {
      notify: true,
    },
    frequency: 'immediate',
  });

  const handleCreateRule = () => {
    if (newRule.name.trim()) {
      onCreateRule(newRule);
      setNewRule({
        name: '',
        description: '',
        enabled: true,
        triggers: {
          keywords: [],
          platforms: [],
          sentiments: [],
          competitors: [],
          thresholds: {},
        },
        actions: {
          notify: true,
        },
        frequency: 'immediate',
      });
      setShowCreateForm(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Alert Rules
        </h3>
        <Button
          onClick={() => setShowCreateForm(true)}
          size="sm"
        >
          <IconPlus className="h-4 w-4 mr-1" />
          New Rule
        </Button>
      </div>

      {/* Create/Edit Form */}
      {showCreateForm && (
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <h4 className="font-medium text-gray-900 dark:text-white mb-4">Create Alert Rule</h4>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Rule Name
              </label>
              <input
                type="text"
                value={newRule.name}
                onChange={(e) => setNewRule(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="e.g., High Visibility Drop Alert"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Description
              </label>
              <textarea
                value={newRule.description}
                onChange={(e) => setNewRule(prev => ({ ...prev, description: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                rows={2}
                placeholder="Describe when this alert should trigger..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Platforms
                </label>
                <div className="space-y-1">
                  {['ChatGPT', 'Claude', 'Gemini', 'Bing Chat'].map(platform => (
                    <label key={platform} className="flex items-center space-x-2 text-sm">
                      <input
                        type="checkbox"
                        checked={newRule.triggers.platforms.includes(platform)}
                        onChange={(e) => {
                          const platforms = e.target.checked
                            ? [...newRule.triggers.platforms, platform]
                            : newRule.triggers.platforms.filter(p => p !== platform);
                          setNewRule(prev => ({
                            ...prev,
                            triggers: { ...prev.triggers, platforms }
                          }));
                        }}
                        className="rounded border-gray-300 text-brand-purple focus:ring-brand-purple"
                      />
                      <span>{platform}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Frequency
                </label>
                <select
                  value={newRule.frequency}
                  onChange={(e) => setNewRule(prev => ({ 
                    ...prev, 
                    frequency: e.target.value as AlertRule['frequency']
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="immediate">Immediate</option>
                  <option value="hourly">Hourly</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                </select>
              </div>
            </div>

            <div className="flex space-x-2">
              <Button onClick={handleCreateRule} size="sm">
                Create Rule
              </Button>
              <Button
                onClick={() => setShowCreateForm(false)}
                variant="secondary"
                size="sm"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Rules List */}
      <div className="space-y-2">
        {rules.map(rule => (
          <div
            key={rule.id}
            className={`p-4 rounded-lg border transition-colors ${
              rule.enabled
                ? 'border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20'
                : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h4 className="font-medium text-gray-900 dark:text-white">
                  {rule.name}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {rule.description}
                </p>
                <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500 dark:text-gray-400">
                  <span>Frequency: {rule.frequency}</span>
                  {rule.lastTriggered && (
                    <span>Last triggered: {formatTimeAgo(rule.lastTriggered)}</span>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={rule.enabled}
                    onChange={(e) => onUpdateRule(rule.id, { enabled: e.target.checked })}
                    className="rounded border-gray-300 text-brand-purple focus:ring-brand-purple"
                  />
                  <span className="ml-2 text-sm">Enabled</span>
                </label>

                <button
                  onClick={() => onDeleteRule(rule.id)}
                  className="p-1 text-red-600 hover:text-red-800 transition-colors"
                >
                  <IconX className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}

        {rules.length === 0 && (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <p className="text-sm">No alert rules configured</p>
            <p className="text-xs mt-1">Create your first rule to get notified about important changes</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Main Notification System Component
const NotificationSystem: React.FC<NotificationSystemProps> = ({
  onNotificationClick,
  maxNotifications = 50,
  enableRealTime = true,
  enableAlertRules = true,
}) => {
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const [toastNotifications, setToastNotifications] = useState<NotificationData[]>([]);
  const [alertRules, setAlertRules] = useState<AlertRule[]>([]);
  const [showCenter, setShowCenter] = useState(false);
  const [showRulesManager, setShowRulesManager] = useState(false);

  // Load data from localStorage
  useEffect(() => {
    const savedNotifications = localStorage.getItem('notifications');
    const savedRules = localStorage.getItem('alert-rules');

    if (savedNotifications) {
      try {
        const parsed = JSON.parse(savedNotifications);
        setNotifications(parsed.map((n: any) => ({ ...n, timestamp: new Date(n.timestamp) })));
      } catch (error) {
        console.error('Failed to load notifications:', error);
      }
    }

    if (savedRules) {
      try {
        const parsed = JSON.parse(savedRules);
        setAlertRules(parsed.map((r: any) => ({
          ...r,
          createdAt: new Date(r.createdAt),
          lastTriggered: r.lastTriggered ? new Date(r.lastTriggered) : undefined,
        })));
      } catch (error) {
        console.error('Failed to load alert rules:', error);
      }
    }
  }, []);

  // Save to localStorage when notifications change
  useEffect(() => {
    localStorage.setItem('notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('alert-rules', JSON.stringify(alertRules));
  }, [alertRules]);

  const addNotification = useCallback((notification: Omit<NotificationData, 'id' | 'timestamp' | 'isRead'>) => {
    const newNotification: NotificationData = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date(),
      isRead: false,
    };

    setNotifications(prev => [newNotification, ...prev].slice(0, maxNotifications));
    
    // Show toast notification
    setToastNotifications(prev => [newNotification, ...prev]);
  }, [maxNotifications]);

  const markAsRead = useCallback((id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, isRead: true } : n))
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications(prev =>
      prev.map(n => ({ ...n, isRead: true }))
    );
  }, []);

  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToastNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const createAlertRule = useCallback((rule: Omit<AlertRule, 'id' | 'createdAt'>) => {
    const newRule: AlertRule = {
      ...rule,
      id: Date.now().toString(),
      createdAt: new Date(),
    };
    setAlertRules(prev => [newRule, ...prev]);
  }, []);

  const updateAlertRule = useCallback((id: string, updates: Partial<AlertRule>) => {
    setAlertRules(prev =>
      prev.map(rule => (rule.id === id ? { ...rule, ...updates } : rule))
    );
  }, []);

  const deleteAlertRule = useCallback((id: string) => {
    setAlertRules(prev => prev.filter(rule => rule.id !== id));
  }, []);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div>
      {/* Notification Bell Button */}
      <div className="relative">
        <button
          onClick={() => setShowCenter(!showCenter)}
          className="relative p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
        >
          <IconBell className="h-6 w-6" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>

        {/* Notification Center Dropdown */}
        {showCenter && (
          <div className="absolute top-full right-0 mt-2 z-50">
            <NotificationCenter
              notifications={notifications}
              onMarkAsRead={markAsRead}
              onMarkAllAsRead={markAllAsRead}
              onClearAll={clearAllNotifications}
              onNotificationClick={onNotificationClick}
            />
          </div>
        )}
      </div>

      {/* Alert Rules Manager Button */}
      {enableAlertRules && (
        <button
          onClick={() => setShowRulesManager(true)}
          className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors ml-2"
          title="Manage Alert Rules"
        >
          <IconSettings className="h-5 w-5" />
        </button>
      )}

      {/* Alert Rules Manager Modal */}
      {showRulesManager && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-dark-card rounded-lg shadow-xl w-full max-w-4xl max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Alert Rules Management
                </h2>
                <button
                  onClick={() => setShowRulesManager(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                >
                  <IconX className="h-6 w-6" />
                </button>
              </div>

              <AlertRulesManager
                rules={alertRules}
                onCreateRule={createAlertRule}
                onUpdateRule={updateAlertRule}
                onDeleteRule={deleteAlertRule}
              />
            </div>
          </div>
        </div>
      )}

      {/* Toast Notifications */}
      {toastNotifications.map(notification => (
        <EnhancedToast
          key={notification.id}
          notification={notification}
          onClose={() => removeToast(notification.id)}
          onAction={() => onNotificationClick?.(notification)}
          position="top-right"
        />
      ))}
    </div>
  );
};

export default NotificationSystem;
export type { NotificationData, AlertRule };