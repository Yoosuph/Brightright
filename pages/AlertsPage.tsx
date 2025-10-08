import React, { useState, useEffect } from 'react';
import Card from '../components/Card';
import Button from '../components/Button';
import Badge from '../src/components/ui/Badge';
import type {
  OnboardingData,
  AlertRule,
  AlertNotification
} from '../types';

interface AlertsPageProps {
  appData: OnboardingData;
}

const AlertsPage: React.FC<AlertsPageProps> = ({ appData }) => {
  const [activeTab, setActiveTab] = useState<'notifications' | 'rules'>('notifications');
  const [showCreateRuleModal, setShowCreateRuleModal] = useState(false);

  // Mock data for alerts
  const [notifications, setNotifications] = useState<AlertNotification[]>([
    {
      id: '1',
      ruleId: 'rule1',
      type: 'mention_spike',
      title: 'Mention Spike Detected',
      message: `${appData.brandName} mentions increased by 250% in the last hour. Current volume: 47 mentions.`,
      severity: 'high',
      timestamp: '2024-01-15T14:30:00Z',
      read: false,
      data: { currentVolume: 47, previousVolume: 13 }
    },
    {
      id: '2',
      ruleId: 'rule2',
      type: 'sentiment_drop',
      title: 'Sentiment Alert',
      message: `Negative sentiment for ${appData.brandName} increased to 35% (threshold: 30%).`,
      severity: 'medium',
      timestamp: '2024-01-15T12:15:00Z',
      read: false,
      data: { currentSentiment: 35, threshold: 30 }
    },
    {
      id: '3',
      ruleId: 'rule3',
      type: 'competitor_activity',
      title: 'Competitor Activity',
      message: 'Competitor A gained 12% visibility in shared keywords in the last 24h.',
      severity: 'medium',
      timestamp: '2024-01-15T09:45:00Z',
      read: true,
      data: { competitor: 'Competitor A', visibilityGain: 12 }
    }
  ]);

  const [alertRules, setAlertRules] = useState<AlertRule[]>([
    {
      id: 'rule1',
      name: 'Mention Volume Spike',
      type: 'mention_spike',
      conditions: {
        threshold: 200,
        operator: '>',
        timeframe: '1 hour'
      },
      channels: ['email', 'slack'],
      active: true,
      lastTriggered: '2024-01-15T14:30:00Z'
    },
    {
      id: 'rule2',
      name: 'Sentiment Drop Alert',
      type: 'sentiment_drop',
      conditions: {
        threshold: 30,
        operator: '>=',
        timeframe: '24 hours'
      },
      channels: ['email'],
      active: true,
      lastTriggered: '2024-01-15T12:15:00Z'
    },
    {
      id: 'rule3',
      name: 'Competitor Visibility Gain',
      type: 'competitor_activity',
      conditions: {
        threshold: 10,
        operator: '>',
        timeframe: '24 hours'
      },
      channels: ['email', 'slack'],
      active: true,
      lastTriggered: '2024-01-15T09:45:00Z'
    }
  ]);

  const markAsRead = (notificationId: string) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === notificationId ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notif => ({ ...notif, read: true }))
    );
  };

  const toggleRule = (ruleId: string) => {
    setAlertRules(prev =>
      prev.map(rule =>
        rule.id === ruleId ? { ...rule, active: !rule.active } : rule
      )
    );
  };

  const getSeverityColor = (severity: AlertNotification['severity']) => {
    switch (severity) {
      case 'critical': return 'error';
      case 'high': return 'warning';
      case 'medium': return 'info';
      case 'low': return 'secondary';
      default: return 'secondary';
    }
  };

  const getTypeIcon = (type: AlertRule['type']) => {
    switch (type) {
      case 'mention_spike': return <IconTrendingUp />;
      case 'sentiment_drop': return <IconEmoticonSad />;
      case 'competitor_activity': return <IconUsers />;
      case 'keyword_ranking': return <IconSearch />;
      default: return <IconBell />;
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Alerts & Notifications
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Stay informed about important changes for {appData.brandName}
          </p>
        </div>
        
        <div className="flex items-center gap-4 mt-4 lg:mt-0">
          {unreadCount > 0 && (
            <Button variant="secondary" onClick={markAllAsRead}>
              Mark All as Read ({unreadCount})
            </Button>
          )}
          <Button variant="primary" onClick={() => setShowCreateRuleModal(true)}>
            Create Alert Rule
          </Button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex items-center gap-2 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl w-fit">
        <button
          onClick={() => setActiveTab('notifications')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
            activeTab === 'notifications'
              ? 'bg-brand-purple text-white shadow-lg'
              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
          }`}
        >
          <IconBell />
          Notifications
          {unreadCount > 0 && (
            <Badge variant="error" size="sm">{unreadCount}</Badge>
          )}
        </button>
        <button
          onClick={() => setActiveTab('rules')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
            activeTab === 'rules'
              ? 'bg-brand-purple text-white shadow-lg'
              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
          }`}
        >
          <IconSettings />
          Alert Rules ({alertRules.filter(r => r.active).length} active)
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'notifications' && (
        <div className="space-y-4">
          {notifications.length === 0 ? (
            <Card>
              <div className="text-center py-12">
                <IconBell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  No notifications yet
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  When your alert rules trigger, notifications will appear here.
                </p>
              </div>
            </Card>
          ) : (
            notifications.map((notification) => (
              <Card 
                key={notification.id} 
                className={`border-l-4 ${
                  notification.read 
                    ? 'border-gray-300 dark:border-gray-600' 
                    : 'border-brand-purple'
                } ${!notification.read ? 'bg-brand-purple/5 dark:bg-brand-purple/10' : ''}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="mt-1">
                      {getTypeIcon(notification.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className={`font-semibold ${
                          notification.read 
                            ? 'text-gray-600 dark:text-gray-400' 
                            : 'text-gray-900 dark:text-white'
                        }`}>
                          {notification.title}
                        </h3>
                        <Badge 
                          variant={getSeverityColor(notification.severity)} 
                          size="sm"
                        >
                          {notification.severity}
                        </Badge>
                        {!notification.read && (
                          <div className="w-2 h-2 bg-brand-purple rounded-full"></div>
                        )}
                      </div>
                      <p className={`text-sm ${
                        notification.read 
                          ? 'text-gray-500 dark:text-gray-500' 
                          : 'text-gray-700 dark:text-gray-300'
                      }`}>
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-400 mt-2">
                        {new Date(notification.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {!notification.read && (
                      <Button 
                        variant="secondary" 
                        size="sm"
                        onClick={() => markAsRead(notification.id)}
                      >
                        Mark as Read
                      </Button>
                    )}
                    <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                      <IconDotsVertical />
                    </button>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      )}

      {activeTab === 'rules' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {alertRules.map((rule) => (
              <Card key={rule.id}>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    {getTypeIcon(rule.type)}
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {rule.name}
                    </h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={rule.active ? 'success' : 'secondary'} size="sm">
                      {rule.active ? 'Active' : 'Inactive'}
                    </Badge>
                    <button
                      onClick={() => toggleRule(rule.id)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        rule.active ? 'bg-brand-purple' : 'bg-gray-200 dark:bg-gray-700'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                          rule.active ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>
                
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Trigger when:</span>
                    <div className="mt-1 p-2 bg-gray-50 dark:bg-gray-800 rounded-md">
                      Value {rule.conditions.operator} {rule.conditions.threshold}% 
                      over {rule.conditions.timeframe}
                    </div>
                  </div>
                  
                  <div>
                    <span className="text-gray-600 dark:text-gray-400 block mb-1">Notifications:</span>
                    <div className="flex gap-2">
                      {rule.channels.map((channel) => (
                        <Badge key={channel} variant="info" size="sm">
                          {channel}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  {rule.lastTriggered && (
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Last triggered:</span>
                      <div className="text-xs text-gray-500 mt-1">
                        {new Date(rule.lastTriggered).toLocaleString()}
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <Button variant="secondary" size="sm">
                    Edit
                  </Button>
                  <button className="text-red-600 hover:text-red-700 text-sm font-medium">
                    Delete
                  </button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Icon components
const IconBell = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5-5v5zm-5 0H5l5-5v5zM12 3v1m0 16v1M4 12H3m18 0h-1M5.636 5.636L4.929 4.93m12.728 12.728l.707.707M5.636 18.364L4.929 19.07m12.728-12.728l.707-.707" />
  </svg>
);

const IconSettings = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const IconTrendingUp = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
  </svg>
);

const IconEmoticonSad = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const IconUsers = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
  </svg>
);

const IconSearch = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const IconDotsVertical = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
    <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
  </svg>
);

export default AlertsPage;