import React from 'react';
import Card from '../Card';
import Button from '../Button';

interface WelcomeModalProps {
  onStartTour: () => void;
  onSkip: () => void;
  brandName?: string;
}

const WelcomeModal: React.FC<WelcomeModalProps> = ({ 
  onStartTour, 
  onSkip,
  brandName = "your brand"
}) => {
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[9999] p-4 animate-fade-in">
      <Card className="max-w-2xl w-full shadow-2xl border-0 p-4 sm:p-6 lg:p-8 animate-slide-up max-h-[90vh] overflow-y-auto">
        <div className="text-center">
          {/* Icon/Logo */}
          <div className="mx-auto mb-6 w-20 h-20 bg-gradient-to-br from-brand-purple to-brand-pink rounded-2xl flex items-center justify-center shadow-lg">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>

          {/* Welcome Message */}
          <h1 className="text-3xl font-bold mb-3 bg-gradient-to-r from-brand-purple to-brand-pink bg-clip-text text-transparent">
            Welcome to BrightRank! 🎉
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
            You're all set to track {brandName}'s AI visibility across platforms
          </p>

          {/* Features List */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-6 sm:mb-8 text-left">
            <div className="flex items-start gap-3 p-3 sm:p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
              <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-sm sm:text-base text-gray-900 dark:text-white mb-1">Real-Time Analytics</h3>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Monitor your visibility score and sentiment trends</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 sm:p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
              <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-sm sm:text-base text-gray-900 dark:text-white mb-1">Keyword Tracking</h3>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Track how your keywords perform across AI platforms</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 sm:p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
              <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-sm sm:text-base text-gray-900 dark:text-white mb-1">Competitor Analysis</h3>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Compare your visibility against competitors</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 sm:p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
              <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 bg-pink-100 dark:bg-pink-900/30 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-pink-600 dark:text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-sm sm:text-base text-gray-900 dark:text-white mb-1">Actionable Insights</h3>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Get AI-powered recommendations to improve</p>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4 sm:pt-6">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Would you like a quick tour to help you get started?
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button 
                onClick={onStartTour}
                variant="primary"
                className="px-6 py-3 text-base min-h-[44px] touch-manipulation"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Start Tour (2 min)
              </Button>
              <Button 
                onClick={onSkip}
                variant="secondary"
                className="px-6 py-3 text-base min-h-[44px] touch-manipulation"
              >
                Skip for Now
              </Button>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-3">
              You can restart the tour anytime from the help menu
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default WelcomeModal;
