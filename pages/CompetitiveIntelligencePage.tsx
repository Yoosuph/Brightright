import React, { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ScatterChart,
  Scatter,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ZAxis,
} from 'recharts';
import Card from '../components/Card';
import Button from '../components/Button';
import Badge from '../components/ui/Badge';
import { platformTracking, type MultiPlatformData } from '../services/platformTracking';
import type { OnboardingData, CompetitorData } from '../types';

interface CompetitiveIntelligencePageProps {
  appData: OnboardingData;
}

// Icons
const IconRefresh = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
  </svg>
);

const IconTrending = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
  </svg>
);

const IconAlert = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
  </svg>
);

const IconTarget = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);

const IconShield = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);

const IconInfo = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-8m0 0v-3a2 2 0 012-2h2a2 2 0 012 2v3m-4 0h4m4 0h4m0 0v-3a2 2 0 012-2h2a2 2 0 012 2v3m-4 0h4" />
  </svg>
);

const IconLightbulb = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
  </svg>
);

// Competitor Card Component
const CompetitorCard: React.FC<{
  competitor: string;
  data: MultiPlatformData;
  brandData: MultiPlatformData;
  isSelected: boolean;
  onSelect: () => void;
}> = ({ competitor, data, brandData, isSelected, onSelect }) => {
  const difference = data.overallVisibility - brandData.overallVisibility;
  const isAhead = difference > 0;
  
  return (
    <div
      onClick={onSelect}
      className={`
        relative p-6 rounded-xl border-2 cursor-pointer transition-all duration-300
        ${isSelected 
          ? 'border-brand-purple bg-gradient-to-br from-purple-50/50 to-pink-50/50 dark:from-purple-900/20 dark:to-pink-900/20 shadow-lg transform scale-105' 
          : 'border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 hover:border-gray-300 dark:hover:border-gray-600'
        }
      `}
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{competitor}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {data.totalMentions} mentions • {data.totalCitations} citations
          </p>
        </div>
        <div className={`text-2xl font-bold ${isAhead ? 'text-red-500' : 'text-green-500'}`}>
          {isAhead ? '↑' : '↓'} {Math.abs(difference)}
        </div>
      </div>
      
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600 dark:text-gray-400">Visibility Score</span>
          <span className="text-xl font-bold">{data.overallVisibility}</span>
        </div>
        
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-brand-purple to-brand-pink transition-all duration-500"
            style={{ width: `${data.overallVisibility}%` }}
          />
        </div>
        
        <div className="grid grid-cols-3 gap-2 text-xs">
          <div className="text-center">
            <p className="text-gray-500 dark:text-gray-400">Positive</p>
            <p className="font-semibold text-green-500">{data.aggregatedSentiment.positive}%</p>
          </div>
          <div className="text-center">
            <p className="text-gray-500 dark:text-gray-400">Neutral</p>
            <p className="font-semibold text-gray-500">{data.aggregatedSentiment.neutral}%</p>
          </div>
          <div className="text-center">
            <p className="text-gray-500 dark:text-gray-400">Negative</p>
            <p className="font-semibold text-red-500">{data.aggregatedSentiment.negative}%</p>
          </div>
        </div>
      </div>
      
      {isSelected && (
        <div className="absolute -top-2 -right-2 bg-brand-purple text-white text-xs px-2 py-1 rounded-full">
          Selected
        </div>
      )}
    </div>
  );
};

// SWOT Analysis Component
const SWOTAnalysis: React.FC<{ brandName: string; competitorName: string }> = ({ brandName, competitorName }) => {
  const swotData = {
    strengths: [
      { text: "Higher positive sentiment (72% vs 65%)", impact: 'high' },
      { text: "Better citation quality from authoritative sources", impact: 'medium' },
      { text: "Strong presence on ChatGPT and Claude", impact: 'high' },
      { text: "Consistent brand messaging across platforms", impact: 'medium' },
    ],
    weaknesses: [
      { text: "Lower overall visibility score (-5 points)", impact: 'high' },
      { text: "Fewer total mentions (245 vs 312)", impact: 'medium' },
      { text: "Limited presence on Perplexity", impact: 'low' },
      { text: "Slower response to market trends", impact: 'medium' },
    ],
    opportunities: [
      { text: "Untapped potential in emerging AI platforms", impact: 'high' },
      { text: "Growing demand for eco-friendly messaging", impact: 'medium' },
      { text: "Partnership opportunities with influencers", impact: 'medium' },
      { text: "Content gap in technical documentation", impact: 'low' },
    ],
    threats: [
      { text: `${competitorName} increasing marketing spend`, impact: 'high' },
      { text: "New competitors entering the market", impact: 'medium' },
      { text: "Changing AI platform algorithms", impact: 'medium' },
      { text: "Negative sentiment from customer service issues", impact: 'high' },
    ],
  };

  const impactColors = {
    high: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
    medium: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300',
    low: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Strengths */}
      <div className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl border border-green-200 dark:border-green-800">
        <h3 className="text-lg font-bold text-green-800 dark:text-green-300 mb-4 flex items-center">
          <span className="text-2xl mr-2">💪</span> Strengths
        </h3>
        <ul className="space-y-2">
          {swotData.strengths.map((item, index) => (
            <li key={index} className="flex items-start">
              <span className="text-green-500 mr-2">•</span>
              <div className="flex-1">
                <p className="text-sm text-gray-700 dark:text-gray-300">{item.text}</p>
                <Badge variant="default" className={`mt-1 text-xs ${impactColors[item.impact]}`}>
                  {item.impact} impact
                </Badge>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Weaknesses */}
      <div className="p-6 bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-xl border border-orange-200 dark:border-orange-800">
        <h3 className="text-lg font-bold text-orange-800 dark:text-orange-300 mb-4 flex items-center">
          <span className="text-2xl mr-2">⚠️</span> Weaknesses
        </h3>
        <ul className="space-y-2">
          {swotData.weaknesses.map((item, index) => (
            <li key={index} className="flex items-start">
              <span className="text-orange-500 mr-2">•</span>
              <div className="flex-1">
                <p className="text-sm text-gray-700 dark:text-gray-300">{item.text}</p>
                <Badge variant="default" className={`mt-1 text-xs ${impactColors[item.impact]}`}>
                  {item.impact} impact
                </Badge>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Opportunities */}
      <div className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
        <h3 className="text-lg font-bold text-blue-800 dark:text-blue-300 mb-4 flex items-center">
          <span className="text-2xl mr-2">🚀</span> Opportunities
        </h3>
        <ul className="space-y-2">
          {swotData.opportunities.map((item, index) => (
            <li key={index} className="flex items-start">
              <span className="text-blue-500 mr-2">•</span>
              <div className="flex-1">
                <p className="text-sm text-gray-700 dark:text-gray-300">{item.text}</p>
                <Badge variant="default" className={`mt-1 text-xs ${impactColors[item.impact]}`}>
                  {item.impact} impact
                </Badge>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Threats */}
      <div className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl border border-purple-200 dark:border-purple-800">
        <h3 className="text-lg font-bold text-purple-800 dark:text-purple-300 mb-4 flex items-center">
          <span className="text-2xl mr-2">⚡</span> Threats
        </h3>
        <ul className="space-y-2">
          {swotData.threats.map((item, index) => (
            <li key={index} className="flex items-start">
              <span className="text-purple-500 mr-2">•</span>
              <div className="flex-1">
                <p className="text-sm text-gray-700 dark:text-gray-300">{item.text}</p>
                <Badge variant="default" className={`mt-1 text-xs ${impactColors[item.impact]}`}>
                  {item.impact} impact
                </Badge>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

const CompetitiveIntelligencePage: React.FC<CompetitiveIntelligencePageProps> = ({ appData }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCompetitor, setSelectedCompetitor] = useState<string>('');
  const [competitorData, setCompetitorData] = useState<Map<string, MultiPlatformData>>(new Map());
  const [activeView, setActiveView] = useState<'overview' | 'comparison' | 'positioning' | 'swot' | 'alerts'>('overview');
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');

  const competitors = appData.competitors?.map(c => c.name) || ['Competitor A', 'Competitor B', 'Competitor C'];

  useEffect(() => {
    loadCompetitiveData();
  }, []);

  const loadCompetitiveData = async () => {
    setIsLoading(true);
    try {
      const data = await platformTracking.compareCompetitors(appData.brandName, competitors);
      setCompetitorData(data);
      if (competitors.length > 0 && !selectedCompetitor) {
        setSelectedCompetitor(competitors[0]);
      }
    } catch (error) {
      console.error('Failed to load competitive data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const brandData = competitorData.get(appData.brandName);
  const selectedCompetitorData = selectedCompetitor ? competitorData.get(selectedCompetitor) : null;

  // Prepare data for visualizations
  const marketShareData = Array.from(competitorData.entries()).map(([name, data]) => ({
    name: name === appData.brandName ? `${name} (You)` : name,
    value: data.totalMentions,
    visibility: data.overallVisibility,
    fill: name === appData.brandName ? '#8B5CF6' : ['#EC4899', '#3B82F6', '#10B981', '#F59E0B'][competitors.indexOf(name) % 4],
  }));

  const comparisonData = brandData && selectedCompetitorData ? [
    { metric: 'Visibility', brand: brandData.overallVisibility, competitor: selectedCompetitorData.overallVisibility },
    { metric: 'Mentions', brand: brandData.totalMentions, competitor: selectedCompetitorData.totalMentions },
    { metric: 'Citations', brand: brandData.totalCitations, competitor: selectedCompetitorData.totalCitations },
    { metric: 'Positive %', brand: brandData.aggregatedSentiment.positive, competitor: selectedCompetitorData.aggregatedSentiment.positive },
    { metric: 'Share of Voice', brand: 34, competitor: 28 }, // Mock data
  ] : [];

  const radarComparisonData = brandData && selectedCompetitorData ? [
    { metric: 'Visibility', [appData.brandName]: brandData.overallVisibility, [selectedCompetitor]: selectedCompetitorData.overallVisibility, fullMark: 100 },
    { metric: 'Mentions', [appData.brandName]: Math.min(100, (brandData.totalMentions / 5)), [selectedCompetitor]: Math.min(100, (selectedCompetitorData.totalMentions / 5)), fullMark: 100 },
    { metric: 'Citations', [appData.brandName]: Math.min(100, brandData.totalCitations), [selectedCompetitor]: Math.min(100, selectedCompetitorData.totalCitations), fullMark: 100 },
    { metric: 'Sentiment', [appData.brandName]: brandData.aggregatedSentiment.positive, [selectedCompetitor]: selectedCompetitorData.aggregatedSentiment.positive, fullMark: 100 },
    { metric: 'Authority', [appData.brandName]: 75, [selectedCompetitor]: 68, fullMark: 100 }, // Mock
    { metric: 'Engagement', [appData.brandName]: 82, [selectedCompetitor]: 71, fullMark: 100 }, // Mock
  ] : [];

  // Positioning Matrix Data (Mock)
  const positioningData = Array.from(competitorData.entries()).map(([name, data]) => ({
    name,
    x: data.overallVisibility, // Market Share
    y: data.aggregatedSentiment.positive, // Customer Satisfaction
    z: data.totalMentions, // Size represents volume
  }));

  // Competitive Alerts (Mock)
  const alerts = [
    { type: 'critical', message: `${competitors[0]} launched a new feature mentioned 45 times today`, time: '2 hours ago' },
    { type: 'warning', message: `Your share of voice dropped by 3% this week`, time: '5 hours ago' },
    { type: 'success', message: `Outperforming ${competitors[1]} in positive sentiment by 12%`, time: '1 day ago' },
    { type: 'info', message: `New competitor detected: "Brand X" with 15 mentions`, time: '2 days ago' },
  ];

  const alertIcons = {
    critical: '🔴',
    warning: '🟡',
    success: '🟢',
    info: '🔵',
  };

  const viewTabs = [
    { id: 'overview', label: 'Overview', icon: <IconTarget /> },
    { id: 'comparison', label: 'Head-to-Head', icon: '⚔️' },
    { id: 'positioning', label: 'Market Position', icon: '📍' },
    { id: 'swot', label: 'SWOT Analysis', icon: '📊' },
    { id: 'alerts', label: 'Alerts', icon: <IconAlert /> },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
              <IconShield />
              <span className="ml-3">Competitive Intelligence</span>
            </h1>
            <p className="mt-1 text-gray-600 dark:text-gray-400">
              Monitor and analyze your competitive landscape in real-time
            </p>
          </div>
          
          <div className="mt-4 lg:mt-0 flex items-center space-x-3">
            {/* Time Range Selector */}
            <div className="flex bg-gray-100 dark:bg-gray-800 rounded-xl p-1">
              {(['7d', '30d', '90d'] as const).map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`
                    px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-300
                    ${timeRange === range
                      ? 'bg-white dark:bg-gray-700 text-brand-purple shadow-sm'
                      : 'text-gray-600 dark:text-gray-400'
                    }
                  `}
                >
                  {range === '7d' ? '7 Days' : range === '30d' ? '30 Days' : '90 Days'}
                </button>
              ))}
            </div>
            
            <Button onClick={loadCompetitiveData} variant="secondary">
              <IconRefresh />
              <span className="ml-2">Refresh</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Market Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-6 rounded-2xl text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Market Position</p>
              <p className="text-3xl font-bold mt-1">
                #{brandData ? Math.min(competitors.length + 1, 2) : '-'}
              </p>
              <p className="text-purple-100 text-xs mt-1">Out of {competitors.length + 1} brands</p>
            </div>
            <span className="text-3xl">🏆</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-emerald-500 p-6 rounded-2xl text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Competitive Advantage</p>
              <p className="text-3xl font-bold mt-1">+15%</p>
              <p className="text-green-100 text-xs mt-1">Sentiment lead</p>
            </div>
            <span className="text-3xl">📈</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-cyan-500 p-6 rounded-2xl text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Share of Voice</p>
              <p className="text-3xl font-bold mt-1">34%</p>
              <p className="text-blue-100 text-xs mt-1">Industry coverage</p>
            </div>
            <span className="text-3xl">🔊</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-red-500 p-6 rounded-2xl text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm">Win Rate</p>
              <p className="text-3xl font-bold mt-1">67%</p>
              <p className="text-orange-100 text-xs mt-1">vs competitors</p>
            </div>
            <span className="text-3xl">💪</span>
          </div>
        </div>
      </div>

      {/* View Tabs */}
      <div className="flex space-x-1 mb-6 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl overflow-x-auto">
        {viewTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveView(tab.id as any)}
            className={`
              flex items-center space-x-2 px-4 py-2.5 rounded-lg font-medium transition-all duration-300 whitespace-nowrap
              ${activeView === tab.id
                ? 'bg-white dark:bg-gray-700 text-brand-purple dark:text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }
            `}
          >
            <span className="text-lg">{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Content Views */}
      {activeView === 'overview' && (
        <div className="space-y-6">
          {/* Competitor Cards */}
          <div>
            <h2 className="text-xl font-bold mb-4">Competitor Analysis</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {competitors.map((competitor) => {
                const data = competitorData.get(competitor);
                if (!data || !brandData) return null;
                
                return (
                  <CompetitorCard
                    key={competitor}
                    competitor={competitor}
                    data={data}
                    brandData={brandData}
                    isSelected={selectedCompetitor === competitor}
                    onSelect={() => setSelectedCompetitor(competitor)}
                  />
                );
              })}
            </div>
          </div>

          {/* Market Share Pie Chart */}
          <Card>
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4">Market Share Distribution</h2>
              <ResponsiveContainer width="100%" height={400}>
                <PieChart>
                  <Pie
                    data={marketShareData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {marketShareData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      )}

      {activeView === 'comparison' && selectedCompetitor && (
        <div className="space-y-6">
          {/* Comparison Header */}
          <Card>
            <div className="p-6">
              <div className="flex items-center justify-center space-x-8 mb-6">
                <div className="text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-brand-purple to-brand-pink rounded-xl flex items-center justify-center text-white font-bold text-2xl mx-auto mb-2">
                    {appData.brandName.charAt(0)}
                  </div>
                  <h3 className="font-bold text-lg">{appData.brandName}</h3>
                  <Badge variant="default" className="mt-1">Your Brand</Badge>
                </div>
                
                <span className="text-3xl">⚔️</span>
                
                <div className="text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-gray-600 to-gray-700 rounded-xl flex items-center justify-center text-white font-bold text-2xl mx-auto mb-2">
                    {selectedCompetitor.charAt(0)}
                  </div>
                  <h3 className="font-bold text-lg">{selectedCompetitor}</h3>
                  <Badge variant="secondary" className="mt-1">Competitor</Badge>
                </div>
              </div>
              
              {/* Comparison Metrics */}
              <div className="space-y-4">
                {comparisonData.map((item) => (
                  <div key={item.metric} className="flex items-center">
                    <div className="w-32 text-sm font-medium text-gray-600 dark:text-gray-400">
                      {item.metric}
                    </div>
                    <div className="flex-1 flex items-center space-x-4">
                      <div className="flex-1">
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-semibold">{item.brand}</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-brand-purple to-brand-pink transition-all duration-500"
                            style={{ width: `${(item.brand / Math.max(item.brand, item.competitor)) * 100}%` }}
                          />
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-semibold">{item.competitor}</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-gray-500 to-gray-600 transition-all duration-500"
                            style={{ width: `${(item.competitor / Math.max(item.brand, item.competitor)) * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* Radar Comparison */}
          <Card>
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4">Performance Comparison</h2>
              <ResponsiveContainer width="100%" height={400}>
                <RadarChart data={radarComparisonData}>
                  <PolarGrid stroke="#374151" />
                  <PolarAngleAxis dataKey="metric" stroke="#9CA3AF" />
                  <PolarRadiusAxis angle={90} domain={[0, 100]} stroke="#9CA3AF" />
                  <Radar
                    name={appData.brandName}
                    dataKey={appData.brandName}
                    stroke="#8B5CF6"
                    fill="#8B5CF6"
                    fillOpacity={0.3}
                    strokeWidth={2}
                  />
                  <Radar
                    name={selectedCompetitor}
                    dataKey={selectedCompetitor}
                    stroke="#EC4899"
                    fill="#EC4899"
                    fillOpacity={0.3}
                    strokeWidth={2}
                  />
                  <Legend />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      )}

      {activeView === 'positioning' && (
        <Card>
          <div className="p-6">
            <h2 className="text-xl font-bold mb-4">Market Positioning Matrix</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
              Bubble size represents total mentions volume
            </p>
            <ResponsiveContainer width="100%" height={500}>
              <ScatterChart>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.2} />
                <XAxis
                  dataKey="x"
                  name="Market Share"
                  unit="%"
                  stroke="#9CA3AF"
                  label={{ value: 'Market Share (Visibility Score)', position: 'insideBottom', offset: -10 }}
                />
                <YAxis
                  dataKey="y"
                  name="Customer Satisfaction"
                  unit="%"
                  stroke="#9CA3AF"
                  label={{ value: 'Customer Satisfaction (Positive Sentiment)', angle: -90, position: 'insideLeft' }}
                />
                <ZAxis dataKey="z" range={[100, 600]} />
                <Tooltip cursor={{ strokeDasharray: '3 3' }} content={<CustomTooltip />} />
                <Scatter
                  data={positioningData}
                  fill="#8884d8"
                  shape={(props: any) => {
                    const { cx, cy, payload } = props;
                    const isYourBrand = payload.name === appData.brandName;
                    
                    return (
                      <g>
                        <circle
                          cx={cx}
                          cy={cy}
                          r={Math.sqrt(payload.z) * 2}
                          fill={isYourBrand ? '#8B5CF6' : '#EC4899'}
                          fillOpacity={0.6}
                          stroke={isYourBrand ? '#8B5CF6' : '#EC4899'}
                          strokeWidth={2}
                        />
                        <text
                          x={cx}
                          y={cy}
                          fill="white"
                          textAnchor="middle"
                          dominantBaseline="middle"
                          className="text-xs font-bold"
                        >
                          {payload.name.charAt(0)}
                        </text>
                      </g>
                    );
                  }}
                />
              </ScatterChart>
            </ResponsiveContainer>
            
            {/* Quadrant Labels */}
            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
                <h4 className="font-semibold text-green-800 dark:text-green-300">Leaders</h4>
                <p className="text-sm text-green-700 dark:text-green-400">High share + High satisfaction</p>
              </div>
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                <h4 className="font-semibold text-blue-800 dark:text-blue-300">Challengers</h4>
                <p className="text-sm text-blue-700 dark:text-blue-400">Low share + High satisfaction</p>
              </div>
              <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-xl">
                <h4 className="font-semibold text-orange-800 dark:text-orange-300">Established</h4>
                <p className="text-sm text-orange-700 dark:text-orange-400">High share + Low satisfaction</p>
              </div>
              <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-xl">
                <h4 className="font-semibold text-red-800 dark:text-red-300">Niche Players</h4>
                <p className="text-sm text-red-700 dark:text-red-400">Low share + Low satisfaction</p>
              </div>
            </div>
          </div>
        </Card>
      )}

      {activeView === 'swot' && selectedCompetitor && (
        <Card>
          <div className="p-6">
            <h2 className="text-xl font-bold mb-6">SWOT Analysis vs {selectedCompetitor}</h2>
            <SWOTAnalysis brandName={appData.brandName} competitorName={selectedCompetitor} />
            
            {/* Action Items */}
            <div className="mt-8 p-6 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl">
              <h3 className="text-lg font-bold mb-4 flex items-center">
                <IconLightbulb />
                <span className="ml-2">Recommended Actions</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start">
                  <span className="text-2xl mr-3">1️⃣</span>
                  <div>
                    <h4 className="font-semibold">Leverage Strength</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Amplify your superior sentiment scores through customer testimonials
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <span className="text-2xl mr-3">2️⃣</span>
                  <div>
                    <h4 className="font-semibold">Address Weakness</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Increase content production to boost visibility metrics
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <span className="text-2xl mr-3">3️⃣</span>
                  <div>
                    <h4 className="font-semibold">Capture Opportunity</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Target emerging AI platforms before competitors establish presence
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <span className="text-2xl mr-3">4️⃣</span>
                  <div>
                    <h4 className="font-semibold">Mitigate Threat</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Improve customer service response time to prevent negative sentiment
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      )}

      {activeView === 'alerts' && (
        <div className="space-y-4">
          <Card>
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4">Competitive Alerts</h2>
              <div className="space-y-3">
                {alerts.map((alert, index) => (
                  <div
                    key={index}
                    className={`
                      p-4 rounded-xl border-2 transition-all duration-300
                      ${alert.type === 'critical' ? 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20' :
                        alert.type === 'warning' ? 'border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-900/20' :
                        alert.type === 'success' ? 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20' :
                        'border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/20'
                      }
                    `}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3">
                        <span className="text-2xl">{alertIcons[alert.type]}</span>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">{alert.message}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{alert.time}</p>
                        </div>
                      </div>
                      <Button variant="secondary" size="sm">
                        View Details
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
          
          {/* Alert Configuration */}
          <Card>
            <div className="p-6">
              <h3 className="text-lg font-bold mb-4">Alert Configuration</h3>
              <div className="space-y-4">
                <label className="flex items-center space-x-3">
                  <input type="checkbox" defaultChecked className="rounded text-brand-purple focus:ring-brand-purple" />
                  <span className="text-sm">Competitor launches new feature</span>
                </label>
                <label className="flex items-center space-x-3">
                  <input type="checkbox" defaultChecked className="rounded text-brand-purple focus:ring-brand-purple" />
                  <span className="text-sm">Share of voice drops below threshold</span>
                </label>
                <label className="flex items-center space-x-3">
                  <input type="checkbox" defaultChecked className="rounded text-brand-purple focus:ring-brand-purple" />
                  <span className="text-sm">New competitor enters market</span>
                </label>
                <label className="flex items-center space-x-3">
                  <input type="checkbox" className="rounded text-brand-purple focus:ring-brand-purple" />
                  <span className="text-sm">Competitor sentiment improves significantly</span>
                </label>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

// Custom Tooltip Component
const CustomTooltip: React.FC<any> = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
        {label && <p className="font-medium text-gray-900 dark:text-white mb-2">{label}</p>}
        {payload.map((entry: any, index: number) => (
          <div key={index} className="text-sm">
            {entry.name && (
              <p style={{ color: entry.color || entry.fill }}>
                {entry.name}: {entry.value}
                {entry.unit || ''}
              </p>
            )}
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default CompetitiveIntelligencePage;
