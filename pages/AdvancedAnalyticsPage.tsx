import React, { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  ComposedChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Treemap,
  Cell
} from 'recharts';
import Card from '../components/Card';
import Button from '../components/Button';
import Metric from '../src/components/ui/Metric';
import Badge from '../src/components/ui/Badge';
import type {
  OnboardingData,
  TrendAnalysis,
  KeywordOpportunity,
  AIModelUsage,
  CompetitiveIntelligence
} from '../types';

interface AdvancedAnalyticsPageProps {
  appData: OnboardingData;
}

const AdvancedAnalyticsPage: React.FC<AdvancedAnalyticsPageProps> = ({
  appData
}) => {
  const [selectedTimeframe, setSelectedTimeframe] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const [activeTab, setActiveTab] = useState<'trends' | 'keywords' | 'models' | 'competitive'>('trends');

  // Mock data for analytics (would come from API in real app)
  const trendAnalysis: TrendAnalysis = {
    period: selectedTimeframe,
    growth: 23.5,
    predictions: {
      nextMonth: 78,
      nextQuarter: 85,
      confidence: 0.87
    },
    seasonality: {
      pattern: 'trending',
      peaks: ['December', 'March'],
      valleys: ['August', 'September']
    }
  };

  const keywordOpportunities: KeywordOpportunity[] = [
    {
      keyword: 'AI-powered analytics',
      searchVolume: 12500,
      difficulty: 65,
      opportunity: 85,
      currentRanking: 8,
      competitors: ['Competitor A', 'Competitor B'],
      intent: 'informational'
    },
    {
      keyword: 'brand visibility tracking',
      searchVolume: 8900,
      difficulty: 45,
      opportunity: 92,
      competitors: ['Competitor C'],
      intent: 'transactional'
    },
    {
      keyword: 'AI search optimization',
      searchVolume: 15200,
      difficulty: 78,
      opportunity: 67,
      competitors: ['Competitor A', 'Competitor D'],
      intent: 'informational'
    }
  ];

  const aiModelUsage: AIModelUsage[] = [
    {
      model: 'ChatGPT',
      usage: 45.2,
      growth: 12.8,
      demographics: {
        ageGroups: { '18-24': 35, '25-34': 40, '35-44': 25 },
        regions: { 'North America': 60, 'Europe': 25, 'Asia': 15 },
        industries: { 'Tech': 45, 'Marketing': 30, 'Finance': 25 }
      }
    },
    {
      model: 'Gemini',
      usage: 28.7,
      growth: 25.4,
      demographics: {
        ageGroups: { '18-24': 30, '25-34': 45, '35-44': 25 },
        regions: { 'North America': 45, 'Europe': 30, 'Asia': 25 },
        industries: { 'Tech': 50, 'Marketing': 25, 'Finance': 25 }
      }
    },
    {
      model: 'Claude',
      usage: 18.5,
      growth: 8.9,
      demographics: {
        ageGroups: { '18-24': 25, '25-34': 50, '35-44': 25 },
        regions: { 'North America': 70, 'Europe': 20, 'Asia': 10 },
        industries: { 'Tech': 60, 'Marketing': 20, 'Finance': 20 }
      }
    },
    {
      model: 'Perplexity',
      usage: 7.6,
      growth: 45.2,
      demographics: {
        ageGroups: { '18-24': 40, '25-34': 35, '35-44': 25 },
        regions: { 'North America': 55, 'Europe': 25, 'Asia': 20 },
        industries: { 'Tech': 40, 'Marketing': 35, 'Finance': 25 }
      }
    }
  ];

  const mockVisibilityTrend = [
    { date: 'Jan', score: 65, prediction: null },
    { date: 'Feb', score: 68, prediction: null },
    { date: 'Mar', score: 72, prediction: null },
    { date: 'Apr', score: 69, prediction: null },
    { date: 'May', score: 75, prediction: null },
    { date: 'Jun', score: 78, prediction: null },
    { date: 'Jul', score: 81, prediction: 84 },
    { date: 'Aug', score: null, prediction: 87 },
    { date: 'Sep', score: null, prediction: 85 }
  ];

  const TabButton: React.FC<{ 
    id: string; 
    label: string; 
    active: boolean; 
    onClick: () => void;
    icon: React.ReactNode;
  }> = ({ id, label, active, onClick, icon }) => (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
        active
          ? 'bg-brand-purple text-white shadow-lg'
          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
      }`}
    >
      {icon}
      {label}
    </button>
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Advanced Analytics
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Deep insights and predictive analytics for {appData.brandName}
          </p>
        </div>
        
        <div className="flex items-center gap-4 mt-4 lg:mt-0">
          <div className="flex items-center gap-2">
            {(['7d', '30d', '90d', '1y'] as const).map((timeframe) => (
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
          <Button variant="primary">
            Export Insights
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Metric
          label="AI Visibility Growth"
          value={`${trendAnalysis.growth}%`}
          change={{ value: 15.3, period: 'last month' }}
          icon={<IconTrendingUp />}
        />
        <Metric
          label="Prediction Confidence"
          value={`${Math.round(trendAnalysis.predictions.confidence * 100)}%`}
          description="Model accuracy"
          icon={<IconTarget />}
        />
        <Metric
          label="Next Quarter Forecast"
          value={trendAnalysis.predictions.nextQuarter}
          change={{ value: 8.2, period: 'current quarter' }}
          icon={<IconCrystalBall />}
        />
        <Metric
          label="Keyword Opportunities"
          value={keywordOpportunities.length}
          description="High-value targets"
          icon={<IconSearch />}
        />
      </div>

      {/* Tab Navigation */}
      <div className="flex items-center gap-2 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl w-fit">
        <TabButton
          id="trends"
          label="Trend Analysis"
          active={activeTab === 'trends'}
          onClick={() => setActiveTab('trends')}
          icon={<IconChart />}
        />
        <TabButton
          id="keywords"
          label="Keyword Intelligence"
          active={activeTab === 'keywords'}
          onClick={() => setActiveTab('keywords')}
          icon={<IconSearch />}
        />
        <TabButton
          id="models"
          label="AI Model Insights"
          active={activeTab === 'models'}
          onClick={() => setActiveTab('models')}
          icon={<IconBrain />}
        />
        <TabButton
          id="competitive"
          label="Competitive Intel"
          active={activeTab === 'competitive'}
          onClick={() => setActiveTab('competitive')}
          icon={<IconShield />}
        />
      </div>

      {/* Tab Content */}
      {activeTab === 'trends' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Trend Prediction Chart */}
          <Card className="col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold">Visibility Trend & Predictions</h3>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-brand-purple rounded-full"></div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">Historical</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-brand-pink rounded-full"></div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">Predicted</span>
                </div>
              </div>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={mockVisibilityTrend}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="score"
                    stroke="#8b5cf6"
                    strokeWidth={3}
                    dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 6 }}
                    connectNulls={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="prediction"
                    stroke="#ec4899"
                    strokeWidth={3}
                    strokeDasharray="5 5"
                    dot={{ fill: '#ec4899', strokeWidth: 2, r: 6 }}
                    connectNulls={false}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Seasonality Analysis */}
          <Card>
            <h3 className="text-xl font-semibold mb-4">Seasonality Insights</h3>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Pattern Type
                  </span>
                  <Badge variant="primary">{trendAnalysis.seasonality.pattern}</Badge>
                </div>
              </div>
              
              <div>
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400 block mb-2">
                  Peak Months
                </span>
                <div className="flex gap-2">
                  {trendAnalysis.seasonality.peaks.map((peak) => (
                    <Badge key={peak} variant="success" size="sm">
                      {peak}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400 block mb-2">
                  Low Periods
                </span>
                <div className="flex gap-2">
                  {trendAnalysis.seasonality.valleys.map((valley) => (
                    <Badge key={valley} variant="warning" size="sm">
                      {valley}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {activeTab === 'keywords' && (
        <div className="space-y-6">
          <Card>
            <h3 className="text-xl font-semibold mb-6">Keyword Opportunities</h3>
            <div className="space-y-4">
              {keywordOpportunities.map((opportunity, index) => (
                <div key={index} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                        {opportunity.keyword}
                      </h4>
                      <div className="flex items-center gap-6 text-sm text-gray-600 dark:text-gray-400">
                        <span>Volume: {opportunity.searchVolume.toLocaleString()}</span>
                        <span>Difficulty: {opportunity.difficulty}/100</span>
                        {opportunity.currentRanking && (
                          <span>Current Rank: #{opportunity.currentRanking}</span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge 
                          variant={opportunity.intent === 'transactional' ? 'success' : 'info'} 
                          size="sm"
                        >
                          {opportunity.intent}
                        </Badge>
                        <span className="text-xs text-gray-500">
                          vs {opportunity.competitors.join(', ')}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-brand-purple">
                        {opportunity.opportunity}
                      </div>
                      <div className="text-xs text-gray-500">Opportunity Score</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {activeTab === 'models' && (
        <div className="space-y-6">
          <Card>
            <h3 className="text-xl font-semibold mb-6">AI Model Usage & Trends</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {aiModelUsage.map((model) => (
                <div key={model.model} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      {model.model}
                    </h4>
                    <div className={`text-sm font-semibold ${
                      model.growth > 20 ? 'text-green-500' : 
                      model.growth > 10 ? 'text-yellow-500' : 'text-gray-500'
                    }`}>
                      +{model.growth}%
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-brand-purple mb-4">
                    {model.usage}%
                  </div>
                  <div className="space-y-3">
                    <div>
                      <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                        Top Industry: Tech ({model.demographics.industries.Tech}%)
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-brand-purple h-2 rounded-full transition-all duration-500"
                          style={{ width: `${model.demographics.industries.Tech}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

// Icon components (using simple SVGs)
const IconTrendingUp = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
  </svg>
);

const IconTarget = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
  </svg>
);

const IconCrystalBall = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
);

const IconSearch = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const IconChart = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);

const IconBrain = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
  </svg>
);

const IconShield = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);

export default AdvancedAnalyticsPage;