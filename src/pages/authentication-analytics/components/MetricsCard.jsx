import React from 'react';
import Icon from '../../../components/AppIcon';

const MetricsCard = ({ 
  title, 
  value, 
  change, 
  changeType, 
  icon, 
  trend, 
  description,
  className = "" 
}) => {
  const getChangeColor = () => {
    if (changeType === 'positive') return 'text-success';
    if (changeType === 'negative') return 'text-error';
    return 'text-muted-foreground';
  };

  const getChangeIcon = () => {
    if (changeType === 'positive') return 'TrendingUp';
    if (changeType === 'negative') return 'TrendingDown';
    return 'Minus';
  };

  return (
    <div className={`bg-card border border-border rounded-lg p-6 transition-smooth hover:shadow-lg ${className}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <Icon name={icon} size={20} className="text-primary" />
            <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
          </div>
          
          <div className="space-y-2">
            <p className="text-3xl font-bold text-foreground">{value}</p>
            
            {change && (
              <div className="flex items-center space-x-2">
                <div className={`flex items-center space-x-1 ${getChangeColor()}`}>
                  <Icon name={getChangeIcon()} size={16} />
                  <span className="text-sm font-medium">{change}</span>
                </div>
                <span className="text-xs text-muted-foreground">vs last period</span>
              </div>
            )}
            
            {description && (
              <p className="text-xs text-muted-foreground">{description}</p>
            )}
          </div>
        </div>
        
        {trend && (
          <div className="ml-4">
            <div className="w-16 h-8 flex items-end space-x-1">
              {trend?.map((point, index) => (
                <div
                  key={index}
                  className={`flex-1 rounded-sm ${
                    changeType === 'positive' ? 'bg-success/20' : 
                    changeType === 'negative' ? 'bg-error/20' : 'bg-muted'
                  }`}
                  style={{ height: `${point}%` }}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MetricsCard;