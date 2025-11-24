import React, { useState, useEffect, useRef } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Brush } from 'recharts';
import Icon from '../../../components/AppIcon';

const SystemCallTimeline = ({ selectedProcess, refreshRate }) => {
  const [timelineData, setTimelineData] = useState([]);
  const [zoomDomain, setZoomDomain] = useState(null);
  const [anomalies, setAnomalies] = useState([]);
  const [selectedMetric, setSelectedMetric] = useState('totalCalls');
  const chartRef = useRef(null);

  // Mock timeline data generation
  const generateTimelineData = () => {
    const now = new Date();
    const data = [];
    const anomalyPoints = [];
    
    // Generate 24 hours of data with 5-minute intervals
    for (let i = 288; i >= 0; i--) {
      const timestamp = new Date(now.getTime() - (i * 5 * 60 * 1000));
      const hour = timestamp?.getHours();
      
      // Base patterns with realistic variations
      const baseActivity = Math.sin((hour / 24) * Math.PI * 2) * 30 + 70;
      const noise = (Math.random() - 0.5) * 20;
      const totalCalls = Math.max(0, baseActivity + noise);
      
      // Process-specific multipliers
      const processMultiplier = selectedProcess ? 
        (selectedProcess === 'kernel' ? 2 : selectedProcess === 'chrome' ? 1.5 : 0.8) : 1;
      
      const adjustedCalls = totalCalls * processMultiplier;
      
      // Generate anomalies (5% chance)
      const isAnomaly = Math.random() > 0.95;
      const anomalyMultiplier = isAnomaly ? (2 + Math.random() * 3) : 1;
      
      const finalCalls = adjustedCalls * anomalyMultiplier;
      
      if (isAnomaly) {
        anomalyPoints?.push({
          timestamp: timestamp?.getTime(),
          value: finalCalls,
          type: 'spike',
          severity: finalCalls > 200 ? 'high' : 'medium'
        });
      }
      
      data?.push({
        timestamp: timestamp?.getTime(),
        time: timestamp?.toLocaleTimeString('en-US', { 
          hour: '2-digit', 
          minute: '2-digit' 
        }),
        totalCalls: Math.round(finalCalls),
        readCalls: Math.round(finalCalls * 0.4),
        writeCalls: Math.round(finalCalls * 0.3),
        networkCalls: Math.round(finalCalls * 0.2),
        systemCalls: Math.round(finalCalls * 0.1),
        cpuUsage: Math.min(100, Math.max(0, 20 + (finalCalls / 5) + (Math.random() - 0.5) * 10)),
        memoryUsage: Math.min(100, Math.max(0, 30 + (finalCalls / 8) + (Math.random() - 0.5) * 15)),
        isAnomaly
      });
    }
    
    setAnomalies(anomalyPoints);
    return data;
  };

  useEffect(() => {
    const updateData = () => {
      setTimelineData(generateTimelineData());
    };

    updateData();
    const interval = setInterval(updateData, refreshRate * 1000);
    return () => clearInterval(interval);
  }, [refreshRate, selectedProcess]);

  const metricOptions = [
    { value: 'totalCalls', label: 'Total Calls', color: '#1E40AF' },
    { value: 'readCalls', label: 'Read Calls', color: '#10B981' },
    { value: 'writeCalls', label: 'Write Calls', color: '#F59E0B' },
    { value: 'networkCalls', label: 'Network Calls', color: '#8B5CF6' },
    { value: 'systemCalls', label: 'System Calls', color: '#EF4444' }
  ];

  const currentMetric = metricOptions?.find(m => m?.value === selectedMetric);

  const handleZoomIn = () => {
    if (timelineData?.length > 0) {
      const dataLength = timelineData?.length;
      const start = Math.floor(dataLength * 0.25);
      const end = Math.floor(dataLength * 0.75);
      setZoomDomain([timelineData?.[start]?.timestamp, timelineData?.[end]?.timestamp]);
    }
  };

  const handleZoomOut = () => {
    setZoomDomain(null);
  };

  const handleExportData = () => {
    const csvContent = [
      ['Timestamp', 'Total Calls', 'Read Calls', 'Write Calls', 'Network Calls', 'System Calls', 'CPU Usage', 'Memory Usage', 'Is Anomaly'],
      ...timelineData?.map(row => [
        new Date(row.timestamp)?.toISOString(),
        row?.totalCalls,
        row?.readCalls,
        row?.writeCalls,
        row?.networkCalls,
        row?.systemCalls,
        row?.cpuUsage,
        row?.memoryUsage,
        row?.isAnomaly
      ])
    ]?.map(row => row?.join(','))?.join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `system-calls-${new Date()?.toISOString()?.split('T')?.[0]}.csv`;
    document.body?.appendChild(a);
    a?.click();
    document.body?.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload?.length) {
      const data = payload?.[0]?.payload;
      return (
        <div className="bg-popover border border-border rounded-lg shadow-lg p-3">
          <p className="text-sm font-medium text-popover-foreground mb-2">
            {new Date(label)?.toLocaleString()}
          </p>
          <div className="space-y-1">
            {payload?.map((entry, index) => (
              <div key={index} className="flex items-center justify-between space-x-4">
                <div className="flex items-center space-x-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: entry?.color }}
                  ></div>
                  <span className="text-xs text-muted-foreground">{entry?.name}:</span>
                </div>
                <span className="text-xs font-mono text-popover-foreground">
                  {entry?.value?.toLocaleString()}
                </span>
              </div>
            ))}
            {data?.isAnomaly && (
              <div className="mt-2 pt-2 border-t border-border">
                <div className="flex items-center space-x-2">
                  <Icon name="AlertTriangle" size={12} className="text-error" />
                  <span className="text-xs text-error font-medium">Anomaly Detected</span>
                </div>
              </div>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 space-y-4 sm:space-y-0">
        <div className="flex items-center space-x-3">
          <Icon name="TrendingUp" size={20} className="text-primary" />
          <h3 className="text-lg font-semibold text-foreground">System Call Timeline</h3>
          {selectedProcess && (
            <span className="px-2 py-1 bg-primary text-primary-foreground text-xs rounded-md">
              {selectedProcess}
            </span>
          )}
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
          {/* Metric Selector */}
          <select
            value={selectedMetric}
            onChange={(e) => setSelectedMetric(e?.target?.value)}
            className="px-3 py-1 bg-input border border-border rounded-md text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          >
            {metricOptions?.map(option => (
              <option key={option?.value} value={option?.value}>
                {option?.label}
              </option>
            ))}
          </select>

          {/* Zoom Controls */}
          <div className="flex items-center space-x-1">
            <button
              onClick={handleZoomIn}
              className="p-1 hover:bg-muted rounded transition-smooth"
              title="Zoom In"
            >
              <Icon name="ZoomIn" size={16} className="text-muted-foreground" />
            </button>
            <button
              onClick={handleZoomOut}
              className="p-1 hover:bg-muted rounded transition-smooth"
              title="Reset Zoom"
            >
              <Icon name="ZoomOut" size={16} className="text-muted-foreground" />
            </button>
          </div>

          {/* Export Button */}
          <button
            onClick={handleExportData}
            className="flex items-center space-x-1 px-3 py-1 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80 transition-smooth"
          >
            <Icon name="Download" size={14} />
            <span className="text-sm">Export</span>
          </button>
        </div>
      </div>
      {/* Chart */}
      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            ref={chartRef}
            data={timelineData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis 
              dataKey="timestamp"
              type="number"
              scale="time"
              domain={zoomDomain || ['dataMin', 'dataMax']}
              tickFormatter={(value) => new Date(value)?.toLocaleTimeString('en-US', { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
              stroke="var(--color-muted-foreground)"
            />
            <YAxis stroke="var(--color-muted-foreground)" />
            <Tooltip content={<CustomTooltip />} />
            
            {/* Anomaly reference lines */}
            {anomalies?.map((anomaly, index) => (
              <ReferenceLine
                key={index}
                x={anomaly?.timestamp}
                stroke={anomaly?.severity === 'high' ? 'var(--color-error)' : 'var(--color-warning)'}
                strokeDasharray="2 2"
                strokeWidth={1}
              />
            ))}
            
            <Line
              type="monotone"
              dataKey={selectedMetric}
              stroke={currentMetric?.color || '#1E40AF'}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, fill: currentMetric?.color || '#1E40AF' }}
            />
            
            <Brush 
              dataKey="time" 
              height={30} 
              stroke="var(--color-primary)"
              fill="var(--color-muted)"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      {/* Anomaly Summary */}
      {anomalies?.length > 0 && (
        <div className="mt-4 pt-4 border-t border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Icon name="AlertTriangle" size={16} className="text-warning" />
              <span className="text-sm font-medium text-foreground">
                {anomalies?.length} anomalies detected in the last 24 hours
              </span>
            </div>
            <div className="flex items-center space-x-4 text-xs text-muted-foreground">
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-error rounded-full"></div>
                <span>High Severity: {anomalies?.filter(a => a?.severity === 'high')?.length}</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-warning rounded-full"></div>
                <span>Medium Severity: {anomalies?.filter(a => a?.severity === 'medium')?.length}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SystemCallTimeline;