import React, { useState } from 'react';
import Card from '../components/Card';
import Button from '../components/Button';
import Badge from '../src/components/ui/Badge';
import Metric from '../src/components/ui/Metric';
import type { OnboardingData, CompetitiveIntelligence } from '../types';

interface CompetitorsPageProps {
  appData: OnboardingData;
}

const CompetitorsPage: React.FC<CompetitorsPageProps> = ({ appData }) => {
  const [selectedTimeframe, setSelectedTimeframe] = useState<'7d' | '30d' | '90d'>('30d');

  // Mock competitive intelligence data
  const competitiveData: CompetitiveIntelligence[] = appData.competitors.map((competitor, index) => ({
    competitor: competitor.name,
    marketShare: competitor.visibility,
    visibilityTrend: [
      { date: 'Jan', score: competitor.visibility - 5 },
      { date: 'Feb', score: competitor.visibility - 2 },
      { date: 'Mar', score: competitor.visibility + 1 },
      { date: 'Apr', score: competitor.visibility },
    ],
    topKeywords: [
      `AI analytics ${index + 1}`,
      `brand tracking ${index + 1}`,
      `visibility metrics ${index + 1}`,
    ],
    strengths: [
      index === 0 ? 'Strong brand recognition' : 'Innovative features',
      index === 0 ? 'Wide market reach' : 'Competitive pricing',
    ],
    weaknesses: [
      index === 0 ? 'Limited AI capabilities' : 'Smaller user base',
      index === 0 ? 'Slower innovation' : 'Less brand recognition',
    ],
    opportunities: [
      'AI integration',
      'Market expansion',
    ],
    threats: [
      'New market entrants',
      'Technology disruption',
    ],
  }));

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Competitive Intelligence
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Monitor and analyze your competition in the AI visibility space
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
          <Button variant="primary">
            Add Competitor
          </Button>
        </div>
      </div>

      {/* Overview Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Metric
          label="Total Competitors"
          value={competitiveData.length}
          description="Being monitored"
          icon={<IconUsers />}
        />
        <Metric
          label="Market Leader"
          value={competitiveData[0]?.competitor || 'N/A'}
          description={`${competitiveData[0]?.marketShare}% visibility`}
          icon={<IconTrophy />}
        />
        <Metric
          label="Your Position"
          value="#1"
          change={{ value: 2, period: 'last month' }}
          description="in visibility ranking"
          icon={<IconTarget />}
        />
      </div>

      {/* Competitors Analysis */}
      <div className="space-y-6">
        {competitiveData.map((competitor, index) => (
          <Card key={competitor.competitor}>
            <div className="flex items-start justify-between mb-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {competitor.competitor}
                </h3>
                <div className="flex items-center gap-4 mt-2">
                  <Badge variant="info" size="sm">
                    {competitor.marketShare}% Market Share
                  </Badge>
                  <span className="text-sm text-gray-500">
                    Rank #{index + 2} in visibility
                  </span>
                </div>
              </div>
              <Button variant="secondary" size="sm">
                View Details
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Strengths */}
              <div>
                <h4 className="font-medium text-green-600 dark:text-green-400 mb-2">
                  Strengths
                </h4>
                <div className="space-y-1">
                  {competitor.strengths.map((strength, idx) => (
                    <div key={idx} className="text-sm text-gray-600 dark:text-gray-400">
                      • {strength}
                    </div>
                  ))}
                </div>
              </div>

              {/* Weaknesses */}
              <div>
                <h4 className="font-medium text-red-600 dark:text-red-400 mb-2">
                  Weaknesses
                </h4>
                <div className="space-y-1">
                  {competitor.weaknesses.map((weakness, idx) => (
                    <div key={idx} className="text-sm text-gray-600 dark:text-gray-400">
                      • {weakness}
                    </div>
                  ))}
                </div>
              </div>

              {/* Opportunities */}
              <div>
                <h4 className="font-medium text-blue-600 dark:text-blue-400 mb-2">
                  Opportunities
                </h4>
                <div className="space-y-1">
                  {competitor.opportunities.map((opportunity, idx) => (
                    <div key={idx} className="text-sm text-gray-600 dark:text-gray-400">
                      • {opportunity}
                    </div>
                  ))}
                </div>
              </div>

              {/* Threats */}
              <div>
                <h4 className="font-medium text-orange-600 dark:text-orange-400 mb-2">
                  Threats
                </h4>
                <div className="space-y-1">
                  {competitor.threats.map((threat, idx) => (
                    <div key={idx} className="text-sm text-gray-600 dark:text-gray-400">
                      • {threat}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Top Keywords */}
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <h4 className="font-medium text-gray-900 dark:text-white mb-3">
                Top Keywords
              </h4>
              <div className="flex flex-wrap gap-2">
                {competitor.topKeywords.map((keyword, idx) => (
                  <Badge key={idx} variant="secondary" size="sm">
                    {keyword}
                  </Badge>
                ))}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {competitiveData.length === 0 && (
        <Card>
          <div className="text-center py-12">
            <IconUsers className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No competitors added yet
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              Add competitors to start monitoring their AI visibility and get competitive insights.
            </p>
            <Button variant="primary">
              Add Your First Competitor
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};

// Icon components
const IconUsers = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
  </svg>
);

const IconTrophy = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
  </svg>
);

const IconTarget = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
  </svg>
);

export default CompetitorsPage;