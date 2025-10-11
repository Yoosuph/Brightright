import React, { useState, useEffect } from 'react';
import Card from '../components/Card';
import Button from '../components/Button';
import Badge from '../components/ui/Badge';
import { notificationService, type Notification, type NotificationType, type NotificationPriority } from '../services/notificationService';

// Icons
const IconFilter = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
  </svg>
);

const IconCheck = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

const IconTrash = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

const IconBell = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
  </svg>
);

const IconSettings = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const IconExternalLink = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
  </svg>
);

const IconEmail = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

const IconPush = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
  </svg>
);

const IconSlack = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zM18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zM17.688 8.834a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312zM15.165 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zM15.165 17.688a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z"/>
  </svg>
);

// Notification Item Component
const NotificationItem: React.FC<{
  notification: Notification;
  onRead: () => void;
  onDelete: () => void;
  onAction: () => void;
  isSelected: boolean;
  onSelect: () => void;
}> = ({ notification, onRead, onDelete, onAction, isSelected, onSelect }) => {
  const priorityColors = {
    low: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400',
    medium: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
    high: 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400',
    critical: 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400',
  };

  const typeIcons = {
    success: '✅',
    warning: '⚠️',
    error: '❌',
    info: 'ℹ️',
    mention: '💬',
    competitor: '🏆',
    alert: '🚨',
    report: '📊',
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes} minutes ago`;
    if (hours < 24) return `${hours} hours ago`;
    if (days < 7) return `${days} days ago`;
    return date.toLocaleDateString();
  };

  return (
    <div
      onClick={onSelect}
      className={`
        group relative p-4 rounded-xl border-2 transition-all duration-300 cursor-pointer
        ${!notification.read 
          ? 'bg-white dark:bg-gray-800 border-brand-purple/30' 
          : 'bg-gray-50 dark:bg-gray-900/50 border-gray-200 dark:border-gray-700'
        }
        ${isSelected ? 'ring-2 ring-brand-purple ring-offset-2 dark:ring-offset-gray-900' : ''}
        hover:shadow-lg hover:scale-[1.01]
      `}
    >
      {/* Selection Checkbox */}
      <div className="absolute top-4 left-4">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={onSelect}
          onClick={(e) => e.stopPropagation()}
          className="rounded text-brand-purple focus:ring-brand-purple"
        />
      </div>

      {/* Unread indicator */}
      {!notification.read && (
        <div className="absolute top-1/2 left-0 transform -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-brand-purple to-brand-pink rounded-r-full" />
      )}

      <div className="flex items-start space-x-3 ml-8">
        {/* Icon */}
        <div className="flex-shrink-0 text-2xl mt-1">
          {typeIcons[notification.type]}
        </div>

        {/* Content */}
        <div className="flex-1">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white">
                {notification.title}
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {notification.message}
              </p>
            </div>
            <div className="flex items-center space-x-2 ml-4">
              <Badge variant="default" className={priorityColors[notification.priority]}>
                {notification.priority}
              </Badge>
              <span className="text-xs text-gray-500">
                {formatTime(notification.timestamp)}
              </span>
            </div>
          </div>

          {/* Metadata */}
          {notification.metadata && (
            <div className="flex flex-wrap items-center gap-2 mt-3">
              {notification.metadata.platform && (
                <Badge variant="default">
                  📱 {notification.metadata.platform}
                </Badge>
              )}
              {notification.metadata.competitor && (
                <Badge variant="secondary">
                  👥 {notification.metadata.competitor}
                </Badge>
              )}
              {notification.metadata.sentiment && (
                <Badge 
                  variant={notification.metadata.sentiment === 'positive' ? 'success' : 
                          notification.metadata.sentiment === 'negative' ? 'error' : 'default'}
                >
                  {notification.metadata.sentiment}
                </Badge>
              )}
              {notification.metadata.change && (
                <Badge variant={notification.metadata.change > 0 ? 'success' : 'error'}>
                  {notification.metadata.change > 0 ? '↑' : '↓'} {Math.abs(notification.metadata.change)}%
                </Badge>
              )}
              {notification.metadata.mentions && (
                <Badge variant="default">
                  {notification.metadata.mentions} mentions
                </Badge>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center space-x-4 mt-4">
            {!notification.read && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onRead();
                }}
                className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
              >
                <IconCheck className="w-4 h-4" /> Mark as read
              </button>
            )}
            {notification.actionUrl && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onAction();
                }}
                className="text-sm text-brand-purple hover:underline flex items-center gap-1"
              >
                {notification.actionLabel || 'View'} <IconExternalLink />
              </button>
            )}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              className="text-sm text-red-600 dark:text-red-400 hover:underline flex items-center gap-1"
            >
              <IconTrash className="w-4 h-4" /> Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const NotificationCenterPage: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filteredNotifications, setFilteredNotifications] = useState<Notification[]>([]);
  const [selectedNotifications, setSelectedNotifications] = useState<Set<string>>(new Set());
  const [filter, setFilter] = useState<{
    type: NotificationType | 'all';
    priority: NotificationPriority | 'all';
    read: 'all' | 'read' | 'unread';
  }>({
    type: 'all',
    priority: 'all',
    read: 'all',
  });
  const [preferences, setPreferences] = useState(notificationService.getPreferences());
  const [statistics, setStatistics] = useState(notificationService.getStatistics());

  useEffect(() => {
    // Subscribe to notifications
    const unsubscribe = notificationService.subscribe((updatedNotifications) => {
      setNotifications(updatedNotifications);
      setStatistics(notificationService.getStatistics());
    });

    // Initial load
    setNotifications(notificationService.getNotifications());
    setStatistics(notificationService.getStatistics());

    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    // Apply filters
    let filtered = [...notifications];
    
    if (filter.type !== 'all') {
      filtered = filtered.filter(n => n.type === filter.type);
    }
    
    if (filter.priority !== 'all') {
      filtered = filtered.filter(n => n.priority === filter.priority);
    }
    
    if (filter.read === 'read') {
      filtered = filtered.filter(n => n.read);
    } else if (filter.read === 'unread') {
      filtered = filtered.filter(n => !n.read);
    }
    
    setFilteredNotifications(filtered);
  }, [notifications, filter]);

  const handleMarkAsRead = (notificationId: string) => {
    notificationService.markAsRead(notificationId);
  };

  const handleDelete = (notificationId: string) => {
    notificationService.deleteNotification(notificationId);
    setSelectedNotifications(prev => {
      const newSet = new Set(prev);
      newSet.delete(notificationId);
      return newSet;
    });
  };

  const handleSelectNotification = (notificationId: string) => {
    setSelectedNotifications(prev => {
      const newSet = new Set(prev);
      if (newSet.has(notificationId)) {
        newSet.delete(notificationId);
      } else {
        newSet.add(notificationId);
      }
      return newSet;
    });
  };

  const handleSelectAll = () => {
    if (selectedNotifications.size === filteredNotifications.length) {
      setSelectedNotifications(new Set());
    } else {
      setSelectedNotifications(new Set(filteredNotifications.map(n => n.id)));
    }
  };

  const handleBulkMarkAsRead = () => {
    selectedNotifications.forEach(id => {
      notificationService.markAsRead(id);
    });
    setSelectedNotifications(new Set());
  };

  const handleBulkDelete = () => {
    selectedNotifications.forEach(id => {
      notificationService.deleteNotification(id);
    });
    setSelectedNotifications(new Set());
  };

  const handlePreferenceChange = (key: string, value: any) => {
    const updatedPreferences = { ...preferences };
    
    // Navigate nested object
    const keys = key.split('.');
    let obj: any = updatedPreferences;
    for (let i = 0; i < keys.length - 1; i++) {
      obj = obj[keys[i]];
    }
    obj[keys[keys.length - 1]] = value;
    
    setPreferences(updatedPreferences);
    notificationService.updatePreferences(updatedPreferences);
  };

  const handleRequestPushPermission = async () => {
    const granted = await notificationService.requestPushPermission();
    if (granted) {
      handlePreferenceChange('channels.push', true);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
              <IconBell />
              <span className="ml-3">Notification Center</span>
            </h1>
            <p className="mt-1 text-gray-600 dark:text-gray-400">
              Manage your notifications and alert preferences
            </p>
          </div>
          
          <Button onClick={() => window.location.reload()} variant="secondary">
            Refresh
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-6 rounded-2xl text-white">
          <p className="text-purple-100 text-sm">Total Notifications</p>
          <p className="text-3xl font-bold mt-1">{statistics.total}</p>
          <p className="text-purple-100 text-xs mt-1">All time</p>
        </div>
        
        <div className="bg-gradient-to-br from-blue-500 to-cyan-500 p-6 rounded-2xl text-white">
          <p className="text-blue-100 text-sm">Unread</p>
          <p className="text-3xl font-bold mt-1">{statistics.unread}</p>
          <p className="text-blue-100 text-xs mt-1">Requires attention</p>
        </div>
        
        <div className="bg-gradient-to-br from-green-500 to-emerald-500 p-6 rounded-2xl text-white">
          <p className="text-green-100 text-sm">Read</p>
          <p className="text-3xl font-bold mt-1">{statistics.read}</p>
          <p className="text-green-100 text-xs mt-1">Processed</p>
        </div>
        
        <div className="bg-gradient-to-br from-orange-500 to-red-500 p-6 rounded-2xl text-white">
          <p className="text-orange-100 text-sm">Critical</p>
          <p className="text-3xl font-bold mt-1">
            {statistics.byPriority?.critical || 0}
          </p>
          <p className="text-orange-100 text-xs mt-1">High priority</p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Main Content - Notifications List */}
        <div className="space-y-4">
          {/* Filters and Bulk Actions */}
          <Card>
            <div className="p-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedNotifications.size === filteredNotifications.length && filteredNotifications.length > 0}
                      onChange={handleSelectAll}
                      className="rounded text-brand-purple focus:ring-brand-purple"
                    />
                    <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                      {selectedNotifications.size > 0 ? `${selectedNotifications.size} selected` : 'Select all'}
                    </span>
                  </div>
                  
                  {selectedNotifications.size > 0 && (
                    <div className="flex items-center space-x-2">
                      <Button size="sm" variant="secondary" onClick={handleBulkMarkAsRead}>
                        <IconCheck className="w-4 h-4 mr-1" /> Mark as read
                      </Button>
                      <Button size="sm" variant="secondary" onClick={handleBulkDelete}>
                        <IconTrash className="w-4 h-4 mr-1" /> Delete
                      </Button>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center space-x-2">
                  <IconFilter className="text-gray-400" />
                  <select
                    value={filter.type}
                    onChange={(e) => setFilter({ ...filter, type: e.target.value as any })}
                    className="text-sm border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700"
                  >
                    <option value="all">All Types</option>
                    <option value="success">Success</option>
                    <option value="warning">Warning</option>
                    <option value="error">Error</option>
                    <option value="info">Info</option>
                    <option value="mention">Mention</option>
                    <option value="competitor">Competitor</option>
                    <option value="alert">Alert</option>
                    <option value="report">Report</option>
                  </select>
                  
                  <select
                    value={filter.priority}
                    onChange={(e) => setFilter({ ...filter, priority: e.target.value as any })}
                    className="text-sm border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700"
                  >
                    <option value="all">All Priorities</option>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                  
                  <select
                    value={filter.read}
                    onChange={(e) => setFilter({ ...filter, read: e.target.value as any })}
                    className="text-sm border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700"
                  >
                    <option value="all">All</option>
                    <option value="unread">Unread</option>
                    <option value="read">Read</option>
                  </select>
                </div>
              </div>
            </div>
          </Card>

          {/* Notifications List */}
          <div className="space-y-3">
            {filteredNotifications.length > 0 ? (
              filteredNotifications.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  onRead={() => handleMarkAsRead(notification.id)}
                  onDelete={() => handleDelete(notification.id)}
                  onAction={() => {
                    if (notification.actionUrl) {
                      window.location.href = notification.actionUrl;
                    }
                  }}
                  isSelected={selectedNotifications.has(notification.id)}
                  onSelect={() => handleSelectNotification(notification.id)}
                />
              ))
            ) : (
              <Card>
                <div className="p-12 text-center">
                  <div className="text-6xl mb-4">🔔</div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    No notifications found
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    Adjust your filters or wait for new notifications
                  </p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationCenterPage;
