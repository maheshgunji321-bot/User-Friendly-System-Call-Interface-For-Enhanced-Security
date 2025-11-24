import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';

const MetricCards = ({ selectedProcess, refreshRate }) => {
  const [metrics, setMetrics] = useState({
    totalCalls: 0,
    uniqueProcesses: 0,
    suspiciousPatterns: 0,
    performanceImpact: 0
  });
  const [previousMetrics, setPreviousMetrics] = useState({});
  const [alerts, setAlerts] = useState([]);

  // Mock metrics generation
  const generateMetrics = () => {
    const baseMultiplier = selectedProcess ? 0.3 : 1;
    
    const newMetrics = {
      totalCalls: Math.floor((50000 + Math.random() * 20000) * baseMultiplier),
      uniqueProcesses: selectedProcess ? 1 : Math.floor(15 + Math.random() * 10),
      suspiciousPatterns: Math.floor((5 + Math.random() * 15) * baseMultiplier),
      performanceImpact: Math.round((20 + Math.random() * 60) * 10) / 10
    };

    // Generate alerts based on thresholds
    const newAlerts = [];
    if (newMetrics?.totalCalls > 60000) {
      newAlerts?.push({ type: 'warning', message: 'High system call volume detected' });
    }
    if (newMetrics?.suspiciousPatterns > 15) {
      newAlerts?.push({ type: 'error', message: 'Multiple suspicious patterns identified' });
    }
    if (newMetrics?.performanceImpact > 70) {
      newAlerts?.push({ type: 'warning', message: 'Performance impact threshold exceeded' });
    }

    setAlerts(newAlerts);
    setPreviousMetrics(metrics);
    return newMetrics;
  };

  useEffect(() => {
    const updateMetrics = () => {
      setMetrics(generateMetrics());
    };

    updateMetrics();
    const interval = setInterval(updateMetrics, refreshRate * 1000);
    return () => clearInterval(interval);
  }, [refreshRate, selectedProcess]);

  const calculateChange = (current, previous) => {
    if (!previous || previous === 0) return 0;
    return ((current - previous) / previous) * 100;
  };

  const formatChange = (change) => {
    const absChange = Math.abs(change);
    const sign = change >= 0 ? '+' : '-';
    return `${sign}${absChange?.toFixed(1)}%`;
  };

  const getChangeColor = (change) => {
    if (Math.abs(change) < 1) return 'text-muted-foreground';
    return change >= 0 ? 'text-success' : 'text-error';
  };

  const getChangeIcon = (change) => {
    if (Math.abs(change) < 1) return 'Minus';
    return change >= 0 ? 'TrendingUp' : 'TrendingDown';
  };

  const metricCards = [
    {
      id: 'totalCalls',
      title: 'Total System Calls',
      value: metrics?.totalCalls?.toLocaleString(),
      icon: 'Activity',
      iconColor: 'text-primary',
      bgColor: 'bg-primary/10',
      description: 'System calls in the last hour',
      threshold: 60000,
      unit: 'calls'
    },
    {
      id: 'uniqueProcesses',
      title: 'Unique Processes',
      value: metrics?.uniqueProcesses?.toString(),
      icon: 'Layers',
      iconColor: 'text-success',
      bgColor: 'bg-success/10',
      description: 'Active processes monitored',
      threshold: 25,
      unit: 'processes'
    },
    {
      id: 'suspiciousPatterns',
      title: 'Suspicious Patterns',
      value: metrics?.suspiciousPatterns?.toString(),
      icon: 'AlertTriangle',
      iconColor: 'text-warning',
      bgColor: 'bg-warning/10',
      description: 'Anomalous behavior detected',
      threshold: 15,
      unit: 'patterns'
    },
    {
      id: 'performanceImpact',
      title: 'Performance Impact',
      value: `${metrics?.performanceImpact}%`,
      icon: 'Gauge',
      iconColor: 'text-accent',
      bgColor: 'bg-accent/10',
      description: 'System performance overhead',
      threshold: 70,
      unit: '%'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {metricCards?.map((card) => {
        const change = calculateChange(metrics?.[card?.id], previousMetrics?.[card?.id]);
        const isAboveThreshold = 
          card?.id === 'performanceImpact' ? metrics?.[card?.id] > card?.threshold :
          card?.id === 'suspiciousPatterns' ? metrics?.[card?.id] > card?.threshold :
          metrics?.[card?.id] > card?.threshold;

        return (
          <div
            key={card?.id}
            className={`
              relative bg-card rounded-lg border border-border p-6 transition-smooth
              hover:shadow-lg hover:border-primary/50
              ${isAboveThreshold ? 'ring-2 ring-warning/20' : ''}
            `}
          >
            {/* Alert indicator */}
            {isAboveThreshold && (
              <div className="absolute top-2 right-2">
                <div className="w-2 h-2 bg-warning rounded-full animate-pulse-status"></div>
              </div>
            )}
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-3">
                  <div className={`p-2 rounded-lg ${card?.bgColor}`}>
                    <Icon name={card?.icon} size={20} className={card?.iconColor} />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">
                      {card?.title}
                    </h3>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-2xl font-bold text-foreground">
                    {card?.value}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      {card?.description}
                    </span>
                    
                    {previousMetrics?.[card?.id] !== undefined && (
                      <div className={`flex items-center space-x-1 ${getChangeColor(change)}`}>
                        <Icon name={getChangeIcon(change)} size={12} />
                        <span className="text-xs font-medium">
                          {formatChange(change)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Progress bar for percentage metrics */}
                {card?.unit === '%' && (
                  <div className="mt-3">
                    <div className="flex justify-between text-xs text-muted-foreground mb-1">
                      <span>Impact Level</span>
                      <span>{card?.threshold}% threshold</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-smooth ${
                          metrics?.[card?.id] > card?.threshold ? 'bg-warning' : 'bg-success'
                        }`}
                        style={{ width: `${Math.min(100, metrics?.[card?.id])}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                {/* Threshold indicator for count metrics */}
                {card?.unit !== '%' && (
                  <div className="mt-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">
                        Threshold: {card?.threshold?.toLocaleString()}
                      </span>
                      <span className={`font-medium ${
                        isAboveThreshold ? 'text-warning' : 'text-success'
                      }`}>
                        {isAboveThreshold ? 'Above' : 'Normal'}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
            {/* Real-time indicator */}
            <div className="absolute bottom-2 right-2">
              <div className="flex items-center space-x-1">
                <div className="w-1 h-1 bg-success rounded-full animate-pulse"></div>
                <span className="text-xs text-muted-foreground">Live</span>
              </div>
            </div>
          </div>
        );
      })}
      {/* Alerts Panel */}
      {alerts?.length > 0 && (
        <div className="col-span-full">
          <div className="bg-card rounded-lg border border-warning p-4">
            <div className="flex items-center space-x-2 mb-3">
              <Icon name="AlertCircle" size={16} className="text-warning" />
              <h4 className="text-sm font-medium text-foreground">Active Alerts</h4>
            </div>
            <div className="space-y-2">
              {alerts?.map((alert, index) => (
                <div
                  key={index}
                  className={`flex items-center space-x-2 text-sm p-2 rounded ${
                    alert?.type === 'error' ? 'bg-error/10 text-error' : 'bg-warning/10 text-warning'
                  }`}
                >
                  <Icon 
                    name={alert?.type === 'error' ? 'XCircle' : 'AlertTriangle'} 
                    size={14} 
                  />
                  <span>{alert?.message}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MetricCards;