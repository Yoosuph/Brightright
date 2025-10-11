import React, { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadialBarChart,
  RadialBar,
  Legend,
  PolarAngleAxis,
} from 'recharts';
import Card from '../components/Card';
import Button from '../components/Button';
import Badge from '../components/ui/Badge';
import { checkBrandVisibility } from '../services/geminiService';
import type { KeywordAnalysisResult, KeywordMentionDetail } from '../types';

interface KeywordsPageProps {
  brandName: string;
  initialKeywords: string[];
}

// Icons
const IconAdd = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
);

const IconSearch = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const IconTrending = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
  </svg>
);

const IconTrash = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

const IconSparkles = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
  </svg>
);

const IconAnalytics = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);

const SentimentIndicator: React.FC<{ sentiment: string; value: number }> = ({ sentiment, value }) => {
  const colors = {
    Positive: 'bg-gradient-to-r from-green-400 to-emerald-500',
    Negative: 'bg-gradient-to-r from-red-400 to-rose-500',
    Neutral: 'bg-gradient-to-r from-gray-400 to-slate-500',
    Mixed: 'bg-gradient-to-r from-purple-400 to-indigo-500',
  };

  return (
    <div className="flex items-center space-x-3">
      <span className="text-sm font-medium text-gray-600 dark:text-gray-400 w-20">{sentiment}</span>
      <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ease-out ${colors[sentiment as keyof typeof colors]}`}
          style={{ width: `${value}%` }}
        />
      </div>
      <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 w-12 text-right">
        {value}%
      </span>
    </div>
  );
};

const KeywordCard: React.FC<{
  keyword: string;
  onRemove: () => void;
  performance?: { mentions: number; sentiment: number; trend: 'up' | 'down' | 'stable' };
}> = ({ keyword, onRemove, performance }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="relative group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`
        relative p-4 rounded-xl border transition-all duration-300
        ${isHovered 
          ? 'bg-gradient-to-br from-purple-50/50 to-pink-50/50 dark:from-purple-900/20 dark:to-pink-900/20 border-purple-300 dark:border-purple-600 shadow-lg transform -translate-y-0.5' 
          : 'bg-white/50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700'
        }
      `}>
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{keyword}</h3>
          <button
            onClick={onRemove}
            className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-1.5 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 text-red-500"
          >
            <IconTrash />
          </button>
        </div>
        
        {performance && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500 dark:text-gray-400">Mentions</span>
              <span className="font-semibold">{performance.mentions}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500 dark:text-gray-400">Sentiment</span>
              <div className="flex items-center space-x-1">
                <div className={`w-2 h-2 rounded-full ${
                  performance.sentiment > 60 ? 'bg-green-500' : 
                  performance.sentiment > 40 ? 'bg-yellow-500' : 'bg-red-500'
                }`} />
                <span className="font-semibold">{performance.sentiment}%</span>
              </div>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500 dark:text-gray-400">Trend</span>
              <Badge variant={
                performance.trend === 'up' ? 'success' : 
                performance.trend === 'down' ? 'error' : 'default'
              }>
                {performance.trend === 'up' ? '↑' : performance.trend === 'down' ? '↓' : '→'} {performance.trend}
              </Badge>
            </div>
          </div>
        )}
      </div>
      
      {/* Decorative gradient blur */}
      {isHovered && (
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-purple-400 to-pink-400 rounded-xl blur-xl opacity-20" />
      )}
    </div>
  );
};

const ModernKeywordsPage: React.FC<KeywordsPageProps> = ({
  brandName,
  initialKeywords,
}) => {
  const [keywords, setKeywords] = useState<string[]>(initialKeywords);
  const [newKeyword, setNewKeyword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<KeywordAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'trending' | 'critical'>('all');

  // Mock performance data for keywords
  const keywordPerformance: { [key: string]: any } = {
    'coffee': { mentions: 45, sentiment: 75, trend: 'up' },
    'subscription': { mentions: 32, sentiment: 60, trend: 'stable' },
    'delivery': { mentions: 28, sentiment: 45, trend: 'down' },
    'eco-friendly': { mentions: 38, sentiment: 82, trend: 'up' },
    'quality': { mentions: 52, sentiment: 70, trend: 'up' },
  };

  useEffect(() => {
    setKeywords(initialKeywords);
  }, [initialKeywords]);

  const handleAddKeyword = () => {
    if (newKeyword.trim() && !keywords.includes(newKeyword.trim())) {
      setKeywords([...keywords, newKeyword.trim()]);
      setNewKeyword('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddKeyword();
    }
  };

  const handleRemoveKeyword = (keywordToRemove: string) => {
    setKeywords(keywords.filter(keyword => keyword !== keywordToRemove));
  };

  const handleAnalyze = async () => {
    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);

    if (keywords.length === 0) {
      setError('Please add at least one keyword to analyze.');
      setIsLoading(false);
      return;
    }

    const result = await checkBrandVisibility(brandName, keywords);

    if (result) {
      setAnalysisResult(result);
    } else {
      setError('Failed to get analysis. Please try again.');
    }
    setIsLoading(false);
  };

  const filteredKeywords = keywords.filter(keyword => 
    keyword.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Mock data for performance chart
  const performanceData = [
    { date: 'Mon', keywords: 12, mentions: 45 },
    { date: 'Tue', keywords: 14, mentions: 52 },
    { date: 'Wed', keywords: 13, mentions: 48 },
    { date: 'Thu', keywords: 16, mentions: 61 },
    { date: 'Fri', keywords: 15, mentions: 58 },
    { date: 'Sat', keywords: 18, mentions: 72 },
    { date: 'Sun', keywords: 17, mentions: 68 },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
            <IconSparkles />
            <span className="ml-3">Keyword Intelligence</span>
          </h1>
          <p className="mt-1 text-gray-600 dark:text-gray-400">
            Track and optimize your brand's keyword performance across AI platforms
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex space-x-3">
          <Button onClick={handleAnalyze} disabled={isLoading || keywords.length === 0}>
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Analyzing...
              </>
            ) : (
              <>
                <IconAnalytics />
                <span className="ml-2">Analyze Keywords</span>
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-6 rounded-2xl text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Total Keywords</p>
              <p className="text-3xl font-bold mt-1">{keywords.length}</p>
              <p className="text-purple-100 text-xs mt-1">Active tracking</p>
            </div>
            <div className="bg-white/20 p-3 rounded-xl">
              <IconTrending />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-emerald-500 p-6 rounded-2xl text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Avg. Sentiment</p>
              <p className="text-3xl font-bold mt-1">72%</p>
              <p className="text-green-100 text-xs mt-1">+5% this week</p>
            </div>
            <div className="bg-white/20 p-3 rounded-xl">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-cyan-500 p-6 rounded-2xl text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Total Mentions</p>
              <p className="text-3xl font-bold mt-1">342</p>
              <p className="text-blue-100 text-xs mt-1">Last 30 days</p>
            </div>
            <div className="bg-white/20 p-3 rounded-xl">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-red-500 p-6 rounded-2xl text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm">Trending Up</p>
              <p className="text-3xl font-bold mt-1">8</p>
              <p className="text-orange-100 text-xs mt-1">Keywords improving</p>
            </div>
            <div className="bg-white/20 p-3 rounded-xl">
              <IconTrending />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Keyword Management */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Keyword Portfolio</h2>
                <div className="flex space-x-2">
                  {['all', 'trending', 'critical'].map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category as any)}
                      className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                        selectedCategory === category
                          ? 'bg-brand-purple text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Add Keyword Input */}
              <div className="mb-6">
                <div className="flex gap-3">
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={newKeyword}
                      onChange={(e) => setNewKeyword(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Add a new keyword to track..."
                      className="w-full px-4 py-3 pl-12 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-brand-purple focus:border-transparent transition-all"
                    />
                    <IconSearch />
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                      <IconAdd />
                    </div>
                  </div>
                  <Button 
                    onClick={handleAddKeyword} 
                    disabled={!newKeyword.trim()}
                    className="px-6"
                  >
                    Add Keyword
                  </Button>
                </div>
              </div>

              {/* Search Bar */}
              <div className="mb-6">
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search keywords..."
                    className="w-full px-4 py-2 pl-10 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-brand-purple focus:border-transparent"
                  />
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <IconSearch />
                  </div>
                </div>
              </div>

              {/* Keywords Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredKeywords.length > 0 ? (
                  filteredKeywords.map(keyword => (
                    <KeywordCard
                      key={keyword}
                      keyword={keyword}
                      onRemove={() => handleRemoveKeyword(keyword)}
                      performance={keywordPerformance[keyword.toLowerCase()]}
                    />
                  ))
                ) : (
                  <div className="col-span-2 text-center py-12 text-gray-500">
                    {searchQuery ? 'No keywords match your search' : 'No keywords added yet. Start by adding some keywords to track!'}
                  </div>
                )}
              </div>
            </div>
          </Card>

          {/* Performance Chart */}
          <Card>
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4">Weekly Performance</h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.2} />
                  <XAxis dataKey="date" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip content={<CustomTooltip />} />
                  <Line 
                    type="monotone" 
                    dataKey="keywords" 
                    stroke="#8B5CF6" 
                    strokeWidth={2}
                    dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6 }}
                    name="Keywords"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="mentions" 
                    stroke="#EC4899" 
                    strokeWidth={2}
                    dot={{ fill: '#EC4899', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6 }}
                    name="Mentions"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        {/* Analysis Results */}
        <div className="space-y-6">
          {error && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400">
              {error}
            </div>
          )}

          {analysisResult && (
            <>
              <Card>
                <div className="p-6">
                  <h3 className="text-lg font-bold mb-4">Sentiment Analysis</h3>
                  <div className="space-y-3">
                    <SentimentIndicator sentiment="Positive" value={analysisResult.sentiment.positive} />
                    <SentimentIndicator sentiment="Neutral" value={analysisResult.sentiment.neutral} />
                    <SentimentIndicator sentiment="Negative" value={analysisResult.sentiment.negative} />
                    <SentimentIndicator sentiment="Mixed" value={analysisResult.sentiment.mixed} />
                  </div>
                </div>
              </Card>

              <Card>
                <div className="p-6">
                  <h3 className="text-lg font-bold mb-4">Top Performing Keywords</h3>
                  <div className="space-y-3">
                    {analysisResult.topKeywords.slice(0, 5).map((kw, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${
                            index === 0 ? 'from-yellow-400 to-orange-500' :
                            index === 1 ? 'from-gray-400 to-gray-500' :
                            'from-orange-400 to-red-400'
                          } flex items-center justify-center text-white font-bold text-sm`}>
                            {index + 1}
                          </div>
                          <span className="font-medium">{kw.keyword}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant="default">{kw.mentions} mentions</Badge>
                          <Badge variant={kw.trend === 'up' ? 'success' : kw.trend === 'down' ? 'error' : 'default'}>
                            {kw.trend === 'up' ? '↑' : kw.trend === 'down' ? '↓' : '→'}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            </>
          )}

          {/* Suggestions */}
          <Card>
            <div className="p-6">
              <h3 className="text-lg font-bold mb-4">AI Suggestions</h3>
              <div className="space-y-3">
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    💡 Consider adding "sustainable" - it's trending in your industry
                  </p>
                </div>
                <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                  <p className="text-sm text-green-700 dark:text-green-300">
                    🚀 "Premium quality" is performing well with 85% positive sentiment
                  </p>
                </div>
                <div className="p-3 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg">
                  <p className="text-sm text-purple-700 dark:text-purple-300">
                    📈 Your competitors are targeting "fast shipping" - consider monitoring
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

// Custom Tooltip Component
const CustomTooltip: React.FC<any> = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
        <p className="font-medium text-gray-900 dark:text-white">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {entry.name}: {entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default ModernKeywordsPage;
