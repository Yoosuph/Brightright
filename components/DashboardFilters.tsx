import React, { useState, useEffect, useRef } from 'react';
import Button from './Button';

interface DateRange {
  start: Date;
  end: Date;
}

interface FilterState {
  dateRange: DateRange;
  platforms: string[];
  sentiments: string[];
  keywords: string[];
  competitors: string[];
  presetName?: string;
}

interface DashboardFiltersProps {
  onFiltersChange: (filters: FilterState) => void;
  availableKeywords?: string[];
  availableCompetitors?: string[];
  initialFilters?: Partial<FilterState>;
}

const IconFilter: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
  </svg>
);

const IconCalendar: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const IconChevronDown: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </svg>
);

const IconX: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const IconSave: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
  </svg>
);

const PRESET_RANGES = [
  { label: 'Last 7 Days', days: 7 },
  { label: 'Last 30 Days', days: 30 },
  { label: 'Last 3 Months', days: 90 },
  { label: 'Last 6 Months', days: 180 },
  { label: 'This Year', days: 365 },
];

const PLATFORMS = ['ChatGPT', 'Claude', 'Gemini', 'Bing Chat', 'Perplexity'];
const SENTIMENTS = ['Positive', 'Neutral', 'Negative'];

const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

const DashboardFilters: React.FC<DashboardFiltersProps> = ({
  onFiltersChange,
  availableKeywords = [],
  availableCompetitors = [],
  initialFilters,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showPresetSave, setShowPresetSave] = useState(false);
  const [presetName, setPresetName] = useState('');
  const [savedPresets, setSavedPresets] = useState<Array<{ name: string; filters: FilterState }>>([]);
  
  const datePickerRef = useRef<HTMLDivElement>(null);
  const presetSaveRef = useRef<HTMLDivElement>(null);

  const [filters, setFilters] = useState<FilterState>({
    dateRange: {
      start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
      end: new Date(),
    },
    platforms: [],
    sentiments: [],
    keywords: [],
    competitors: [],
    ...initialFilters,
  });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (datePickerRef.current && !datePickerRef.current.contains(event.target as Node)) {
        setShowDatePicker(false);
      }
      if (presetSaveRef.current && !presetSaveRef.current.contains(event.target as Node)) {
        setShowPresetSave(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    // Load saved presets from localStorage
    const saved = localStorage.getItem('dashboard-filter-presets');
    if (saved) {
      try {
        setSavedPresets(JSON.parse(saved));
      } catch (error) {
        console.error('Failed to load filter presets:', error);
      }
    }
  }, []);

  useEffect(() => {
    onFiltersChange(filters);
  }, [filters, onFiltersChange]);

  const updateFilters = (updates: Partial<FilterState>) => {
    setFilters(prev => ({ ...prev, ...updates, presetName: undefined }));
  };

  const handleDateRangePreset = (days: number) => {
    const end = new Date();
    const start = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    updateFilters({ dateRange: { start, end } });
    setShowDatePicker(false);
  };

  const handleDateRangeCustom = (start: string, end: string) => {
    updateFilters({
      dateRange: {
        start: new Date(start),
        end: new Date(end),
      },
    });
  };

  const toggleArrayFilter = (array: string[], value: string, key: keyof FilterState) => {
    const newArray = array.includes(value)
      ? array.filter(item => item !== value)
      : [...array, value];
    updateFilters({ [key]: newArray });
  };

  const clearAllFilters = () => {
    setFilters({
      dateRange: {
        start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        end: new Date(),
      },
      platforms: [],
      sentiments: [],
      keywords: [],
      competitors: [],
    });
  };

  const savePreset = () => {
    if (!presetName.trim()) return;

    const newPreset = {
      name: presetName.trim(),
      filters: { ...filters, presetName: presetName.trim() },
    };

    const updatedPresets = [...savedPresets.filter(p => p.name !== presetName.trim()), newPreset];
    setSavedPresets(updatedPresets);
    localStorage.setItem('dashboard-filter-presets', JSON.stringify(updatedPresets));
    
    setPresetName('');
    setShowPresetSave(false);
    updateFilters({ presetName: newPreset.name });
  };

  const loadPreset = (preset: { name: string; filters: FilterState }) => {
    setFilters(preset.filters);
  };

  const deletePreset = (presetName: string) => {
    const updatedPresets = savedPresets.filter(p => p.name !== presetName);
    setSavedPresets(updatedPresets);
    localStorage.setItem('dashboard-filter-presets', JSON.stringify(updatedPresets));
  };

  const hasActiveFilters = 
    filters.platforms.length > 0 ||
    filters.sentiments.length > 0 ||
    filters.keywords.length > 0 ||
    filters.competitors.length > 0;

  return (
    <div className="bg-white dark:bg-dark-card border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm">
      {/* Filter Header */}
      <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100"
            >
              <IconFilter className="h-4 w-4" />
              <span>Filters</span>
              <IconChevronDown className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
            </button>
            
            {hasActiveFilters && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-brand-purple/10 text-brand-purple">
                Active
              </span>
            )}

            {filters.presetName && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">
                {filters.presetName}
              </span>
            )}
          </div>

          <div className="flex items-center space-x-2">
            {/* Date Range Display */}
            <div className="relative" ref={datePickerRef}>
              <button
                onClick={() => setShowDatePicker(!showDatePicker)}
                className="flex items-center space-x-2 px-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-800 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                <IconCalendar className="h-4 w-4" />
                <span>
                  {formatDate(filters.dateRange.start)} - {formatDate(filters.dateRange.end)}
                </span>
              </button>

              {showDatePicker && (
                <div className="absolute top-full right-0 mt-2 w-80 bg-white dark:bg-dark-card border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50">
                  <div className="p-4">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-3">Date Range</h4>
                    
                    {/* Preset Ranges */}
                    <div className="space-y-2 mb-4">
                      {PRESET_RANGES.map(preset => (
                        <button
                          key={preset.label}
                          onClick={() => handleDateRangePreset(preset.days)}
                          className="w-full text-left px-3 py-2 text-sm rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        >
                          {preset.label}
                        </button>
                      ))}
                    </div>

                    {/* Custom Range */}
                    <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                      <h5 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Custom Range</h5>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">Start Date</label>
                          <input
                            type="date"
                            value={formatDate(filters.dateRange.start)}
                            onChange={(e) => handleDateRangeCustom(e.target.value, formatDate(filters.dateRange.end))}
                            className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">End Date</label>
                          <input
                            type="date"
                            value={formatDate(filters.dateRange.end)}
                            onChange={(e) => handleDateRangeCustom(formatDate(filters.dateRange.start), e.target.value)}
                            className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {hasActiveFilters && (
              <button
                onClick={clearAllFilters}
                className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 underline"
              >
                Clear All
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Expanded Filters */}
      {isExpanded && (
        <div className="px-4 py-4 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Platform Filter */}
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">Platforms</h4>
              <div className="space-y-1">
                {PLATFORMS.map(platform => (
                  <label key={platform} className="flex items-center space-x-2 text-sm">
                    <input
                      type="checkbox"
                      checked={filters.platforms.includes(platform)}
                      onChange={() => toggleArrayFilter(filters.platforms, platform, 'platforms')}
                      className="rounded border-gray-300 text-brand-purple focus:ring-brand-purple"
                    />
                    <span className="text-gray-700 dark:text-gray-300">{platform}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Sentiment Filter */}
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">Sentiment</h4>
              <div className="space-y-1">
                {SENTIMENTS.map(sentiment => (
                  <label key={sentiment} className="flex items-center space-x-2 text-sm">
                    <input
                      type="checkbox"
                      checked={filters.sentiments.includes(sentiment)}
                      onChange={() => toggleArrayFilter(filters.sentiments, sentiment, 'sentiments')}
                      className="rounded border-gray-300 text-brand-purple focus:ring-brand-purple"
                    />
                    <span className="text-gray-700 dark:text-gray-300">{sentiment}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Keywords Filter */}
            {availableKeywords.length > 0 && (
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Keywords</h4>
                <div className="space-y-1 max-h-32 overflow-y-auto">
                  {availableKeywords.map(keyword => (
                    <label key={keyword} className="flex items-center space-x-2 text-sm">
                      <input
                        type="checkbox"
                        checked={filters.keywords.includes(keyword)}
                        onChange={() => toggleArrayFilter(filters.keywords, keyword, 'keywords')}
                        className="rounded border-gray-300 text-brand-purple focus:ring-brand-purple"
                      />
                      <span className="text-gray-700 dark:text-gray-300">{keyword}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Competitors Filter */}
            {availableCompetitors.length > 0 && (
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Competitors</h4>
                <div className="space-y-1">
                  {availableCompetitors.map(competitor => (
                    <label key={competitor} className="flex items-center space-x-2 text-sm">
                      <input
                        type="checkbox"
                        checked={filters.competitors.includes(competitor)}
                        onChange={() => toggleArrayFilter(filters.competitors, competitor, 'competitors')}
                        className="rounded border-gray-300 text-brand-purple focus:ring-brand-purple"
                      />
                      <span className="text-gray-700 dark:text-gray-300">{competitor}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Preset Management */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium text-gray-900 dark:text-white">Filter Presets</h4>
              <div className="relative" ref={presetSaveRef}>
                <Button
                  onClick={() => setShowPresetSave(!showPresetSave)}
                  variant="secondary"
                  size="sm"
                >
                  <IconSave className="h-4 w-4 mr-1" />
                  Save Preset
                </Button>

                {showPresetSave && (
                  <div className="absolute top-full right-0 mt-2 w-64 bg-white dark:bg-dark-card border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50 p-3">
                    <input
                      type="text"
                      value={presetName}
                      onChange={(e) => setPresetName(e.target.value)}
                      placeholder="Enter preset name..."
                      className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white mb-2"
                      onKeyPress={(e) => e.key === 'Enter' && savePreset()}
                    />
                    <div className="flex space-x-2">
                      <Button onClick={savePreset} size="sm" disabled={!presetName.trim()}>
                        Save
                      </Button>
                      <Button onClick={() => setShowPresetSave(false)} variant="secondary" size="sm">
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {savedPresets.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {savedPresets.map(preset => (
                  <div
                    key={preset.name}
                    className={`flex items-center space-x-2 px-3 py-1.5 rounded-full text-sm border transition-colors ${
                      filters.presetName === preset.name
                        ? 'bg-brand-purple text-white border-brand-purple'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-700'
                    }`}
                  >
                    <button
                      onClick={() => loadPreset(preset)}
                      className="hover:underline"
                    >
                      {preset.name}
                    </button>
                    <button
                      onClick={() => deletePreset(preset.name)}
                      className="hover:text-red-500"
                    >
                      <IconX className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardFilters;