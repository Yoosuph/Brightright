import React from 'react';
import type { Page } from '../types';

interface BreadcrumbItem {
  label: string;
  page?: Page;
  isActive?: boolean;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  setCurrentPage: (page: Page) => void;
}

const IconChevronRight: React.FC = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-4 w-4 text-gray-400"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 5l7 7-7 7"
    />
  </svg>
);

const IconHome: React.FC = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-4 w-4"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
    />
  </svg>
);

const Breadcrumb: React.FC<BreadcrumbProps> = ({ items, setCurrentPage }) => {
  const handleNavigate = (page?: Page) => {
    if (page) {
      setCurrentPage(page);
    }
  };

  return (
    <nav 
      className="flex items-center space-x-1 text-sm mb-6 px-1"
      aria-label="Breadcrumb"
    >
      <ol className="flex items-center space-x-1">
        {/* Home icon always first */}
        <li>
          <button
            onClick={() => handleNavigate('dashboard')}
            className="flex items-center text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors duration-200"
            aria-label="Go to Dashboard"
          >
            <IconHome />
          </button>
        </li>
        
        {items.map((item, index) => (
          <li key={index} className="flex items-center">
            <IconChevronRight />
            {item.page && !item.isActive ? (
              <button
                onClick={() => handleNavigate(item.page)}
                className="ml-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors duration-200 hover:underline"
                aria-label={`Go to ${item.label}`}
              >
                {item.label}
              </button>
            ) : (
              <span 
                className={`ml-1 ${
                  item.isActive 
                    ? 'text-brand-purple font-medium dark:text-white' 
                    : 'text-gray-500 dark:text-gray-400'
                }`}
                aria-current={item.isActive ? 'page' : undefined}
              >
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

// Helper function to generate breadcrumb items based on current page
export const getBreadcrumbItems = (currentPage: Page): BreadcrumbItem[] => {
  const pageLabels: Record<Page, string> = {
    dashboard: 'Dashboard',
    analytics: 'Advanced Analytics',
    keywords: 'Keywords',
    competitors: 'Competitors',
    alerts: 'Alerts',
    reports: 'Reports',
    settings: 'Settings',
    landing: 'Home',
    pricing: 'Pricing',
    resources: 'Resources',
    changelog: 'Changelog',
    docs: 'Documentation',
  };

  // For most pages, just show the current page as active
  if (currentPage in pageLabels) {
    return [
      {
        label: pageLabels[currentPage],
        isActive: true,
      },
    ];
  }

  return [];
};

export default Breadcrumb;