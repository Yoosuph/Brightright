import type {
  DetailedMention,
  PlatformBreakdown,
  SentimentBreakdown
} from '../types';

export interface PlatformConfig {
  id: string;
  name: string;
  icon: string;
  color: string;
  apiEndpoint?: string; // Will be used when real APIs are available
  isActive: boolean;
}

export interface Citation {
  id: string;
  url: string;
  domain: string;
  title: string;
  type: 'news' | 'blog' | 'social' | 'academic' | 'corporate' | 'ugc';
  authority: number; // Domain authority score 1-100
  sentiment: 'positive' | 'neutral' | 'negative';
  excerpt: string;
  platform: string;
  timestamp: Date;
}

export interface PlatformMention extends DetailedMention {
  citations: Citation[];
  responsePosition: number; // Position in the AI response (1st mention, 2nd, etc.)
  contextLength: number; // How much context around the mention
  competitorMentions: string[]; // Other brands mentioned in same response
}

export interface PlatformMetrics {
  platform: string;
  visibility: number; // 0-100 score
  shareOfVoice: number; // Percentage vs competitors
  avgPosition: number; // Average position in responses
  citationRate: number; // % of mentions with citations
  sentimentScore: number; // -100 to +100
  trending: 'up' | 'down' | 'stable';
  trendPercentage: number;
}

export interface MultiPlatformData {
  overallVisibility: number;
  platforms: PlatformMetrics[];
  totalMentions: number;
  totalCitations: number;
  aggregatedSentiment: SentimentBreakdown;
  topCitations: Citation[];
  recentMentions: PlatformMention[];
  lastUpdated: Date;
}

// Platform configurations
export const SUPPORTED_PLATFORMS: PlatformConfig[] = [
  {
    id: 'chatgpt',
    name: 'ChatGPT',
    icon: '🤖',
    color: '#10A37F',
    isActive: true
  },
  {
    id: 'claude',
    name: 'Claude',
    icon: '🧠',
    color: '#6B46C1',
    isActive: true
  },
  {
    id: 'gemini',
    name: 'Gemini',
    icon: '✨',
    color: '#4285F4',
    isActive: true
  },
  {
    id: 'perplexity',
    name: 'Perplexity',
    icon: '🔍',
    color: '#338FFF',
    isActive: true
  },
  {
    id: 'bing',
    name: 'Bing Chat',
    icon: '🔎',
    color: '#0C8484',
    isActive: true
  },
  {
    id: 'bard',
    name: 'Bard',
    icon: '🎭',
    color: '#EA4335',
    isActive: false // Deprecated, merged with Gemini
  }
];

// Mock data generator for development
class MockDataGenerator {
  private brands = ['Nike', 'Adidas', 'Puma', 'New Balance', 'Under Armour'];
  private domains = [
    { domain: 'techcrunch.com', authority: 92, type: 'news' as const },
    { domain: 'reddit.com', authority: 89, type: 'ugc' as const },
    { domain: 'forbes.com', authority: 95, type: 'news' as const },
    { domain: 'medium.com', authority: 85, type: 'blog' as const },
    { domain: 'twitter.com', authority: 94, type: 'social' as const },
    { domain: 'linkedin.com', authority: 93, type: 'social' as const },
    { domain: 'youtube.com', authority: 96, type: 'ugc' as const },
    { domain: 'wikipedia.org', authority: 98, type: 'academic' as const },
    { domain: 'businessinsider.com', authority: 91, type: 'news' as const },
    { domain: 'harvard.edu', authority: 97, type: 'academic' as const }
  ];

  private queries = [
    'best running shoes 2024',
    'sustainable athletic wear brands',
    'marathon training gear recommendations',
    'compare Nike vs Adidas running shoes',
    'eco-friendly sportswear companies',
    'professional athlete shoe endorsements',
    'innovative fitness technology brands',
    'customer reviews athletic apparel'
  ];

  generateCitation(): Citation {
    const domainInfo = this.domains[Math.floor(Math.random() * this.domains.length)];
    const sentiment = ['positive', 'neutral', 'negative'][Math.floor(Math.random() * 3)] as Citation['sentiment'];
    
    return {
      id: `citation_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      url: `https://${domainInfo.domain}/article/${Math.random().toString(36).substr(2, 9)}`,
      domain: domainInfo.domain,
      title: `Analysis of ${this.brands[Math.floor(Math.random() * this.brands.length)]} Performance in 2024`,
      type: domainInfo.type,
      authority: domainInfo.authority,
      sentiment,
      excerpt: 'The brand has shown significant improvements in sustainability metrics while maintaining competitive pricing...',
      platform: SUPPORTED_PLATFORMS[Math.floor(Math.random() * 5)].id,
      timestamp: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000) // Last 7 days
    };
  }

  generatePlatformMention(platform: string, brandName: string): PlatformMention {
    const sentiments = ['positive', 'neutral', 'negative'] as const;
    const sentiment = sentiments[Math.floor(Math.random() * 3)];
    const query = this.queries[Math.floor(Math.random() * this.queries.length)];
    
    // Generate 0-3 citations per mention
    const citationCount = Math.floor(Math.random() * 4);
    const citations = Array.from({ length: citationCount }, () => this.generateCitation());
    
    // Randomly include competitor mentions
    const competitorCount = Math.floor(Math.random() * 3);
    const competitors = this.brands
      .filter(b => b !== brandName)
      .sort(() => 0.5 - Math.random())
      .slice(0, competitorCount);

    return {
      platform,
      query,
      snippet: `When discussing ${query}, ${brandName} stands out for its innovative approach. ${
        competitors.length > 0 ? `Compared to ${competitors.join(' and ')}, ` : ''
      }the brand offers superior value...`,
      sentiment: sentiment as 'Positive' | 'Neutral' | 'Negative',
      date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      confidence: 0.85 + Math.random() * 0.15,
      citations,
      responsePosition: Math.ceil(Math.random() * 5),
      contextLength: 50 + Math.floor(Math.random() * 200),
      competitorMentions: competitors
    };
  }

  generatePlatformMetrics(platform: string): PlatformMetrics {
    const trending = ['up', 'down', 'stable'][Math.floor(Math.random() * 3)] as PlatformMetrics['trending'];
    const trendMultiplier = trending === 'up' ? 1 : trending === 'down' ? -1 : 0.1;
    
    return {
      platform,
      visibility: 50 + Math.floor(Math.random() * 40),
      shareOfVoice: 15 + Math.floor(Math.random() * 25),
      avgPosition: 1 + Math.random() * 4,
      citationRate: 30 + Math.floor(Math.random() * 50),
      sentimentScore: -30 + Math.floor(Math.random() * 80),
      trending,
      trendPercentage: Math.abs(5 + Math.random() * 15) * trendMultiplier
    };
  }

  generateMultiPlatformData(brandName: string): MultiPlatformData {
    const activePlatforms = SUPPORTED_PLATFORMS.filter(p => p.isActive);
    const platformMetrics = activePlatforms.map(p => this.generatePlatformMetrics(p.id));
    
    // Generate mentions for each platform
    const allMentions: PlatformMention[] = [];
    activePlatforms.forEach(platform => {
      const mentionCount = 3 + Math.floor(Math.random() * 7);
      for (let i = 0; i < mentionCount; i++) {
        allMentions.push(this.generatePlatformMention(platform.id, brandName));
      }
    });

    // Sort mentions by date
    allMentions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    // Get all citations from mentions
    const allCitations = allMentions.flatMap(m => m.citations);
    
    // Calculate aggregated metrics
    const totalPositive = allMentions.filter(m => m.sentiment === 'Positive').length;
    const totalNeutral = allMentions.filter(m => m.sentiment === 'Neutral').length;
    const totalNegative = allMentions.filter(m => m.sentiment === 'Negative').length;
    const total = allMentions.length;
    
    return {
      overallVisibility: Math.round(platformMetrics.reduce((acc, p) => acc + p.visibility, 0) / platformMetrics.length),
      platforms: platformMetrics,
      totalMentions: allMentions.length,
      totalCitations: allCitations.length,
      aggregatedSentiment: {
        positive: Math.round((totalPositive / total) * 100),
        neutral: Math.round((totalNeutral / total) * 100),
        negative: Math.round((totalNegative / total) * 100)
      },
      topCitations: allCitations
        .sort((a, b) => b.authority - a.authority)
        .slice(0, 10),
      recentMentions: allMentions.slice(0, 20),
      lastUpdated: new Date()
    };
  }
}

// Platform tracking service
export class PlatformTrackingService {
  private mockGenerator = new MockDataGenerator();
  private useRealAPI = false; // Toggle when real APIs are available
  
  async trackBrand(
    brandName: string,
    platforms: string[] = SUPPORTED_PLATFORMS.filter(p => p.isActive).map(p => p.id)
  ): Promise<MultiPlatformData> {
    if (this.useRealAPI) {
      // TODO: Implement real API calls when available
      throw new Error('Real API integration not yet implemented');
    }
    
    // Return mock data for development
    return this.mockGenerator.generateMultiPlatformData(brandName);
  }
  
  async getCitations(brandName: string, platform?: string): Promise<Citation[]> {
    // In production, this would query real data
    const citations: Citation[] = [];
    for (let i = 0; i < 20; i++) {
      const citation = this.mockGenerator.generateCitation();
      if (!platform || citation.platform === platform) {
        citations.push(citation);
      }
    }
    return citations;
  }
  
  async compareCompetitors(
    brandName: string,
    competitors: string[]
  ): Promise<Map<string, MultiPlatformData>> {
    const results = new Map<string, MultiPlatformData>();
    
    // Get data for main brand and competitors
    for (const brand of [brandName, ...competitors]) {
      results.set(brand, await this.trackBrand(brand));
    }
    
    return results;
  }
  
  async getHistoricalData(
    brandName: string,
    days: number = 30
  ): Promise<{ date: string; visibility: number; mentions: number }[]> {
    const data = [];
    const today = new Date();
    
    for (let i = days; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      data.push({
        date: date.toISOString().split('T')[0],
        visibility: 40 + Math.floor(Math.random() * 30) + (days - i) * 0.5,
        mentions: 5 + Math.floor(Math.random() * 15)
      });
    }
    
    return data;
  }
}

// Export singleton instance
export const platformTracking = new PlatformTrackingService();
