export type Page =
  | 'dashboard'
  | 'keywords'
  | 'reports'
  | 'analytics'
  | 'competitors'
  | 'alerts'
  | 'settings'
  | 'pricing'
  | 'resources'
  | 'changelog'
  | 'docs'
  | 'landing';

export interface Mention {
  id: number;
  platform: 'Gemini' | 'ChatGPT' | 'Claude';
  query: string;
  snippet: string;
  sentiment: 'Positive' | 'Negative' | 'Neutral';
  date: string;
}

export interface SentimentData {
  name: string;
  value: number;
}

export interface VisibilityData {
  date: string;

  score: number;
}

export interface CompetitorData {
  name: string;
  visibility: number;
}

export interface OnboardingData {
  brandName: string;
  keywords: string;
  competitors: CompetitorData[];
}

export interface KeywordMentionDetail {
  text: string;
  sentiment: 'Positive' | 'Negative' | 'Neutral' | 'Unknown';
}

export interface TourStep {
  selector: string;
  title: string;
  content: string;
  position: 'top' | 'bottom' | 'left' | 'right';
}

export interface KeywordAnalysisResult {
  summary: string;
  sentiment: string;
  score: number;
  mentions: KeywordMentionDetail[];
}

// New types for Dashboard
export interface DetailedMention {
  platform: string;
  query: string;
  snippet: string;
  sentiment: 'Positive' | 'Negative' | 'Neutral';
  date: string;
  confidence: number;
}

export interface SentimentBreakdown {
  positive: number;
  neutral: number;
  negative: number;
}

export interface SentimentTrendPoint {
  date: string;
  positive: number;
  neutral: number;
  negative: number;
}

export interface PlatformBreakdown {
  platform: string;
  mentions: number;
}

export interface ActionableInsight {
  category:
    | 'Content Strategy'
    | 'Community Engagement'
    | 'Reputation Management'
    | 'SEO Optimization';
  priority: 'High' | 'Medium' | 'Low';
  title: string;
  description: string;
}

export interface DashboardAnalysisResult {
  overallScore: number;
  visibilityChange: number;
  totalMentions: number;
  sentimentBreakdown: SentimentBreakdown;
  mentions: DetailedMention[];
  sentimentTrend: SentimentTrendPoint[];
  platformBreakdown: PlatformBreakdown[];
  actionableInsights?: ActionableInsight[];
  summary?: string;
}

export interface Report {
  id: string;
  title: string;
  dateGenerated: string;
  dateRange: string;
  analysis: DashboardAnalysisResult;
  competitorComparison: CompetitorData[];
  visibilityTrend: VisibilityData[];
}

// New Analytics Types
export interface TrendAnalysis {
  period: string;
  growth: number;
  predictions: {
    nextMonth: number;
    nextQuarter: number;
    confidence: number;
  };
  seasonality: {
    pattern: 'seasonal' | 'trending' | 'stable';
    peaks: string[];
    valleys: string[];
  };
}

export interface KeywordOpportunity {
  keyword: string;
  searchVolume: number;
  difficulty: number;
  opportunity: number;
  currentRanking?: number;
  competitors: string[];
  intent: 'informational' | 'transactional' | 'navigational';
}

export interface AlertRule {
  id: string;
  name: string;
  type: 'mention_spike' | 'sentiment_drop' | 'competitor_activity' | 'keyword_ranking';
  conditions: {
    threshold: number;
    operator: '>' | '<' | '=' | '>=' | '<=';
    timeframe: string;
  };
  channels: ('email' | 'slack' | 'webhook')[];
  active: boolean;
  lastTriggered?: string;
}

export interface AlertNotification {
  id: string;
  ruleId: string;
  type: AlertRule['type'];
  title: string;
  message: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: string;
  read: boolean;
  data: Record<string, unknown>;
}

export interface CompetitiveIntelligence {
  competitor: string;
  marketShare: number;
  visibilityTrend: VisibilityData[];
  topKeywords: string[];
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
}

export interface AIModelUsage {
  model: 'ChatGPT' | 'Claude' | 'Gemini' | 'Perplexity' | 'Bing Chat';
  usage: number;
  growth: number;
  demographics: {
    ageGroups: Record<string, number>;
    regions: Record<string, number>;
    industries: Record<string, number>;
  };
}
