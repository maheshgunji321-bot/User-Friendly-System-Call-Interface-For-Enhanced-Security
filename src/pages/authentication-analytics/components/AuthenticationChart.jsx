import React, { useState } from 'react';
import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const AuthenticationChart = ({ data, onDrillDown, className = "" }) => {
  const [chartType, setChartType] = useState('combined');
  const [selectedMetric, setSelectedMetric] = useState('all');

  const chartTypes = [
    { value: 'combined', label: 'Combined View', icon: 'BarChart3' },
    { value: 'success', label: 'Success Only', icon: 'CheckCircle' },
    { value: 'failed', label: 'Failed Only', icon: 'XCircle' }
  ];

  const metrics = [
    { value: 'all', label: 'All Methods' },
    { value: 'password', label: 'Password' },
    { value: 'mfa', label: 'Multi-Factor' },
    { value: 'sso', label: 'Single Sign-On' },
    { value: 'biometric', label: 'Biometric' }
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload?.length) {
      return (
        <div className="bg-popover border border-border rounded-lg p-4 shadow-lg">
          <p className="font-medium text-popover-foreground mb-2">{`Time: ${label}`}</p>
          {payload?.map((entry, index) => (
            <div key={index} className="flex items-center space-x-2 text-sm">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: entry?.color }}
              />
              <span className="text-popover-foreground">
                {entry?.name}: {entry?.value?.toLocaleString()}
              </span>
            </div>
          ))}
          <div className="mt-2 pt-2 border-t border-border">
            <p className="text-xs text-muted-foreground">Click to drill down</p>
          </div>
        </div>
      );
    }
    return null;
  };

  const handleChartClick = (data) => {
    if (data && data?.activeLabel && onDrillDown) {
      onDrillDown({
        timestamp: data?.activeLabel,
        data: data?.activePayload
      });
    }
  };

  const getFilteredData = () => {
    if (selectedMetric === 'all') return data;
    return data?.map(item => ({
      ...item,
      successful: selectedMetric === 'password' ? item?.passwordSuccess : 
                 selectedMetric === 'mfa' ? item?.mfaSuccess :
                 selectedMetric === 'sso' ? item?.ssoSuccess :
                 selectedMetric === 'biometric' ? item?.biometricSuccess : item?.successful,
      failed: selectedMetric === 'password' ? item?.passwordFailed : 
             selectedMetric === 'mfa' ? item?.mfaFailed :
             selectedMetric === 'sso' ? item?.ssoFailed :
             selectedMetric === 'biometric' ? item?.biometricFailed : item?.failed
    }));
  };

  return (
    <div className={`bg-card border border-border rounded-lg p-6 ${className}`}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 space-y-4 sm:space-y-0">
        <div>
          <h3 className="text-lg font-semibold text-card-foreground mb-1">
            Authentication Patterns
          </h3>
          <p className="text-sm text-muted-foreground">
            Real-time authentication success and failure rates with geographic overlay
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
          <select
            value={selectedMetric}
            onChange={(e) => setSelectedMetric(e?.target?.value)}
            className="px-3 py-2 bg-input border border-border rounded-md text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          >
            {metrics?.map(metric => (
              <option key={metric?.value} value={metric?.value}>
                {metric?.label}
              </option>
            ))}
          </select>
          
          <div className="flex space-x-1">
            {chartTypes?.map(type => (
              <Button
                key={type?.value}
                variant={chartType === type?.value ? "default" : "outline"}
                size="sm"
                onClick={() => setChartType(type?.value)}
                iconName={type?.icon}
                iconPosition="left"
                className="text-xs"
              >
                {type?.label}
              </Button>
            ))}
          </div>
        </div>
      </div>
      <div className="h-80 w-full" aria-label="Authentication Analytics Chart">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={getFilteredData()}
            onClick={handleChartClick}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
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
            
            {(chartType === 'combined' || chartType === 'success') && (
              <Bar 
                dataKey="successful" 
                name="Successful Logins"
                fill="var(--color-success)"
                radius={[2, 2, 0, 0]}
              />
            )}
            
            {(chartType === 'combined' || chartType === 'failed') && (
              <Bar 
                dataKey="failed" 
                name="Failed Attempts"
                fill="var(--color-error)"
                radius={[2, 2, 0, 0]}
              />
            )}
            
            {chartType === 'combined' && (
              <Line 
                type="monotone" 
                dataKey="suspiciousActivity" 
                name="Suspicious Activity"
                stroke="var(--color-warning)"
                strokeWidth={2}
                dot={{ fill: 'var(--color-warning)', strokeWidth: 2, r: 4 }}
              />
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 flex flex-wrap items-center justify-between text-xs text-muted-foreground">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-success rounded-full" />
            <span>Successful Authentication</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-error rounded-full" />
            <span>Failed Attempts</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-warning rounded-full" />
            <span>Suspicious Activity</span>
          </div>
        </div>
        <div className="flex items-center space-x-2 mt-2 sm:mt-0">
          <Icon name="Info" size={14} />
          <span>Click on chart points to drill down into details</span>
        </div>
      </div>
    </div>
  );
};

export default AuthenticationChart;