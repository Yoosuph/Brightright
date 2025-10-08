import {
  KeywordAnalysisResult,
  DashboardAnalysisResult,
  ActionableInsight,
  CompetitorData,
} from '../types';

// Import existing mock service
import * as mockService from '../../services/geminiService';

// Environment-based configuration
const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_DATA !== 'false';

// Real API service implementation (placeholder)
class RealApiService {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async checkBrandVisibility(
    brandName: string,
    keywords: string[]
  ): Promise<KeywordAnalysisResult | null> {
    // TODO: Implement real API call to Gemini
    console.warn('Real API not implemented yet, falling back to mock data');
    return mockService.checkBrandVisibility(brandName, keywords);
  }

  async getDashboardAnalysis(
    brandName: string,
    keywords: string[],
    dateRange: string
  ): Promise<DashboardAnalysisResult | null> {
    // TODO: Implement real API call
    console.warn('Real API not implemented yet, falling back to mock data');
    return mockService.getDashboardAnalysis(brandName, keywords, dateRange);
  }

  async getActionableInsights(
    analysisResult: DashboardAnalysisResult
  ): Promise<{ insights: ActionableInsight[] } | null> {
    // TODO: Implement real API call
    console.warn('Real API not implemented yet, falling back to mock data');
    return mockService.getActionableInsights(analysisResult);
  }

  async getCompetitorScores(
    mainBrandName: string,
    keywords: string[],
    competitorNames: string[]
  ): Promise<CompetitorData[] | null> {
    // TODO: Implement real API call
    console.warn('Real API not implemented yet, falling back to mock data');
    return mockService.getCompetitorScores(
      mainBrandName,
      keywords,
      competitorNames
    );
  }

  async suggestCompetitors(
    website: string,
    brandName: string
  ): Promise<Array<{ name: string; website: string; description: string; relevanceScore: number; reasoning: string }>> {
    // TODO: Implement real API call to a server function that fetches site metadata and queries providers
    console.warn('Real API not implemented yet, falling back to mock data');
    return mockService.suggestCompetitors(website, brandName);
  }
}

// Create service instance based on environment
const createApiService = () => {
  if (USE_MOCK_DATA) {
    console.log('Using mock data service');
    return mockService;
  } else {
    console.log('Using real API service');
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
      console.warn('No API key provided, falling back to mock data');
      return mockService;
    }
    return new RealApiService(apiKey);
  }
};

export const apiClient = createApiService();
