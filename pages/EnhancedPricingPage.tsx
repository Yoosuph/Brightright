import React, { useState } from 'react';
import Card from '../components/Card';
import Button from '../components/Button';

const BillingToggle: React.FC<{
  billingCycle: 'monthly' | 'annually';
  setBillingCycle: (cycle: 'monthly' | 'annually') => void;
}> = ({ billingCycle, setBillingCycle }) => {
  return (
    <div className="inline-flex items-center gap-2 p-1 bg-gray-500/10 rounded-full">
      <Button
        variant="ghost"
        onClick={() => setBillingCycle('monthly')}
        className={`px-4 py-1.5 text-sm !rounded-full transition-all ${billingCycle === 'monthly' ? 'bg-light-card dark:bg-dark-card shadow-md !text-gray-900 dark:!text-white' : '!bg-transparent !text-gray-500'}`}
      >
        Monthly
      </Button>
      <Button
        variant="ghost"
        onClick={() => setBillingCycle('annually')}
        className={`px-4 py-1.5 text-sm !rounded-full transition-all flex items-center ${billingCycle === 'annually' ? 'bg-light-card dark:bg-dark-card shadow-md !text-gray-900 dark:!text-white' : '!bg-transparent !text-gray-500'}`}
      >
        Annually
        <span className="text-xs font-semibold bg-green-500/20 text-green-300 px-2 py-0.5 rounded-full ml-2">
          Save 20%
        </span>
      </Button>
    </div>
  );
};

const FAQItem: React.FC<{ question: string; answer: string }> = ({
  question,
  answer,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-border-color">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center py-4 text-left"
      >
        <span className="font-semibold">{question}</span>
        <IconChevronDown
          className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>
      {isOpen && (
        <div className="pb-4 text-gray-400 animate-fade-in">
          <p>{answer}</p>
        </div>
      )}
    </div>
  );
};

const FeatureComparisonTable = () => {
  const featureData = [
    {
      category: 'AI Tracking & Analysis',
      features: [
        {
          name: 'Prompts Tracked per Month',
          starter: '100',
          professional: '1,000',
          enterprise: 'Unlimited',
        },
        {
          name: 'AI Platforms Monitored',
          starter: '2 (ChatGPT + Perplexity)',
          professional: 'All 5 Platforms',
          enterprise: 'All + Custom APIs',
        },
        {
          name: 'Countries Supported',
          starter: '1',
          professional: '5',
          enterprise: 'Unlimited',
        },
        {
          name: 'Data Refresh Rate',
          starter: 'Weekly',
          professional: 'Daily',
          enterprise: 'Real-time',
        },
        {
          name: 'Historical Data Access',
          starter: '3 months',
          professional: '12 months',
          enterprise: 'Unlimited',
        },
      ],
    },
    {
      category: 'Visibility & Competitive Intelligence',
      features: [
        {
          name: 'Competitors Tracked',
          starter: '3',
          professional: '20',
          enterprise: 'Unlimited',
        },
        {
          name: 'Visibility Score Tracking',
          starter: true,
          professional: true,
          enterprise: true,
        },
        {
          name: 'Position Tracking',
          starter: true,
          professional: true,
          enterprise: true,
        },
        {
          name: 'Sentiment Analysis',
          starter: 'Basic',
          professional: 'Advanced',
          enterprise: 'AI-Powered + Custom',
        },
        {
          name: 'Source Citation Analysis',
          starter: false,
          professional: true,
          enterprise: true,
        },
        {
          name: 'Market Share Insights',
          starter: false,
          professional: true,
          enterprise: true,
        },
      ],
    },
    {
      category: 'Reporting & Data Export',
      features: [
        {
          name: 'Dashboard Views',
          starter: 'Basic',
          professional: 'Advanced + Custom',
          enterprise: 'Unlimited Custom',
        },
        {
          name: 'PDF Report Export',
          starter: true,
          professional: true,
          enterprise: true,
        },
        {
          name: 'CSV Data Export',
          starter: false,
          professional: true,
          enterprise: true,
        },
        {
          name: 'API Access',
          starter: false,
          professional: 'Limited',
          enterprise: 'Full API Access',
        },
        {
          name: 'Scheduled Reports',
          starter: false,
          professional: true,
          enterprise: true,
        },
        {
          name: 'Custom Integrations',
          starter: false,
          professional: false,
          enterprise: true,
        },
      ],
    },
    {
      category: 'Team & Support',
      features: [
        {
          name: 'Team Seats',
          starter: '1',
          professional: '5',
          enterprise: 'Unlimited',
        },
        {
          name: 'Brand Workspaces',
          starter: '1',
          professional: '3',
          enterprise: 'Unlimited',
        },
        {
          name: 'Email Support',
          starter: true,
          professional: true,
          enterprise: true,
        },
        {
          name: 'Priority Support',
          starter: false,
          professional: true,
          enterprise: true,
        },
        {
          name: 'Dedicated Account Manager',
          starter: false,
          professional: false,
          enterprise: true,
        },
        {
          name: 'Custom Onboarding',
          starter: false,
          professional: false,
          enterprise: true,
        },
      ],
    },
  ];

  const renderValue = (value: string | boolean) => {
    if (typeof value === 'boolean') {
      return value ? (
        <IconCheck className="mx-auto text-green-500" />
      ) : (
        <IconCross className="mx-auto text-gray-500" />
      );
    }
    return <span className="text-sm text-center">{value}</span>;
  };

  return (
    <div className="overflow-x-auto bg-dark-card p-6 rounded-2xl border border-border-color">
      <table className="w-full min-w-max text-left">
        <thead>
          <tr className="border-b border-border-color">
            <th className="p-4 font-semibold text-lg">Features</th>
            <th className="p-4 font-semibold text-center">Starter</th>
            <th className="p-4 font-semibold text-center">Professional</th>
            <th className="p-4 font-semibold text-center">Enterprise</th>
          </tr>
        </thead>
        <tbody>
          {featureData.map(section => (
            <React.Fragment key={section.category}>
              <tr>
                <td
                  colSpan={4}
                  className="p-4 pt-6 font-bold text-brand-purple tracking-wider uppercase text-sm"
                >
                  {section.category}
                </td>
              </tr>
              {section.features.map(feature => (
                <tr
                  key={feature.name}
                  className="border-b border-border-color/50 hover:bg-gray-500/10"
                >
                  <td className="p-4 text-gray-300">{feature.name}</td>
                  <td className="p-4 text-center">
                    {renderValue(feature.starter)}
                  </td>
                  <td className="p-4 text-center">
                    {renderValue(feature.professional)}
                  </td>
                  <td className="p-4 text-center">
                    {renderValue(feature.enterprise)}
                  </td>
                </tr>
              ))}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const TrustIndicators = () => (
  <div className="bg-gray-50 dark:bg-gray-800/50 p-8 rounded-2xl mb-16">
    <div className="text-center mb-8">
      <h3 className="text-xl font-semibold mb-2">Trusted by Marketing Teams</h3>
      <p className="text-gray-600 dark:text-gray-400">Join leading brands tracking their AI visibility</p>
    </div>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center opacity-60">
      <div className="text-center">
        <div className="text-2xl font-bold text-brand-purple">500+</div>
        <div className="text-sm text-gray-600">Brands Tracked</div>
      </div>
      <div className="text-center">
        <div className="text-2xl font-bold text-brand-purple">50M+</div>
        <div className="text-sm text-gray-600">AI Responses Analyzed</div>
      </div>
      <div className="text-center">
        <div className="text-2xl font-bold text-brand-purple">10k+</div>
        <div className="text-sm text-gray-600">Prompts Monitored</div>
      </div>
      <div className="text-center">
        <div className="text-2xl font-bold text-brand-purple">98%</div>
        <div className="text-sm text-gray-600">Customer Satisfaction</div>
      </div>
    </div>
  </div>
);

const EnhancedPricingPage: React.FC = () => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annually'>('monthly');

  return (
    <div className="space-y-16 animate-fade-in max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      <div className="text-center">
        <div className="inline-flex items-center bg-brand-purple/10 text-brand-purple px-3 py-1 rounded-full text-sm font-medium mb-4">
          <IconSparkles className="w-4 h-4 mr-2" />
          AI Search Analytics Platform
        </div>
        <h1 className="text-4xl lg:text-5xl font-bold">
          Track Your Brand's AI Visibility
        </h1>
        <p className="text-gray-400 mt-4 max-w-3xl mx-auto text-lg">
          Monitor how often your brand appears in AI responses across ChatGPT, Perplexity, Claude, and more. 
          Get actionable insights to improve your AI search visibility.
        </p>
        <div className="mt-8">
          <BillingToggle
            billingCycle={billingCycle}
            setBillingCycle={setBillingCycle}
          />
        </div>
      </div>

      <TrustIndicators />

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        <PricingCard
          plan="Starter"
          monthlyPrice={79}
          annualPrice={790}
          billingCycle={billingCycle}
          description="Perfect for individual marketers and small teams getting started with AI visibility tracking."
          features={[
            '100 prompts tracked/month',
            '2 AI platforms (ChatGPT + Perplexity)',
            '3 competitor tracking',
            '1 country supported',
            'Weekly data refresh',
            'Basic visibility & sentiment analysis',
            'PDF report export',
            '3 months historical data',
            'Email support'
          ]}
          limitations={[
            'No API access',
            'No advanced sentiment analysis',
            'Limited historical data'
          ]}
        />
        <PricingCard
          plan="Professional"
          monthlyPrice={299}
          annualPrice={2990}
          billingCycle={billingCycle}
          description="Ideal for marketing teams and agencies needing comprehensive AI visibility insights."
          features={[
            '1,000 prompts tracked/month',
            'All 5 AI platforms monitored',
            '20 competitor tracking',
            '5 countries supported',
            'Daily data refresh',
            'Advanced sentiment analysis',
            'Source citation tracking',
            'Market share insights',
            'CSV export + Limited API',
            '5 team seats + 3 brand workspaces',
            '12 months historical data',
            'Priority support'
          ]}
          isPopular={true}
          badge="Most Popular"
        />
        <PricingCard
          plan="Enterprise"
          price="Custom"
          description="For large organizations requiring unlimited tracking, custom integrations, and white-glove support."
          features={[
            'Unlimited prompts & AI platforms',
            'Unlimited competitors & countries',
            'Real-time data monitoring',
            'Custom AI models & integrations',
            'Advanced analytics & insights',
            'Full API access + webhooks',
            'Unlimited team seats & brands',
            'Dedicated account manager',
            'Custom onboarding & training',
            'SLA guarantees',
            'Unlimited historical data',
            'Custom reporting & dashboards'
          ]}
          badge="Custom Solutions"
        />
      </div>

      <div className="bg-gradient-to-r from-brand-purple/10 to-brand-pink/10 p-8 rounded-2xl text-center">
        <h3 className="text-2xl font-bold mb-4">Start Your 14-Day Free Trial</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
          No credit card required. Get full access to Professional features and see how your brand performs in AI search results.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
          <Button variant="primary" className="flex-1">
            Start Free Trial
          </Button>
          <Button variant="secondary" className="flex-1">
            Schedule Demo
          </Button>
        </div>
      </div>

      <div>
        <h2 className="text-3xl font-bold text-center mb-8">Compare All Features</h2>
        <FeatureComparisonTable />
      </div>

      <div>
        <h2 className="text-3xl font-bold text-center mb-8">
          Frequently Asked Questions
        </h2>
        <div className="max-w-3xl mx-auto space-y-4">
          <FAQItem
            question="How does AI visibility tracking work?"
            answer="BrightRight regularly queries major AI platforms (ChatGPT, Perplexity, Claude, etc.) with prompts relevant to your industry. We analyze the responses to track when and how your brand is mentioned, your position in answers, sentiment, and which sources are cited."
          />
          <FAQItem
            question="Which AI platforms do you monitor?"
            answer="We currently track ChatGPT, Perplexity AI, Claude, Google Gemini, and Microsoft Copilot. Our Enterprise plan includes support for custom AI models and APIs specific to your organization's needs."
          />
          <FAQItem
            question="How often is the data updated?"
            answer="Data refresh frequency depends on your plan: Starter (weekly), Professional (daily), and Enterprise (real-time). We track trends over time to show you how your AI visibility changes."
          />
          <FAQItem
            question="Can I track multiple brands or competitors?"
            answer="Yes! Professional plans include 3 brand workspaces and 20 competitor tracking slots. Enterprise plans offer unlimited brands and competitors. You can benchmark your performance against industry leaders."
          />
          <FAQItem
            question="What kind of prompts should I track?"
            answer="Focus on prompts your potential customers might ask AI: 'best [your category] tools', 'how to solve [problem you address]', '[your industry] software comparison', etc. Our onboarding helps suggest relevant prompts based on your website and industry."
          />
          <FAQItem
            question="Do you offer API access?"
            answer="Professional plans include limited API access for basic data export. Enterprise plans provide full API access with webhooks, allowing you to integrate our data into your existing analytics stack or BI tools."
          />
          <FAQItem
            question="Is there a free trial?"
            answer="Yes! We offer a 14-day free trial of our Professional plan with no credit card required. This gives you access to advanced features so you can see the full value of AI visibility tracking."
          />
          <FAQItem
            question="How do you handle data privacy and compliance?"
            answer="We take data privacy seriously and comply with GDPR, CCPA, and other regulations. We only collect publicly available AI responses and don't store any personal user data from the AI platforms we monitor."
          />
        </div>
      </div>
    </div>
  );
};

interface PricingCardProps {
  plan: string;
  price?: 'Custom';
  monthlyPrice?: number;
  annualPrice?: number;
  billingCycle?: 'monthly' | 'annually';
  description: string;
  features: string[];
  limitations?: string[];
  isPopular?: boolean;
  badge?: string;
}

const PricingCard: React.FC<PricingCardProps> = ({
  plan,
  price,
  monthlyPrice,
  annualPrice,
  billingCycle,
  description,
  features,
  limitations = [],
  isPopular = false,
  badge,
}) => {
  const displayPrice =
    price === 'Custom'
      ? 'Custom'
      : billingCycle === 'annually'
        ? annualPrice
        : monthlyPrice;
  const period =
    price !== 'Custom'
      ? billingCycle === 'annually'
        ? '/year'
        : '/month'
      : null;

  const savings = monthlyPrice && annualPrice ? 
    Math.round(((monthlyPrice * 12 - annualPrice) / (monthlyPrice * 12)) * 100) : 0;

  return (
    <Card
      className={`flex flex-col h-full relative ${isPopular ? 'border-brand-purple ring-2 ring-brand-purple' : ''}`}
    >
      {badge && (
        <div className={`absolute -top-3 left-1/2 transform -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold tracking-widest uppercase shadow-lg ${
          isPopular 
            ? 'bg-brand-purple text-white' 
            : 'bg-gradient-to-r from-brand-purple to-brand-pink text-white'
        }`}>
          {badge}
        </div>
      )}
      
      <div className="pt-2">
        <h2 className="text-2xl font-bold">{plan}</h2>
        <p className="text-gray-400 mt-2 mb-6">{description}</p>
        
        <div className="mb-6">
          {price === 'Custom' ? (
            <div>
              <span className="text-4xl font-bold">Custom</span>
              <p className="text-sm text-gray-500 mt-1">Pricing based on your needs</p>
            </div>
          ) : (
            <div>
              <span className="text-4xl font-bold">${displayPrice}</span>
              <span className="text-gray-400">{period}</span>
              {billingCycle === 'annually' && savings > 0 && (
                <div className="text-sm text-green-400 mt-1">
                  Save {savings}% annually
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="flex-grow">
        <ul className="space-y-3 text-gray-300 mb-6">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start">
              <IconCheck className="flex-shrink-0 text-green-500 mt-0.5" />
              <span className="ml-3 text-sm">{feature}</span>
            </li>
          ))}
        </ul>
        
        {limitations.length > 0 && (
          <div className="border-t border-gray-700 pt-4">
            <p className="text-sm text-gray-500 mb-2">Not included:</p>
            <ul className="space-y-2">
              {limitations.map((limitation, index) => (
                <li key={index} className="flex items-start text-gray-500">
                  <IconCross className="flex-shrink-0 mt-0.5" />
                  <span className="ml-3 text-sm">{limitation}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="mt-6">
        <Button
          variant={isPopular ? 'primary' : 'secondary'}
          className="w-full"
        >
          {plan === 'Enterprise' ? 'Contact Sales' : 'Start Free Trial'}
        </Button>
        {plan !== 'Enterprise' && (
          <p className="text-xs text-gray-500 text-center mt-2">
            14-day free trial • No credit card required
          </p>
        )}
      </div>
    </Card>
  );
};

// Icon Components
const IconCheck: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={`h-5 w-5 ${className}`}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M5 13l4 4L19 7"
    />
  </svg>
);

const IconChevronDown: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M19 9l-7 7-7-7"
    />
  </svg>
);

const IconCross: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={`h-5 w-5 ${className}`}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
);

const IconSparkles: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.293 2.293a1 1 0 010 1.414L13 12l-1.293 1.293a1 1 0 01-1.414 0L8 10.414a1 1 0 010-1.414L10.293 6.707a1 1 0 011.414 0L13 8l2.293-2.293a1 1 0 011.414 0L18 7.414a1 1 0 010 1.414L16.707 10.121a1 1 0 01-1.414 0L14 8.828 12.293 10.536a1 1 0 01-1.414 0L9.586 9.243a1 1 0 010-1.414L11 6.121"
    />
  </svg>
);

export default EnhancedPricingPage;