import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const GlobalControls = ({ 
  timeRange, 
  onTimeRangeChange, 
  environment, 
  onEnvironmentChange,
  autoRefresh,
  onAutoRefreshChange 
}) => {
  const [connectionStatus, setConnectionStatus] = useState('connected');
  const [lastUpdate, setLastUpdate] = useState(new Date());

  const timeRangeOptions = [
    { value: '15m', label: 'Last 15 minutes' },
    { value: '1h', label: 'Last 1 hour' },
    { value: '4h', label: 'Last 4 hours' },
    { value: '24h', label: 'Last 24 hours' }
  ];

  const environmentOptions = [
    { value: 'production', label: 'Production' },
    { value: 'staging', label: 'Staging' },
    { value: 'development', label: 'Development' },
    { value: 'all', label: 'All Environments' }
  ];

  useEffect(() => {
    // Simulate connection status monitoring
    const statusInterval = setInterval(() => {
      const statuses = ['connected', 'connecting', 'disconnected'];
      const randomStatus = statuses?.[Math.floor(Math.random() * statuses?.length)];
      if (Math.random() > 0.95) {
        setConnectionStatus(randomStatus);
      }
    }, 5000);

    return () => clearInterval(statusInterval);
  }, []);

  useEffect(() => {
    if (!autoRefresh) return;

    const refreshInterval = setInterval(() => {
      setLastUpdate(new Date());
    }, 30000);

    return () => clearInterval(refreshInterval);
  }, [autoRefresh]);

  const getConnectionStatusColor = () => {
    switch (connectionStatus) {
      case 'connected':
        return 'text-success';
      case 'connecting':
        return 'text-warning animate-pulse';
      case 'disconnected':
        return 'text-error';
      default:
        return 'text-muted-foreground';
    }
  };

  const getConnectionStatusIcon = () => {
    switch (connectionStatus) {
      case 'connected':
        return 'Wifi';
      case 'connecting':
        return 'WifiOff';
      case 'disconnected':
        return 'WifiOff';
      default:
        return 'Wifi';
    }
  };

  const formatLastUpdate = () => {
    const now = new Date();
    const diff = now - lastUpdate;
    const seconds = Math.floor(diff / 1000);
    
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    return `${hours}h ago`;
  };

  const handleManualRefresh = () => {
    setLastUpdate(new Date());
    // Trigger refresh for all components
    window.dispatchEvent(new CustomEvent('securityDataRefresh'));
  };

  return (
    <div className="bg-card border border-border rounded-lg p-4 mb-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        {/* Left Section - Time Range and Environment */}
        <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
          <div className="flex items-center space-x-2">
            <Icon name="Clock" size={16} className="text-muted-foreground" />
            <Select
              options={timeRangeOptions}
              value={timeRange}
              onChange={onTimeRangeChange}
              placeholder="Select time range"
              className="w-48"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Icon name="Server" size={16} className="text-muted-foreground" />
            <Select
              options={environmentOptions}
              value={environment}
              onChange={onEnvironmentChange}
              placeholder="Select environment"
              className="w-48"
            />
          </div>
        </div>

        {/* Right Section - Status and Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
          {/* Connection Status */}
          <div className="flex items-center space-x-2">
            <Icon 
              name={getConnectionStatusIcon()} 
              size={16} 
              className={getConnectionStatusColor()}
            />
            <span className={`text-sm font-medium ${getConnectionStatusColor()}`}>
              {connectionStatus === 'connected' ? 'Live Data' : 
               connectionStatus === 'connecting' ? 'Connecting...' : 'Offline'}
            </span>
          </div>

          {/* Last Update */}
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Icon name="RefreshCw" size={14} />
            <span>Updated {formatLastUpdate()}</span>
          </div>

          {/* Auto Refresh Toggle */}
          <Button
            variant={autoRefresh ? "default" : "outline"}
            size="sm"
            onClick={() => onAutoRefreshChange(!autoRefresh)}
            iconName={autoRefresh ? "Pause" : "Play"}
            iconPosition="left"
          >
            {autoRefresh ? "Auto Refresh" : "Manual"}
          </Button>

          {/* Manual Refresh */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleManualRefresh}
            iconName="RefreshCw"
            iconPosition="left"
          >
            Refresh Now
          </Button>

          {/* Export Options */}
          <div className="relative">
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
      </div>

      {/* Quick Stats Bar */}
      <div className="mt-4 pt-4 border-t border-border">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-lg font-semibold text-card-foreground">
              {connectionStatus === 'connected' ? '99.9%' : '0%'}
            </div>
            <div className="text-xs text-muted-foreground">Uptime</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-card-foreground">
              {Math.floor(Math.random() * 50) + 150}
            </div>
            <div className="text-xs text-muted-foreground">Events/min</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-card-foreground">
              {Math.floor(Math.random() * 10) + 5}
            </div>
            <div className="text-xs text-muted-foreground">Active Alerts</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-card-foreground">
              {Math.floor(Math.random() * 100) + 50}ms
            </div>
            <div className="text-xs text-muted-foreground">Avg Response</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GlobalControls;