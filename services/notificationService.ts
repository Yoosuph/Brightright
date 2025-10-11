export type NotificationType = 'success' | 'warning' | 'error' | 'info' | 'mention' | 'competitor' | 'alert' | 'report';
export type NotificationPriority = 'low' | 'medium' | 'high' | 'critical';
export type NotificationChannel = 'inapp' | 'email' | 'push' | 'slack';

export interface Notification {
  id: string;
  type: NotificationType;
  priority: NotificationPriority;
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
  actionLabel?: string;
  icon?: string;
  metadata?: {
    platform?: string;
    competitor?: string;
    sentiment?: string;
    change?: number;
    mentions?: number;
  };
  channels: NotificationChannel[];
}

export interface NotificationPreferences {
  channels: {
    inapp: boolean;
    email: boolean;
    push: boolean;
    slack: boolean;
  };
  categories: {
    mentions: boolean;
    competitors: boolean;
    alerts: boolean;
    reports: boolean;
    sentiment: boolean;
  };
  quietHours: {
    enabled: boolean;
    start: string; // "22:00"
    end: string; // "08:00"
  };
  frequency: 'realtime' | 'hourly' | 'daily' | 'weekly';
}

class NotificationService {
  private notifications: Notification[] = [];
  private subscribers: Set<(notifications: Notification[]) => void> = new Set();
  private preferences: NotificationPreferences = {
    channels: {
      inapp: true,
      email: true,
      push: false,
      slack: false,
    },
    categories: {
      mentions: true,
      competitors: true,
      alerts: true,
      reports: true,
      sentiment: true,
    },
    quietHours: {
      enabled: false,
      start: '22:00',
      end: '08:00',
    },
    frequency: 'realtime',
  };

  constructor() {
    // Initialize with some mock notifications
    this.initializeMockNotifications();
    
    // Simulate real-time notifications
    this.startRealTimeSimulation();
  }

  private initializeMockNotifications() {
    const mockNotifications: Notification[] = [
      {
        id: 'notif_1',
        type: 'success',
        priority: 'high',
        title: 'Visibility Score Increased',
        message: 'Your brand visibility score has increased by 12% in the last 24 hours',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        read: false,
        actionUrl: '/dashboard',
        actionLabel: 'View Dashboard',
        icon: '📈',
        metadata: {
          change: 12,
        },
        channels: ['inapp', 'email'],
      },
      {
        id: 'notif_2',
        type: 'competitor',
        priority: 'critical',
        title: 'Competitor Alert',
        message: 'Competitor A launched a new feature that\'s being mentioned 45 times today',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
        read: false,
        actionUrl: '/intelligence',
        actionLabel: 'View Analysis',
        icon: '⚔️',
        metadata: {
          competitor: 'Competitor A',
          mentions: 45,
        },
        channels: ['inapp', 'push'],
      },
      {
        id: 'notif_3',
        type: 'mention',
        priority: 'medium',
        title: 'New Brand Mention on ChatGPT',
        message: 'Your brand was positively mentioned in a ChatGPT response about "best coffee subscriptions"',
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
        read: true,
        actionUrl: '/multiplatform',
        actionLabel: 'View Mention',
        icon: '💬',
        metadata: {
          platform: 'ChatGPT',
          sentiment: 'positive',
        },
        channels: ['inapp'],
      },
      {
        id: 'notif_4',
        type: 'alert',
        priority: 'high',
        title: 'Sentiment Drop Detected',
        message: 'Negative sentiment increased by 5% on Perplexity in the last 12 hours',
        timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8 hours ago
        read: true,
        actionUrl: '/analytics',
        actionLabel: 'Investigate',
        icon: '⚠️',
        metadata: {
          platform: 'Perplexity',
          sentiment: 'negative',
          change: -5,
        },
        channels: ['inapp', 'email'],
      },
      {
        id: 'notif_5',
        type: 'report',
        priority: 'low',
        title: 'Weekly Report Ready',
        message: 'Your weekly performance report is ready for review',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
        read: true,
        actionUrl: '/reports',
        actionLabel: 'View Report',
        icon: '📊',
        channels: ['inapp', 'email'],
      },
    ];

    this.notifications = mockNotifications;
  }

  private startRealTimeSimulation() {
    // Simulate new notifications arriving
    setInterval(() => {
      if (Math.random() > 0.7) { // 30% chance every interval
        this.addMockNotification();
      }
    }, 30000); // Check every 30 seconds
  }

  private addMockNotification() {
    const types: NotificationType[] = ['success', 'warning', 'info', 'mention', 'competitor', 'alert'];
    const type = types[Math.floor(Math.random() * types.length)];
    
    const notifications = {
      success: {
        title: 'Milestone Achieved',
        message: 'You\'ve reached 1000 total mentions this month!',
        icon: '🎉',
        priority: 'medium' as NotificationPriority,
      },
      warning: {
        title: 'Action Required',
        message: 'Your keyword tracking limit is almost reached',
        icon: '⚠️',
        priority: 'high' as NotificationPriority,
      },
      info: {
        title: 'Platform Update',
        message: 'New AI platform "Claude 3" is now available for tracking',
        icon: 'ℹ️',
        priority: 'low' as NotificationPriority,
      },
      mention: {
        title: 'New Mention Detected',
        message: `Your brand was mentioned on ${['ChatGPT', 'Claude', 'Gemini'][Math.floor(Math.random() * 3)]}`,
        icon: '💬',
        priority: 'medium' as NotificationPriority,
      },
      competitor: {
        title: 'Competitor Activity',
        message: 'Competitor B\'s visibility increased by 8% today',
        icon: '🔍',
        priority: 'high' as NotificationPriority,
      },
      alert: {
        title: 'Critical Alert',
        message: 'Unusual spike in negative sentiment detected',
        icon: '🚨',
        priority: 'critical' as NotificationPriority,
      },
    };

    const notificationData = notifications[type as keyof typeof notifications];
    
    const newNotification: Notification = {
      id: `notif_${Date.now()}`,
      type,
      priority: notificationData.priority,
      title: notificationData.title,
      message: notificationData.message,
      timestamp: new Date(),
      read: false,
      actionUrl: '/dashboard',
      actionLabel: 'View Details',
      icon: notificationData.icon,
      channels: ['inapp'],
    };

    this.notifications.unshift(newNotification);
    this.notifySubscribers();

    // Play notification sound if enabled
    if (this.preferences.channels.inapp && typeof window !== 'undefined') {
      this.playNotificationSound();
    }
  }

  private playNotificationSound() {
    // Create a simple notification sound using Web Audio API
    if (typeof window !== 'undefined' && window.AudioContext) {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = 800;
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0, audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 0.01);
      gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + 0.1);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.1);
    }
  }

  subscribe(callback: (notifications: Notification[]) => void) {
    this.subscribers.add(callback);
    return () => {
      this.subscribers.delete(callback);
    };
  }

  private notifySubscribers() {
    this.subscribers.forEach(callback => callback(this.notifications));
  }

  getNotifications(): Notification[] {
    return this.notifications;
  }

  getUnreadNotifications(): Notification[] {
    return this.notifications.filter(n => !n.read);
  }

  getUnreadCount(): number {
    return this.getUnreadNotifications().length;
  }

  markAsRead(notificationId: string) {
    const notification = this.notifications.find(n => n.id === notificationId);
    if (notification) {
      notification.read = true;
      this.notifySubscribers();
    }
  }

  markAllAsRead() {
    this.notifications.forEach(n => {
      n.read = true;
    });
    this.notifySubscribers();
  }

  deleteNotification(notificationId: string) {
    this.notifications = this.notifications.filter(n => n.id !== notificationId);
    this.notifySubscribers();
  }

  clearAll() {
    this.notifications = [];
    this.notifySubscribers();
  }

  getPreferences(): NotificationPreferences {
    return this.preferences;
  }

  updatePreferences(preferences: Partial<NotificationPreferences>) {
    this.preferences = { ...this.preferences, ...preferences };
    // In production, save to backend
    if (typeof window !== 'undefined') {
      localStorage.setItem('notificationPreferences', JSON.stringify(this.preferences));
    }
  }

  async requestPushPermission(): Promise<boolean> {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }
    return false;
  }

  async sendPushNotification(notification: Notification) {
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      new Notification(notification.title, {
        body: notification.message,
        icon: '/logo.png', // Add your app logo
        badge: '/badge.png',
        tag: notification.id,
      });
    }
  }

  // Filter notifications by type
  getNotificationsByType(type: NotificationType): Notification[] {
    return this.notifications.filter(n => n.type === type);
  }

  // Filter notifications by date range
  getNotificationsByDateRange(startDate: Date, endDate: Date): Notification[] {
    return this.notifications.filter(n => 
      n.timestamp >= startDate && n.timestamp <= endDate
    );
  }

  // Get notification statistics
  getStatistics() {
    const total = this.notifications.length;
    const unread = this.getUnreadCount();
    const byType = {} as Record<NotificationType, number>;
    const byPriority = {} as Record<NotificationPriority, number>;

    this.notifications.forEach(n => {
      byType[n.type] = (byType[n.type] || 0) + 1;
      byPriority[n.priority] = (byPriority[n.priority] || 0) + 1;
    });

    return {
      total,
      unread,
      read: total - unread,
      byType,
      byPriority,
    };
  }
}

// Export singleton instance
export const notificationService = new NotificationService();
