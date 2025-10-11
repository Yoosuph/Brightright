import React, { useState, useEffect } from 'react';
import Card from '../components/Card';
import Button from '../components/Button';
import Badge from '../components/ui/Badge';
import type { ToastData } from '../components/Toast';
import type { OnboardingData, CompetitorData } from '../types';

interface SettingsPageProps {
  showToast: (data: ToastData) => void;
  appData: OnboardingData;
  setAppData: (data: OnboardingData) => void;
}

// Icons
const IconUser = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const IconBell = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
  </svg>
);

const IconShield = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);

const IconPlatform = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

const IconTrash = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

const IconAdd = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
);

const IconSave = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V2" />
  </svg>
);

const IconMail = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

const ToggleSwitch: React.FC<{
  label: string;
  description?: string;
  enabled: boolean;
  onChange: (enabled: boolean) => void;
  icon?: React.ReactNode;
}> = ({ label, description, enabled, onChange, icon }) => {
  return (
    <div className="flex items-start justify-between p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
      <div className="flex items-start space-x-3">
        {icon && (
          <div className="mt-0.5 text-gray-400">
            {icon}
          </div>
        )}
        <div className="flex-1">
          <h3 className="text-sm font-medium text-gray-900 dark:text-white">{label}</h3>
          {description && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{description}</p>
          )}
        </div>
      </div>
      <button
        onClick={() => onChange(!enabled)}
        className={`
          relative inline-flex items-center h-6 rounded-full w-11 transition-all duration-300
          focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-purple dark:focus:ring-offset-dark-bg
          ${enabled 
            ? 'bg-gradient-to-r from-brand-purple to-brand-pink' 
            : 'bg-gray-200 dark:bg-gray-700'
          }
        `}
      >
        <span
          className={`
            inline-block w-4 h-4 transform bg-white rounded-full transition-all duration-300 shadow-md
            ${enabled ? 'translate-x-6' : 'translate-x-1'}
          `}
        />
      </button>
    </div>
  );
};

const ModernSettingsPage: React.FC<SettingsPageProps> = ({
  showToast,
  appData,
  setAppData,
}) => {
  const [brandName, setBrandName] = useState(appData.brandName);
  const [keywords, setKeywords] = useState(appData.keywords);
  const [competitors, setCompetitors] = useState<CompetitorData[]>(
    appData.competitors || []
  );
  const [newCompetitorName, setNewCompetitorName] = useState('');
  const [newCompetitorScore, setNewCompetitorScore] = useState('');
  const [activeTab, setActiveTab] = useState<'general' | 'platforms' | 'notifications' | 'privacy'>('general');
  const [notificationPrefs, setNotificationPrefs] = useState({
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
    frequency: 'realtime' as 'realtime' | 'hourly' | 'daily' | 'weekly',
    quietHours: {
      enabled: false,
      start: '22:00',
      end: '08:00',
    },
  });
  
  const [platforms, setPlatforms] = useState({
    chatgpt: true,
    claude: true,
    gemini: true,
    perplexity: false,
    bing: false,
  });



  useEffect(() => {
    setBrandName(appData.brandName);
    setKeywords(appData.keywords);
    setCompetitors(appData.competitors || []);
  }, [appData]);

  const handleAddCompetitor = () => {
    if (newCompetitorName.trim() && newCompetitorScore.trim()) {
      const score = parseInt(newCompetitorScore, 10);
      if (!isNaN(score) && score >= 0 && score <= 100) {
        setCompetitors([
          ...competitors,
          { name: newCompetitorName.trim(), visibility: score },
        ]);
        setNewCompetitorName('');
        setNewCompetitorScore('');
      } else {
        showToast({
          message: 'Please enter a valid score (0-100).',
          type: 'error',
        });
      }
    }
  };

  const handleRemoveCompetitor = (nameToRemove: string) => {
    setCompetitors(competitors.filter(c => c.name !== nameToRemove));
  };

  const handleSave = () => {
    setAppData({ brandName, keywords, competitors });
    showToast({ message: 'Settings saved successfully!', type: 'success' });
  };

  const tabs = [
    { id: 'general', label: 'General', icon: <IconUser /> },
    { id: 'platforms', label: 'AI Platforms', icon: <IconPlatform /> },
    { id: 'notifications', label: 'Notifications', icon: <IconBell /> },
    { id: 'privacy', label: 'Privacy & Security', icon: <IconShield /> },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Settings</h1>
        <p className="mt-1 text-gray-600 dark:text-gray-400">
          Manage your account settings and preferences
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 mb-8 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`
              flex items-center space-x-2 px-4 py-2.5 rounded-lg font-medium transition-all duration-300
              ${activeTab === tab.id
                ? 'bg-white dark:bg-gray-700 text-brand-purple dark:text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }
            `}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Content Panels */}
      <div className="space-y-6">
        {/* General Settings */}
        {activeTab === 'general' && (
          <>
            <Card>
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-6 flex items-center">
                  <IconUser />
                  <span className="ml-2">Brand Information</span>
                </h2>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Brand Name
                    </label>
                    <input
                      type="text"
                      value={brandName}
                      onChange={(e) => setBrandName(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-brand-purple focus:border-transparent transition-all"
                      placeholder="Enter your brand name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Keywords to Track
                    </label>
                    <textarea
                      value={keywords}
                      onChange={(e) => setKeywords(e.target.value)}
                      rows={4}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-brand-purple focus:border-transparent transition-all resize-none"
                      placeholder="Enter keywords separated by commas"
                    />
                    <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                      Separate keywords with commas. These will be tracked across all AI platforms.
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            <Card>
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-6 flex items-center">
                  <IconShield />
                  <span className="ml-2">Competitor Tracking</span>
                </h2>
                
                <div className="mb-6">
                  <div className="flex gap-3">
                    <input
                      type="text"
                      value={newCompetitorName}
                      onChange={(e) => setNewCompetitorName(e.target.value)}
                      className="flex-1 px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-brand-purple focus:border-transparent"
                      placeholder="Competitor name"
                    />
                    <input
                      type="number"
                      value={newCompetitorScore}
                      onChange={(e) => setNewCompetitorScore(e.target.value)}
                      className="w-24 px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-brand-purple focus:border-transparent"
                      placeholder="Score"
                      min="0"
                      max="100"
                    />
                    <Button onClick={handleAddCompetitor}>
                      <IconAdd />
                      <span className="ml-2">Add</span>
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-3">
                  {competitors.map((competitor, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-xl hover:shadow-md transition-all"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-brand-purple to-brand-pink rounded-lg flex items-center justify-center text-white font-bold">
                          {competitor.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900 dark:text-white">{competitor.name}</h3>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Visibility score: {competitor.visibility}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-20 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-brand-purple to-brand-pink"
                            style={{ width: `${competitor.visibility}%` }}
                          />
                        </div>
                        <button
                          onClick={() => handleRemoveCompetitor(competitor.name)}
                          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
                        >
                          <IconTrash />
                        </button>
                      </div>
                    </div>
                  ))}
                  {competitors.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      No competitors added yet. Add competitors to track their performance.
                    </div>
                  )}
                </div>
              </div>
            </Card>
          </>
        )}

        {/* Platform Settings */}
        {activeTab === 'platforms' && (
          <Card>
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-6">AI Platform Integration</h2>
              <div className="space-y-1">
                <ToggleSwitch
                  label="ChatGPT"
                  description="Track mentions in OpenAI's ChatGPT"
                  enabled={platforms.chatgpt}
                  onChange={(enabled) => setPlatforms({ ...platforms, chatgpt: enabled })}
                  icon={<span className="text-lg">🤖</span>}
                />
                <ToggleSwitch
                  label="Claude"
                  description="Monitor Anthropic's Claude AI"
                  enabled={platforms.claude}
                  onChange={(enabled) => setPlatforms({ ...platforms, claude: enabled })}
                  icon={<span className="text-lg">🧠</span>}
                />
                <ToggleSwitch
                  label="Google Gemini"
                  description="Track Google's Gemini AI responses"
                  enabled={platforms.gemini}
                  onChange={(enabled) => setPlatforms({ ...platforms, gemini: enabled })}
                  icon={<span className="text-lg">✨</span>}
                />
                <ToggleSwitch
                  label="Perplexity"
                  description="Monitor Perplexity AI search results"
                  enabled={platforms.perplexity}
                  onChange={(enabled) => setPlatforms({ ...platforms, perplexity: enabled })}
                  icon={<span className="text-lg">🔍</span>}
                />
                <ToggleSwitch
                  label="Bing Chat"
                  description="Track Microsoft Bing Chat mentions"
                  enabled={platforms.bing}
                  onChange={(enabled) => setPlatforms({ ...platforms, bing: enabled })}
                  icon={<span className="text-lg">🔎</span>}
                />
              </div>
              <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  💡 Enable platforms to track your brand mentions across multiple AI services. More platforms coming soon!
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* Notification Settings */}
        {activeTab === 'notifications' && (
          <div className="space-y-6">
            {/* Notification Channels */}
            <Card>
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-6">Notification Channels</h2>
                <div className="space-y-1">
                  <ToggleSwitch
                    label="In-App Notifications"
                    description="Show notifications within the application"
                    enabled={notificationPrefs.channels.inapp}
                    onChange={(enabled) => setNotificationPrefs({
                      ...notificationPrefs,
                      channels: { ...notificationPrefs.channels, inapp: enabled }
                    })}
                    icon={<IconBell />}
                  />
                  <ToggleSwitch
                    label="Email Notifications"
                    description="Receive notifications via email"
                    enabled={notificationPrefs.channels.email}
                    onChange={(enabled) => setNotificationPrefs({
                      ...notificationPrefs,
                      channels: { ...notificationPrefs.channels, email: enabled }
                    })}
                    icon={<IconMail />}
                  />
                  <ToggleSwitch
                    label="Push Notifications"
                    description="Get browser push notifications"
                    enabled={notificationPrefs.channels.push}
                    onChange={(enabled) => setNotificationPrefs({
                      ...notificationPrefs,
                      channels: { ...notificationPrefs.channels, push: enabled }
                    })}
                    icon={<span className="text-gray-400">📱</span>}
                  />
                  <ToggleSwitch
                    label="Slack Integration"
                    description="Send notifications to your Slack workspace"
                    enabled={notificationPrefs.channels.slack}
                    onChange={(enabled) => setNotificationPrefs({
                      ...notificationPrefs,
                      channels: { ...notificationPrefs.channels, slack: enabled }
                    })}
                    icon={<span className="text-gray-400">💬</span>}
                  />
                </div>
              </div>
            </Card>

            {/* Notification Categories */}
            <Card>
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-6">Notification Categories</h2>
                <div className="space-y-1">
                  <ToggleSwitch
                    label="Brand Mentions"
                    description="Get notified when your brand is mentioned"
                    enabled={notificationPrefs.categories.mentions}
                    onChange={(enabled) => setNotificationPrefs({
                      ...notificationPrefs,
                      categories: { ...notificationPrefs.categories, mentions: enabled }
                    })}
                    icon={<span className="text-gray-400">💬</span>}
                  />
                  <ToggleSwitch
                    label="Competitor Activity"
                    description="Track competitor movements and updates"
                    enabled={notificationPrefs.categories.competitors}
                    onChange={(enabled) => setNotificationPrefs({
                      ...notificationPrefs,
                      categories: { ...notificationPrefs.categories, competitors: enabled }
                    })}
                    icon={<span className="text-gray-400">🏆</span>}
                  />
                  <ToggleSwitch
                    label="Critical Alerts"
                    description="Important changes that need immediate attention"
                    enabled={notificationPrefs.categories.alerts}
                    onChange={(enabled) => setNotificationPrefs({
                      ...notificationPrefs,
                      categories: { ...notificationPrefs.categories, alerts: enabled }
                    })}
                    icon={<span className="text-gray-400">🚨</span>}
                  />
                  <ToggleSwitch
                    label="Reports Ready"
                    description="When your scheduled reports are generated"
                    enabled={notificationPrefs.categories.reports}
                    onChange={(enabled) => setNotificationPrefs({
                      ...notificationPrefs,
                      categories: { ...notificationPrefs.categories, reports: enabled }
                    })}
                    icon={<span className="text-gray-400">📊</span>}
                  />
                  <ToggleSwitch
                    label="Sentiment Changes"
                    description="Significant changes in brand sentiment"
                    enabled={notificationPrefs.categories.sentiment}
                    onChange={(enabled) => setNotificationPrefs({
                      ...notificationPrefs,
                      categories: { ...notificationPrefs.categories, sentiment: enabled }
                    })}
                    icon={<span className="text-gray-400">😊</span>}
                  />
                </div>
              </div>
            </Card>

            {/* Notification Frequency */}
            <Card>
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-6">Delivery Settings</h2>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Notification Frequency
                    </label>
                    <select
                      value={notificationPrefs.frequency}
                      onChange={(e) => setNotificationPrefs({
                        ...notificationPrefs,
                        frequency: e.target.value as typeof notificationPrefs.frequency
                      })}
                      className="w-full text-sm border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 px-4 py-2"
                    >
                      <option value="realtime">Real-time</option>
                      <option value="hourly">Hourly Digest</option>
                      <option value="daily">Daily Summary</option>
                      <option value="weekly">Weekly Report</option>
                    </select>
                  </div>

                  <div>
                    <ToggleSwitch
                      label="Quiet Hours"
                      description="Pause notifications during specific hours"
                      enabled={notificationPrefs.quietHours.enabled}
                      onChange={(enabled) => setNotificationPrefs({
                        ...notificationPrefs,
                        quietHours: { ...notificationPrefs.quietHours, enabled }
                      })}
                      icon={<span className="text-gray-400">🌙</span>}
                    />
                    {notificationPrefs.quietHours.enabled && (
                      <div className="grid grid-cols-2 gap-4 mt-4 pl-12">
                        <div>
                          <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                            Start Time
                          </label>
                          <input
                            type="time"
                            value={notificationPrefs.quietHours.start}
                            onChange={(e) => setNotificationPrefs({
                              ...notificationPrefs,
                              quietHours: { ...notificationPrefs.quietHours, start: e.target.value }
                            })}
                            className="w-full text-sm border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 px-3 py-1"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                            End Time
                          </label>
                          <input
                            type="time"
                            value={notificationPrefs.quietHours.end}
                            onChange={(e) => setNotificationPrefs({
                              ...notificationPrefs,
                              quietHours: { ...notificationPrefs.quietHours, end: e.target.value }
                            })}
                            className="w-full text-sm border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 px-3 py-1"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Privacy Settings */}
        {activeTab === 'privacy' && (
          <Card>
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-6">Privacy & Security</h2>
              <div className="space-y-4">
                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
                  <div className="flex items-start space-x-3">
                    <span className="text-2xl">🔒</span>
                    <div>
                      <h3 className="font-medium text-green-800 dark:text-green-300">Data Encryption</h3>
                      <p className="text-sm text-green-700 dark:text-green-400 mt-1">
                        All your data is encrypted using industry-standard AES-256 encryption.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                  <div className="flex items-start space-x-3">
                    <span className="text-2xl">🛡️</span>
                    <div>
                      <h3 className="font-medium text-blue-800 dark:text-blue-300">GDPR Compliant</h3>
                      <p className="text-sm text-blue-700 dark:text-blue-400 mt-1">
                        We comply with GDPR and other data protection regulations.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3 mt-6">
                  <Button variant="secondary" className="w-full justify-center">
                    Download My Data
                  </Button>
                  <Button variant="secondary" className="w-full justify-center text-red-600 hover:text-red-700">
                    Delete My Account
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        )}
      </div>

      {/* Save Button */}
      <div className="mt-8 flex justify-end">
        <Button onClick={handleSave} className="px-8">
          <IconSave />
          <span className="ml-2">Save Settings</span>
        </Button>
      </div>
    </div>
  );
};

export default ModernSettingsPage;
