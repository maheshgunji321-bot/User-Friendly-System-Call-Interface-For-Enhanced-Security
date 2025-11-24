import React from 'react';
import Icon from '../../../components/AppIcon';

const MetricCard = ({ 
  title, 
  value, 
  unit, 
  trend, 
  trendValue, 
  icon, 
  status = 'normal',
  sparklineData = []
}) => {
  const getStatusColor = () => {
    switch (status) {
      case 'critical':
        return 'text-error border-error/20 bg-error/5';
      case 'warning':
        return 'text-warning border-warning/20 bg-warning/5';
      case 'success':
        return 'text-success border-success/20 bg-success/5';
      default:
        return 'text-foreground border-border bg-card';
    }
  };

  const getTrendColor = () => {
    if (trend === 'up') return 'text-success';
    if (trend === 'down') return 'text-error';
    return 'text-muted-foreground';
  };

  const getTrendIcon = () => {
    if (trend === 'up') return 'TrendingUp';
    if (trend === 'down') return 'TrendingDown';
    return 'Minus';
  };

  return (
    <div className={`p-6 rounded-lg border transition-smooth hover:shadow-lg ${getStatusColor()}`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-md ${status === 'critical' ? 'bg-error/10' : status === 'warning' ? 'bg-warning/10' : status === 'success' ? 'bg-success/10' : 'bg-muted'}`}>
            <Icon name={icon} size={20} className={status === 'critical' ? 'text-error' : status === 'warning' ? 'text-warning' : status === 'success' ? 'text-success' : 'text-muted-foreground'} />
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
            <div className="flex items-baseline space-x-1">
              <span className="text-2xl font-bold">{value}</span>
              {unit && <span className="text-sm text-muted-foreground">{unit}</span>}
            </div>
          </div>
        </div>
        
        {sparklineData?.length > 0 && (
          <div className="w-16 h-8">
            <svg width="64" height="32" viewBox="0 0 64 32" className="overflow-visible">
              <polyline
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                points={sparklineData?.map((point, index) => 
                  `${(index / (sparklineData?.length - 1)) * 60},${32 - (point / Math.max(...sparklineData)) * 28}`
                )?.join(' ')}
                className={getTrendColor()}
              />
            </svg>
          </div>
        )}
      </div>
      {trendValue && (
        <div className="flex items-center space-x-1">
          <Icon name={getTrendIcon()} size={14} className={getTrendColor()} />
          <span className={`text-sm font-medium ${getTrendColor()}`}>
            {trendValue}
          </span>
          <span className="text-xs text-muted-foreground">vs last hour</span>
        </div>
      )}
    </div>
  );
};

export default MetricCard;