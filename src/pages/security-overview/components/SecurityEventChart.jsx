import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const SecurityEventChart = ({ timeRange = '1h' }) => {
  const [chartData, setChartData] = useState([]);
  const [selectedEventTypes, setSelectedEventTypes] = useState(['authentication', 'systemCall', 'threat', 'access']);
  const [isLoading, setIsLoading] = useState(false);

  const eventTypes = [
    { key: 'authentication', label: 'Authentication Events', color: '#1E40AF', icon: 'UserCheck' },
    { key: 'systemCall', label: 'System Calls', color: '#10B981', icon: 'Activity' },
    { key: 'threat', label: 'Threat Detections', color: '#EF4444', icon: 'AlertTriangle' },
    { key: 'access', label: 'Access Attempts', color: '#F59E0B', icon: 'Lock' }
  ];

  useEffect(() => {
    generateMockData();
  }, [timeRange]);

  const generateMockData = () => {
    setIsLoading(true);
    
    setTimeout(() => {
      const now = new Date();
      const dataPoints = timeRange === '15m' ? 15 : timeRange === '1h' ? 60 : timeRange === '4h' ? 48 : 24;
      const interval = timeRange === '15m' ? 1 : timeRange === '1h' ? 1 : timeRange === '4h' ? 5 : 60;
      
      const data = [];
      
      for (let i = dataPoints - 1; i >= 0; i--) {
        const timestamp = new Date(now.getTime() - (i * interval * 60000));
        const timeLabel = timeRange === '24h' ? timestamp?.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
          : timestamp?.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
        
        data?.push({
          time: timeLabel,
          timestamp: timestamp?.getTime(),
          authentication: Math.floor(Math.random() * 150) + 50 + (Math.sin(i * 0.1) * 30),
          systemCall: Math.floor(Math.random() * 300) + 200 + (Math.cos(i * 0.15) * 50),
          threat: Math.floor(Math.random() * 20) + 5 + (Math.random() > 0.8 ? 15 : 0),
          access: Math.floor(Math.random() * 80) + 30 + (Math.sin(i * 0.2) * 20)
        });
      }
      
      setChartData(data);
      setIsLoading(false);
    }, 500);
  };

  const toggleEventType = (eventKey) => {
    setSelectedEventTypes(prev => 
      prev?.includes(eventKey) 
        ? prev?.filter(key => key !== eventKey)
        : [...prev, eventKey]
    );
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload?.length) {
      return (
        <div className="bg-popover border border-border rounded-lg p-3 shadow-lg">
          <p className="text-sm font-medium text-popover-foreground mb-2">{`Time: ${label}`}</p>
          {payload?.map((entry) => {
            const eventType = eventTypes?.find(type => type?.key === entry?.dataKey);
            return (
              <div key={entry?.dataKey} className="flex items-center space-x-2 text-sm">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: entry?.color }}
                />
                <span className="text-popover-foreground">
                  {eventType?.label}: {entry?.value}
                </span>
              </div>
            );
          })}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-card-foreground">Security Event Timeline</h2>
          <p className="text-sm text-muted-foreground">Real-time security events across all monitored systems</p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={generateMockData}
            iconName="RefreshCw"
            iconPosition="left"
            loading={isLoading}
          >
            Refresh
          </Button>
          <Button
            variant="outline"
            size="sm"
            iconName="Download"
            iconPosition="left"
          >
            Export
          </Button>
        </div>
      </div>
      {/* Event Type Filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        {eventTypes?.map((eventType) => (
          <button
            key={eventType?.key}
            onClick={() => toggleEventType(eventType?.key)}
            className={`
              flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-smooth
              ${selectedEventTypes?.includes(eventType?.key)
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80'
              }
            `}
          >
            <Icon name={eventType?.icon} size={14} />
            <span>{eventType?.label}</span>
            <div 
              className="w-2 h-2 rounded-full" 
              style={{ backgroundColor: eventType?.color }}
            />
          </button>
        ))}
      </div>
      {/* Chart */}
      <div className="h-80">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="flex items-center space-x-2 text-muted-foreground">
              <Icon name="Loader2" size={20} className="animate-spin" />
              <span>Loading security data...</span>
            </div>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis 
                dataKey="time" 
                stroke="var(--color-muted-foreground)"
                fontSize={12}
              />
              <YAxis 
                stroke="var(--color-muted-foreground)"
                fontSize={12}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              
              {eventTypes?.map((eventType) => (
                selectedEventTypes?.includes(eventType?.key) && (
                  <Line
                    key={eventType?.key}
                    type="monotone"
                    dataKey={eventType?.key}
                    stroke={eventType?.color}
                    strokeWidth={2}
                    dot={false}
                    name={eventType?.label}
                    connectNulls={false}
                  />
                )
              ))}
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default SecurityEventChart;