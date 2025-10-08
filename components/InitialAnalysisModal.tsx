import React, { useState, useEffect } from 'react';
import Card from './Card';
import { ProgressLoadingState } from './LoadingState';

const IconEye = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-10 w-10"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
    />
  </svg>
);

interface AnalysisStep {
  id: string;
  label: string;
  description: string;
  duration: number; // in milliseconds
}

const ANALYSIS_STEPS: AnalysisStep[] = [
  {
    id: 'search',
    label: 'Searching AI Platforms',
    description: 'Scanning ChatGPT, Claude, Gemini, and other platforms',
    duration: 2000,
  },
  {
    id: 'analyze',
    label: 'Analyzing Mentions',
    description: 'Processing brand mentions and sentiment analysis',
    duration: 3000,
  },
  {
    id: 'competitors',
    label: 'Competitor Analysis',
    description: 'Comparing with competitor visibility',
    duration: 2500,
  },
  {
    id: 'insights',
    label: 'Generating Insights',
    description: 'Creating actionable recommendations',
    duration: 1500,
  },
  {
    id: 'dashboard',
    label: 'Building Dashboard',
    description: 'Finalizing your personalized dashboard',
    duration: 1000,
  },
];

const InitialAnalysisModal: React.FC<{ brandName: string; onComplete?: () => void }> = ({
  brandName,
  onComplete,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isCompleting, setIsCompleting] = useState(false);

  useEffect(() => {
    if (currentStepIndex >= ANALYSIS_STEPS.length) {
      setIsCompleting(true);
      const timer = setTimeout(() => {
        onComplete?.();
      }, 500);
      return () => clearTimeout(timer);
    }

    const currentStep = ANALYSIS_STEPS[currentStepIndex];
    const stepProgress = 100 / ANALYSIS_STEPS.length;
    const baseProgress = currentStepIndex * stepProgress;
    
    let startTime = Date.now();
    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const stepProgressPercent = Math.min((elapsed / currentStep.duration) * 100, 100);
      const totalProgress = baseProgress + (stepProgressPercent * stepProgress) / 100;
      
      setProgress(totalProgress);
      
      if (stepProgressPercent >= 100) {
        clearInterval(timer);
        setCurrentStepIndex(prev => prev + 1);
      }
    }, 50);

    return () => clearInterval(timer);
  }, [currentStepIndex, onComplete]);

  const currentStep = ANALYSIS_STEPS[currentStepIndex] || ANALYSIS_STEPS[ANALYSIS_STEPS.length - 1];
  const isComplete = isCompleting;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="w-full max-w-lg animate-slide-up">
        <Card className="text-center p-8 w-full overflow-hidden">
          {/* Main Animation */}
          <div className="relative w-32 h-32 mx-auto mb-6">
            {/* Radar Pulses */}
            <div
              className="absolute inset-0 rounded-full border-2 border-brand-purple/50 animate-radar-pulse"
              style={{ animationDelay: '0s' }}
            />
            <div
              className="absolute inset-0 rounded-full border-2 border-brand-purple/50 animate-radar-pulse"
              style={{ animationDelay: '0.6s' }}
            />
            <div
              className="absolute inset-0 rounded-full border-2 border-brand-purple/50 animate-radar-pulse"
              style={{ animationDelay: '1.2s' }}
            />

            {/* Central Icon */}
            <div className="absolute inset-0 flex items-center justify-center text-brand-pink animate-subtle-pulse">
              {isComplete ? (
                <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <IconEye />
              )}
            </div>
          </div>

          {/* Title */}
          <h2
            className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-brand-purple to-brand-pink mb-2 animate-text-gradient-shift"
            style={{ backgroundSize: '200% auto' }}
          >
            {isComplete ? 'Analysis Complete!' : 'Analyzing Visibility'}
          </h2>

          {/* Brand Name */}
          <p className="text-lg font-semibold text-gray-300 mb-4">
            {brandName}
          </p>

          {/* Current Step */}
          {!isComplete && (
            <div className="mb-6 space-y-2">
              <p className="text-white font-medium">
                {currentStep.label}
              </p>
              <p className="text-gray-400 text-sm">
                {currentStep.description}
              </p>
            </div>
          )}

          {/* Progress */}
          <div className="mb-6">
            <ProgressLoadingState 
              progress={progress} 
              message={isComplete ? 'Redirecting to dashboard...' : `Step ${currentStepIndex + 1} of ${ANALYSIS_STEPS.length}`}
            />
          </div>

          {/* Step Indicators */}
          <div className="flex justify-center space-x-2">
            {ANALYSIS_STEPS.map((step, index) => (
              <div
                key={step.id}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index < currentStepIndex
                    ? 'bg-green-400'
                    : index === currentStepIndex
                    ? 'bg-brand-purple animate-pulse'
                    : 'bg-gray-600'
                }`}
              />
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default InitialAnalysisModal;
