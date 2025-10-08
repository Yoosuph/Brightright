import React, { useState, useRef } from 'react';
import Button from './Button';

interface ExportOptions {
  format: 'csv' | 'xlsx' | 'pdf' | 'json';
  dateRange: {
    start: Date;
    end: Date;
  };
  includeCharts: boolean;
  includeSummary: boolean;
  includeDetails: boolean;
  platforms: string[];
  dataTypes: string[];
}

interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  sections: Array<{
    type: 'summary' | 'chart' | 'table' | 'insights';
    title: string;
    config: Record<string, any>;
  }>;
  schedule?: {
    frequency: 'daily' | 'weekly' | 'monthly';
    dayOfWeek?: number; // 0-6 for weekly
    dayOfMonth?: number; // 1-31 for monthly
    time: string; // HH:mm format
    enabled: boolean;
  };
  recipients: string[];
  createdAt: Date;
  lastRun?: Date;
}

interface ExportReportingProps {
  data: any[];
  brandName: string;
  onExport?: (options: ExportOptions) => Promise<Blob>;
  onScheduleReport?: (template: ReportTemplate) => void;
  onSendReport?: (template: ReportTemplate, recipients: string[]) => void;
}

const IconDownload: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-4-4m4 4l4-4m-4-8V3" />
  </svg>
);

const IconMail: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

const IconCalendar: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const IconTemplate: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

// Export format selector
const ExportFormatSelector: React.FC<{
  format: string;
  onFormatChange: (format: 'csv' | 'xlsx' | 'pdf' | 'json') => void;
}> = ({ format, onFormatChange }) => {
  const formats = [
    { value: 'csv', label: 'CSV', description: 'Comma-separated values for spreadsheets' },
    { value: 'xlsx', label: 'Excel', description: 'Microsoft Excel format with formatting' },
    { value: 'pdf', label: 'PDF', description: 'Formatted report with charts and summaries' },
    { value: 'json', label: 'JSON', description: 'Raw data in JSON format for developers' },
  ];

  return (
    <div className="space-y-2">
      <h4 className="font-medium text-gray-900 dark:text-white">Export Format</h4>
      <div className="grid grid-cols-2 gap-3">
        {formats.map(f => (
          <label
            key={f.value}
            className={`flex items-center space-x-3 p-3 border rounded-lg cursor-pointer transition-colors ${
              format === f.value
                ? 'border-brand-purple bg-brand-purple/5'
                : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
            }`}
          >
            <input
              type="radio"
              name="export-format"
              value={f.value}
              checked={format === f.value}
              onChange={() => onFormatChange(f.value as any)}
              className="sr-only"
            />
            <div className="flex-1">
              <div className="font-medium text-gray-900 dark:text-white">{f.label}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">{f.description}</div>
            </div>
            {format === f.value && (
              <svg className="h-5 w-5 text-brand-purple" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            )}
          </label>
        ))}
      </div>
    </div>
  );
};

// Quick export component
const QuickExport: React.FC<{
  onExport: (options: ExportOptions) => Promise<void>;
  isLoading: boolean;
}> = ({ onExport, isLoading }) => {
  const [options, setOptions] = useState<ExportOptions>({
    format: 'pdf',
    dateRange: {
      start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
      end: new Date(),
    },
    includeCharts: true,
    includeSummary: true,
    includeDetails: false,
    platforms: [],
    dataTypes: [],
  });

  const handleExport = async () => {
    try {
      await onExport(options);
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <IconDownload className="h-6 w-6 text-brand-purple" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Quick Export</h3>
      </div>

      <ExportFormatSelector 
        format={options.format}
        onFormatChange={(format) => setOptions(prev => ({ ...prev, format }))}
      />

      {/* Date Range */}
      <div className="space-y-2">
        <h4 className="font-medium text-gray-900 dark:text-white">Date Range</h4>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Start Date</label>
            <input
              type="date"
              value={options.dateRange.start.toISOString().split('T')[0]}
              onChange={(e) => setOptions(prev => ({
                ...prev,
                dateRange: { ...prev.dateRange, start: new Date(e.target.value) }
              }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">End Date</label>
            <input
              type="date"
              value={options.dateRange.end.toISOString().split('T')[0]}
              onChange={(e) => setOptions(prev => ({
                ...prev,
                dateRange: { ...prev.dateRange, end: new Date(e.target.value) }
              }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            />
          </div>
        </div>
      </div>

      {/* Content Options */}
      {options.format === 'pdf' && (
        <div className="space-y-2">
          <h4 className="font-medium text-gray-900 dark:text-white">Include Content</h4>
          <div className="space-y-2">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={options.includeSummary}
                onChange={(e) => setOptions(prev => ({ ...prev, includeSummary: e.target.checked }))}
                className="rounded border-gray-300 text-brand-purple focus:ring-brand-purple"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">Executive Summary</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={options.includeCharts}
                onChange={(e) => setOptions(prev => ({ ...prev, includeCharts: e.target.checked }))}
                className="rounded border-gray-300 text-brand-purple focus:ring-brand-purple"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">Charts & Visualizations</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={options.includeDetails}
                onChange={(e) => setOptions(prev => ({ ...prev, includeDetails: e.target.checked }))}
                className="rounded border-gray-300 text-brand-purple focus:ring-brand-purple"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">Detailed Mention List</span>
            </label>
          </div>
        </div>
      )}

      <Button
        onClick={handleExport}
        disabled={isLoading}
        className="w-full"
      >
        {isLoading ? (
          <span className="flex items-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Generating Export...
          </span>
        ) : (
          <span className="flex items-center">
            <IconDownload className="h-5 w-5 mr-2" />
            Export {options.format.toUpperCase()}
          </span>
        )}
      </Button>
    </div>
  );
};

// Report template manager
const ReportTemplateManager: React.FC<{
  templates: ReportTemplate[];
  onCreateTemplate: (template: Omit<ReportTemplate, 'id' | 'createdAt'>) => void;
  onUpdateTemplate: (id: string, updates: Partial<ReportTemplate>) => void;
  onDeleteTemplate: (id: string) => void;
  onRunTemplate: (template: ReportTemplate) => void;
}> = ({ templates, onCreateTemplate, onUpdateTemplate, onDeleteTemplate, onRunTemplate }) => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<string | null>(null);

  const [newTemplate, setNewTemplate] = useState<Omit<ReportTemplate, 'id' | 'createdAt'>>({
    name: '',
    description: '',
    sections: [
      { type: 'summary', title: 'Executive Summary', config: {} },
      { type: 'chart', title: 'Visibility Trends', config: { chartType: 'line' } },
      { type: 'table', title: 'Recent Mentions', config: { limit: 20 } },
    ],
    recipients: [],
  });

  const handleCreateTemplate = () => {
    if (newTemplate.name.trim()) {
      onCreateTemplate(newTemplate);
      setNewTemplate({
        name: '',
        description: '',
        sections: [
          { type: 'summary', title: 'Executive Summary', config: {} },
          { type: 'chart', title: 'Visibility Trends', config: { chartType: 'line' } },
          { type: 'table', title: 'Recent Mentions', config: { limit: 20 } },
        ],
        recipients: [],
      });
      setShowCreateForm(false);
    }
  };

  const formatScheduleText = (schedule?: ReportTemplate['schedule']) => {
    if (!schedule || !schedule.enabled) return 'No schedule';

    switch (schedule.frequency) {
      case 'daily':
        return `Daily at ${schedule.time}`;
      case 'weekly':
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        return `Weekly on ${days[schedule.dayOfWeek || 0]} at ${schedule.time}`;
      case 'monthly':
        return `Monthly on day ${schedule.dayOfMonth} at ${schedule.time}`;
      default:
        return 'No schedule';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <IconTemplate className="h-6 w-6 text-brand-purple" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Report Templates</h3>
        </div>
        <Button
          onClick={() => setShowCreateForm(true)}
          size="sm"
        >
          <IconTemplate className="h-4 w-4 mr-1" />
          New Template
        </Button>
      </div>

      {/* Create Template Form */}
      {showCreateForm && (
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <h4 className="font-medium text-gray-900 dark:text-white mb-4">Create Report Template</h4>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Template Name
              </label>
              <input
                type="text"
                value={newTemplate.name}
                onChange={(e) => setNewTemplate(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="e.g., Weekly Executive Summary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Description
              </label>
              <textarea
                value={newTemplate.description}
                onChange={(e) => setNewTemplate(prev => ({ ...prev, description: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                rows={2}
                placeholder="Brief description of what this report includes..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email Recipients (comma-separated)
              </label>
              <input
                type="text"
                value={newTemplate.recipients.join(', ')}
                onChange={(e) => setNewTemplate(prev => ({ 
                  ...prev, 
                  recipients: e.target.value.split(',').map(email => email.trim()).filter(Boolean)
                }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="email1@example.com, email2@example.com"
              />
            </div>

            <div className="flex space-x-2">
              <Button onClick={handleCreateTemplate} size="sm">
                Create Template
              </Button>
              <Button
                onClick={() => setShowCreateForm(false)}
                variant="secondary"
                size="sm"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Templates List */}
      <div className="space-y-3">
        {templates.map(template => (
          <div
            key={template.id}
            className="p-4 bg-white dark:bg-dark-card border border-gray-200 dark:border-gray-700 rounded-lg"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h4 className="font-medium text-gray-900 dark:text-white">
                  {template.name}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {template.description}
                </p>
                
                <div className="flex items-center space-x-4 mt-3 text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center space-x-1">
                    <IconCalendar className="h-4 w-4" />
                    <span>{formatScheduleText(template.schedule)}</span>
                  </div>
                  
                  <div className="flex items-center space-x-1">
                    <IconMail className="h-4 w-4" />
                    <span>{template.recipients.length} recipients</span>
                  </div>

                  {template.lastRun && (
                    <span>Last run: {template.lastRun.toLocaleDateString()}</span>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Button
                  onClick={() => onRunTemplate(template)}
                  variant="secondary"
                  size="sm"
                >
                  Run Now
                </Button>
                
                <button
                  onClick={() => setEditingTemplate(template.id)}
                  className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                  title="Edit template"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>

                <button
                  onClick={() => onDeleteTemplate(template.id)}
                  className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                  title="Delete template"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ))}

        {templates.length === 0 && (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <IconTemplate className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-sm">No report templates yet</p>
            <p className="text-xs mt-1">Create your first template to schedule automated reports</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Main Export & Reporting Component
const ExportReporting: React.FC<ExportReportingProps> = ({
  data,
  brandName,
  onExport,
  onScheduleReport,
  onSendReport,
}) => {
  const [activeTab, setActiveTab] = useState<'export' | 'templates'>('export');
  const [isExporting, setIsExporting] = useState(false);
  const [templates, setTemplates] = useState<ReportTemplate[]>([]);

  // Mock export function
  const handleExport = async (options: ExportOptions): Promise<void> => {
    setIsExporting(true);
    
    try {
      // Simulate export process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      if (onExport) {
        const blob = await onExport(options);
        
        // Create download link
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${brandName}-report-${Date.now()}.${options.format}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } else {
        // Fallback: generate mock data
        const content = generateMockExport(options, brandName, data);
        const blob = new Blob([content], { 
          type: options.format === 'json' ? 'application/json' : 'text/plain' 
        });
        
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${brandName}-report-${Date.now()}.${options.format}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleCreateTemplate = (template: Omit<ReportTemplate, 'id' | 'createdAt'>) => {
    const newTemplate: ReportTemplate = {
      ...template,
      id: Date.now().toString(),
      createdAt: new Date(),
    };
    setTemplates(prev => [newTemplate, ...prev]);
    onScheduleReport?.(newTemplate);
  };

  const handleUpdateTemplate = (id: string, updates: Partial<ReportTemplate>) => {
    setTemplates(prev =>
      prev.map(template => (template.id === id ? { ...template, ...updates } : template))
    );
  };

  const handleDeleteTemplate = (id: string) => {
    setTemplates(prev => prev.filter(template => template.id !== id));
  };

  const handleRunTemplate = (template: ReportTemplate) => {
    // Run the template immediately
    console.log('Running template:', template);
    onSendReport?.(template, template.recipients);
    
    // Update last run time
    handleUpdateTemplate(template.id, { lastRun: new Date() });
  };

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('export')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'export'
                ? 'border-brand-purple text-brand-purple'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Quick Export
          </button>
          <button
            onClick={() => setActiveTab('templates')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'templates'
                ? 'border-brand-purple text-brand-purple'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Report Templates
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'export' && (
        <QuickExport
          onExport={handleExport}
          isLoading={isExporting}
        />
      )}

      {activeTab === 'templates' && (
        <ReportTemplateManager
          templates={templates}
          onCreateTemplate={handleCreateTemplate}
          onUpdateTemplate={handleUpdateTemplate}
          onDeleteTemplate={handleDeleteTemplate}
          onRunTemplate={handleRunTemplate}
        />
      )}
    </div>
  );
};

// Helper function to generate mock export content
const generateMockExport = (options: ExportOptions, brandName: string, data: any[]): string => {
  switch (options.format) {
    case 'csv':
      return `Brand,Date,Platform,Sentiment,Mentions\n${brandName},${options.dateRange.start.toDateString()},ChatGPT,Positive,15\n${brandName},${options.dateRange.start.toDateString()},Claude,Neutral,8\n${brandName},${options.dateRange.start.toDateString()},Gemini,Positive,12`;
    
    case 'json':
      return JSON.stringify({
        brand: brandName,
        dateRange: options.dateRange,
        summary: {
          totalMentions: 35,
          visibilityScore: 78,
          sentimentBreakdown: { positive: 60, neutral: 30, negative: 10 }
        },
        data: data.slice(0, 10)
      }, null, 2);
    
    case 'xlsx':
      return 'Excel format would be generated using a library like xlsx or exceljs';
    
    case 'pdf':
      return 'PDF content would be generated using a library like jsPDF or PDFKit';
    
    default:
      return 'Export data';
  }
};

export default ExportReporting;
export type { ExportOptions, ReportTemplate };