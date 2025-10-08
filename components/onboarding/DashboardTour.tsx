import React, { useEffect, useState } from 'react';
import GuidedTour from './GuidedTour';
import type { TourStep } from '../../types';

interface DashboardTourProps {
  run: boolean;
  onComplete: () => void;
  onSkip: () => void;
}

const TOUR_STORAGE_KEY = 'brightrank_tour_completed';

const DashboardTour: React.FC<DashboardTourProps> = ({ run, onComplete, onSkip }) => {
  const [isReady, setIsReady] = useState(false);

  // Wait for elements to be ready before starting tour
  useEffect(() => {
    if (!run) {
      setIsReady(false);
      return;
    }

    // Check if key elements exist
    const checkTargets = () => {
      const targets = [
        '[data-tour="sidebar"]',
        '[data-tour="visibility-score"]',
        '[data-tour="help-icon"]',
      ];

      const allExist = targets.every(selector => {
        const element = document.querySelector(selector);
        return element !== null;
      });
      
      if (allExist) {
        console.log('All tour targets found');
        setIsReady(true);
      } else {
        console.log('Some tour targets not ready yet, retrying...');
        setTimeout(checkTargets, 200);
      }
    };

    // Start checking after a small delay
    const initialDelay = setTimeout(checkTargets, 500);
    
    return () => clearTimeout(initialDelay);
  }, [run]);

  const steps: TourStep[] = [
    {
      selector: '[data-tour="sidebar"]',
      title: '📱 Navigation Sidebar',
      content: 'Use the sidebar to navigate between different sections of your dashboard. Each section provides unique insights into your AI visibility.',
      position: 'right',
    },
    {
      selector: '[data-tour="dashboard-link"]',
      title: '📊 Dashboard Overview',
      content: 'Your main hub for tracking visibility scores, sentiment analysis, and mentions across AI platforms like ChatGPT, Claude, and Gemini.',
      position: 'right',
    },
    {
      selector: '[data-tour="analytics-link"]',
      title: '📈 Advanced Analytics',
      content: 'Dive deeper into trends, predictions, and detailed performance metrics. Understand how your visibility changes over time.',
      position: 'right',
    },
    {
      selector: '[data-tour="keywords-link"]',
      title: '🔑 Keyword Tracking',
      content: 'Monitor how specific keywords associated with your brand perform. Track sentiment and mentions for each keyword individually.',
      position: 'right',
    },
    {
      selector: '[data-tour="competitors-link"]',
      title: '👥 Competitor Analysis',
      content: 'Compare your AI visibility against competitors. See how you stack up and identify opportunities to improve your rankings.',
      position: 'right',
    },
    {
      selector: '[data-tour="settings-link"]',
      title: '⚙️ Settings',
      content: 'Customize your preferences, update brand information, manage keywords, and configure tracking parameters.',
      position: 'right',
    },
    {
      selector: '[data-tour="theme-toggle"]',
      title: '🌓 Theme Toggle',
      content: 'Switch between light and dark mode to match your preference. Your choice is automatically saved.',
      position: 'top',
    },
    {
      selector: '[data-tour="visibility-score"]',
      title: '🎯 Visibility Score',
      content: 'Your overall AI visibility rating from 0-100. This score represents how often and positively your brand appears in AI responses.',
      position: 'bottom',
    },
    {
      selector: '[data-tour="mentions-card"]',
      title: '📢 Total Mentions',
      content: 'Track the total number of times your brand is mentioned across all AI platforms within your selected date range.',
      position: 'bottom',
    },
    {
      selector: '[data-tour="sentiment-card"]',
      title: '😊 Sentiment Breakdown',
      content: 'See the distribution of positive, neutral, and negative sentiment in mentions of your brand. Higher positive sentiment is better!',
      position: 'bottom',
    },
    {
      selector: '[data-tour="date-selector"]',
      title: '📅 Date Range Selector',
      content: 'Change the time period for your analytics. View data from the last 7 days, 30 days, or custom date ranges.',
      position: 'bottom',
    },
    {
      selector: '[data-tour="refresh-button"]',
      title: '🔄 Refresh Data',
      content: 'Click here to fetch the latest data from AI platforms. Keep your analytics up-to-date with real-time information.',
      position: 'bottom',
    },
    {
      selector: '[data-tour="mentions-table"]',
      title: '📋 Mentions Tracker',
      content: 'Detailed table of individual mentions showing the AI platform, query, response snippet, sentiment, and confidence level for each mention.',
      position: 'top',
    },
    {
      selector: '[data-tour="help-icon"]',
      title: '❓ Help Menu',
      content: 'Need help? Click here anytime to restart this tour, access documentation, or get support. You\'re ready to start tracking your AI visibility!',
      position: 'bottom',
    },
  ];

  const handleTourClose = () => {
    localStorage.setItem(TOUR_STORAGE_KEY, 'true');
    onComplete();
  };

  const handleTourSkip = () => {
    localStorage.setItem(TOUR_STORAGE_KEY, 'skipped');
    onSkip();
  };

  return (
    <GuidedTour
      steps={steps}
      isOpen={run && isReady}
      onClose={handleTourClose}
    />
  );
};

export default DashboardTour;
export { TOUR_STORAGE_KEY };
