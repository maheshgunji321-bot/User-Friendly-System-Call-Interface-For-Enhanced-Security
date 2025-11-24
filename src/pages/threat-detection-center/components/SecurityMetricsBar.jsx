import React from 'react';
import Icon from '../../../components/AppIcon';

const SecurityMetricsBar = ({ metrics }) => {
  const getMetricConfig = (type, value, threshold) => {
    const isGood = value <= threshold;
    switch (type) {
      case 'incidents':
        return {
          icon: 'AlertTriangle',
          color: isGood ? 'text-success' : 'text-error',
          bgColor: isGood ? 'bg-success/10' : 'bg-error/10',
          borderColor: isGood ? 'border-success' : 'border-error'
        };
      case 'response_time':
        return {
          icon: 'Clock',
          color: isGood ? 'text-success' : 'text-warning',
          bgColor: isGood ? 'bg-success/10' : 'bg-warning/10',
          borderColor: isGood ? 'border-success' : 'border-warning'
        };
      case 'security_score':
        return {
          icon: 'Shield',
          color: value >= 80 ? 'text-success' : value >= 60 ? 'text-warning' : 'text-error',
          bgColor: value >= 80 ? 'bg-success/10' : value >= 60 ? 'bg-warning/10' : 'bg-error/10',
          borderColor: value >= 80 ? 'border-success' : value >= 60 ? 'border-warning' : 'border-error'
        };
      case 'threats_blocked':
        return {
          icon: 'ShieldCheck',
          color: 'text-success',
          bgColor: 'bg-success/10',
          borderColor: 'border-success'
        };
      default:
        return {
          icon: 'BarChart3',
          color: 'text-muted-foreground',
          bgColor: 'bg-muted/10',
          borderColor: 'border-muted'
        };
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {metrics?.map((metric) => {
        const config = getMetricConfig(metric?.type, metric?.value, metric?.threshold);
        
        return (
          <div 
            key={metric?.id}
            className={`p-4 rounded-lg border ${config?.bgColor} ${config?.borderColor} transition-smooth hover:shadow-md`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`p-2 rounded-full ${config?.bgColor}`}>
                <Icon name={config?.icon} size={20} className={config?.color} />
              </div>
              {metric?.trend && (
                <div className="flex items-center space-x-1">
                  <Icon 
                    name={metric?.trend === 'up' ? 'TrendingUp' : metric?.trend === 'down' ? 'TrendingDown' : 'Minus'} 
                    size={14} 
                    className={
                      metric?.trend === 'up' 
                        ? (metric?.type === 'threats_blocked' ? 'text-success' : 'text-error')
                        : metric?.trend === 'down' 
                        ? (metric?.type === 'threats_blocked' ? 'text-error' : 'text-success')
                        : 'text-muted-foreground'
                    } 
                  />
                  <span className={`text-xs ${
                    metric?.trend === 'up' 
                      ? (metric?.type === 'threats_blocked' ? 'text-success' : 'text-error')
                      : metric?.trend === 'down' 
                      ? (metric?.type === 'threats_blocked' ? 'text-error' : 'text-success')
                      : 'text-muted-foreground'
                  }`}>
                    {metric?.changePercent}%
                  </span>
                </div>
              )}
            </div>
            <div className="space-y-1">
              <div className="flex items-baseline space-x-2">
                <span className={`text-2xl font-bold ${config?.color}`}>
                  {metric?.value}
                </span>
                <span className="text-sm text-muted-foreground">
                  {metric?.unit}
                </span>
              </div>
              
              <div className="text-sm font-medium text-foreground">
                {metric?.label}
              </div>
              
              <div className="text-xs text-muted-foreground">
                {metric?.description}
              </div>
              
              {metric?.threshold && (
                <div className="text-xs text-muted-foreground">
                  Threshold: {metric?.threshold} {metric?.unit}
                </div>
              )}
            </div>
            {/* Progress bar for metrics with targets */}
            {metric?.target && (
              <div className="mt-3">
                <div className="flex justify-between text-xs text-muted-foreground mb-1">
                  <span>Progress</span>
                  <span>{Math.round((metric?.value / metric?.target) * 100)}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-300 ${
                      metric?.value >= metric?.target ? 'bg-success' : 'bg-primary'
                    }`}
                    style={{ width: `${Math.min((metric?.value / metric?.target) * 100, 100)}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default SecurityMetricsBar;