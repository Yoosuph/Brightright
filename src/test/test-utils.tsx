import React from 'react';
import { render, RenderOptions } from '@testing-library/react';

// Mock data generators for testing
export const createMockOnboardingData = (overrides = {}) => ({
  brandName: 'Test Brand',
  keywords: 'test, keywords, mock',
  competitors: [
    { name: 'Competitor 1', visibility: 75 },
    { name: 'Competitor 2', visibility: 60 },
  ],
  ...overrides,
});

export const createMockDashboardData = (overrides = {}) => ({
  overallScore: 85,
  visibilityChange: 5.2,
  totalMentions: 150,
  sentimentBreakdown: { positive: 60, neutral: 30, negative: 10 },
  mentions: [
    {
      platform: 'ChatGPT',
      query: 'test query',
      snippet: 'test snippet',
      sentiment: 'Positive' as const,
      date: '2023-10-25',
      confidence: 0.92,
    },
  ],
  sentimentTrend: [{ date: 'Week 1', positive: 55, neutral: 35, negative: 10 }],
  platformBreakdown: [
    { platform: 'ChatGPT', mentions: 75 },
    { platform: 'Gemini', mentions: 53 },
    { platform: 'Claude', mentions: 22 },
  ],
  actionableInsights: [],
  summary: 'Test summary',
  ...overrides,
});

// Custom render function for components that need context
const customRender = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { ...options });

/* eslint-disable react-refresh/only-export-components */
export * from '@testing-library/react';
export { customRender as render };
