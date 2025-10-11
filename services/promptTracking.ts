export interface TrackedPrompt {
  id: string;
  userId: string;
  prompt: string;
  variations: string[];
  platforms: string[];
  frequency: 'realtime' | 'hourly' | 'daily' | 'weekly';
  alerts: AlertConfig;
  createdAt: Date;
  lastChecked: Date;
  isActive: boolean;
}

export interface AlertConfig {
  enabled: boolean;
  channels: ('email' | 'sms' | 'slack' | 'inapp')[];
  conditions: AlertCondition[];
}

export interface AlertCondition {
  type: 'mention' | 'sentiment_drop' | 'competitor_mention' | 'position_change' | 'new_citation';
  threshold?: number;
  comparisonOperator?: 'greater' | 'less' | 'equal';
  value?: any;
}

export interface PromptResult {
  id: string;
  promptId: string;
  platform: string;
  query: string;
  response: string;
  brandMentioned: boolean;
  brandPosition?: number; // Position in response (1st, 2nd, etc.)
  competitorsMentioned: string[];
  sentiment: 'positive' | 'neutral' | 'negative';
  citations: string[];
  timestamp: Date;
  changeFromPrevious?: {
    positionDelta: number;
    sentimentChange: string;
    newCompetitors: string[];
  };
}

export interface PromptAnalytics {
  promptId: string;
  totalResults: number;
  mentionRate: number; // Percentage where brand is mentioned
  avgPosition: number;
  sentimentDistribution: {
    positive: number;
    neutral: number;
    negative: number;
  };
  topCompetitors: { name: string; count: number }[];
  platformBreakdown: { platform: string; mentions: number; avgPosition: number }[];
  trend: {
    date: string;
    mentions: number;
    avgPosition: number;
    sentiment: number; // -1 to 1 scale
  }[];
}

class PromptTrackingService {
  private trackedPrompts: Map<string, TrackedPrompt> = new Map();
  private promptResults: Map<string, PromptResult[]> = new Map();
  
  // Mock data for demonstration
  private mockPlatforms = ['chatgpt', 'claude', 'gemini', 'perplexity'];
  private mockCompetitors = ['Competitor A', 'Competitor B', 'Competitor C'];
  
  async createTrackedPrompt(
    userId: string,
    prompt: string,
    config: Partial<TrackedPrompt>
  ): Promise<TrackedPrompt> {
    const newPrompt: TrackedPrompt = {
      id: `prompt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId,
      prompt,
      variations: config.variations || this.generateVariations(prompt),
      platforms: config.platforms || this.mockPlatforms,
      frequency: config.frequency || 'daily',
      alerts: config.alerts || {
        enabled: true,
        channels: ['email', 'inapp'],
        conditions: [
          { type: 'mention', threshold: 1 },
          { type: 'sentiment_drop', threshold: -0.3 }
        ]
      },
      createdAt: new Date(),
      lastChecked: new Date(),
      isActive: true
    };
    
    this.trackedPrompts.set(newPrompt.id, newPrompt);
    
    // Initialize with some mock results
    await this.checkPrompt(newPrompt.id);
    
    return newPrompt;
  }
  
  private generateVariations(basePrompt: string): string[] {
    const variations = [basePrompt];
    
    // Generate common variations
    const prefixes = ['Tell me about', 'What is', 'Compare', 'Review'];
    const suffixes = ['recommendations', 'vs competitors', 'pros and cons', 'latest updates'];
    
    // Extract brand name (simplified - in production would use NLP)
    const words = basePrompt.split(' ');
    const brandKeywords = words.slice(-2).join(' ');
    
    prefixes.forEach(prefix => {
      variations.push(`${prefix} ${brandKeywords}`);
    });
    
    suffixes.forEach(suffix => {
      variations.push(`${brandKeywords} ${suffix}`);
    });
    
    return variations.slice(0, 5); // Limit to 5 variations
  }
  
  async checkPrompt(promptId: string): Promise<PromptResult[]> {
    const prompt = this.trackedPrompts.get(promptId);
    if (!prompt) throw new Error('Prompt not found');
    
    const results: PromptResult[] = [];
    
    // Generate mock results for each platform
    for (const platform of prompt.platforms) {
      for (const variation of prompt.variations) {
        const result = this.generateMockResult(promptId, platform, variation);
        results.push(result);
      }
    }
    
    // Store results
    const existingResults = this.promptResults.get(promptId) || [];
    this.promptResults.set(promptId, [...existingResults, ...results]);
    
    // Update last checked
    prompt.lastChecked = new Date();
    this.trackedPrompts.set(promptId, prompt);
    
    // Check alerts
    await this.checkAlerts(promptId, results);
    
    return results;
  }
  
  private generateMockResult(promptId: string, platform: string, query: string): PromptResult {
    const brandMentioned = Math.random() > 0.3;
    const sentiment = ['positive', 'neutral', 'negative'][Math.floor(Math.random() * 3)] as PromptResult['sentiment'];
    
    return {
      id: `result_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      promptId,
      platform,
      query,
      response: `Based on the query "${query}", here's a comprehensive analysis...`,
      brandMentioned,
      brandPosition: brandMentioned ? Math.ceil(Math.random() * 5) : undefined,
      competitorsMentioned: this.mockCompetitors
        .filter(() => Math.random() > 0.6)
        .slice(0, Math.floor(Math.random() * 3)),
      sentiment,
      citations: Array.from(
        { length: Math.floor(Math.random() * 5) },
        () => `https://example.com/article-${Math.random().toString(36).substr(2, 9)}`
      ),
      timestamp: new Date(),
      changeFromPrevious: Math.random() > 0.5 ? {
        positionDelta: Math.floor(Math.random() * 3) - 1,
        sentimentChange: ['improved', 'declined', 'stable'][Math.floor(Math.random() * 3)],
        newCompetitors: Math.random() > 0.7 ? ['New Competitor'] : []
      } : undefined
    };
  }
  
  async getPromptAnalytics(promptId: string): Promise<PromptAnalytics> {
    const results = this.promptResults.get(promptId) || [];
    
    if (results.length === 0) {
      await this.checkPrompt(promptId);
      return this.getPromptAnalytics(promptId);
    }
    
    const mentionedResults = results.filter(r => r.brandMentioned);
    const totalResults = results.length;
    
    // Calculate sentiment distribution
    const sentimentCounts = {
      positive: mentionedResults.filter(r => r.sentiment === 'positive').length,
      neutral: mentionedResults.filter(r => r.sentiment === 'neutral').length,
      negative: mentionedResults.filter(r => r.sentiment === 'negative').length
    };
    
    // Calculate competitor frequency
    const competitorMap = new Map<string, number>();
    results.forEach(r => {
      r.competitorsMentioned.forEach(comp => {
        competitorMap.set(comp, (competitorMap.get(comp) || 0) + 1);
      });
    });
    
    // Platform breakdown
    const platformMap = new Map<string, { mentions: number; positions: number[] }>();
    mentionedResults.forEach(r => {
      const data = platformMap.get(r.platform) || { mentions: 0, positions: [] };
      data.mentions++;
      if (r.brandPosition) data.positions.push(r.brandPosition);
      platformMap.set(r.platform, data);
    });
    
    // Generate trend data (mock)
    const trendData = [];
    for (let i = 30; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      trendData.push({
        date: date.toISOString().split('T')[0],
        mentions: Math.floor(Math.random() * 10) + 5,
        avgPosition: 1 + Math.random() * 3,
        sentiment: Math.random() * 2 - 1 // -1 to 1 scale
      });
    }
    
    return {
      promptId,
      totalResults,
      mentionRate: (mentionedResults.length / totalResults) * 100,
      avgPosition: mentionedResults.reduce((acc, r) => acc + (r.brandPosition || 0), 0) / mentionedResults.length,
      sentimentDistribution: {
        positive: (sentimentCounts.positive / mentionedResults.length) * 100,
        neutral: (sentimentCounts.neutral / mentionedResults.length) * 100,
        negative: (sentimentCounts.negative / mentionedResults.length) * 100
      },
      topCompetitors: Array.from(competitorMap.entries())
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5),
      platformBreakdown: Array.from(platformMap.entries()).map(([platform, data]) => ({
        platform,
        mentions: data.mentions,
        avgPosition: data.positions.reduce((a, b) => a + b, 0) / data.positions.length || 0
      })),
      trend: trendData
    };
  }
  
  private async checkAlerts(promptId: string, results: PromptResult[]): Promise<void> {
    const prompt = this.trackedPrompts.get(promptId);
    if (!prompt || !prompt.alerts.enabled) return;
    
    const alerts: string[] = [];
    
    prompt.alerts.conditions.forEach(condition => {
      switch (condition.type) {
        case 'mention':
          const mentionCount = results.filter(r => r.brandMentioned).length;
          if (mentionCount >= (condition.threshold || 1)) {
            alerts.push(`New brand mentions detected: ${mentionCount} mentions across platforms`);
          }
          break;
          
        case 'sentiment_drop':
          const avgSentiment = this.calculateAvgSentiment(results);
          if (avgSentiment < (condition.threshold || -0.3)) {
            alerts.push(`Sentiment has dropped below threshold: ${avgSentiment.toFixed(2)}`);
          }
          break;
          
        case 'competitor_mention':
          const competitorMentions = new Set(results.flatMap(r => r.competitorsMentioned));
          if (competitorMentions.size > 0) {
            alerts.push(`Competitors mentioned: ${Array.from(competitorMentions).join(', ')}`);
          }
          break;
          
        case 'position_change':
          const positionChanges = results
            .filter(r => r.changeFromPrevious && Math.abs(r.changeFromPrevious.positionDelta) > 1);
          if (positionChanges.length > 0) {
            alerts.push(`Significant position changes detected in ${positionChanges.length} results`);
          }
          break;
          
        case 'new_citation':
          const totalCitations = results.reduce((acc, r) => acc + r.citations.length, 0);
          if (totalCitations > 0) {
            alerts.push(`New citations found: ${totalCitations} total citations`);
          }
          break;
      }
    });
    
    if (alerts.length > 0) {
      await this.sendAlerts(prompt, alerts);
    }
  }
  
  private calculateAvgSentiment(results: PromptResult[]): number {
    const sentimentMap = { positive: 1, neutral: 0, negative: -1 };
    const sentiments = results.map(r => sentimentMap[r.sentiment]);
    return sentiments.reduce((a, b) => a + b, 0) / sentiments.length;
  }
  
  private async sendAlerts(prompt: TrackedPrompt, alerts: string[]): Promise<void> {
    // In production, this would integrate with notification services
    console.log(`Alerts for prompt ${prompt.id}:`, alerts);
    
    // Mock alert storage for UI display
    if (typeof window !== 'undefined') {
      const existingAlerts = JSON.parse(localStorage.getItem('promptAlerts') || '[]');
      existingAlerts.push({
        promptId: prompt.id,
        alerts,
        timestamp: new Date().toISOString(),
        channels: prompt.alerts.channels
      });
      localStorage.setItem('promptAlerts', JSON.stringify(existingAlerts));
    }
  }
  
  async getTrackedPrompts(userId: string): Promise<TrackedPrompt[]> {
    return Array.from(this.trackedPrompts.values())
      .filter(p => p.userId === userId);
  }
  
  async updatePrompt(promptId: string, updates: Partial<TrackedPrompt>): Promise<TrackedPrompt> {
    const prompt = this.trackedPrompts.get(promptId);
    if (!prompt) throw new Error('Prompt not found');
    
    const updated = { ...prompt, ...updates };
    this.trackedPrompts.set(promptId, updated);
    return updated;
  }
  
  async deletePrompt(promptId: string): Promise<void> {
    this.trackedPrompts.delete(promptId);
    this.promptResults.delete(promptId);
  }
  
  async getPromptResults(
    promptId: string,
    filters?: {
      platform?: string;
      dateFrom?: Date;
      dateTo?: Date;
      sentiment?: string;
    }
  ): Promise<PromptResult[]> {
    let results = this.promptResults.get(promptId) || [];
    
    if (filters) {
      if (filters.platform) {
        results = results.filter(r => r.platform === filters.platform);
      }
      if (filters.sentiment) {
        results = results.filter(r => r.sentiment === filters.sentiment);
      }
      if (filters.dateFrom) {
        results = results.filter(r => r.timestamp >= filters.dateFrom!);
      }
      if (filters.dateTo) {
        results = results.filter(r => r.timestamp <= filters.dateTo!);
      }
    }
    
    return results;
  }
}

// Export singleton instance
export const promptTracking = new PromptTrackingService();
