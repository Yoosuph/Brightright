import React, { useState, useEffect, useRef } from 'react';
import { notificationService, type Notification } from '../services/notificationService';
import Badge from './ui/Badge';
import Button from './Button';
import type { Page } from '../types';

interface NotificationBellProps {
  onNavigate: (page: Page) => void;
}

// Icons
const IconBell = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
  </svg>
);

const IconCheck = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

const IconTrash = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

const IconSettings = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const IconExternalLink = () => (
  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
  </svg>
);

// Notification Item Component
const NotificationItem: React.FC<{
  notification: Notification;
  onRead: () => void;
  onDelete: () => void;
  onAction: () => void;
  compact?: boolean;
}> = ({ notification, onRead, onDelete, onAction, compact = false }) => {
  const priorityColors = {
    low: 'text-gray-500 dark:text-gray-400',
    medium: 'text-blue-500 dark:text-blue-400',
    high: 'text-orange-500 dark:text-orange-400',
    critical: 'text-red-500 dark:text-red-400',
  };

  const typeStyles = {
    success: 'border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20',
    warning: 'border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-900/20',
    error: 'border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20',
    info: 'border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20',
    mention: 'border-purple-200 dark:border-purple-800 bg-purple-50 dark:bg-purple-900/20',
    competitor: 'border-pink-200 dark:border-pink-800 bg-pink-50 dark:bg-pink-900/20',
    alert: 'border-orange-200 dark:border-orange-800 bg-orange-50 dark:bg-orange-900/20',
    report: 'border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/20',
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div
      className={`
        group relative p-4 rounded-xl border-2 transition-all duration-300 cursor-pointer
        ${!notification.read ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-900/50'}
        ${typeStyles[notification.type]}
        hover:shadow-md hover:scale-[1.02]
      `}
      onClick={onAction}
    >
      {/* Unread indicator */}
      {!notification.read && (
        <div className="absolute -left-1 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-brand-purple rounded-full animate-pulse" />
      )}

      <div className="flex items-start space-x-3">
        {/* Icon */}
        <div className="flex-shrink-0 text-2xl">
          {notification.icon || '🔔'}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h4 className={`font-semibold text-sm ${!notification.read ? 'text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-300'}`}>
                {notification.title}
              </h4>
              {!compact && (
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                  {notification.message}
                </p>
              )}
            </div>
            <span className={`text-xs ml-2 ${priorityColors[notification.priority]}`}>
              {formatTime(notification.timestamp)}
            </span>
          </div>

          {/* Metadata */}
          {notification.metadata && !compact && (
            <div className="flex items-center gap-2 mt-2">
              {notification.metadata.platform && (
                <Badge variant="default" className="text-xs">
                  {notification.metadata.platform}
                </Badge>
              )}
              {notification.metadata.sentiment && (
                <Badge 
                  variant={notification.metadata.sentiment === 'positive' ? 'success' : notification.metadata.sentiment === 'negative' ? 'error' : 'default'}
                  className="text-xs"
                >
                  {notification.metadata.sentiment}
                </Badge>
              )}
              {notification.metadata.change && (
                <Badge variant="default" className="text-xs">
                  {notification.metadata.change > 0 ? '+' : ''}{notification.metadata.change}%
                </Badge>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center space-x-2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
            {!notification.read && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onRead();
                }}
                className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
              >
                <IconCheck /> Mark as read
              </button>
            )}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              className="text-xs text-red-600 dark:text-red-400 hover:underline flex items-center gap-1"
            >
              <IconTrash /> Delete
            </button>
            {notification.actionLabel && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onAction();
                }}
                className="text-xs text-brand-purple hover:underline flex items-center gap-1"
              >
                {notification.actionLabel} <IconExternalLink />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const NotificationBell: React.FC<NotificationBellProps> = ({ onNavigate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Subscribe to notifications
    const unsubscribe = notificationService.subscribe((updatedNotifications) => {
      setNotifications(updatedNotifications);
      setUnreadCount(notificationService.getUnreadCount());
    });

    // Initial load
    setNotifications(notificationService.getNotifications());
    setUnreadCount(notificationService.getUnreadCount());

    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNotificationAction = (notification: Notification) => {
    if (notification.actionUrl) {
      // Navigate to the action URL
      const page = notification.actionUrl.replace('/', '') as Page;
      onNavigate(page);
      setIsOpen(false);
    }
    notificationService.markAsRead(notification.id);
  };

  const handleMarkAsRead = (notificationId: string) => {
    notificationService.markAsRead(notificationId);
  };

  const handleDelete = (notificationId: string) => {
    notificationService.deleteNotification(notificationId);
  };

  const handleMarkAllAsRead = () => {
    notificationService.markAllAsRead();
  };

  const handleViewAll = () => {
    onNavigate('alerts');
    setIsOpen(false);
  };

  const displayedNotifications = filter === 'unread' 
    ? notifications.filter(n => !n.read).slice(0, 5)
    : notifications.slice(0, 5);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Icon Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          relative p-2 rounded-lg transition-all duration-300
          ${isOpen 
            ? 'bg-brand-purple/10 text-brand-purple' 
            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
          }
        `}
        aria-label="Notifications"
      >
        <IconBell />
        
        {/* Notification Badge */}
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-bounce">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
        
        {/* Ripple effect for new notifications */}
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full animate-ping" />
        )}
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="fixed sm:absolute top-16 sm:top-auto left-4 right-4 sm:left-auto sm:right-0 sm:mt-2 sm:w-96 max-h-[50vh] sm:max-h-[600px] bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50 animate-fade-in">
          {/* Header */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-brand-purple/10 to-brand-pink/10">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Notifications</h3>
              <div className="flex items-center space-x-2">
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllAsRead}
                    className="text-xs text-brand-purple hover:underline"
                  >
                    Mark all as read
                  </button>
                )}
                <button
                  onClick={() => {
                    onNavigate('settings');
                    setIsOpen(false);
                  }}
                  className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                >
                  <IconSettings />
                </button>
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex space-x-1 p-1 bg-gray-100 dark:bg-gray-700 rounded-lg">
              <button
                onClick={() => setFilter('all')}
                className={`
                  flex-1 px-3 py-1.5 rounded-md text-xs font-medium transition-all
                  ${filter === 'all' 
                    ? 'bg-white dark:bg-gray-600 text-brand-purple shadow-sm' 
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }
                `}
              >
                All ({notifications.length})
              </button>
              <button
                onClick={() => setFilter('unread')}
                className={`
                  flex-1 px-3 py-1.5 rounded-md text-xs font-medium transition-all
                  ${filter === 'unread' 
                    ? 'bg-white dark:bg-gray-600 text-brand-purple shadow-sm' 
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }
                `}
              >
                Unread ({unreadCount})
              </button>
            </div>
          </div>

          {/* Notifications List */}
          <div className="overflow-y-auto max-h-[30vh] sm:max-h-[400px] p-2">
            {displayedNotifications.length > 0 ? (
              <div className="space-y-2">
                {displayedNotifications.map((notification) => (
                  <NotificationItem
                    key={notification.id}
                    notification={notification}
                    onRead={() => handleMarkAsRead(notification.id)}
                    onDelete={() => handleDelete(notification.id)}
                    onAction={() => handleNotificationAction(notification)}
                    compact
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-4xl mb-3">🔔</div>
                <p className="text-gray-500 dark:text-gray-400">
                  {filter === 'unread' ? 'No unread notifications' : 'No notifications yet'}
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                  We'll notify you when something important happens
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="p-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
              <Button 
                onClick={handleViewAll}
                variant="secondary" 
                className="w-full justify-center"
              >
                View All Notifications
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
