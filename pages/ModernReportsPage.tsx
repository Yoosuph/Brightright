import React, { useState, useCallback, useEffect } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import Card from '../components/Card';
import Button from '../components/Button';
import Badge from '../components/ui/Badge';
import { getDashboardAnalysis } from '../services/geminiService';
import type { OnboardingData, DashboardAnalysisResult } from '../types';

interface ReportsPageProps {
  appData: OnboardingData;
}

// Icons
const IconDownload = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
  </svg>
);

const IconCalendar = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const IconShare = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m9.032 4.026a3 3 0 10-4.026-4.026m4.026 4.026a3 3 0 00-4.026-4.026M6 12a3 3 0 110-6 3 3 0 010 6z" />
  </svg>
);

const IconPrint = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
  </svg>
);

const IconFilter = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
  </svg>
);

const IconChart = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);

const ModernReportsPage: React.FC<ReportsPageProps> = ({ appData }) => {
  const [selectedPeriod, setSelectedPeriod] = useState<'7d' | '30d' | '90d' | 'custom'>('30d');
  const [analysisData, setAnalysisData] = useState<DashboardAnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeReport, setActiveReport] = useState<'overview' | 'sentiment' | 'competitors' | 'keywords'>('overview');

  useEffect(() => {
    loadAnalysisData();
  }, [selectedPeriod]);

  const loadAnalysisData = async () => {
    setIsLoading(true);
    try {
      const data = await getDashboardAnalysis(
        appData.brandName,
        appData.keywords.split(',').map(k => k.trim()),
        getPeriodLabel(selectedPeriod)
      );
      setAnalysisData(data);
    } catch (error) {
      console.error('Failed to load analysis data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getPeriodLabel = (period: string): string => {
    switch (period) {
      case '7d': return 'Last 7 Days';
      case '30d': return 'Last 30 Days';
      case '90d': return 'Last 3 Months';
      default: return 'Custom Range';
    }
  };

  const handleExport = (format: 'pdf' | 'csv' | 'json') => {
    console.log(`Exporting report as ${format}`);
    // Implementation would go here
  };

  // Mock data for visualizations
  const visibilityTrend = [
    { date: 'Jan 1', score: 65, competitors: 45 },
    { date: 'Jan 8', score: 72, competitors: 48 },
    { date: 'Jan 15', score: 78, competitors: 52 },
    { date: 'Jan 22', score: 75, competitors: 55 },
    { date: 'Jan 29', score: 82, competitors: 54 },
    { date: 'Feb 5', score: 85, competitors: 56 },
    { date: 'Feb 12', score: 88, competitors: 58 },
  ];

  const platformDistribution = [
    { platform: 'ChatGPT', mentions: 45, sentiment: 75 },
    { platform: 'Claude', mentions: 38, sentiment: 82 },
    { platform: 'Gemini', mentions: 42, sentiment: 70 },
    { platform: 'Perplexity', mentions: 28, sentiment: 68 },
    { platform: 'Bing', mentions: 22, sentiment: 65 },
  ];

  const sentimentData = [
    { name: 'Positive', value: 65, color: '#10B981' },
    { name: 'Neutral', value: 25, color: '#F59E0B' },
    { name: 'Negative', value: 10, color: '#EF4444' },
  ];

  const radarData = [
    { metric: 'Visibility', value: 85, fullMark: 100 },
    { metric: 'Sentiment', value: 72, fullMark: 100 },
    { metric: 'Citations', value: 68, fullMark: 100 },
    { metric: 'Share of Voice', value: 45, fullMark: 100 },
    { metric: 'Engagement', value: 78, fullMark: 100 },
    { metric: 'Authority', value: 62, fullMark: 100 },
  ];

  const reportTabs = [
    { id: 'overview', label: 'Overview', icon: <IconChart /> },
    { id: 'sentiment', label: 'Sentiment Analysis', icon: '😊' },
    { id: 'competitors', label: 'Competitive Analysis', icon: '🏆' },
    { id: 'keywords', label: 'Keyword Performance', icon: '🔑' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Reports & Analytics</h1>
            <p className="mt-1 text-gray-600 dark:text-gray-400">
              Comprehensive insights and performance metrics for {appData.brandName}
            </p>
          </div>
          
          <div className="mt-4 lg:mt-0 flex flex-wrap gap-3">
            {/* Period Selector */}
            <div className="flex bg-gray-100 dark:bg-gray-800 rounded-xl p-1">
              {['7d', '30d', '90d'].map((period) => (
                <button
                  key={period}
                  onClick={() => setSelectedPeriod(period as any)}
                  className={`
                    px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300
                    ${selectedPeriod === period
                      ? 'bg-white dark:bg-gray-700 text-brand-purple shadow-sm'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                    }
                  `}
                >
                  {period === '7d' ? '7 Days' : period === '30d' ? '30 Days' : '90 Days'}
                </button>
              ))}
            </div>
            
            {/* Action Buttons */}
            <Button variant="secondary" onClick={() => window.print()}>
              <IconPrint />
              <span className="ml-2 hidden sm:inline">Print</span>
            </Button>
            <Button variant="secondary">
              <IconShare />
              <span className="ml-2 hidden sm:inline">Share</span>
            </Button>
            <Button onClick={() => handleExport('pdf')}>
              <IconDownload />
              <span className="ml-2">Export</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-6 rounded-2xl text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Visibility Score</p>
              <p className="text-4xl font-bold mt-1">{analysisData?.overallScore || 88}</p>
              <div className="flex items-center mt-2">
                <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">
                  +12% vs last period
                </span>
              </div>
            </div>
            <div className="text-4xl opacity-50">📊</div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-emerald-500 p-6 rounded-2xl text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Total Mentions</p>
              <p className="text-4xl font-bold mt-1">{analysisData?.totalMentions || 245}</p>
              <div className="flex items-center mt-2">
                <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">
                  +28 this week
                </span>
              </div>
            </div>
            <div className="text-4xl opacity-50">💬</div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-cyan-500 p-6 rounded-2xl text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Positive Sentiment</p>
              <p className="text-4xl font-bold mt-1">
                {analysisData?.sentimentBreakdown.positive || 72}%
              </p>
              <div className="flex items-center mt-2">
                <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">
                  Above average
                </span>
              </div>
            </div>
            <div className="text-4xl opacity-50">😊</div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-red-500 p-6 rounded-2xl text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm">Share of Voice</p>
              <p className="text-4xl font-bold mt-1">34%</p>
              <div className="flex items-center mt-2">
                <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">
                  #2 in industry
                </span>
              </div>
            </div>
            <div className="text-4xl opacity-50">🎯</div>
          </div>
        </div>
      </div>

      {/* Report Tabs */}
      <div className="flex space-x-1 mb-6 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl">
        {reportTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveReport(tab.id as any)}
            className={`
              flex items-center space-x-2 px-4 py-2.5 rounded-lg font-medium transition-all duration-300 flex-1
              ${activeReport === tab.id
                ? 'bg-white dark:bg-gray-700 text-brand-purple dark:text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }
            `}
          >
            <span className="text-lg">{tab.icon}</span>
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Report Content */}
      {activeReport === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Visibility Trend */}
          <Card>
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4">Visibility Trend</h2>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={visibilityTrend}>
                  <defs>
                    <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.1}/>
                    </linearGradient>
                    <linearGradient id="colorCompetitors" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#EC4899" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#EC4899" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.2} />
                  <XAxis dataKey="date" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="score"
                    stroke="#8B5CF6"
                    fillOpacity={1}
                    fill="url(#colorScore)"
                    strokeWidth={2}
                    name="Your Brand"
                  />
                  <Area
                    type="monotone"
                    dataKey="competitors"
                    stroke="#EC4899"
                    fillOpacity={1}
                    fill="url(#colorCompetitors)"
                    strokeWidth={2}
                    name="Competitors Avg"
                  />
                  <Legend />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Performance Radar */}
          <Card>
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4">Performance Overview</h2>
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke="#374151" />
                  <PolarAngleAxis dataKey="metric" stroke="#9CA3AF" />
                  <PolarRadiusAxis angle={90} domain={[0, 100]} stroke="#9CA3AF" />
                  <Radar
                    name="Current"
                    dataKey="value"
                    stroke="#8B5CF6"
                    fill="#8B5CF6"
                    fillOpacity={0.3}
                    strokeWidth={2}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Platform Distribution */}
          <Card>
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4">Platform Distribution</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={platformDistribution}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.2} />
                  <XAxis dataKey="platform" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="mentions" fill="#8B5CF6" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="sentiment" fill="#EC4899" radius={[8, 8, 0, 0]} />
                  <Legend />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Sentiment Breakdown */}
          <Card>
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4">Sentiment Distribution</h2>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={sentimentData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {sentimentData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      )}

      {activeReport === 'sentiment' && (
        <Card>
          <div className="p-6">
            <h2 className="text-xl font-bold mb-6">Detailed Sentiment Analysis</h2>
            <div className="space-y-6">
              {/* Sentiment timeline would go here */}
              <div className="text-center py-12 text-gray-500">
                Detailed sentiment analysis visualization coming soon...
              </div>
            </div>
          </div>
        </Card>
      )}

      {activeReport === 'competitors' && (
        <Card>
          <div className="p-6">
            <h2 className="text-xl font-bold mb-6">Competitive Landscape</h2>
            <div className="space-y-6">
              {/* Competitive analysis would go here */}
              <div className="text-center py-12 text-gray-500">
                Competitive analysis visualization coming soon...
              </div>
            </div>
          </div>
        </Card>
      )}

      {activeReport === 'keywords' && (
        <Card>
          <div className="p-6">
            <h2 className="text-xl font-bold mb-6">Keyword Performance Metrics</h2>
            <div className="space-y-6">
              {/* Keyword performance would go here */}
              <div className="text-center py-12 text-gray-500">
                Keyword performance visualization coming soon...
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Export Options */}
      <div className="mt-8 p-6 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-2xl">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Export Report</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Download this report in your preferred format
            </p>
          </div>
          <div className="flex space-x-3">
            <Button variant="secondary" onClick={() => handleExport('csv')}>
              CSV
            </Button>
            <Button variant="secondary" onClick={() => handleExport('json')}>
              JSON
            </Button>
            <Button onClick={() => handleExport('pdf')}>
              PDF Report
            </Button>
          </div>
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

export default ModernReportsPage;
