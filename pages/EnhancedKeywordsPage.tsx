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
  ScatterChart,
  Scatter
} from 'recharts';
import Card from '../components/Card';
import Button from '../components/Button';
import Badge from '../src/components/ui/Badge';
import Metric from '../src/components/ui/Metric';
import type { KeywordOpportunity } from '../types';

interface EnhancedKeywordsPageProps {
  brandName: string;
  initialKeywords: string[];
}

const EnhancedKeywordsPage: React.FC<EnhancedKeywordsPageProps> = ({
  brandName,
  initialKeywords
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'opportunities' | 'tracking' | 'research'>('overview');
  const [selectedTimeframe, setSelectedTimeframe] = useState<'7d' | '30d' | '90d'>('30d');
  const [showAddKeywordModal, setShowAddKeywordModal] = useState(false);
  const [keywords, setKeywords] = useState(initialKeywords);

  // Mock keyword opportunities data
  const keywordOpportunities: KeywordOpportunity[] = [
    {
      keyword: 'AI brand monitoring',
      searchVolume: 18500,
      difficulty: 45,
      opportunity: 92,
      currentRanking: undefined,
      competitors: ['Brand24', 'Mention'],
      intent: 'informational'
    },
    {
      keyword: 'conversational AI analytics',
      searchVolume: 12300,
      difficulty: 58,
      opportunity: 87,
      currentRanking: undefined,
      competitors: ['ChatGPT Analytics', 'Perplexity Pro'],
      intent: 'transactional'
    },
    {
      keyword: 'AI mention tracking tool',
      searchVolume: 8900,
      difficulty: 52,
      opportunity: 85,
      currentRanking: 15,
      competitors: ['Brandwatch', 'Awario'],
      intent: 'transactional'
    },
    {
      keyword: 'generative AI brand insights',
      searchVolume: 6700,
      difficulty: 38,
      opportunity: 83,
      currentRanking: undefined,
      competitors: ['Talkwalker'],
      intent: 'informational'
    },
    {
      keyword: 'ChatGPT mention analysis',
      searchVolume: 15200,
      difficulty: 62,
      opportunity: 78,
      currentRanking: 8,
      competitors: ['SentiOne', 'Brand24'],
      intent: 'informational'
    }
  ];

  // Mock keyword tracking data
  const trackedKeywords = [
    {
      keyword: 'AI analytics platform',
      currentRank: 3,
      previousRank: 5,
      visibility: 78,
      mentions: 145,
      trend: 'up',
      difficulty: 65
    },
    {
      keyword: 'brand visibility tracking',
      currentRank: 1,
      previousRank: 1,
      visibility: 92,
      mentions: 203,
      trend: 'stable',
      difficulty: 48
    },
    {
      keyword: 'AI mention monitoring',
      currentRank: 7,
      previousRank: 4,
      visibility: 54,
      mentions: 89,
      trend: 'down',
      difficulty: 72
    },
    {
      keyword: 'competitive intelligence AI',
      currentRank: 12,
      previousRank: 15,
      visibility: 41,
      mentions: 67,
      trend: 'up',
      difficulty: 58
    }
  ];

  // Mock keyword research suggestions
  const researchSuggestions = [
    { keyword: 'AI sentiment tracking', score: 94, reason: 'High search volume, low competition' },
    { keyword: 'generative AI monitoring', score: 89, reason: 'Growing trend, good opportunity' },
    { keyword: 'LLM brand analysis', score: 85, reason: 'Emerging niche, early adoption' },
    { keyword: 'conversational AI insights', score: 82, reason: 'Related to current keywords' },
    { keyword: 'AI model mention tracking', score: 78, reason: 'Technical audience, good fit' }
  ];

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <IconTrendingUp className="w-4 h-4 text-green-500" />;
      case 'down': return <IconTrendingDown className="w-4 h-4 text-red-500" />;
      default: return <IconMinus className="w-4 h-4 text-gray-500" />;
    }
  };

  const getIntentColor = (intent: KeywordOpportunity['intent']) => {
    switch (intent) {
      case 'transactional': return 'success';
      case 'informational': return 'info';
      case 'navigational': return 'warning';
      default: return 'secondary';
    }
  };

  const opportunityScatterData = keywordOpportunities.map(kw => ({
    x: kw.difficulty,
    y: kw.searchVolume / 1000, // Convert to thousands
    z: kw.opportunity,
    name: kw.keyword
  }));

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Keyword Intelligence
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Discover, track, and optimize keywords for {brandName}'s AI visibility
          </p>
        </div>
        
        <div className="flex items-center gap-4 mt-4 lg:mt-0">
          <div className="flex items-center gap-2">
            {(['7d', '30d', '90d'] as const).map((timeframe) => (
              <button
                key={timeframe}
                onClick={() => setSelectedTimeframe(timeframe)}
                className={`px-3 py-1.5 text-sm rounded-md font-medium transition-colors ${
                  selectedTimeframe === timeframe
                    ? 'bg-brand-purple text-white'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                {timeframe.toUpperCase()}
              </button>
            ))}
          </div>
          <Button variant="primary" onClick={() => setShowAddKeywordModal(true)}>
            Add Keywords
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Metric
          label="Tracked Keywords"
          value={trackedKeywords.length}
          change={{ value: 12, period: 'last month' }}
          icon={<IconTag />}
        />
        <Metric
          label="Avg. Visibility Score"
          value={Math.round(trackedKeywords.reduce((acc, kw) => acc + kw.visibility, 0) / trackedKeywords.length)}
          change={{ value: 8.5, period: 'last month' }}
          icon={<IconEye />}
        />
        <Metric
          label="Opportunities Found"
          value={keywordOpportunities.length}
          description="High-value targets"
          icon={<IconTarget />}
        />
        <Metric
          label="Top Ranking"
          value={`#${Math.min(...trackedKeywords.map(kw => kw.currentRank))}`}
          change={{ value: 2, period: 'best position' }}
          icon={<IconTrophy />}
        />
      </div>

      {/* Tab Navigation */}
      <div className="flex items-center gap-2 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl w-fit">
        {[
          { id: 'overview', label: 'Overview', icon: <IconDashboard /> },
          { id: 'opportunities', label: 'Opportunities', icon: <IconLightbulb /> },
          { id: 'tracking', label: 'Tracking', icon: <IconChart /> },
          { id: 'research', label: 'Research', icon: <IconSearch /> }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              activeTab === tab.id
                ? 'bg-brand-purple text-white shadow-lg'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Keyword Performance Chart */}
          <Card className="col-span-2">
            <h3 className="text-xl font-semibold mb-6">Keyword Performance Trend</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={[
                  { date: 'Jan', visibility: 65, mentions: 120 },
                  { date: 'Feb', visibility: 72, mentions: 145 },
                  { date: 'Mar', visibility: 68, mentions: 132 },
                  { date: 'Apr', visibility: 78, mentions: 178 },
                  { date: 'May', visibility: 82, mentions: 203 },
                  { date: 'Jun', visibility: 85, mentions: 218 }
                ]}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="visibility" stroke="#8b5cf6" strokeWidth={3} />
                  <Line type="monotone" dataKey="mentions" stroke="#ec4899" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Top Performing Keywords */}
          <Card>
            <h3 className="text-xl font-semibold mb-4">Top Performing Keywords</h3>
            <div className="space-y-4">
              {trackedKeywords.slice(0, 3).map((kw, index) => (
                <div key={index} className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">
                      {kw.keyword}
                    </div>
                    <div className="text-sm text-gray-500">
                      Rank #{kw.currentRank} • {kw.mentions} mentions
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-2xl font-bold text-brand-purple">
                      {kw.visibility}
                    </div>
                    {getTrendIcon(kw.trend)}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {activeTab === 'opportunities' && (
        <div className="space-y-6">
          {/* Opportunity Matrix */}
          <Card>
            <h3 className="text-xl font-semibold mb-6">Opportunity Matrix</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart data={opportunityScatterData}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis type="number" dataKey="x" name="Difficulty" domain={[0, 100]} />
                  <YAxis type="number" dataKey="y" name="Search Volume (K)" domain={[0, 20]} />
                  <Tooltip 
                    cursor={{ strokeDasharray: '3 3' }}
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-white dark:bg-gray-800 p-3 border rounded-lg shadow-lg">
                            <p className="font-medium">{data.name}</p>
                            <p>Difficulty: {data.x}</p>
                            <p>Volume: {data.y}K</p>
                            <p>Opportunity: {data.z}</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Scatter dataKey="z" fill="#8b5cf6" />
                </ScatterChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
              Bubble size represents opportunity score. Look for large bubbles in the bottom-right quadrant (high volume, low difficulty).
            </div>
          </Card>

          {/* Keyword Opportunities List */}
          <Card>
            <h3 className="text-xl font-semibold mb-6">Keyword Opportunities</h3>
            <div className="space-y-4">
              {keywordOpportunities.map((opportunity, index) => (
                <div key={index} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-brand-purple/50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-semibold text-gray-900 dark:text-white">
                          {opportunity.keyword}
                        </h4>
                        <Badge variant={getIntentColor(opportunity.intent)} size="sm">
                          {opportunity.intent}
                        </Badge>
                        {opportunity.currentRanking && (
                          <Badge variant="secondary" size="sm">
                            Currently #{opportunity.currentRanking}
                          </Badge>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-6 text-sm text-gray-600 dark:text-gray-400 mb-2">
                        <span>Volume: {opportunity.searchVolume.toLocaleString()}/mo</span>
                        <span>Difficulty: {opportunity.difficulty}/100</span>
                        <span>Competitors: {opportunity.competitors.length}</span>
                      </div>
                      
                      <div className="text-xs text-gray-500">
                        vs {opportunity.competitors.join(', ')}
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-3xl font-bold text-brand-purple mb-1">
                        {opportunity.opportunity}
                      </div>
                      <div className="text-xs text-gray-500">Opportunity Score</div>
                      <Button variant="secondary" size="sm" className="mt-2">
                        Track Keyword
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {activeTab === 'tracking' && (
        <Card>
          <h3 className="text-xl font-semibold mb-6">Keyword Rankings</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3 px-4">Keyword</th>
                  <th className="text-left py-3 px-4">Current Rank</th>
                  <th className="text-left py-3 px-4">Change</th>
                  <th className="text-left py-3 px-4">Visibility</th>
                  <th className="text-left py-3 px-4">Mentions</th>
                  <th className="text-left py-3 px-4">Difficulty</th>
                  <th className="text-left py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {trackedKeywords.map((keyword, index) => (
                  <tr key={index} className="border-b border-gray-100 dark:border-gray-800">
                    <td className="py-4 px-4">
                      <div className="font-medium text-gray-900 dark:text-white">
                        {keyword.keyword}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="text-2xl font-bold">#{keyword.currentRank}</div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-1">
                        {getTrendIcon(keyword.trend)}
                        <span className={`text-sm font-medium ${
                          keyword.trend === 'up' ? 'text-green-600' :
                          keyword.trend === 'down' ? 'text-red-600' : 'text-gray-500'
                        }`}>
                          {keyword.currentRank - keyword.previousRank !== 0 && 
                            (keyword.currentRank - keyword.previousRank > 0 ? '+' : '') +
                            (keyword.currentRank - keyword.previousRank)
                          }
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-12 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div 
                            className="bg-brand-purple h-2 rounded-full transition-all duration-500"
                            style={{ width: `${keyword.visibility}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium">{keyword.visibility}%</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">{keyword.mentions}</td>
                    <td className="py-4 px-4">
                      <Badge 
                        variant={keyword.difficulty > 70 ? 'error' : keyword.difficulty > 50 ? 'warning' : 'success'} 
                        size="sm"
                      >
                        {keyword.difficulty}/100
                      </Badge>
                    </td>
                    <td className="py-4 px-4">
                      <Button variant="secondary" size="sm">
                        Details
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {activeTab === 'research' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <h3 className="text-xl font-semibold mb-6">AI-Suggested Keywords</h3>
            <div className="space-y-4">
              {researchSuggestions.map((suggestion, index) => (
                <div key={index} className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">
                      {suggestion.keyword}
                    </div>
                    <div className="text-sm text-gray-500">
                      {suggestion.reason}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-lg font-bold text-brand-purple">
                      {suggestion.score}
                    </div>
                    <Button variant="secondary" size="sm">
                      Add
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <h3 className="text-xl font-semibold mb-6">Keyword Research Tools</h3>
            <div className="space-y-4">
              <div className="p-4 bg-brand-purple/5 dark:bg-brand-purple/10 rounded-lg border border-brand-purple/20">
                <h4 className="font-semibold text-brand-purple mb-2">
                  Semantic Analysis
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  Find related keywords based on semantic similarity to your brand.
                </p>
                <Button variant="primary" size="sm">
                  Run Analysis
                </Button>
              </div>
              
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                <h4 className="font-semibold text-green-700 dark:text-green-400 mb-2">
                  Competitor Gap Analysis
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  Discover keywords your competitors rank for but you don't.
                </p>
                <Button variant="secondary" size="sm">
                  Analyze Gaps
                </Button>
              </div>
              
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <h4 className="font-semibold text-blue-700 dark:text-blue-400 mb-2">
                  Trending Keywords
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  Identify emerging keywords in AI and analytics spaces.
                </p>
                <Button variant="secondary" size="sm">
                  Find Trends
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

// Icon components
const IconTag = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5a2 2 0 012 2v5a2 2 0 01-2 2H7a2 2 0 01-2-2V5a2 2 0 012-2z" />
  </svg>
);

const IconEye = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);

const IconTarget = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
  </svg>
);

const IconTrophy = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
  </svg>
);

const IconDashboard = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
  </svg>
);

const IconLightbulb = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
  </svg>
);

const IconChart = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);

const IconSearch = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const IconTrendingUp = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
  </svg>
);

const IconTrendingDown = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M16.707 10.293a1 1 0 010 1.414l-6 6a1 1 0 01-1.414 0l-6-6a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l4.293-4.293a1 1 0 011.414 0z" clipRule="evenodd" />
  </svg>
);

const IconMinus = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
  </svg>
);

export default EnhancedKeywordsPage;