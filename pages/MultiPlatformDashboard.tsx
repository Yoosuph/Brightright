import React, { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';
import Card from '../components/Card';
import Button from '../components/Button';
import Badge from '../components/ui/Badge';
import { platformTracking, SUPPORTED_PLATFORMS, type MultiPlatformData, type Citation } from '../services/platformTracking';
import { promptTracking, type TrackedPrompt, type PromptAnalytics } from '../services/promptTracking';

// Icons
const IconRefresh = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
  </svg>
);

const IconTrending = ({ trend }: { trend: 'up' | 'down' | 'stable' }) => {
  if (trend === 'up') {
    return (
      <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </svg>
    );
  }
  if (trend === 'down') {
    return (
      <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
      </svg>
    );
  }
  return (
    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14" />
    </svg>
  );
};

const IconLink = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
  </svg>
);

const IconAdd = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
);

interface PlatformCardProps {
  platform: any;
  data: MultiPlatformData;
}

const PlatformCard: React.FC<PlatformCardProps> = ({ platform, data }) => {
  const metrics = data.platforms.find(p => p.platform === platform.id);
  if (!metrics) return null;
  
  return (
    <div className="relative p-3 sm:p-4 lg:p-6 bg-gradient-to-br from-light-card/90 to-light-card/50 dark:from-dark-card/90 dark:to-dark-card/50 rounded-xl border border-white/10 hover:border-white/20 transition-all duration-300 hover:shadow-lg">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-3 sm:mb-4">
        <div className="flex items-center space-x-2 sm:space-x-3">
          <span className="text-2xl sm:text-3xl">{platform.icon}</span>
          <div>
            <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-gray-900 dark:text-white">{platform.name}</h3>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
              {metrics.shareOfVoice.toFixed(1)}% share
            </p>
          </div>
        </div>
        <IconTrending trend={metrics.trending} />
      </div>
      
      <div className="space-y-2 sm:space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Visibility</span>
          <span className="text-xl sm:text-2xl font-bold" style={{ color: platform.color }}>
            {metrics.visibility}
          </span>
        </div>
        
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 sm:h-2 overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${metrics.visibility}%`,
              backgroundColor: platform.color
            }}
          />
        </div>
        
        <div className="grid grid-cols-2 gap-1 sm:gap-2 pt-1 sm:pt-2">
          <div>
            <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">Avg Pos</p>
            <p className="text-xs sm:text-sm font-semibold">#{metrics.avgPosition.toFixed(1)}</p>
          </div>
          <div>
            <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">Citations</p>
            <p className="text-xs sm:text-sm font-semibold">{metrics.citationRate}%</p>
          </div>
        </div>
        
        {metrics.trending !== 'stable' && (
          <div className={`text-[10px] sm:text-xs ${metrics.trending === 'up' ? 'text-green-500' : 'text-red-500'}`}>
            {metrics.trending === 'up' ? '↑' : '↓'} {Math.abs(metrics.trendPercentage).toFixed(1)}% change
          </div>
        )}
      </div>
    </div>
  );
};

const CitationCard: React.FC<{ citation: Citation }> = ({ citation }) => {
  const typeColors = {
    news: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
    blog: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
    social: 'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300',
    academic: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
    corporate: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300',
    ugc: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300'
  };
  
  return (
    <div className="p-4 bg-white/50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1">
          <a
            href={citation.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
          >
            {citation.title}
            <IconLink />
          </a>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{citation.domain}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-2 py-0.5 text-xs rounded-full ${typeColors[citation.type]}`}>
            {citation.type}
          </span>
          <span className="text-xs font-semibold text-gray-600 dark:text-gray-400">
            {citation.authority}
          </span>
        </div>
      </div>
      
      <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">{citation.excerpt}</p>
      
      <div className="flex items-center justify-between">
        <Badge
          variant={citation.sentiment === 'positive' ? 'success' : citation.sentiment === 'negative' ? 'error' : 'default'}
        >
          {citation.sentiment}
        </Badge>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded">
            {citation.platform}
          </span>
          <span>{new Date(citation.timestamp).toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  );
};

const PromptTrackingModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSave: (prompt: string, variations: string[]) => void;
}> = ({ isOpen, onClose, onSave }) => {
  const [prompt, setPrompt] = useState('');
  const [variations, setVariations] = useState<string[]>(['']);
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-4">Track New Prompt</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Main Prompt</label>
              <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand-purple dark:bg-gray-700 dark:border-gray-600"
                placeholder="e.g., Best coffee subscription service 2024"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Prompt Variations (Optional)</label>
              {variations.map((variation, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={variation}
                    onChange={(e) => {
                      const newVariations = [...variations];
                      newVariations[index] = e.target.value;
                      setVariations(newVariations);
                    }}
                    className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand-purple dark:bg-gray-700 dark:border-gray-600"
                    placeholder="e.g., Coffee subscription reviews"
                  />
                  {index === variations.length - 1 && (
                    <button
                      onClick={() => setVariations([...variations, ''])}
                      className="px-3 py-2 bg-brand-purple text-white rounded-lg hover:bg-purple-700"
                    >
                      <IconAdd />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex justify-end gap-3 mt-6">
            <Button variant="secondary" onClick={onClose}>Cancel</Button>
            <Button
              onClick={() => {
                onSave(prompt, variations.filter(v => v));
                onClose();
              }}
              disabled={!prompt}
            >
              Start Tracking
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

const MultiPlatformDashboard: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [multiPlatformData, setMultiPlatformData] = useState<MultiPlatformData | null>(null);
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);
  const [trackedPrompts, setTrackedPrompts] = useState<TrackedPrompt[]>([]);
  const [promptAnalytics, setPromptAnalytics] = useState<Map<string, PromptAnalytics>>(new Map());
  const [isPromptModalOpen, setIsPromptModalOpen] = useState(false);
  
  // Get brand name from localStorage (set during onboarding)
  const brandName = localStorage.getItem('brandName') || 'Your Brand';
  
  useEffect(() => {
    loadData();
  }, []);
  
  const loadData = async () => {
    setIsLoading(true);
    try {
      // Load platform data
      const platformData = await platformTracking.trackBrand(brandName);
      setMultiPlatformData(platformData);
      
      // Load tracked prompts
      const prompts = await promptTracking.getTrackedPrompts('current_user');
      setTrackedPrompts(prompts);
      
      // Load analytics for each prompt
      const analytics = new Map();
      for (const prompt of prompts) {
        const data = await promptTracking.getPromptAnalytics(prompt.id);
        analytics.set(prompt.id, data);
      }
      setPromptAnalytics(analytics);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleRefresh = () => {
    loadData();
  };
  
  const handleAddPrompt = async (prompt: string, variations: string[]) => {
    const newPrompt = await promptTracking.createTrackedPrompt('current_user', prompt, {
      variations
    });
    setTrackedPrompts([...trackedPrompts, newPrompt]);
    
    // Load analytics for the new prompt
    const analytics = await promptTracking.getPromptAnalytics(newPrompt.id);
    setPromptAnalytics(new Map(promptAnalytics).set(newPrompt.id, analytics));
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-purple"></div>
      </div>
    );
  }
  
  if (!multiPlatformData) {
    return <div>No data available</div>;
  }
  
  // Prepare data for radar chart
  const radarData = multiPlatformData.platforms.map(p => ({
    platform: SUPPORTED_PLATFORMS.find(sp => sp.id === p.platform)?.name || p.platform,
    visibility: p.visibility,
    sentiment: (p.sentimentScore + 100) / 2, // Convert -100 to 100 to 0-100
    citations: p.citationRate
  }));
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
              Multi-Platform AI Visibility
            </h1>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1">
              Track your brand presence across all major AI platforms
            </p>
          </div>
          <Button onClick={handleRefresh} variant="secondary" className="w-full sm:w-auto">
            <IconRefresh />
            <span className="ml-2">Refresh Data</span>
          </Button>
        </div>
      </div>
      
      {/* Overall Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
        <Card>
          <div className="p-4 sm:p-6">
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Overall Visibility</p>
            <p className="text-2xl sm:text-3xl font-bold mt-1 sm:mt-2">{multiPlatformData.overallVisibility}</p>
            <p className="text-xs text-gray-500 mt-0.5 sm:mt-1">Across all platforms</p>
          </div>
        </Card>
        
        <Card>
          <div className="p-4 sm:p-6">
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Total Mentions</p>
            <p className="text-2xl sm:text-3xl font-bold mt-1 sm:mt-2">{multiPlatformData.totalMentions}</p>
            <p className="text-xs text-gray-500 mt-0.5 sm:mt-1">Last 30 days</p>
          </div>
        </Card>
        
        <Card>
          <div className="p-4 sm:p-6">
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Total Citations</p>
            <p className="text-2xl sm:text-3xl font-bold mt-1 sm:mt-2">{multiPlatformData.totalCitations}</p>
            <p className="text-xs text-gray-500 mt-0.5 sm:mt-1">Source references</p>
          </div>
        </Card>
        
        <Card>
          <div className="p-4 sm:p-6">
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Sentiment Score</p>
            <div className="flex items-center gap-1 sm:gap-2 mt-1 sm:mt-2">
              <span className="text-2xl sm:text-3xl font-bold text-green-500">
                {multiPlatformData.aggregatedSentiment.positive}%
              </span>
              <span className="text-xs sm:text-sm text-gray-500">positive</span>
            </div>
          </div>
        </Card>
      </div>
      
      {/* Platform Cards */}
      <div className="mb-6 sm:mb-8">
        <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">Platform Performance</h2>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {SUPPORTED_PLATFORMS.filter(p => p.isActive).map(platform => (
            <PlatformCard
              key={platform.id}
              platform={platform}
              data={multiPlatformData}
            />
          ))}
        </div>
      </div>
      
      {/* Radar Chart */}
      <Card className="mb-8">
        <div className="p-6">
          <h2 className="text-xl font-bold mb-4">Platform Comparison</h2>
          <ResponsiveContainer width="100%" height={400}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="#e5e5e5" />
              <PolarAngleAxis dataKey="platform" />
              <PolarRadiusAxis angle={90} domain={[0, 100]} />
              <Radar name="Visibility" dataKey="visibility" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.3} />
              <Radar name="Sentiment" dataKey="sentiment" stroke="#ec4899" fill="#ec4899" fillOpacity={0.3} />
              <Radar name="Citation Rate" dataKey="citations" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
              <Legend />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </Card>
      
      {/* Top Citations */}
      <Card className="mb-8">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Top Citations</h2>
            <span className="text-sm text-gray-500">Sorted by authority</span>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {multiPlatformData.topCitations.slice(0, 6).map((citation) => (
              <CitationCard key={citation.id} citation={citation} />
            ))}
          </div>
        </div>
      </Card>
      
      {/* Prompt Tracking Section */}
      <Card>
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Tracked Prompts</h2>
            <Button onClick={() => setIsPromptModalOpen(true)}>
              <IconAdd />
              Track New Prompt
            </Button>
          </div>
          
          {trackedPrompts.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No prompts being tracked. Add one to get started!
            </div>
          ) : (
            <div className="space-y-4">
              {trackedPrompts.map(prompt => {
                const analytics = promptAnalytics.get(prompt.id);
                return (
                  <div
                    key={prompt.id}
                    className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold">{prompt.prompt}</h3>
                        <p className="text-sm text-gray-500 mt-1">
                          Tracking on {prompt.platforms.length} platforms • {prompt.frequency}
                        </p>
                      </div>
                      {prompt.isActive && (
                        <Badge variant="success">Active</Badge>
                      )}
                    </div>
                    
                    {analytics && (
                      <div className="grid grid-cols-4 gap-4 mt-4">
                        <div>
                          <p className="text-xs text-gray-500">Mention Rate</p>
                          <p className="text-lg font-semibold">{analytics.mentionRate.toFixed(1)}%</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Avg Position</p>
                          <p className="text-lg font-semibold">#{analytics.avgPosition.toFixed(1)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Sentiment</p>
                          <div className="flex gap-1 mt-1">
                            <span className="text-xs text-green-500">
                              {analytics.sentimentDistribution.positive.toFixed(0)}%
                            </span>
                            <span className="text-xs text-gray-500">
                              {analytics.sentimentDistribution.neutral.toFixed(0)}%
                            </span>
                            <span className="text-xs text-red-500">
                              {analytics.sentimentDistribution.negative.toFixed(0)}%
                            </span>
                          </div>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Top Competitor</p>
                          <p className="text-sm font-semibold">
                            {analytics.topCompetitors[0]?.name || 'None'}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </Card>
      
      {/* Prompt Tracking Modal */}
      <PromptTrackingModal
        isOpen={isPromptModalOpen}
        onClose={() => setIsPromptModalOpen(false)}
        onSave={handleAddPrompt}
      />
    </div>
  );
};

export default MultiPlatformDashboard;
