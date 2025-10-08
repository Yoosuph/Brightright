import React, { useState, useEffect } from 'react';

const TourDebugger: React.FC = () => {
  const [targets, setTargets] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const checkTargets = () => {
      const targetSelectors = [
        'sidebar',
        'dashboard-link',
        'analytics-link',
        'keywords-link',
        'competitors-link',
        'settings-link',
        'theme-toggle',
        'visibility-score',
        'mentions-card',
        'sentiment-card',
        'date-selector',
        'refresh-button',
        'mentions-table',
        'help-icon',
      ];

      const results: Record<string, boolean> = {};
      
      targetSelectors.forEach(selector => {
        const element = document.querySelector(`[data-tour="${selector}"]`);
        if (element) {
          const rect = element.getBoundingClientRect();
          results[selector] = rect.width > 0 && rect.height > 0;
        } else {
          results[selector] = false;
        }
      });

      setTargets(results);
    };

    checkTargets();
    const interval = setInterval(checkTargets, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed bottom-20 right-4 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg p-4 max-w-sm max-h-96 overflow-y-auto z-[10000] shadow-xl">
      <h3 className="font-bold text-sm mb-2">Tour Targets Debug</h3>
      <div className="space-y-1 text-xs">
        {Object.entries(targets).map(([key, visible]) => (
          <div key={key} className="flex items-center justify-between">
            <span className="font-mono">{key}</span>
            <span className={visible ? 'text-green-500' : 'text-red-500'}>
              {visible ? '✓ Visible' : '✗ Not Found'}
            </span>
          </div>
        ))}
      </div>
      <div className="mt-3 pt-3 border-t border-gray-300 dark:border-gray-700">
        <div className="text-xs">
          <div>Window: {window.innerWidth}×{window.innerHeight}</div>
          <div>Theme: {document.documentElement.classList.contains('dark') ? 'Dark' : 'Light'}</div>
        </div>
      </div>
    </div>
  );
};

export default TourDebugger;