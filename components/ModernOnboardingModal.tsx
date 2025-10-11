import React, { useState, useEffect } from 'react';
import Card from './Card';
import Button from './Button';
import { OnboardingData, CompetitorData } from '../types';
import FloatingLabelInput from './forms/FloatingLabelInput';
import { apiClient } from '../src/services/apiClient';
import Tooltip from './Tooltip';

interface ModernOnboardingData extends OnboardingData {
  website: string;
  industry?: string;
  targetCountries?: string[];
  aiPlatforms?: string[];
  trackingGoals?: string[];
  suggestedCompetitors?: SuggestedCompetitor[];
}

interface SuggestedCompetitor {
  name: string;
  website: string;
  description: string;
  relevanceScore: number;
  reasoning: string;
  isSelected: boolean;
}

interface ModernOnboardingModalProps {
  onComplete: (data: ModernOnboardingData) => void;
  onClose: () => void;
}

const ModernOnboardingModal: React.FC<ModernOnboardingModalProps> = ({
  onComplete,
  onClose,
}) => {
  const [step, setStep] = useState(1);
  const [isExiting, setIsExiting] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  // Step 1: Brand & Website
  const [brandName, setBrandName] = useState('');
  const [website, setWebsite] = useState('');
  
  // Step 2: AI Platform Selection
  const [aiPlatforms, setAiPlatforms] = useState<string[]>(['ChatGPT', 'Perplexity']);
  const [targetCountries, setTargetCountries] = useState<string[]>(['United States']);
  
  // Step 3: Competitor Analysis
  const [suggestedCompetitors, setSuggestedCompetitors] = useState<SuggestedCompetitor[]>([]);
  const [manualCompetitors, setManualCompetitors] = useState<CompetitorData[]>([]);
  const [newCompetitorName, setNewCompetitorName] = useState('');
  const [newCompetitorWebsite, setNewCompetitorWebsite] = useState('');
  
  // Step 4: Keywords & Goals
  const [keywords, setKeywords] = useState('');
  const [trackingGoals, setTrackingGoals] = useState<string[]>([]);
  const [suggestedKeywords, setSuggestedKeywords] = useState<string[]>([]);
  const [selectedSuggestedKeywords, setSelectedSuggestedKeywords] = useState<string[]>([]);

  const totalSteps = 3; // Reduced steps for cleaner flow

  const aiPlatformOptions = [
    { id: 'ChatGPT', name: 'ChatGPT', icon: '🤖' },
    { id: 'Perplexity', name: 'Perplexity AI', icon: '🔍' },
    { id: 'Claude', name: 'Claude', icon: '🧠' },
    { id: 'Gemini', name: 'Google Gemini', icon: '💎' },
    { id: 'Copilot', name: 'Microsoft Copilot', icon: '🚁' }
  ];

  const countryOptions = [
    'United States', 'United Kingdom', 'Canada', 'Australia', 'Germany', 
    'France', 'Spain', 'Italy', 'Netherlands', 'Sweden', 'Japan', 'India'
  ];

  const trackingGoalOptions = [
    'Brand Awareness Monitoring', 'Competitive Intelligence', 'Product Mentions',
    'Industry Authority', 'Customer Support Topics', 'Thought Leadership'
  ];

// Generate suggested keywords based on brand name and website
  const generateSuggestedKeywords = (brand: string, websiteUrl: string): string[] => {
    const keywords = [];
    
    // Add brand name variations
    keywords.push(brand);
    
    // Add common business-related keywords
    const commonKeywords = [
      'software', 'platform', 'service', 'solution', 'product',
      'tool', 'app', 'technology', 'innovation', 'analytics'
    ];
    
    // Add a few common keywords
    keywords.push(...commonKeywords.slice(0, 4));
    
    // Try to infer from domain
    try {
      const url = new URL(websiteUrl.startsWith('http') ? websiteUrl : `https://${websiteUrl}`);
      const domain = url.hostname.replace('www.', '').split('.')[0];
      if (domain && domain !== brand.toLowerCase()) {
        keywords.push(domain);
      }
    } catch (e) {
      // Invalid URL, skip
    }
    
    return [...new Set(keywords)]; // Remove duplicates
  };

// Use API client to analyze website for competitors (with mock fallback)
  const analyzeWebsiteForCompetitors = async (websiteUrl: string, brandName: string): Promise<SuggestedCompetitor[]> => {
    const raw = await apiClient.suggestCompetitors(websiteUrl, brandName);
    // Map to include selection state by default for top 3
    return raw.map((r, idx) => ({
      name: r.name,
      website: r.website,
      description: r.description,
      relevanceScore: r.relevanceScore,
      reasoning: r.reasoning,
      isSelected: idx < 3,
    }));
  };

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(onClose, 300);
  };

  const handleNext = async () => {
    if (step === 1 && brandName && website && aiPlatforms.length > 0) {
      // Start analyzing competitors before moving to step 2
      setStep(step + 1);
      setIsAnalyzing(true);
      try {
        const competitors = await analyzeWebsiteForCompetitors(website, brandName);
        setSuggestedCompetitors(competitors);
      } catch (error) {
        console.error('Competitor analysis failed:', error);
      } finally {
        setIsAnalyzing(false);
      }
    } else if (step === 2) {
      // Moving to step 3, generate suggested keywords
      const suggested = generateSuggestedKeywords(brandName, website);
      setSuggestedKeywords(suggested);
      // Pre-select first 3 keywords
      setSelectedSuggestedKeywords(suggested.slice(0, 3));
      setStep(step + 1);
    } else if (step < totalSteps) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleFinalSubmit = () => {
    const selectedSuggested = suggestedCompetitors
      .filter(comp => comp.isSelected)
      .map(comp => ({ name: comp.name, website: comp.website, visibility: 0 }));
    
    const allCompetitors = [...selectedSuggested, ...manualCompetitors];
    
    // Combine selected suggested keywords with manual keywords
    const manualKeywordsArray = keywords.split(',').map(k => k.trim()).filter(Boolean);
    const allKeywords = [...selectedSuggestedKeywords, ...manualKeywordsArray];
    const uniqueKeywords = [...new Set(allKeywords)];
    
    // Ensure we have at least some default keywords if nothing selected
    const finalKeywords = uniqueKeywords.length > 0 
      ? uniqueKeywords.join(', ')
      : `${brandName}, software, platform, service`;
    
    const enhancedData: ModernOnboardingData = {
      brandName,
      keywords: finalKeywords,
      competitors: allCompetitors,
      website,
      targetCountries,
      aiPlatforms,
      trackingGoals,
      suggestedCompetitors
    };
    
    console.log('✅ Onboarding data:', enhancedData);
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

  const toggleCompetitor = (competitorName: string) => {
    setSuggestedCompetitors(prev => 
      prev.map(comp => 
        comp.name === competitorName 
          ? { ...comp, isSelected: !comp.isSelected }
          : comp
      )
    );
  };

  const addManualCompetitor = () => {
    if (newCompetitorName.trim()) {
      setManualCompetitors(prev => [...prev, {
        name: newCompetitorName.trim(),
        website: newCompetitorWebsite.trim() || undefined,
        visibility: 0
      }]);
      setNewCompetitorName('');
      setNewCompetitorWebsite('');
    }
  };

  const removeManualCompetitor = (name: string) => {
    setManualCompetitors(prev => prev.filter(c => c.name !== name));
  };

  const toggleSuggestedKeyword = (keyword: string) => {
    setSelectedSuggestedKeywords(prev => 
      prev.includes(keyword)
        ? prev.filter(k => k !== keyword)
        : [...prev, keyword]
    );
  };

  const canProceed = () => {
    switch (step) {
      case 1: return brandName.trim().length > 0 && website.trim().length > 0 && aiPlatforms.length > 0;
      case 2: return true; // Competitors are optional
      case 3: return trackingGoals.length > 0 && selectedSuggestedKeywords.length > 0; // At least one keyword selected
      default: return false;
    }
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  const renderProgressBar = () => (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-2">
        <h1 className="text-lg font-bold bg-gradient-to-r from-brand-purple to-brand-pink bg-clip-text text-transparent">
          Setup BrightRank
        </h1>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {step}/{totalSteps}
          </span>
          <div className="flex gap-1">
            {Array.from({ length: totalSteps }, (_, i) => (
              <div
                key={i}
                className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                  i < step 
                    ? 'bg-gradient-to-r from-brand-purple to-brand-pink' 
                    : i === step - 1
                    ? 'bg-gradient-to-r from-brand-purple to-brand-pink animate-pulse'
                    : 'bg-gray-200 dark:bg-gray-700'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 overflow-hidden">
        <div 
          className="bg-gradient-to-r from-brand-purple via-purple-500 to-brand-pink h-1.5 rounded-full transition-all duration-700 ease-out"
          style={{ width: `${(step / totalSteps) * 100}%` }}
        />
      </div>
    </div>
  );

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-3">
            <div className="text-center mb-4">
              <div className="mx-auto mb-3 w-12 h-12 bg-gradient-to-br from-brand-purple via-purple-500 to-brand-pink rounded-xl flex items-center justify-center shadow-lg">
                <IconRocket className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-lg font-bold mb-1 text-gray-900 dark:text-white">
                Welcome to BrightRank
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-xs">
                Set up your AI visibility tracking
              </p>
            </div>
            
            <div className="space-y-3">
              <div className="group">
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Brand Name
                </label>
                <input
                  type="text"
                  value={brandName}
                  onChange={e => setBrandName(e.target.value)}
                  placeholder="e.g., BrightRank"
                  className="w-full px-3 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-purple/20 focus:border-brand-purple outline-none transition-all duration-300 text-gray-900 dark:text-white placeholder-gray-400"
                />
              </div>
              
              <div className="group">
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Website URL
                </label>
                <div className="relative">
                  <input
                    type="url"
                    value={website}
                    onChange={e => setWebsite(e.target.value)}
                    placeholder="https://yourbrand.com"
                    className="w-full px-3 py-2 pr-8 text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-purple/20 focus:border-brand-purple outline-none transition-all duration-300 text-gray-900 dark:text-white placeholder-gray-400"
                  />
                  <IconGlobe className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                </div>
              </div>

              <div className="group">
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  AI Platforms
                </label>
                <div className="grid grid-cols-2 gap-1.5">
                  {aiPlatformOptions.map(platform => (
                    <label
                      key={platform.id}
                      className={`flex items-center gap-2 p-2 border rounded-lg cursor-pointer transition-all duration-200 ${
                        aiPlatforms.includes(platform.id)
                          ? 'border-brand-purple bg-brand-purple/10'
                          : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={aiPlatforms.includes(platform.id)}
                        onChange={() => toggleArrayItem(platform.id, aiPlatforms, setAiPlatforms)}
                        className="w-3 h-3 text-brand-purple border-gray-300 rounded focus:ring-brand-purple"
                      />
                      <span className="text-sm">{platform.icon}</span>
                      <span className="text-xs font-medium text-gray-900 dark:text-white flex-1">{platform.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="group">
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Target Country
                </label>
                <div className="relative">
                  <select
                    value={targetCountries[0] || 'United States'}
                    onChange={(e) => setTargetCountries([e.target.value])}
                    className="w-full px-3 py-2 pr-8 text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-purple/20 focus:border-brand-purple outline-none transition-all duration-300 text-gray-900 dark:text-white appearance-none cursor-pointer"
                  >
                    {countryOptions.map(country => (
                      <option key={country} value={country}>{country}</option>
                    ))}
                  </select>
                  <svg className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-3">
            <div className="text-center mb-4">
              <div className="mx-auto mb-3 w-12 h-12 bg-gradient-to-br from-green-500 via-emerald-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <IconUsers className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-lg font-bold mb-1 text-gray-900 dark:text-white">
                {isAnalyzing ? 'Finding Competitors...' : 'Select Competitors'}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-xs">
                {isAnalyzing 
                  ? 'Analyzing your website'
                  : 'Choose competitors to track'
                }
              </p>
            </div>
            
            {isAnalyzing ? (
              <div className="flex flex-col items-center justify-center py-8">
                <div className="relative mb-4">
                  <div className="w-12 h-12 border-4 border-brand-purple/20 border-t-brand-purple rounded-full animate-spin"></div>
                  <IconAnalytics className="absolute inset-0 m-auto w-5 h-5 text-brand-purple" />
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                  Finding competitors...
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {suggestedCompetitors.length > 0 && (
                  <div>
                    <h3 className="text-xs font-semibold mb-2 text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
                      <IconSparkles className="w-3.5 h-3.5 text-yellow-500" />
                      Suggested
                    </h3>
                    <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                      {suggestedCompetitors.map(competitor => (
                        <div
                          key={competitor.name}
                          onClick={() => toggleCompetitor(competitor.name)}
                          className={`p-2 border rounded-md cursor-pointer transition-all duration-150 ${
                            competitor.isSelected
                              ? 'border-brand-purple bg-brand-purple/5'
                              : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                          }`}
                        >
                          <div className="flex items-start gap-2">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-1.5 mb-0.5">
                                <h4 className="font-semibold text-xs text-gray-900 dark:text-white truncate">
                                  {competitor.name}
                                </h4>
                                <span className="flex-shrink-0 text-[10px] bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-1 py-0.5 rounded">
                                  {competitor.relevanceScore}%
                                </span>
                              </div>
                              <p className="text-[10px] text-gray-600 dark:text-gray-400 leading-tight">
                                {competitor.description}
                              </p>
                            </div>
                            {competitor.isSelected && (
                              <div className="flex-shrink-0">
                                <IconCheck className="w-4 h-4 text-brand-purple" />
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="border-t border-gray-200 dark:border-gray-700 pt-2">
                  <h3 className="text-xs font-semibold mb-2 text-gray-700 dark:text-gray-300">
                    Add Manually
                  </h3>
                  <div className="flex gap-1.5 mb-2">
                    <input
                      type="text"
                      value={newCompetitorName}
                      onChange={e => setNewCompetitorName(e.target.value)}
                      placeholder="Name"
                      className="flex-1 px-2 py-1.5 text-xs bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-brand-purple focus:border-transparent outline-none transition-all text-gray-900 dark:text-white placeholder-gray-400"
                    />
                    <Button 
                      onClick={addManualCompetitor} 
                      disabled={!newCompetitorName.trim()}
                      className="px-3 py-1.5 text-xs"
                    >
                      Add
                    </Button>
                  </div>
                  
                  {manualCompetitors.length > 0 && (
                    <div className="space-y-1">
                      {manualCompetitors.map(competitor => (
                        <div key={competitor.name} className="flex items-center justify-between bg-gray-50 dark:bg-gray-800 p-1.5 rounded-md text-xs">
                          <span className="font-medium text-gray-900 dark:text-white">{competitor.name}</span>
                          <button
                            onClick={() => removeManualCompetitor(competitor.name)}
                            className="text-red-500 hover:text-red-700 p-0.5"
                          >
                            <IconTrash className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        );

      case 3:
        return (
          <div className="space-y-3">
            <div className="text-center mb-4">
              <div className="mx-auto mb-3 w-12 h-12 bg-gradient-to-br from-purple-500 via-violet-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
                <IconTarget className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-lg font-bold mb-1 text-gray-900 dark:text-white">
                Goals & Keywords
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-xs">
                Choose what matters most
              </p>
            </div>
            
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Goals
                </label>
                <div className="space-y-1.5">
                  {trackingGoalOptions.map(goal => (
                    <label
                      key={goal}
                      className={`flex items-center gap-2 p-2 border rounded-md cursor-pointer transition-all ${
                        trackingGoals.includes(goal)
                          ? 'border-brand-purple bg-brand-purple/5'
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={trackingGoals.includes(goal)}
                        onChange={() => toggleArrayItem(goal, trackingGoals, setTrackingGoals)}
                        className="w-3.5 h-3.5 text-brand-purple border-gray-300 rounded focus:ring-brand-purple"
                      />
                      <span className="text-xs font-medium text-gray-900 dark:text-white flex-1">{goal}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5 flex items-center gap-1.5">
                  <IconSparkles className="w-3.5 h-3.5 text-yellow-500" />
                  Suggested Keywords
                </label>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {suggestedKeywords.map(keyword => (
                    <button
                      key={keyword}
                      onClick={() => toggleSuggestedKeyword(keyword)}
                      className={`px-2 py-1 text-xs rounded-full transition-all ${
                        selectedSuggestedKeywords.includes(keyword)
                          ? 'bg-brand-purple text-white'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                      }`}
                    >
                      {keyword}
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Additional Keywords (Optional)
                </label>
                <textarea
                  value={keywords}
                  onChange={e => setKeywords(e.target.value)}
                  placeholder="Add more keywords separated by commas"
                  rows={2}
                  className="w-full px-3 py-2 text-xs bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-brand-purple focus:border-transparent outline-none transition-all text-gray-900 dark:text-white placeholder-gray-400 resize-none"
                />
                <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-1">
                  {selectedSuggestedKeywords.length} keyword{selectedSuggestedKeywords.length !== 1 ? 's' : ''} selected
                </p>
              </div>
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
      className={`fixed inset-0 bg-gradient-to-br from-black/70 via-purple-900/20 to-pink-900/20 backdrop-blur-md flex items-center justify-center z-50 p-4 ${
        isExiting ? 'opacity-0' : 'opacity-100'
      } transition-all duration-500`}
    >
      <div className={`w-full max-w-md ${isExiting ? 'animate-slide-down scale-95' : 'animate-slide-up scale-100'} transition-all duration-500`}>
        <Card className="w-full shadow-2xl border-0 p-4 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border border-white/20 dark:border-gray-700/50">
          {renderProgressBar()}
          {renderStep()}
          
          <div className="mt-4 flex gap-2">
            {step > 1 && (
              <Button 
                onClick={handleBack} 
                variant="secondary" 
                className="px-4 py-2 text-sm rounded-lg"
                disabled={isAnalyzing}
              >
                Back
              </Button>
            )}
            
            {step < totalSteps ? (
              <Button 
                onClick={handleNext} 
                variant="primary" 
                className="flex-1 px-4 py-2 text-sm bg-gradient-to-r from-brand-purple to-brand-pink hover:from-purple-600 hover:to-pink-600 rounded-lg transition-all duration-300"
                disabled={!canProceed() || isAnalyzing}
              >
                {isAnalyzing ? 'Analyzing...' : 'Continue'}
              </Button>
            ) : (
              <Button 
                onClick={handleFinalSubmit} 
                variant="primary" 
                className="flex-1 px-4 py-2 text-sm bg-gradient-to-r from-brand-purple to-brand-pink hover:from-purple-600 hover:to-pink-600 rounded-lg transition-all duration-300"
                disabled={!canProceed()}
              >
                Start Tracking
              </Button>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

// Enhanced Icon Components
const IconRocket = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
);

const IconGlobe = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const IconUsers = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
  </svg>
);

const IconTarget = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
  </svg>
);

const IconCheck = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

const IconSparkles = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.293 2.293a1 1 0 010 1.414L13 12l-1.293 1.293a1 1 0 01-1.414 0L8 10.414a1 1 0 010-1.414L10.293 6.707a1 1 0 011.414 0L13 8l2.293-2.293a1 1 0 011.414 0L18 7.414a1 1 0 010 1.414L16.707 10.121a1 1 0 01-1.414 0L14 8.828 12.293 10.536a1 1 0 01-1.414 0L9.586 9.243a1 1 0 010-1.414L11 6.121" />
  </svg>
);

const IconAnalytics = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);

const IconExternalLink = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
  </svg>
);

const IconTrash = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

export default ModernOnboardingModal;