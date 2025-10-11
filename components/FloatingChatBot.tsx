import React, { useState, useRef, useEffect, useCallback } from 'react';
import Card from './Card';
import Button from './Button';
import Badge from './ui/Badge';
import type { OnboardingData, Page } from '../types';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  suggestions?: string[];
  data?: {
    type: 'chart' | 'metric' | 'insight' | 'action' | 'navigation';
    payload: unknown;
  };
  page?: Page; // Track which page the message was sent from
}

interface FloatingChatBotProps {
  appData: OnboardingData;
  currentPage: Page;
  onNavigate?: (page: Page) => void;
  onActionRequest?: (action: string, params?: unknown) => void;
}

const CHAT_STORAGE_KEY = 'brightrankChatHistory';

const FloatingChatBot: React.FC<FloatingChatBotProps> = ({ 
  appData, 
  currentPage,
  onNavigate,
  onActionRequest 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Load chat history from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(CHAT_STORAGE_KEY);
      if (stored) {
        const history = JSON.parse(stored);
        setMessages(history.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        })));
      } else {
        // Initialize with welcome message
        const welcomeMessage: ChatMessage = {
          id: '1',
          role: 'assistant',
          content: `Hi! I'm your AI visibility assistant for ${appData.brandName}. I can help you analyze performance, explain trends, navigate the platform, and suggest optimization strategies. What would you like to know?`,
          timestamp: new Date(),
          page: currentPage,
          suggestions: [
            'Show me recent mention trends',
            'Navigate to Analytics',
            'How do I improve visibility?',
            'Set up new alerts'
          ]
        };
        setMessages([welcomeMessage]);
      }
    } catch (error) {
      console.error('Error loading chat history:', error);
    }
  }, [appData.brandName]);

  // Save chat history to localStorage
  const saveChatHistory = useCallback((newMessages: ChatMessage[]) => {
    try {
      localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(newMessages));
    } catch (error) {
      console.error('Error saving chat history:', error);
    }
  }, []);

  // Update unread count when chat is closed
  useEffect(() => {
    if (!isOpen && messages.length > 0) {
      const lastUserMessageIndex = messages.findLastIndex(msg => msg.role === 'user');
      if (lastUserMessageIndex !== -1) {
        const unreadMessages = messages.slice(lastUserMessageIndex + 1).filter(msg => msg.role === 'assistant');
        setUnreadCount(unreadMessages.length);
      }
    } else if (isOpen) {
      setUnreadCount(0);
    }
  }, [isOpen, messages]);

  // Generate context-aware AI responses
  const generateResponse = (userMessage: string, contextPage: Page): ChatMessage => {
    const lowerMessage = userMessage.toLowerCase();
    let response = '';
    let suggestions: string[] = [];
    let data: ChatMessage['data'];

    // Navigation requests
    if (lowerMessage.includes('navigate') || lowerMessage.includes('go to') || lowerMessage.includes('show me')) {
      if (lowerMessage.includes('dashboard')) {
        response = `I'll take you to the Dashboard where you can see your overall AI visibility metrics and performance overview.`;
        data = { type: 'navigation', payload: 'dashboard' };
        if (onNavigate) onNavigate('dashboard');
      } else if (lowerMessage.includes('analytics') || lowerMessage.includes('advanced')) {
        response = `Opening Advanced Analytics for deep-dive analysis and detailed reporting.`;
        data = { type: 'navigation', payload: 'analytics' };
        if (onNavigate) onNavigate('analytics');
      } else if (lowerMessage.includes('keyword') || lowerMessage.includes('keywords')) {
        response = `Taking you to Keywords management where you can optimize your tracked terms.`;
        data = { type: 'navigation', payload: 'keywords' };
        if (onNavigate) onNavigate('keywords');
      } else if (lowerMessage.includes('competitor') || lowerMessage.includes('competitors')) {
        response = `Opening Competitors section for competitive analysis and benchmarking.`;
        data = { type: 'navigation', payload: 'competitors' };
        if (onNavigate) onNavigate('competitors');
      } else if (lowerMessage.includes('alert') || lowerMessage.includes('alerts')) {
        response = `Navigating to Alerts where you can set up monitoring rules and notifications.`;
        data = { type: 'navigation', payload: 'alerts' };
        if (onNavigate) onNavigate('alerts');
      } else if (lowerMessage.includes('report') || lowerMessage.includes('reports')) {
        response = `Opening Reports section for exporting and scheduled reporting.`;
        data = { type: 'navigation', payload: 'reports' };
        if (onNavigate) onNavigate('reports');
      } else if (lowerMessage.includes('setting') || lowerMessage.includes('settings')) {
        response = `Taking you to Settings to customize your account and preferences.`;
        data = { type: 'navigation', payload: 'settings' };
        if (onNavigate) onNavigate('settings');
      } else {
        response = `I can help you navigate to different sections:\n\n• **Dashboard** - Overview and key metrics\n• **Analytics** - Advanced analysis\n• **Keywords** - Manage tracked terms\n• **Competitors** - Competitive intelligence\n• **Alerts** - Set up monitoring\n• **Reports** - Export and scheduling\n• **Settings** - Account preferences\n\nWhich section would you like to visit?`;
      }
      suggestions = ['Dashboard', 'Analytics', 'Keywords', 'Competitors'];
    }
    // Context-specific responses based on current page
    else if (contextPage === 'dashboard' && (lowerMessage.includes('trend') || lowerMessage.includes('recent'))) {
      response = `Based on your dashboard data for ${appData.brandName}, here's what I see:\n\n• **Recent Growth**: 23% increase in AI mentions over the last 30 days\n• **Top Platforms**: ChatGPT (35% increase), Gemini (18% increase), Claude (12% increase)\n• **Sentiment Trend**: Generally positive with some opportunities for improvement\n\nThe growth correlates with your content strategy and increased market presence.`;
      suggestions = [
        'What caused the growth spike?',
        'How can we maintain this trend?',
        'Show competitor comparison'
      ];
    } else if (contextPage === 'analytics' && lowerMessage.includes('deep')) {
      response = `For advanced analytics on ${appData.brandName}, I recommend:\n\n**Deep-dive Analysis:**\n• Segment performance by platform and time period\n• Analyze sentiment patterns and triggers\n• Review keyword performance metrics\n• Compare competitor positioning\n\n**Next Steps:**\n• Use the filter panel to narrow down specific metrics\n• Export data for external analysis\n• Set up automated reports for regular insights`;
      suggestions = [
        'Set up custom filters',
        'Export current analysis',
        'Schedule regular reports'
      ];
    } else if (contextPage === 'keywords' && lowerMessage.includes('optimize')) {
      response = `To optimize your keyword strategy for ${appData.brandName}:\n\n**Current Keywords Analysis:**\n${appData.keywords.split(',').map((k, i) => `• ${k.trim()}`).join('\n')}\n\n**Optimization Suggestions:**\n• Add long-tail variations\n• Include brand-specific terms\n• Monitor competitor keywords\n• Track seasonal trends\n\n**Quick Actions:**\n• Add negative keywords to filter noise\n• Set up keyword performance alerts\n• Expand into related topics`;
      suggestions = [
        'Add new keyword suggestions',
        'Set up keyword alerts',
        'Analyze keyword performance'
      ];
    } else if (contextPage === 'alerts' && lowerMessage.includes('set up')) {
      response = `I can help you set up smart alerts for ${appData.brandName}:\n\n**Recommended Alert Types:**\n• **Mention Volume Spike** - When mentions increase >50%\n• **Sentiment Drop** - When positive sentiment falls below 70%\n• **Competitor Activity** - New competitor mentions detected\n• **Keyword Performance** - Track your target keywords\n\n**Alert Channels:**\n• Email notifications\n• In-app alerts\n• Webhook integrations\n\nWould you like me to help configure any of these?`;
      suggestions = [
        'Set up mention volume alert',
        'Configure sentiment monitoring',
        'Track competitor activity'
      ];
    }
    // General helpful responses
    else if (lowerMessage.includes('improve') || lowerMessage.includes('optimize')) {
      response = `Here are my top recommendations to improve ${appData.brandName}'s AI visibility:\n\n**Quick Wins (1-2 weeks):**\n1. **Content Optimization**\n   - Create FAQ content for common queries\n   - Publish success stories and case studies\n   - Optimize for AI model training data\n\n2. **Community Engagement**\n   - Increase forum participation\n   - Respond to brand mentions proactively\n   - Share expertise in relevant discussions\n\n**Medium-term Strategy:**\n3. **Thought Leadership**\n   - Research reports on industry trends\n   - Guest posts and speaking opportunities\n   - Strategic partnerships for exposure\n\nWant me to create a detailed action plan?`;
      suggestions = [
        'Create content optimization plan',
        'Show engagement opportunities',
        'Navigate to keyword optimization'
      ];
    } else if (lowerMessage.includes('competitor') || lowerMessage.includes('compare')) {
      response = `Based on competitive analysis for ${appData.brandName}:\n\n**Market Position:**\n• You're currently tracking ${appData.competitors?.length || 'several'} competitors\n• Your visibility score trends are showing positive momentum\n• Key opportunities in content volume and engagement\n\n**Competitive Insights:**\n• Monitor competitor content strategies\n• Track their mention volume and sentiment\n• Identify gaps in their coverage\n• Leverage their successful approaches\n\n**Next Steps:**\n• Review competitor performance in the Competitors section\n• Set up alerts for competitor activity\n• Analyze their keyword strategies`;
      suggestions = [
        'Open Competitors analysis',
        'Set up competitor alerts',
        'Compare keyword strategies'
      ];
    } else {
      // Generic helpful response with current page context
      const pageContext = {
        dashboard: 'your performance overview',
        analytics: 'advanced analytics and reporting',
        keywords: 'keyword management and optimization',
        competitors: 'competitive intelligence',
        alerts: 'monitoring and alert configuration',
        reports: 'reporting and data export',
        settings: 'account settings and preferences'
      };

      response = `I'm here to help you with ${pageContext[contextPage] || 'your AI visibility analysis'}!\n\n**I can assist with:**\n• **Performance Analysis** - Deep dive into metrics and trends\n• **Navigation** - Take you to any section of the platform\n• **Optimization** - Actionable improvement strategies\n• **Setup** - Configure alerts, keywords, and tracking\n• **Competitive Intelligence** - Compare with competitors\n\n**Current Context:** You're viewing the ${currentPage} section.\n\nWhat would you like to explore?`;

      suggestions = [
        'Analyze current performance',
        'Navigate to another section',
        'Get optimization tips',
        'Set up monitoring alerts'
      ];
    }

    return {
      id: Date.now().toString(),
      role: 'assistant',
      content: response,
      timestamp: new Date(),
      page: contextPage,
      suggestions,
      data
    };
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: new Date(),
      page: currentPage
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI thinking time
    setTimeout(() => {
      const assistantResponse = generateResponse(inputValue, currentPage);
      const finalMessages = [...newMessages, assistantResponse];
      setMessages(finalMessages);
      saveChatHistory(finalMessages);
      setIsTyping(false);
    }, 1200 + Math.random() * 800);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
    setTimeout(() => handleSendMessage(), 100);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const clearChatHistory = () => {
    const welcomeMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'assistant',
      content: `Chat history cleared! I'm here to help you with ${appData.brandName}'s AI visibility. What would you like to know?`,
      timestamp: new Date(),
      page: currentPage,
      suggestions: [
        'Show performance overview',
        'Navigate to Analytics',
        'Get optimization tips',
        'Set up alerts'
      ]
    };
    setMessages([welcomeMessage]);
    saveChatHistory([welcomeMessage]);
  };

  const toggleChat = () => {
    if (isMinimized && isOpen) {
      setIsMinimized(false);
    } else {
      setIsOpen(!isOpen);
      setIsMinimized(false);
    }
    if (!isOpen) {
      setUnreadCount(0);
    }
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <button
        onClick={toggleChat}
        className={`fixed bottom-20 right-6 z-50 p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-105 ${
          isOpen && !isMinimized
            ? 'bg-gray-600 text-white scale-95' 
            : 'bg-gradient-to-r from-brand-purple to-brand-pink text-white hover:shadow-xl'
        }`}
        aria-label="Toggle AI Assistant"
      >
        {isOpen && !isMinimized ? <IconX /> : <IconChat />}
        {unreadCount > 0 && !isOpen && (
          <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center animate-pulse">
            {unreadCount}
          </div>
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className={`fixed bottom-36 right-6 z-40 w-96 max-w-[90vw] transition-all duration-300 ${
          isMinimized ? 'h-14' : 'h-[600px] max-h-[80vh]'
        }`}>
          <Card className="h-full flex flex-col shadow-2xl border border-gray-200 dark:border-gray-700">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-brand-purple to-brand-pink rounded-full flex items-center justify-center">
                  <IconBrain className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    AI Assistant
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {currentPage.charAt(0).toUpperCase() + currentPage.slice(1)} • Online
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="success" size="sm">
                  Beta
                </Badge>
                <button
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
                  aria-label={isMinimized ? "Expand chat" : "Minimize chat"}
                >
                  {isMinimized ? <IconExpand /> : <IconMinimize />}
                </button>
              </div>
            </div>

            {!isMinimized && (
              <>
                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                          message.role === 'user'
                            ? 'bg-gradient-to-r from-brand-purple to-brand-pink text-white'
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white'
                        }`}
                      >
                        <div className="text-sm whitespace-pre-wrap">
                          {message.content}
                        </div>
                        
                        {message.role === 'assistant' && message.suggestions && (
                          <div className="mt-3 flex flex-wrap gap-2">
                            {message.suggestions.map((suggestion, index) => (
                              <button
                                key={index}
                                onClick={() => handleSuggestionClick(suggestion)}
                                className="px-2 py-1 text-xs bg-white/10 hover:bg-white/20 rounded-full transition-colors"
                              >
                                {suggestion}
                              </button>
                            ))}
                          </div>
                        )}
                        
                        <div className="flex items-center justify-between text-xs opacity-60 mt-1">
                          <span>
                            {message.timestamp.toLocaleTimeString([], { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </span>
                          {message.page && (
                            <span className="ml-2 px-1 py-0.5 bg-black/10 rounded text-xs">
                              {message.page}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}

                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl px-4 py-2">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex gap-2">
                    <input
                      ref={inputRef}
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder={`Ask about ${appData.brandName}'s visibility...`}
                      className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-purple bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      disabled={isTyping}
                    />
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={handleSendMessage}
                      disabled={!inputValue.trim() || isTyping}
                    >
                      <IconSend />
                    </Button>
                    <button
                      onClick={clearChatHistory}
                      className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                      title="Clear chat history"
                    >
                      <IconTrash className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
                    AI responses are contextual to your current page • Chat history is saved locally
                  </div>
                </div>
              </>
            )}
          </Card>
        </div>
      )}
    </>
  );
};

// Icon components
const IconChat = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
  </svg>
);

const IconX = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const IconBrain = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
  </svg>
);

const IconSend = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
  </svg>
);

const IconMinimize = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
  </svg>
);

const IconExpand = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
  </svg>
);

const IconTrash = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

export default FloatingChatBot;