import React from 'react';
import type { Page } from '../types';
import Breadcrumb, { getBreadcrumbItems } from './Breadcrumb';
import DataRefresh from './DataRefresh';
import HelpMenu from './HelpMenu';
import NotificationBell from './NotificationBell';

interface TopBarProps {
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
  title?: string;
  subtitle?: string;
  actions?: React.ReactNode;
  showBreadcrumb?: boolean;
  onDataRefresh?: () => Promise<void>;
  isDataLoading?: boolean;
  lastUpdated?: Date;
  showDataRefresh?: boolean;
  onRestartTour?: () => void;
  onMenuClick?: () => void;
}

const IconMenu: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M4 6h16M4 12h16M4 18h16"
    />
  </svg>
);

const IconRefresh: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
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

const IconQuestion: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

const getPageTitles = (page: Page): { title: string; subtitle?: string } => {
  const titles: Record<Page, { title: string; subtitle?: string }> = {
    dashboard: {
      title: 'Dashboard',
      subtitle: 'Monitor your brand visibility across AI platforms',
    },
    multiplatform: {
      title: 'AI Platforms',
      subtitle: 'Track your presence across all major AI platforms',
    },
    analytics: {
      title: 'Advanced Analytics',
      subtitle: 'Deep dive into your brand performance metrics',
    },
    keywords: {
      title: 'Keywords Management',
      subtitle: 'Track and optimize your brand keywords',
    },
    competitors: {
      title: 'Competitor Analysis',
      subtitle: 'Compare your performance with competitors',
    },
    intelligence: {
      title: 'Competitive Intelligence',
      subtitle: 'Monitor and analyze your competitive landscape',
    },
    alerts: {
      title: 'Alerts & Notifications',
      subtitle: 'Stay updated with real-time brand mentions',
    },
    reports: {
      title: 'Reports',
      subtitle: 'Generate and export detailed analytics reports',
    },
    settings: {
      title: 'Settings',
      subtitle: 'Configure your account and preferences',
    },
    landing: { title: 'Home' },
    pricing: { title: 'Pricing' },
    resources: { title: 'Resources' },
    changelog: { title: 'Changelog' },
    docs: { title: 'Documentation' },
  };

  return titles[page] || { title: 'Page Not Found' };
};

const TopBar: React.FC<TopBarProps> = ({
  currentPage,
  setCurrentPage,
  title,
  subtitle,
  actions,
  showBreadcrumb = true,
  onDataRefresh,
  isDataLoading = false,
  lastUpdated,
  showDataRefresh = false,
  onRestartTour,
  onMenuClick,
}) => {
  const pageInfo = getPageTitles(currentPage);
  const displayTitle = title || pageInfo.title;
  const displaySubtitle = subtitle || pageInfo.subtitle;
  const breadcrumbItems = getBreadcrumbItems(currentPage);

  const handleRefresh = () => {
    // Trigger a page refresh by re-setting the current page
    // This can be enhanced to trigger actual data refresh in the future
    window.location.reload();
  };

  const handleHelp = () => {
    // In a real app, this could open a help modal or navigate to docs
    setCurrentPage('docs');
  };

  return (
    <div className="bg-white dark:bg-dark-bg border-b border-gray-200 dark:border-gray-700">
      <div className="px-6 py-4">
        {/* Breadcrumb */}
        {showBreadcrumb && breadcrumbItems.length > 0 && (
          <Breadcrumb items={breadcrumbItems} setCurrentPage={setCurrentPage} />
        )}

        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center flex-1 min-w-0">
            {/* Mobile Menu Button */}
            <button
              onClick={onMenuClick}
              className="p-2 mr-3 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg md:hidden"
              aria-label="Open menu"
            >
              <IconMenu className="h-6 w-6" />
            </button>
            
            <div className="flex-1 min-w-0">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white truncate">
                {displayTitle}
              </h1>
              {displaySubtitle && (
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 max-w-2xl">
                  {displaySubtitle}
                </p>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center space-x-3">
            {/* Data Refresh Controls for Dashboard Pages */}
            {showDataRefresh && onDataRefresh && (
              <DataRefresh
                onRefresh={onDataRefresh}
                isLoading={isDataLoading}
                lastUpdated={lastUpdated}
                className="mr-3 border-r border-gray-200 dark:border-gray-700 pr-3"
              />
            )}

            {/* Default actions for all pages */}
            {!showDataRefresh && (
              <button
                onClick={handleRefresh}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors duration-200"
                title="Refresh page"
                aria-label="Refresh page"
              >
                <IconRefresh className="h-5 w-5" />
              </button>
            )}

            {/* Notification Bell */}
            <NotificationBell onNavigate={setCurrentPage} />

            {/* Help Menu with Tour Restart */}
            {onRestartTour && (
              <HelpMenu onRestartTour={onRestartTour} />
            )}

            {/* Custom actions passed as props */}
            {actions}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopBar;