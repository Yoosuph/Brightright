import React, { useState, useRef, useEffect } from 'react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Badge from './ui/Badge';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  suggestions?: string[];
  data?: {
    type: 'chart' | 'metric' | 'insight' | 'action';
    payload: unknown;
  };
}

interface ChatAssistantProps {
  brandName: string;
  onActionRequest?: (action: string, params?: unknown) => void;
}

const ChatAssistant: React.FC<ChatAssistantProps> = ({ 
  brandName, 
  onActionRequest 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: `Hi! I'm your AI visibility assistant. I can help you analyze ${brandName}'s performance, explain trends, and suggest optimization strategies. What would you like to know?`,
      timestamp: new Date(),
      suggestions: [
        'Show me recent mention trends',
        'Why did sentiment drop last week?',
        'How do I improve visibility?',
        'Compare with competitors'
      ]
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
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

  // Mock AI responses based on common queries
  const generateResponse = (userMessage: string): ChatMessage => {
    const lowerMessage = userMessage.toLowerCase();
    let response = '';
    let suggestions: string[] = [];
    let data: ChatMessage['data'];

    if (lowerMessage.includes('trend') || lowerMessage.includes('recent')) {
      response = `Based on the last 30 days, ${brandName} has seen a 23% increase in AI mentions. The growth is primarily driven by positive discussions about your recent features. Here's what I found:

• **ChatGPT mentions**: Up 35% (mostly positive sentiment)
• **Gemini mentions**: Up 18% (mixed sentiment)
• **Claude mentions**: Up 12% (neutral to positive)

The spike correlates with your recent product announcements and increased content marketing efforts.`;
      
      suggestions = [
        'What caused the ChatGPT spike?',
        'How can we improve Gemini sentiment?',
        'Show competitor comparison'
      ];

      data = {
        type: 'chart',
        payload: { chartType: 'trend', period: '30d' }
      };
    } else if (lowerMessage.includes('sentiment') || lowerMessage.includes('drop')) {
      response = `I analyzed the sentiment patterns for ${brandName} and found that the recent sentiment shift was primarily due to:

**Main Factors:**
1. **Customer Support Issues** (40% of negative mentions)
   - Response time concerns
   - Technical issue resolution
   
2. **Feature Requests** (35% of neutral/negative mentions)
   - Users asking for specific integrations
   - Mobile app improvements

3. **Pricing Discussions** (25%)
   - Competitive pricing comparisons
   - Value proposition questions

**Recommendation:** Focus on improving customer support response times and create content addressing common feature requests.`;

      suggestions = [
        'How to improve customer support mentions?',
        'Show specific feature requests',
        'Create action plan'
      ];
    } else if (lowerMessage.includes('improve') || lowerMessage.includes('optimize')) {
      response = `Here are my top recommendations to improve ${brandName}'s AI visibility:

**Quick Wins (1-2 weeks):**
1. **Content Optimization**
   - Create FAQ content for common user queries
   - Publish case studies highlighting successful outcomes
   - Optimize existing content for AI model training data

2. **Community Engagement**
   - Increase activity in relevant forums and communities
   - Respond to brand mentions proactively
   - Share expertise in AI/analytics discussions

**Medium-term (1-3 months):**
3. **Thought Leadership**
   - Publish research reports on AI visibility trends
   - Guest posts on industry publications
   - Speak at relevant conferences

4. **Strategic Partnerships**
   - Collaborate with complementary tools
   - Integration partnerships for broader exposure

Would you like me to create a detailed action plan for any of these?`;

      suggestions = [
        'Create content optimization plan',
        'Show community engagement opportunities',
        'Generate thought leadership topics'
      ];
    } else if (lowerMessage.includes('competitor') || lowerMessage.includes('compare')) {
      response = `Here's how ${brandName} compares to your main competitors in AI visibility:

**Your Position: #2 overall**

**Competitor Analysis:**
• **Competitor A**: 67% visibility (↑5% vs last month)
  - Strengths: Brand recognition, content volume
  - Weakness: Lower engagement rates
  
• **${brandName}**: 72% visibility (↑8% vs last month) 🎉
  - Strengths: High engagement, positive sentiment
  - Opportunity: Increase content volume
  
• **Competitor B**: 58% visibility (↓2% vs last month)
  - Strengths: Technical authority
  - Weakness: Limited market reach

**Key Insight:** You're outpacing competitors in engagement quality. Focus on scaling content production to capture more share.`;

      suggestions = [
        'How to increase content volume?',
        'Analyze competitor content strategy',
        'Show gap analysis'
      ];
    } else {
      // Generic helpful response
      response = `I understand you're asking about "${userMessage}". Let me help you with that.

I can assist you with:
• **Performance Analysis** - Deep dive into metrics and trends
• **Competitive Intelligence** - Compare with competitors
• **Optimization Recommendations** - Actionable improvement strategies
• **Content Strategy** - Ideas for better AI visibility
• **Alert Setup** - Monitor important changes

What specific aspect would you like to explore?`;

      suggestions = [
        'Analyze my performance metrics',
        'Show competitive insights',
        'Get optimization recommendations',
        'Help with content strategy'
      ];
    }

    return {
      id: Date.now().toString(),
      role: 'assistant',
      content: response,
      timestamp: new Date(),
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
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI thinking time
    setTimeout(() => {
      const assistantResponse = generateResponse(inputValue);
      setMessages(prev => [...prev, assistantResponse]);
      setIsTyping(false);
    }, 1500 + Math.random() * 1000);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
    handleSendMessage();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-50 p-4 rounded-full shadow-lg transition-all duration-300 ${
          isOpen 
            ? 'bg-gray-600 text-white scale-95' 
            : 'bg-brand-purple text-white hover:bg-brand-purple/90 hover:scale-105'
        }`}
        aria-label="Toggle AI Assistant"
      >
        {isOpen ? <IconX /> : <IconChat />}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-40 w-96 h-[600px] max-w-[90vw] max-h-[80vh]">
          <Card className="h-full flex flex-col shadow-2xl border border-gray-200 dark:border-gray-700">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-brand-purple rounded-full flex items-center justify-center">
                  <IconBrain className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    AI Assistant
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Online
                  </p>
                </div>
              </div>
              <Badge variant="success" size="sm">
                Beta
              </Badge>
            </div>

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
                        ? 'bg-brand-purple text-white'
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
                    
                    <div className="text-xs opacity-60 mt-1">
                      {message.timestamp.toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
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
                  placeholder="Ask about your AI visibility..."
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
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
                AI responses are generated for demo purposes
              </div>
            </div>
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

export default ChatAssistant;