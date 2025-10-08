import type {
  KeywordAnalysisResult,
  DashboardAnalysisResult,
  ActionableInsight,
  CompetitorData,
} from '../types';

// Helper function to create a random number in a range
const random = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const mockActionableInsights: { insights: ActionableInsight[] } = {
  insights: [
    {
      category: 'Reputation Management',
      priority: 'High',
      title: 'Address Negative Subscription Feedback',
      description:
        'Create a dedicated FAQ page and train support staff to handle complaints promptly about delivery delays.',
    },
    {
      category: 'Content Strategy',
      priority: 'Medium',
      title: 'Leverage "Eco-Friendly" Keywords',
      description:
        "Create blog content and social media campaigns highlighting your brand's eco-friendly practices and compostable pods.",
    },
    {
      category: 'SEO Optimization',
      priority: 'Low',
      title: 'Create Comparison Content',
      description:
        'Develop a "Why [BrandName] is the best choice" page to control the narrative against competitors mentioned in taste tests.',
    },
  ],
};

// --- Dynamic Data Generators ---

const generateDynamicDashboardData = (
  brandName: string,
  keywords: string[],
  dateRange: string
): DashboardAnalysisResult => {
  const totalMentions = random(50, 250);
  const positive = random(30, 70);
  const neutral = random(10, 30);
  const negative = 100 - positive - neutral;

  const platforms = ['Gemini', 'ChatGPT', 'Claude'];
  const sentiments: ('Positive' | 'Negative' | 'Neutral')[] = [
    'Positive',
    'Negative',
    'Neutral',
  ];

  const brandHash = brandName
    .split('')
    .reduce((acc, char) => char.charCodeAt(0) + ((acc << 5) - acc), 0);
  const overallScore = (Math.abs(brandHash) % 40) + 50; // Score between 50-90

  return {
    overallScore: overallScore,
    visibilityChange: parseFloat((Math.random() * 20 - 10).toFixed(1)), // -10% to +10%
    totalMentions: totalMentions,
    sentimentBreakdown: { positive, neutral, negative },
    summary: `The overall visibility score for "${brandName}" is ${overallScore}, indicating a solid presence within the AI-generated space for the period of ${dateRange}. Sentiment is predominantly positive at ${positive}%, driven by discussions around "${keywords[0]}" and general product quality. Key themes identified include customer service experiences and pricing comparisons against competitors.`,
    actionableInsights: mockActionableInsights.insights,
    mentions: Array.from({ length: 5 }, (_) => ({
      platform: platforms[random(0, platforms.length - 1)],
      query: `reviews for ${brandName} ${keywords[random(0, keywords.length - 1)] || 'products'}`,
      snippet: `A user mentioned ${brandName} in a discussion about ${keywords[random(0, keywords.length - 1)] || 'its products'}. The sentiment was generally ${sentiments[random(0, 2)].toLowerCase()}.`,
      sentiment: sentiments[random(0, 2)],
      date: `2023-10-${random(20, 28)}`,
      confidence: parseFloat((Math.random() * 0.15 + 0.85).toFixed(2)), // 0.85 - 1.0
    })),
    sentimentTrend: [
      {
        date: 'Week 1',
        positive: Math.max(0, positive - random(10, 15)),
        neutral: neutral + random(0, 5),
        negative: 100 - (positive - random(10, 15)) - (neutral + random(0, 5)),
      },
      {
        date: 'Week 2',
        positive: Math.max(0, positive - random(5, 10)),
        neutral: neutral + random(0, 5),
        negative: 100 - (positive - random(5, 10)) - (neutral + random(0, 5)),
      },
      {
        date: 'Week 3',
        positive: Math.max(0, positive - random(0, 5)),
        neutral: neutral - random(0, 5),
        negative: 100 - (positive - random(0, 5)) - (neutral - random(0, 5)),
      },
      {
        date: 'Week 4',
        positive: positive,
        neutral: neutral,
        negative: negative,
      },
    ].map(d => ({
      ...d,
      positive: Math.max(0, Math.min(100, d.positive)),
      neutral: Math.max(0, Math.min(100, d.neutral)),
      negative: Math.max(0, Math.min(100, d.negative)),
    })),
    platformBreakdown: [
      { platform: 'ChatGPT', mentions: Math.floor(totalMentions * 0.5) },
      { platform: 'Gemini', mentions: Math.floor(totalMentions * 0.35) },
      { platform: 'Claude', mentions: Math.floor(totalMentions * 0.15) },
    ],
  };
};

const generateDynamicKeywordAnalysis = (
  brandName: string,
  keywords: string[]
): KeywordAnalysisResult => {
  const brandHash = brandName
    .split('')
    .reduce((acc, char) => char.charCodeAt(0) + ((acc << 5) - acc), 0);
  const score = (Math.abs(brandHash) % 40) + 55; // Score between 55-95
  const sentiments: ('Positive' | 'Negative' | 'Neutral' | 'Unknown')[] = [
    'Positive',
    'Negative',
    'Neutral',
    'Unknown',
  ];
  const sentimentSummary = ['Mixed', 'Positive', 'Neutral'][random(0, 2)];

  return {
    summary: `Analysis for "${brandName}" shows a strong presence for keywords like "${keywords[0]}". Overall sentiment is ${sentimentSummary.toLowerCase()}, though some discussions mention price or customer support as areas for improvement.`,
    sentiment: sentimentSummary,
    score: score,
    mentions: keywords.slice(0, 4).map(kw => ({
      text: `Users associate ${brandName} with "${kw}" in a generally ${sentiments[random(0, 2)].toLowerCase()} way.`,
      sentiment: sentiments[random(0, 3)],
    })),
  };
};

// --- Mock Service Functions ---

const simulateApiCall = <T>(data: T): Promise<T> => {
  return new Promise(resolve => {
    setTimeout(
      () => {
        resolve(data);
      },
      500 + Math.random() * 500
    ); // Simulate network delay
  });
};

export const checkBrandVisibility = async (
  brandName: string,
  keywords: string[]
): Promise<KeywordAnalysisResult | null> => {
  console.log('MOCK: checkBrandVisibility called with:', {
    brandName,
    keywords,
  });
  const result = generateDynamicKeywordAnalysis(brandName, keywords);
  return simulateApiCall(result);
};

export const getDashboardAnalysis = async (
  brandName: string,
  keywords: string[],
  dateRange: string
): Promise<DashboardAnalysisResult | null> => {
  console.log('MOCK: getDashboardAnalysis called with:', {
    brandName,
    keywords,
    dateRange,
  });
  const result = generateDynamicDashboardData(brandName, keywords, dateRange);
  return simulateApiCall(result);
};

export const getActionableInsights = async (
  analysisResult: DashboardAnalysisResult
): Promise<{ insights: ActionableInsight[] } | null> => {
  console.log('MOCK: getActionableInsights called.');
  // Actionable insights can remain static as they are high-quality examples.
  // We can still replace the placeholder for a bit more dynamic feel.
  const dynamicInsights = JSON.parse(
    JSON.stringify(mockActionableInsights).replace(
      /\[BrandName\]/g,
      analysisResult.mentions[0]?.snippet.includes('BrandName')
        ? 'Your Brand'
        : 'a competitor'
    )
  );
  return simulateApiCall(dynamicInsights);
};

export const getCompetitorScores = async (
  mainBrandName: string,
  keywords: string[],
  competitorNames: string[]
): Promise<CompetitorData[] | null> => {
  console.log('MOCK: getCompetitorScores called with:', {
    mainBrandName,
    keywords,
    competitorNames,
  });
  const mockScores: CompetitorData[] = competitorNames.map(name => ({
    name,
    visibility: Math.floor(40 + Math.random() * 50), // Random score between 40 and 90
  }));
  return simulateApiCall(mockScores);
};

// --- New: Competitor Suggestion (Mock + Heuristic) ---

const toHostname = (url: string): string => {
  try {
    const u = new URL(url.startsWith('http') ? url : `https://${url}`);
    return u.hostname.replace(/^www\./, '');
  } catch {
    return url.replace(/^www\./, '');
  }
};

const inferCategory = (brandName: string, website: string, meta?: string): string => {
  const hay = `${brandName} ${website} ${meta || ''}`.toLowerCase();
  if (/(monitor|observab|log|apm|metrics|tracing)/.test(hay)) return 'observability';
  if (/(analytics|insight|bi|amplitude|mixpanel|heap)/.test(hay)) return 'analytics';
  if (/(crm|salesforce|hubspot|pipedrive|leads|contacts)/.test(hay)) return 'crm';
  if (/(project|task|kanban|asana|jira|trello|monday)/.test(hay)) return 'project_management';
  if (/(e-?commerce|shopify|magento|woocommerce|store)/.test(hay)) return 'ecommerce';
  if (/(marketing|campaign|seo|sem|ads|email)/.test(hay)) return 'marketing';
  if (/(security|siem|xdr|endpoint|firewall)/.test(hay)) return 'security';
  if (/(helpdesk|support|ticket|zendesk|freshdesk|intercom)/.test(hay)) return 'helpdesk';
  if (/(hr|payroll|recruit|ats|workday|bamboo)/.test(hay)) return 'hr';
  return 'general_saas';
};

const catalogs: Record<string, Array<{ name: string; website: string; description: string }>> = {
  observability: [
    { name: 'Datadog', website: 'https://www.datadoghq.com', description: 'Cloud monitoring and security platform' },
    { name: 'New Relic', website: 'https://newrelic.com', description: 'Application performance monitoring' },
    { name: 'Splunk', website: 'https://www.splunk.com', description: 'SIEM and observability analytics' },
    { name: 'Elastic', website: 'https://www.elastic.co', description: 'Search, logs, and APM' },
  ],
  analytics: [
    { name: 'Amplitude', website: 'https://amplitude.com', description: 'Product analytics' },
    { name: 'Mixpanel', website: 'https://mixpanel.com', description: 'User behavior analytics' },
    { name: 'Heap', website: 'https://heap.io', description: 'Auto-capture analytics' },
    { name: 'Pendo', website: 'https://www.pendo.io', description: 'Product experience analytics' },
  ],
  crm: [
    { name: 'Salesforce', website: 'https://www.salesforce.com', description: 'Enterprise CRM' },
    { name: 'HubSpot', website: 'https://www.hubspot.com', description: 'Inbound marketing and CRM' },
    { name: 'Pipedrive', website: 'https://www.pipedrive.com', description: 'Sales pipeline CRM' },
    { name: 'Zoho CRM', website: 'https://www.zoho.com/crm/', description: 'All-in-one CRM' },
  ],
  project_management: [
    { name: 'Asana', website: 'https://asana.com', description: 'Work management' },
    { name: 'Jira', website: 'https://www.atlassian.com/software/jira', description: 'Agile project tracking' },
    { name: 'Trello', website: 'https://trello.com', description: 'Kanban boards' },
    { name: 'Monday.com', website: 'https://monday.com', description: 'Projects and workflows' },
  ],
  ecommerce: [
    { name: 'Shopify', website: 'https://www.shopify.com', description: 'Ecommerce platform' },
    { name: 'Magento', website: 'https://magento.com', description: 'Adobe Commerce' },
    { name: 'BigCommerce', website: 'https://www.bigcommerce.com', description: 'Ecommerce platform' },
    { name: 'WooCommerce', website: 'https://woocommerce.com', description: 'WordPress ecommerce' },
  ],
  marketing: [
    { name: 'Mailchimp', website: 'https://mailchimp.com', description: 'Email marketing' },
    { name: 'Marketo', website: 'https://www.marketo.com', description: 'Marketing automation' },
    { name: 'Ahrefs', website: 'https://ahrefs.com', description: 'SEO tools' },
    { name: 'SEMrush', website: 'https://semrush.com', description: 'SEO/SEM platform' },
  ],
  security: [
    { name: 'CrowdStrike', website: 'https://www.crowdstrike.com', description: 'Endpoint security' },
    { name: 'Palo Alto Networks', website: 'https://www.paloaltonetworks.com', description: 'Network security' },
    { name: 'SentinelOne', website: 'https://www.sentinelone.com', description: 'Autonomous cybersecurity' },
    { name: 'Okta', website: 'https://okta.com', description: 'Identity and access' },
  ],
  helpdesk: [
    { name: 'Zendesk', website: 'https://www.zendesk.com', description: 'Customer service' },
    { name: 'Freshdesk', website: 'https://freshdesk.com', description: 'Helpdesk software' },
    { name: 'Intercom', website: 'https://www.intercom.com', description: 'Customer communications' },
    { name: 'Help Scout', website: 'https://www.helpscout.com', description: 'Email-based helpdesk' },
  ],
  hr: [
    { name: 'Workday', website: 'https://www.workday.com', description: 'HR and finance' },
    { name: 'BambooHR', website: 'https://www.bamboohr.com', description: 'HR software for SMBs' },
    { name: 'Greenhouse', website: 'https://www.greenhouse.io', description: 'Hiring ATS' },
    { name: 'Lever', website: 'https://www.lever.co', description: 'Talent acquisition' },
  ],
  general_saas: [
    { name: 'Notion', website: 'https://www.notion.so', description: 'Docs and wiki' },
    { name: 'Slack', website: 'https://slack.com', description: 'Team communications' },
    { name: 'Airtable', website: 'https://airtable.com', description: 'Flexible database' },
    { name: 'Basecamp', website: 'https://basecamp.com', description: 'Project management' },
  ],
};

const score = (needle: string, hay: string) => {
  let s = 70;
  const n = needle.toLowerCase();
  const h = hay.toLowerCase();
  if (h.includes(n)) s += 10;
  if (new RegExp(`\\b${n.split(' ')[0]}\\b`).test(h)) s += 10;
  return Math.min(98, s + Math.floor(Math.random() * 10));
};

const fetchWebsiteMetadata = async (website: string): Promise<string | undefined> => {
  try {
    const res = await fetch(website.startsWith('http') ? website : `https://${website}`, { mode: 'cors' });
    const html = await res.text();
    // Extract <title> and common meta descriptions as a lightweight signal
    const title = /<title>([^<]+)<\/title>/i.exec(html)?.[1] || '';
    const desc = /<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["'][^>]*>/i.exec(html)?.[1] || '';
    const og = /<meta[^>]+property=["']og:description["'][^>]+content=["']([^"']+)["'][^>]*>/i.exec(html)?.[1] || '';
    return [title, desc, og].filter(Boolean).join(' ');
  } catch {
    // CORS or network errors are common; return undefined to trigger heuristic fallback
    return undefined;
  }
};

export const suggestCompetitors = async (
  website: string,
  brandName: string
): Promise<Array<{ name: string; website: string; description: string; relevanceScore: number; reasoning: string }>> => {
  console.log('MOCK: suggestCompetitors called with:', { website, brandName });
  const hostname = toHostname(website);
  const meta = await fetchWebsiteMetadata(website);
  const category = inferCategory(brandName, hostname, meta);
  const baseList = catalogs[category] || catalogs.general_saas;

  const enriched = baseList.map(entry => ({
    ...entry,
    relevanceScore: score(brandName, `${entry.name} ${entry.description} ${entry.website}`),
    reasoning: meta
      ? `Matches your site\'s detected theme (${category.replace('_', ' ')}) and keywords found in metadata.`
      : `Based on your brand and URL patterns indicating ${category.replace('_', ' ')}.`,
  }))
  .sort((a, b) => b.relevanceScore - a.relevanceScore)
  .slice(0, 5);

  return simulateApiCall(enriched);
};
