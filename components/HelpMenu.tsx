import React, { useState, useRef, useEffect } from 'react';

interface HelpMenuProps {
  onRestartTour: () => void;
}

const HelpMenu: React.FC<HelpMenuProps> = ({ onRestartTour }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleRestartTour = () => {
    setIsOpen(false);
    onRestartTour();
  };

  return (
    <div className="relative" ref={menuRef} data-tour="help-icon">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors relative"
        title="Help & Support"
      >
        <svg
          className="w-6 h-6 text-gray-600 dark:text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        {/* Notification dot for first-time users */}
        <span className="absolute top-1 right-1 w-2 h-2 bg-brand-pink rounded-full animate-pulse"></span>
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-64 bg-white dark:bg-dark-card border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl z-50 animate-fade-in">
          <div className="p-2">
            <div className="px-3 py-2 border-b border-gray-200 dark:border-gray-700">
              <h3 className="font-semibold text-sm text-gray-900 dark:text-white">
                Help & Support
              </h3>
            </div>

            <button
              onClick={handleRestartTour}
              className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-left hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md transition-colors mt-2"
            >
              <div className="flex-shrink-0 w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-purple-600 dark:text-purple-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div>
                <div className="font-medium text-gray-900 dark:text-white">
                  Start Dashboard Tour
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  2 minute walkthrough
                </div>
              </div>
            </button>

            <a
              href="#"
              className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-left hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md transition-colors"
            >
              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-blue-600 dark:text-blue-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              </div>
              <div>
                <div className="font-medium text-gray-900 dark:text-white">
                  Documentation
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Guides and tutorials
                </div>
              </div>
            </a>

            <a
              href="#"
              className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-left hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md transition-colors"
            >
              <div className="flex-shrink-0 w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-green-600 dark:text-green-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                  />
                </svg>
              </div>
              <div>
                <div className="font-medium text-gray-900 dark:text-white">
                  Contact Support
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Get help from our team
                </div>
              </div>
            </a>

            <div className="border-t border-gray-200 dark:border-gray-700 mt-2 pt-2">
              <a
                href="#"
                className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-left hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md transition-colors"
              >
                <div className="flex-shrink-0 w-8 h-8 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-gray-600 dark:text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">
                    About BrightRank
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    v1.0.0
                  </div>
                </div>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HelpMenu;
