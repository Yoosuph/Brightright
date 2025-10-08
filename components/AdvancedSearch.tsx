import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import Button from './Button';

interface SearchResult {
  id: string;
  type: 'mention' | 'keyword' | 'competitor' | 'insight' | 'report';
  title: string;
  content: string;
  platform?: string;
  sentiment?: 'positive' | 'neutral' | 'negative';
  date?: string;
  score?: number;
  metadata?: Record<string, any>;
}

interface SearchFilters {
  type: string[];
  platform: string[];
  sentiment: string[];
  dateRange: {
    start?: Date;
    end?: Date;
  };
  scoreRange: {
    min: number;
    max: number;
  };
}

interface AdvancedSearchProps {
  data: SearchResult[];
  onResultSelect?: (result: SearchResult) => void;
  onSearchStateChange?: (isActive: boolean) => void;
  placeholder?: string;
  maxResults?: number;
  enableHighlighting?: boolean;
  enableSavedSearches?: boolean;
}

const IconSearch: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const IconFilter: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
  </svg>
);

const IconX: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const IconBookmark: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
  </svg>
);

const IconChevronDown: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </svg>
);

const highlightText = (text: string, query: string): string => {
  if (!query.trim()) return text;
  
  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  return text.replace(regex, '<mark class="bg-yellow-200 dark:bg-yellow-800 px-1 rounded">$1</mark>');
};

const AdvancedSearch: React.FC<AdvancedSearchProps> = ({
  data,
  onResultSelect,
  onSearchStateChange,
  placeholder = "Search mentions, keywords, competitors...",
  maxResults = 50,
  enableHighlighting = true,
  enableSavedSearches = true,
}) => {
  const [query, setQuery] = useState('');
  const [isActive, setIsActive] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [showSavedSearches, setShowSavedSearches] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [savedSearches, setSavedSearches] = useState<Array<{name: string; query: string; filters: SearchFilters}>>([]);
  
  const resultsPerPage = 10;
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [filters, setFilters] = useState<SearchFilters>({
    type: [],
    platform: [],
    sentiment: [],
    dateRange: {},
    scoreRange: { min: 0, max: 100 },
  });

  // Search logic with fuzzy matching and scoring
  const searchResults = useMemo(() => {
    if (!query.trim() && Object.values(filters).every(f => 
      Array.isArray(f) ? f.length === 0 : (f.min === 0 && f.max === 100) || Object.keys(f).length === 0
    )) {
      return [];
    }

    let results = data.filter(item => {
      // Text search
      const textMatch = !query.trim() || 
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.content.toLowerCase().includes(query.toLowerCase());

      // Type filter
      const typeMatch = filters.type.length === 0 || filters.type.includes(item.type);

      // Platform filter
      const platformMatch = filters.platform.length === 0 || 
        !item.platform || filters.platform.includes(item.platform);

      // Sentiment filter
      const sentimentMatch = filters.sentiment.length === 0 || 
        !item.sentiment || filters.sentiment.includes(item.sentiment);

      // Date range filter
      const dateMatch = !filters.dateRange.start && !filters.dateRange.end ||
        !item.date ||
        (new Date(item.date) >= (filters.dateRange.start || new Date(0)) &&
         new Date(item.date) <= (filters.dateRange.end || new Date()));

      // Score range filter
      const scoreMatch = !item.score || 
        (item.score >= filters.scoreRange.min && item.score <= filters.scoreRange.max);

      return textMatch && typeMatch && platformMatch && sentimentMatch && dateMatch && scoreMatch;
    });

    // Sort by relevance
    if (query.trim()) {
      results = results.map(item => {
        let score = 0;
        const queryLower = query.toLowerCase();
        const titleLower = item.title.toLowerCase();
        const contentLower = item.content.toLowerCase();

        // Exact title match gets highest score
        if (titleLower === queryLower) score += 100;
        else if (titleLower.startsWith(queryLower)) score += 50;
        else if (titleLower.includes(queryLower)) score += 25;

        // Content matches
        if (contentLower.includes(queryLower)) score += 10;

        // Boost recent results
        if (item.date) {
          const daysSince = (Date.now() - new Date(item.date).getTime()) / (1000 * 60 * 60 * 24);
          score += Math.max(0, 10 - daysSince);
        }

        return { ...item, searchScore: score };
      }).sort((a, b) => (b.searchScore || 0) - (a.searchScore || 0));
    }

    return results.slice(0, maxResults);
  }, [query, filters, data, maxResults]);

  // Pagination
  const totalPages = Math.ceil(searchResults.length / resultsPerPage);
  const paginatedResults = searchResults.slice(
    (currentPage - 1) * resultsPerPage,
    currentPage * resultsPerPage
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsActive(false);
        setShowFilters(false);
        setShowSavedSearches(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    onSearchStateChange?.(isActive);
  }, [isActive, onSearchStateChange]);

  useEffect(() => {
    // Load saved searches from localStorage
    if (enableSavedSearches) {
      const saved = localStorage.getItem('advanced-search-saved');
      if (saved) {
        try {
          setSavedSearches(JSON.parse(saved));
        } catch (error) {
          console.error('Failed to load saved searches:', error);
        }
      }
    }
  }, [enableSavedSearches]);

  useEffect(() => {
    setCurrentPage(1);
  }, [query, filters]);

  const handleInputFocus = () => {
    setIsActive(true);
  };

  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleFilterChange = useCallback((key: keyof SearchFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
    }));
  }, []);

  const clearSearch = () => {
    setQuery('');
    setFilters({
      type: [],
      platform: [],
      sentiment: [],
      dateRange: {},
      scoreRange: { min: 0, max: 100 },
    });
    setCurrentPage(1);
  };

  const saveCurrentSearch = () => {
    if (!query.trim()) return;

    const searchName = prompt('Enter a name for this search:');
    if (!searchName) return;

    const newSearch = {
      name: searchName,
      query,
      filters: { ...filters },
    };

    const updatedSearches = [...savedSearches.filter(s => s.name !== searchName), newSearch];
    setSavedSearches(updatedSearches);
    
    if (enableSavedSearches) {
      localStorage.setItem('advanced-search-saved', JSON.stringify(updatedSearches));
    }
  };

  const loadSavedSearch = (search: {name: string; query: string; filters: SearchFilters}) => {
    setQuery(search.query);
    setFilters(search.filters);
    setShowSavedSearches(false);
    inputRef.current?.focus();
  };

  const deleteSavedSearch = (searchName: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updatedSearches = savedSearches.filter(s => s.name !== searchName);
    setSavedSearches(updatedSearches);
    
    if (enableSavedSearches) {
      localStorage.setItem('advanced-search-saved', JSON.stringify(updatedSearches));
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'mention': return '💬';
      case 'keyword': return '🏷️';
      case 'competitor': return '🏢';
      case 'insight': return '💡';
      case 'report': return '📊';
      default: return '📄';
    }
  };

  const getSentimentColor = (sentiment?: string) => {
    switch (sentiment) {
      case 'positive': return 'text-green-600 bg-green-100 dark:bg-green-900/20 dark:text-green-400';
      case 'negative': return 'text-red-600 bg-red-100 dark:bg-red-900/20 dark:text-red-400';
      case 'neutral': return 'text-gray-600 bg-gray-100 dark:bg-gray-800 dark:text-gray-400';
      default: return '';
    }
  };

  const hasActiveFilters = Object.values(filters).some(f => 
    Array.isArray(f) ? f.length > 0 : 
    (f.min !== 0 || f.max !== 100) || Object.keys(f).length > 0
  );

  return (
    <div ref={searchRef} className="relative w-full max-w-4xl">
      {/* Search Input */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <IconSearch className="h-5 w-5 text-gray-400" />
        </div>
        
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleQueryChange}
          onFocus={handleInputFocus}
          placeholder={placeholder}
          className="w-full pl-10 pr-20 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-dark-card text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-brand-purple focus:border-transparent transition-all duration-200"
        />

        <div className="absolute inset-y-0 right-0 flex items-center space-x-2 pr-3">
          {enableSavedSearches && savedSearches.length > 0 && (
            <button
              onClick={() => setShowSavedSearches(!showSavedSearches)}
              className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
              title="Saved searches"
            >
              <IconBookmark className="h-4 w-4" />
            </button>
          )}
          
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`p-1 transition-colors ${
              hasActiveFilters 
                ? 'text-brand-purple' 
                : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'
            }`}
            title="Filters"
          >
            <IconFilter className="h-4 w-4" />
          </button>

          {(query || hasActiveFilters) && (
            <button
              onClick={clearSearch}
              className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
              title="Clear search"
            >
              <IconX className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Search Results Panel */}
      {isActive && (query || hasActiveFilters || showFilters || showSavedSearches) && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-dark-card border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl z-50 max-h-96 overflow-hidden">
          {/* Filters Panel */}
          {showFilters && (
            <div className="border-b border-gray-200 dark:border-gray-700 p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Type Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Type
                  </label>
                  <div className="space-y-1">
                    {['mention', 'keyword', 'competitor', 'insight', 'report'].map(type => (
                      <label key={type} className="flex items-center space-x-2 text-sm">
                        <input
                          type="checkbox"
                          checked={filters.type.includes(type)}
                          onChange={(e) => {
                            const newTypes = e.target.checked
                              ? [...filters.type, type]
                              : filters.type.filter(t => t !== type);
                            handleFilterChange('type', newTypes);
                          }}
                          className="rounded border-gray-300 text-brand-purple focus:ring-brand-purple"
                        />
                        <span className="capitalize">{type}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Platform Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Platform
                  </label>
                  <div className="space-y-1">
                    {['ChatGPT', 'Claude', 'Gemini', 'Bing Chat'].map(platform => (
                      <label key={platform} className="flex items-center space-x-2 text-sm">
                        <input
                          type="checkbox"
                          checked={filters.platform.includes(platform)}
                          onChange={(e) => {
                            const newPlatforms = e.target.checked
                              ? [...filters.platform, platform]
                              : filters.platform.filter(p => p !== platform);
                            handleFilterChange('platform', newPlatforms);
                          }}
                          className="rounded border-gray-300 text-brand-purple focus:ring-brand-purple"
                        />
                        <span>{platform}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Sentiment Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Sentiment
                  </label>
                  <div className="space-y-1">
                    {['positive', 'neutral', 'negative'].map(sentiment => (
                      <label key={sentiment} className="flex items-center space-x-2 text-sm">
                        <input
                          type="checkbox"
                          checked={filters.sentiment.includes(sentiment)}
                          onChange={(e) => {
                            const newSentiments = e.target.checked
                              ? [...filters.sentiment, sentiment]
                              : filters.sentiment.filter(s => s !== sentiment);
                            handleFilterChange('sentiment', newSentiments);
                          }}
                          className="rounded border-gray-300 text-brand-purple focus:ring-brand-purple"
                        />
                        <span className="capitalize">{sentiment}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col space-y-2">
                  <Button
                    onClick={saveCurrentSearch}
                    variant="secondary"
                    size="sm"
                    disabled={!query.trim()}
                  >
                    Save Search
                  </Button>
                  {hasActiveFilters && (
                    <button
                      onClick={clearSearch}
                      className="text-sm text-red-600 hover:text-red-800 underline"
                    >
                      Clear Filters
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Saved Searches Panel */}
          {showSavedSearches && savedSearches.length > 0 && (
            <div className="border-b border-gray-200 dark:border-gray-700 p-4">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Saved Searches
              </h4>
              <div className="space-y-1">
                {savedSearches.map(search => (
                  <div
                    key={search.name}
                    className="flex items-center justify-between p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
                    onClick={() => loadSavedSearch(search)}
                  >
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {search.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        "{search.query}"
                      </p>
                    </div>
                    <button
                      onClick={(e) => deleteSavedSearch(search.name, e)}
                      className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                    >
                      <IconX className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Results */}
          {searchResults.length > 0 ? (
            <div className="max-h-64 overflow-y-auto">
              {paginatedResults.map(result => (
                <div
                  key={result.id}
                  className="p-3 border-b border-gray-100 dark:border-gray-700 last:border-b-0 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors"
                  onClick={() => onResultSelect?.(result)}
                >
                  <div className="flex items-start space-x-3">
                    <span className="text-lg flex-shrink-0 mt-0.5">
                      {getTypeIcon(result.type)}
                    </span>
                    
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {enableHighlighting ? (
                          <span dangerouslySetInnerHTML={{ 
                            __html: highlightText(result.title, query) 
                          }} />
                        ) : (
                          result.title
                        )}
                      </h4>
                      
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                        {enableHighlighting ? (
                          <span dangerouslySetInnerHTML={{ 
                            __html: highlightText(result.content, query) 
                          }} />
                        ) : (
                          result.content
                        )}
                      </p>

                      <div className="flex items-center space-x-2 mt-2">
                        {result.platform && (
                          <span className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-400 rounded-full">
                            {result.platform}
                          </span>
                        )}
                        
                        {result.sentiment && (
                          <span className={`text-xs px-2 py-1 rounded-full ${getSentimentColor(result.sentiment)}`}>
                            {result.sentiment}
                          </span>
                        )}

                        {result.date && (
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {new Date(result.date).toLocaleDateString()}
                          </span>
                        )}

                        {result.score !== undefined && (
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            Score: {result.score}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="p-3 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Showing {((currentPage - 1) * resultsPerPage) + 1}-{Math.min(currentPage * resultsPerPage, searchResults.length)} of {searchResults.length}
                  </p>
                  
                  <div className="flex space-x-1">
                    <button
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (query || hasActiveFilters) && (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400">
              <IconSearch className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-sm">No results found for "{query}"</p>
              <p className="text-xs mt-1">Try adjusting your search terms or filters</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdvancedSearch;