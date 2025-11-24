import React from 'react';
import Icon from '../../../components/AppIcon';

const ThreatLevelIndicator = ({ level, score, trend }) => {
  const getThreatLevelConfig = (level) => {
    switch (level) {
      case 'critical':
        return {
          color: 'text-error',
          bgColor: 'bg-error/10',
          borderColor: 'border-error',
          icon: 'AlertTriangle',
          label: 'Critical'
        };
      case 'high':
        return {
          color: 'text-warning',
          bgColor: 'bg-warning/10',
          borderColor: 'border-warning',
          icon: 'AlertCircle',
          label: 'High'
        };
      case 'medium':
        return {
          color: 'text-accent',
          bgColor: 'bg-accent/10',
          borderColor: 'border-accent',
          icon: 'Info',
          label: 'Medium'
        };
      case 'low':
        return {
          color: 'text-success',
          bgColor: 'bg-success/10',
          borderColor: 'border-success',
          icon: 'CheckCircle',
          label: 'Low'
        };
      default:
        return {
          color: 'text-muted-foreground',
          bgColor: 'bg-muted/10',
          borderColor: 'border-muted',
          icon: 'Shield',
          label: 'Unknown'
        };
    }
  };

  const config = getThreatLevelConfig(level);

  return (
    <div className={`flex items-center space-x-3 p-4 rounded-lg border ${config?.bgColor} ${config?.borderColor}`}>
      <div className={`p-2 rounded-full ${config?.bgColor}`}>
        <Icon name={config?.icon} size={24} className={config?.color} />
      </div>
      <div className="flex-1">
        <div className="flex items-center space-x-2">
          <span className={`text-lg font-semibold ${config?.color}`}>
            {config?.label} Threat Level
          </span>
          {trend && (
            <Icon 
              name={trend === 'up' ? 'TrendingUp' : trend === 'down' ? 'TrendingDown' : 'Minus'} 
              size={16} 
              className={trend === 'up' ? 'text-error' : trend === 'down' ? 'text-success' : 'text-muted-foreground'} 
            />
          )}
        </div>
        <div className="flex items-center space-x-2 mt-1">
          <span className="text-2xl font-bold text-foreground">{score}/100</span>
          <span className="text-sm text-muted-foreground">Security Score</span>
        </div>
      </div>
    </div>
  );
};

export default ThreatLevelIndicator;