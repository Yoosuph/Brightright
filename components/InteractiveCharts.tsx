import React, { useState, useCallback } from 'react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ComposedChart,
  ScatterChart,
  Scatter,
  ReferenceLine,
  Brush,
} from 'recharts';

interface ChartDataPoint {
  [key: string]: any;
}

interface InteractiveChartProps {
  data: ChartDataPoint[];
  title?: string;
  height?: number;
  onDataPointClick?: (data: ChartDataPoint, index: number) => void;
  showBrush?: boolean;
  showGrid?: boolean;
  animated?: boolean;
}

// Custom Tooltip Component
const CustomTooltip: React.FC<{
  active?: boolean;
  payload?: any[];
  label?: string;
  formatter?: (value: any, name: string) => [string, string];
}> = ({ active, payload, label, formatter }) => {
  if (!active || !payload || payload.length === 0) return null;

  return (
    <div className="bg-white dark:bg-dark-card border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-4 max-w-xs">
      {label && (
        <p className="font-semibold text-gray-900 dark:text-white mb-2">
          {label}
        </p>
      )}
      <div className="space-y-1">
        {payload.map((entry, index) => {
          const [value, name] = formatter ? formatter(entry.value, entry.name) : [entry.value, entry.name];
          return (
            <div key={index} className="flex items-center space-x-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                <span className="font-medium">{name}:</span> {value}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Sentiment Trend Chart with Area Visualization
export const SentimentTrendChart: React.FC<InteractiveChartProps> = ({
  data,
  title = "Sentiment Trends",
  height = 300,
  onDataPointClick,
  showBrush = false,
  animated = true,
}) => {
  return (
    <div className="w-full">
      {title && (
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          {title}
        </h3>
      )}
      <ResponsiveContainer width="100%" height={height}>
        <AreaChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
          <XAxis 
            dataKey="date" 
            className="text-xs"
            tick={{ fontSize: 12 }}
          />
          <YAxis 
            className="text-xs"
            tick={{ fontSize: 12 }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          
          <Area
            type="monotone"
            dataKey="positive"
            stackId="1"
            stroke="#10B981"
            fill="#10B981"
            fillOpacity={0.6}
            name="Positive"
            onClick={onDataPointClick}
            isAnimationActive={animated}
            animationDuration={1500}
          />
          <Area
            type="monotone"
            dataKey="neutral"
            stackId="1"
            stroke="#6B7280"
            fill="#6B7280"
            fillOpacity={0.6}
            name="Neutral"
            onClick={onDataPointClick}
            isAnimationActive={animated}
            animationDuration={1500}
            animationDelay={200}
          />
          <Area
            type="monotone"
            dataKey="negative"
            stackId="1"
            stroke="#EF4444"
            fill="#EF4444"
            fillOpacity={0.6}
            name="Negative"
            onClick={onDataPointClick}
            isAnimationActive={animated}
            animationDuration={1500}
            animationDelay={400}
          />
          
          {showBrush && <Brush dataKey="date" height={30} />}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

// Platform Comparison Bar Chart
export const PlatformComparisonChart: React.FC<InteractiveChartProps> = ({
  data,
  title = "Platform Comparison",
  height = 300,
  onDataPointClick,
  animated = true,
}) => {
  const [activeBar, setActiveBar] = useState<string | null>(null);

  const handleMouseEnter = useCallback((data: any) => {
    setActiveBar(data.activeLabel);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setActiveBar(null);
  }, []);

  return (
    <div className="w-full">
      {title && (
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          {title}
        </h3>
      )}
      <ResponsiveContainer width="100%" height={height}>
        <BarChart 
          data={data} 
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
          <XAxis 
            dataKey="platform" 
            className="text-xs"
            tick={{ fontSize: 12 }}
          />
          <YAxis 
            className="text-xs"
            tick={{ fontSize: 12 }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          
          <Bar 
            dataKey="mentions" 
            fill="#8B5CF6"
            name="Mentions"
            onClick={onDataPointClick}
            isAnimationActive={animated}
            animationDuration={1500}
            radius={[4, 4, 0, 0]}
            opacity={activeBar ? 0.7 : 1}
          />
          <Bar 
            dataKey="visibility" 
            fill="#EC4899"
            name="Visibility Score"
            onClick={onDataPointClick}
            isAnimationActive={animated}
            animationDuration={1500}
            animationDelay={200}
            radius={[4, 4, 0, 0]}
            opacity={activeBar ? 0.7 : 1}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

// Competitor Radar Chart
export const CompetitorRadarChart: React.FC<{
  data: ChartDataPoint[];
  title?: string;
  height?: number;
  competitors: string[];
  metrics: string[];
}> = ({
  data,
  title = "Competitor Comparison",
  height = 400,
  competitors,
  metrics,
}) => {
  const colors = ['#8B5CF6', '#EC4899', '#10B981', '#F59E0B', '#EF4444'];

  return (
    <div className="w-full">
      {title && (
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          {title}
        </h3>
      )}
      <ResponsiveContainer width="100%" height={height}>
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
          <PolarGrid />
          <PolarAngleAxis 
            dataKey="metric" 
            tick={{ fontSize: 12 }}
            className="text-gray-600 dark:text-gray-400"
          />
          <PolarRadiusAxis 
            angle={90} 
            domain={[0, 100]}
            tick={{ fontSize: 10 }}
            className="text-gray-500 dark:text-gray-500"
          />
          {competitors.map((competitor, index) => (
            <Radar
              key={competitor}
              name={competitor}
              dataKey={competitor.toLowerCase().replace(' ', '_')}
              stroke={colors[index % colors.length]}
              fill={colors[index % colors.length]}
              fillOpacity={0.2}
              strokeWidth={2}
            />
          ))}
          <Legend />
          <Tooltip content={<CustomTooltip />} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

// Sentiment Distribution Pie Chart
export const SentimentDistributionChart: React.FC<{
  data: ChartDataPoint[];
  title?: string;
  height?: number;
  onSegmentClick?: (data: ChartDataPoint, index: number) => void;
}> = ({
  data,
  title = "Sentiment Distribution",
  height = 300,
  onSegmentClick,
}) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  
  const COLORS = {
    positive: '#10B981',
    neutral: '#6B7280',
    negative: '#EF4444',
  };

  const onPieEnter = useCallback((_: any, index: number) => {
    setActiveIndex(index);
  }, []);

  const onPieLeave = useCallback(() => {
    setActiveIndex(null);
  }, []);

  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        fontSize={12}
        fontWeight="bold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="w-full">
      {title && (
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          {title}
        </h3>
      )}
      <ResponsiveContainer width="100%" height={height}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderCustomizedLabel}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            onMouseEnter={onPieEnter}
            onMouseLeave={onPieLeave}
            onClick={onSegmentClick}
          >
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={COLORS[entry.name.toLowerCase() as keyof typeof COLORS]} 
                stroke={activeIndex === index ? '#ffffff' : 'none'}
                strokeWidth={activeIndex === index ? 3 : 0}
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

// Multi-metric Composed Chart
export const MultiMetricChart: React.FC<{
  data: ChartDataPoint[];
  title?: string;
  height?: number;
  primaryMetric: string;
  secondaryMetric: string;
  showTrend?: boolean;
}> = ({
  data,
  title = "Multi-Metric Analysis",
  height = 350,
  primaryMetric,
  secondaryMetric,
  showTrend = true,
}) => {
  return (
    <div className="w-full">
      {title && (
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          {title}
        </h3>
      )}
      <ResponsiveContainer width="100%" height={height}>
        <ComposedChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
          <XAxis 
            dataKey="date" 
            className="text-xs"
            tick={{ fontSize: 12 }}
          />
          <YAxis 
            yAxisId="left"
            className="text-xs"
            tick={{ fontSize: 12 }}
          />
          <YAxis 
            yAxisId="right" 
            orientation="right"
            className="text-xs"
            tick={{ fontSize: 12 }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          
          <Bar 
            yAxisId="left"
            dataKey={primaryMetric} 
            fill="#8B5CF6"
            name={primaryMetric}
            opacity={0.7}
          />
          <Line 
            yAxisId="right"
            type="monotone" 
            dataKey={secondaryMetric} 
            stroke="#EC4899"
            strokeWidth={3}
            name={secondaryMetric}
            dot={{ fill: '#EC4899', r: 4 }}
          />
          
          {showTrend && (
            <Line 
              yAxisId="right"
              type="monotone" 
              dataKey="trend" 
              stroke="#10B981"
              strokeDasharray="5 5"
              strokeWidth={2}
              name="Trend"
              dot={false}
            />
          )}
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

// Time-based Heatmap Chart (using scatter plot)
export const TimeHeatmapChart: React.FC<{
  data: ChartDataPoint[];
  title?: string;
  height?: number;
  xKey: string;
  yKey: string;
  valueKey: string;
}> = ({
  data,
  title = "Activity Heatmap",
  height = 300,
  xKey,
  yKey,
  valueKey,
}) => {
  return (
    <div className="w-full">
      {title && (
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          {title}
        </h3>
      )}
      <ResponsiveContainer width="100%" height={height}>
        <ScatterChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
          <XAxis 
            type="category"
            dataKey={xKey} 
            name={xKey}
            className="text-xs"
            tick={{ fontSize: 12 }}
          />
          <YAxis 
            type="category"
            dataKey={yKey} 
            name={yKey}
            className="text-xs"
            tick={{ fontSize: 12 }}
          />
          <Tooltip 
            cursor={{ strokeDasharray: '3 3' }}
            content={<CustomTooltip />}
          />
          <Scatter 
            name="Activity" 
            data={data} 
            fill="#8B5CF6"
          />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
};

export default {
  SentimentTrendChart,
  PlatformComparisonChart,
  CompetitorRadarChart,
  SentimentDistributionChart,
  MultiMetricChart,
  TimeHeatmapChart,
};