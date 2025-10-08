import React, { useState, useEffect } from 'react';
import Card from './Card';
import Button from './Button';
import { OnboardingData, CompetitorData } from '../types';
import FloatingLabelInput from './forms/FloatingLabelInput';
import FloatingLabelTextarea from './forms/FloatingLabelTextarea';

interface EnhancedOnboardingData extends OnboardingData {
  website?: string;
  industry?: string;
  targetCountries?: string[];
  aiPlatforms?: string[];
  promptCategories?: string[];
  initialPrompts?: string[];
  trackingGoals?: string[];
}

interface EnhancedOnboardingModalProps {
  onComplete: (data: EnhancedOnboardingData) => void;
  onClose: () => void;
}

const EnhancedOnboardingModal: React.FC<EnhancedOnboardingModalProps> = ({
  onComplete,
  onClose,
}) => {
  const [step, setStep] = useState(1);
  const [isExiting, setIsExiting] = useState(false);
  
  // Step 1: Brand & Business Info
  const [brandName, setBrandName] = useState('');
  const [website, setWebsite] = useState('');
  const [industry, setIndustry] = useState('');
  
  // Step 2: AI Platforms & Geography
  const [aiPlatforms, setAiPlatforms] = useState<string[]>(['ChatGPT', 'Perplexity']);
  const [targetCountries, setTargetCountries] = useState<string[]>(['United States']);
  
  // Step 3: Prompts & Keywords Setup
  const [trackingGoals, setTrackingGoals] = useState<string[]>([]);
  const [promptCategories, setPromptCategories] = useState<string[]>([]);
  const [initialPrompts, setInitialPrompts] = useState<string[]>([]);
  const [customPrompt, setCustomPrompt] = useState('');
  const [keywords, setKeywords] = useState('');
  
  // Step 4: Competitors
  const [competitors, setCompetitors] = useState<CompetitorData[]>([]);
  const [newCompetitorName, setNewCompetitorName] = useState('');
  const [newCompetitorWebsite, setNewCompetitorWebsite] = useState('');

  const totalSteps = 5;

  const aiPlatformOptions = [
    { id: 'ChatGPT', name: 'ChatGPT', description: 'OpenAI\'s conversational AI' },
    { id: 'Perplexity', name: 'Perplexity AI', description: 'AI-powered search engine' },
    { id: 'Claude', name: 'Claude', description: 'Anthropic\'s AI assistant' },
    { id: 'Gemini', name: 'Google Gemini', description: 'Google\'s AI model' },
    { id: 'Copilot', name: 'Microsoft Copilot', description: 'Microsoft\'s AI assistant' }
  ];

  const countryOptions = [
    'United States', 'United Kingdom', 'Canada', 'Australia', 'Germany', 
    'France', 'Spain', 'Italy', 'Netherlands', 'Sweden', 'Japan', 'India'
  ];

  const trackingGoalOptions = [
    'Brand Awareness Monitoring', 'Competitive Intelligence', 'Product Mentions',
    'Industry Authority', 'Customer Support Topics', 'Thought Leadership'
  ];

  const promptCategoryOptions = [
    'Best [Product] for...', 'How to choose...', '[Industry] tools comparison',
    'What is the best...', '[Problem] solutions', 'Top [Category] options'
  ];

  const suggestedPrompts = [
    'best CRM software for small business',
    'how to choose a marketing analytics tool',
    'top AI platforms for content creation',
    'what is the best project management software',
    'customer support tools comparison',
    'enterprise software solutions'
  ];

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(onClose, 500);
  };

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleFinalSubmit = () => {
    const enhancedData: EnhancedOnboardingData = {
      brandName,
      keywords,
      competitors,
      website,
      industry,
      targetCountries,
      aiPlatforms,
      promptCategories,
      initialPrompts,
      trackingGoals
    };
    onComplete(enhancedData);
    handleClose();
  };

  const toggleArrayItem = (item: string, array: string[], setArray: (arr: string[]) => void) => {
    if (array.includes(item)) {
      setArray(array.filter(i => i !== item));
    } else {
      setArray([...array, item]);
    }
  };

  const addCustomPrompt = () => {
    if (customPrompt.trim() && !initialPrompts.includes(customPrompt.trim())) {
      setInitialPrompts([...initialPrompts, customPrompt.trim()]);
      setCustomPrompt('');
    }
  };

  const removePrompt = (prompt: string) => {
    setInitialPrompts(initialPrompts.filter(p => p !== prompt));
  };

  const addCompetitor = () => {
    if (newCompetitorName.trim()) {
      setCompetitors([...competitors, { 
        name: newCompetitorName.trim(), 
        website: newCompetitorWebsite.trim() || undefined,
        visibility: 0 
      }]);
      setNewCompetitorName('');
      setNewCompetitorWebsite('');
    }
  };

  const removeCompetitor = (name: string) => {
    setCompetitors(competitors.filter(c => c.name !== name));
  };

  const canProceed = () => {
    switch (step) {
      case 1: return brandName.trim().length > 0;
      case 2: return aiPlatforms.length > 0 && targetCountries.length > 0;
      case 3: return trackingGoals.length > 0;
      case 4: return true; // Competitors are optional
      case 5: return true; // Review step
      default: return false;
    }
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  const renderProgressBar = () => (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm text-gray-500">Step {step} of {totalSteps}</span>
        <span className="text-sm text-gray-500">{Math.round((step / totalSteps) * 100)}%</span>
      </div>
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
        <div 
          className="bg-gradient-to-r from-brand-purple to-brand-pink h-2 rounded-full transition-all duration-300"
          style={{ width: `${(step / totalSteps) * 100}%` }}
        />
      </div>
    </div>
  );

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div>
            <div className="text-center mb-6">
              <div className="mx-auto mb-4 w-16 h-16 bg-gradient-to-tr from-brand-purple to-brand-pink rounded-2xl flex items-center justify-center">
                <IconBrandBuilding />
              </div>
              <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">
                Tell us about your brand
              </h2>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Let's start with the basics to set up your AI visibility tracking
              </p>
            </div>
            
            <div className="space-y-6">
              <FloatingLabelInput
                id="brandName"
                label="Brand Name"
                value={brandName}
                onChange={e => setBrandName(e.target.value)}
                placeholder="e.g., BrightRight"
                required
              />
              
              <FloatingLabelInput
                id="website"
                label="Website URL"
                value={website}
                onChange={e => setWebsite(e.target.value)}
                placeholder="e.g., https://brightright.ai"
                helpText="We'll analyze your website to suggest relevant prompts"
              />
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Industry
                </label>
                <select
                  value={industry}
                  onChange={e => setIndustry(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-purple bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                >
                  <option value="">Select your industry</option>
                  <option value="SaaS">SaaS / Software</option>
                  <option value="Marketing">Marketing & Advertising</option>
                  <option value="Ecommerce">E-commerce</option>
                  <option value="Finance">Finance & Fintech</option>
                  <option value="Healthcare">Healthcare</option>
                  <option value="Education">Education</option>
                  <option value="Consulting">Consulting</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div>
            <div className="text-center mb-6">
              <div className="mx-auto mb-4 w-16 h-16 bg-gradient-to-tr from-brand-purple to-brand-pink rounded-2xl flex items-center justify-center">
                <IconGlobe />
              </div>
              <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">
                AI Platforms & Geography
              </h2>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Choose which AI platforms to monitor and your target markets
              </p>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  AI Platforms to Monitor
                </label>
                <div className="grid grid-cols-1 gap-3">
                  {aiPlatformOptions.map(platform => (
                    <label
                      key={platform.id}
                      className={`flex items-center p-3 border-2 rounded-lg cursor-pointer transition-all ${
                        aiPlatforms.includes(platform.id)
                          ? 'border-brand-purple bg-brand-purple/5'
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={aiPlatforms.includes(platform.id)}
                        onChange={() => toggleArrayItem(platform.id, aiPlatforms, setAiPlatforms)}
                        className="sr-only"
                      />
                      <div className="flex-1">
                        <div className="font-medium text-gray-900 dark:text-white">
                          {platform.name}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {platform.description}
                        </div>
                      </div>
                      {aiPlatforms.includes(platform.id) && (
                        <IconCheck className="text-brand-purple" />
                      )}
                    </label>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Target Countries
                </label>
                <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                  {countryOptions.map(country => (
                    <label
                      key={country}
                      className={`flex items-center p-2 border rounded-lg cursor-pointer transition-all ${
                        targetCountries.includes(country)
                          ? 'border-brand-purple bg-brand-purple/5'
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={targetCountries.includes(country)}
                        onChange={() => toggleArrayItem(country, targetCountries, setTargetCountries)}
                        className="sr-only"
                      />
                      <span className="text-sm">{country}</span>
                      {targetCountries.includes(country) && (
                        <IconCheck className="ml-auto text-brand-purple w-4 h-4" />
                      )}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div>
            <div className="text-center mb-6">
              <div className="mx-auto mb-4 w-16 h-16 bg-gradient-to-tr from-brand-purple to-brand-pink rounded-2xl flex items-center justify-center">
                <IconSearch />
              </div>
              <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">
                Prompts & Tracking Goals
              </h2>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Define what you want to track and monitor in AI responses
              </p>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  What are your tracking goals?
                </label>
                <div className="grid grid-cols-1 gap-2">
                  {trackingGoalOptions.map(goal => (
                    <label
                      key={goal}
                      className={`flex items-center p-3 border rounded-lg cursor-pointer transition-all ${
                        trackingGoals.includes(goal)
                          ? 'border-brand-purple bg-brand-purple/5'
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={trackingGoals.includes(goal)}
                        onChange={() => toggleArrayItem(goal, trackingGoals, setTrackingGoals)}
                        className="sr-only"
                      />
                      <span className="flex-1">{goal}</span>
                      {trackingGoals.includes(goal) && (
                        <IconCheck className="text-brand-purple" />
                      )}
                    </label>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Prompt Categories to Track
                </label>
                <div className="flex flex-wrap gap-2">
                  {promptCategoryOptions.map(category => (
                    <button
                      key={category}
                      onClick={() => toggleArrayItem(category, promptCategories, setPromptCategories)}
                      className={`px-3 py-1.5 text-sm rounded-full transition-all ${
                        promptCategories.includes(category)
                          ? 'bg-brand-purple text-white'
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Initial Prompts to Track
                </label>
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <FloatingLabelInput
                      id="customPrompt"
                      label="Add custom prompt"
                      value={customPrompt}
                      onChange={e => setCustomPrompt(e.target.value)}
                      placeholder="e.g., best project management tools"
                      className="flex-1"
                    />
                    <Button onClick={addCustomPrompt} disabled={!customPrompt.trim()}>
                      Add
                    </Button>
                  </div>
                  
                  {initialPrompts.length > 0 && (
                    <div className="max-h-32 overflow-y-auto space-y-2">
                      {initialPrompts.map(prompt => (
                        <div key={prompt} className="flex items-center justify-between bg-gray-100 dark:bg-gray-800 p-2 rounded">
                          <span className="text-sm">{prompt}</span>
                          <button
                            onClick={() => removePrompt(prompt)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <IconX className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Suggested prompts:</p>
                    <div className="flex flex-wrap gap-2">
                      {suggestedPrompts.filter(p => !initialPrompts.includes(p)).slice(0, 6).map(prompt => (
                        <button
                          key={prompt}
                          onClick={() => setInitialPrompts([...initialPrompts, prompt])}
                          className="px-2 py-1 text-xs bg-brand-purple/10 text-brand-purple rounded hover:bg-brand-purple/20 transition-colors"
                        >
                          + {prompt}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
              <FloatingLabelTextarea
                id="keywords"
                label="Additional Keywords to Monitor"
                value={keywords}
                onChange={e => setKeywords(e.target.value)}
                placeholder="e.g., AI analytics, visibility tracking, marketing intelligence"
                rows={3}
                helpText="These keywords will help us detect mentions in AI responses"
              />
            </div>
          </div>
        );

      case 4:
        return (
          <div>
            <div className="text-center mb-6">
              <div className="mx-auto mb-4 w-16 h-16 bg-gradient-to-tr from-brand-purple to-brand-pink rounded-2xl flex items-center justify-center">
                <IconUsers />
              </div>
              <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">
                Competitor Tracking
              </h2>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Add competitors to benchmark your AI visibility against industry leaders
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="flex gap-2">
                <FloatingLabelInput
                  id="competitorName"
                  label="Competitor Name"
                  value={newCompetitorName}
                  onChange={e => setNewCompetitorName(e.target.value)}
                  placeholder="e.g., CompetitorBrand"
                  className="flex-1"
                />
                <FloatingLabelInput
                  id="competitorWebsite"
                  label="Website (optional)"
                  value={newCompetitorWebsite}
                  onChange={e => setNewCompetitorWebsite(e.target.value)}
                  placeholder="competitor.com"
                  className="flex-1"
                />
                <Button onClick={addCompetitor} disabled={!newCompetitorName.trim()}>
                  Add
                </Button>
              </div>
              
              {competitors.length > 0 && (
                <div className="max-h-40 overflow-y-auto space-y-2">
                  {competitors.map(competitor => (
                    <div key={competitor.name} className="flex items-center justify-between bg-gray-100 dark:bg-gray-800 p-3 rounded-lg">
                      <div>
                        <div className="font-medium">{competitor.name}</div>
                        {competitor.website && (
                          <div className="text-sm text-gray-500">{competitor.website}</div>
                        )}
                      </div>
                      <button
                        onClick={() => removeCompetitor(competitor.name)}
                        className="text-red-500 hover:text-red-700 p-1"
                      >
                        <IconTrash className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              
              {competitors.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <p>No competitors added yet.</p>
                  <p className="text-sm mt-1">You can add competitors now or skip this step and add them later.</p>
                </div>
              )}
            </div>
          </div>
        );

      case 5:
        return (
          <div>
            <div className="text-center mb-6">
              <div className="mx-auto mb-4 w-16 h-16 bg-gradient-to-tr from-brand-purple to-brand-pink rounded-2xl flex items-center justify-center">
                <IconCheckCircle />
              </div>
              <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">
                Review Your Setup
              </h2>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                We'll use this information to start tracking your AI visibility
              </p>
            </div>
            
            <div className="space-y-4 max-h-96 overflow-y-auto">
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Brand Information</h3>
                <div className="space-y-1 text-sm">
                  <p><span className="text-gray-500">Brand:</span> {brandName}</p>
                  {website && <p><span className="text-gray-500">Website:</span> {website}</p>}
                  {industry && <p><span className="text-gray-500">Industry:</span> {industry}</p>}
                </div>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Tracking Configuration</h3>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-gray-500">AI Platforms:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {aiPlatforms.map(platform => (
                        <span key={platform} className="bg-brand-purple/20 text-brand-purple px-2 py-0.5 rounded-full text-xs">
                          {platform}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-500">Countries:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {targetCountries.slice(0, 3).map(country => (
                        <span key={country} className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 px-2 py-0.5 rounded-full text-xs">
                          {country}
                        </span>
                      ))}
                      {targetCountries.length > 3 && (
                        <span className="text-gray-500 text-xs">+{targetCountries.length - 3} more</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              {initialPrompts.length > 0 && (
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Initial Prompts ({initialPrompts.length})</h3>
                  <div className="space-y-1 text-sm max-h-24 overflow-y-auto">
                    {initialPrompts.slice(0, 5).map(prompt => (
                      <p key={prompt} className="text-gray-600 dark:text-gray-400">• {prompt}</p>
                    ))}
                    {initialPrompts.length > 5 && (
                      <p className="text-gray-500 text-xs">+{initialPrompts.length - 5} more prompts</p>
                    )}
                  </div>
                </div>
              )}
              
              {competitors.length > 0 && (
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Competitors ({competitors.length})</h3>
                  <div className="space-y-1 text-sm">
                    {competitors.slice(0, 3).map(competitor => (
                      <p key={competitor.name} className="text-gray-600 dark:text-gray-400">• {competitor.name}</p>
                    ))}
                    {competitors.length > 3 && (
                      <p className="text-gray-500 text-xs">+{competitors.length - 3} more competitors</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div
      onClick={handleBackdropClick}
      className={`fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 ${
        isExiting ? 'opacity-0' : 'opacity-100'
      } transition-opacity duration-300`}
    >
      <div className={`w-full max-w-2xl ${isExiting ? 'animate-slide-down' : 'animate-slide-up'}`}>
        <Card className="w-full">
          {renderProgressBar()}
          {renderStep()}
          
          <div className="mt-8 flex gap-4">
            {step > 1 && (
              <Button onClick={handleBack} variant="secondary" className="flex-1">
                Back
              </Button>
            )}
            {step < totalSteps ? (
              <Button 
                onClick={handleNext} 
                variant="primary" 
                className="flex-1"
                disabled={!canProceed()}
              >
                Continue
              </Button>
            ) : (
              <Button 
                onClick={handleFinalSubmit} 
                variant="primary" 
                className="flex-1"
              >
                Start AI Tracking
              </Button>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

// Icon Components
const IconBrandBuilding = () => (
  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
  </svg>
);

const IconGlobe = () => (
  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const IconSearch = () => (
  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const IconUsers = () => (
  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
  </svg>
);

const IconCheckCircle = () => (
  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const IconCheck = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

const IconX = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const IconTrash = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

export default EnhancedOnboardingModal;