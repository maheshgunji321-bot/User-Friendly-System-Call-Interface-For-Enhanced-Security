import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import MetricCard from './components/MetricCard';
import SecurityEventChart from './components/SecurityEventChart';
import ThreatFeed from './components/ThreatFeed';
import SecurityHeatmap from './components/SecurityHeatmap';
import GlobalControls from './components/GlobalControls';

const SecurityOverview = () => {
  const [timeRange, setTimeRange] = useState('1h');
  const [environment, setEnvironment] = useState('production');
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [metrics, setMetrics] = useState({
    activeThreats: { value: 0, trend: 'stable', trendValue: '0%' },
    authSuccessRate: { value: 0, trend: 'up', trendValue: '+2.1%' },
    systemCallsPerMin: { value: 0, trend: 'up', trendValue: '+15.3%' },
    unauthorizedAttempts: { value: 0, trend: 'down', trendValue: '-8.7%' }
  });

  // Generate mock data for metrics
  useEffect(() => {
    const generateMetrics = () => {
      setMetrics({
        activeThreats: {
          value: Math.floor(Math.random() * 15) + 3,
          trend: Math.random() > 0.6 ? 'up' : 'down',
          trendValue: `${Math.random() > 0.5 ? '+' : '-'}${(Math.random() * 10)?.toFixed(1)}%`,
          sparklineData: Array.from({ length: 12 }, () => Math.floor(Math.random() * 20) + 5)
        },
        authSuccessRate: {
          value: (Math.random() * 5 + 95)?.toFixed(1),
          trend: Math.random() > 0.3 ? 'up' : 'down',
          trendValue: `${Math.random() > 0.5 ? '+' : '-'}${(Math.random() * 3)?.toFixed(1)}%`,
          sparklineData: Array.from({ length: 12 }, () => Math.floor(Math.random() * 10) + 90)
        },
        systemCallsPerMin: {
          value: Math.floor(Math.random() * 200) + 800,
          trend: Math.random() > 0.4 ? 'up' : 'down',
          trendValue: `${Math.random() > 0.5 ? '+' : '-'}${(Math.random() * 20)?.toFixed(1)}%`,
          sparklineData: Array.from({ length: 12 }, () => Math.floor(Math.random() * 300) + 700)
        },
        unauthorizedAttempts: {
          value: Math.floor(Math.random() * 50) + 10,
          trend: Math.random() > 0.7 ? 'up' : 'down',
          trendValue: `${Math.random() > 0.5 ? '+' : '-'}${(Math.random() * 15)?.toFixed(1)}%`,
          sparklineData: Array.from({ length: 12 }, () => Math.floor(Math.random() * 30) + 5)
        }
      });
    };

    generateMetrics();

    if (autoRefresh) {
      const interval = setInterval(generateMetrics, 30000);
      return () => clearInterval(interval);
    }
  }, [autoRefresh, timeRange, environment]);

  // Listen for manual refresh events
  useEffect(() => {
    const handleRefresh = () => {
      // Trigger refresh for all components
      setMetrics(prev => ({ ...prev }));
    };

    window.addEventListener('securityDataRefresh', handleRefresh);
    return () => window.removeEventListener('securityDataRefresh', handleRefresh);
  }, []);

  const getMetricStatus = (metricKey, value) => {
    switch (metricKey) {
      case 'activeThreats':
        if (value >= 10) return 'critical';
        if (value >= 5) return 'warning';
        return 'normal';
      case 'authSuccessRate':
        if (value < 90) return 'critical';
        if (value < 95) return 'warning';
        return 'success';
      case 'systemCallsPerMin':
        if (value > 1200) return 'warning';
        return 'normal';
      case 'unauthorizedAttempts':
        if (value >= 30) return 'critical';
        if (value >= 15) return 'warning';
        return 'normal';
      default:
        return 'normal';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Security Overview</h1>
            <p className="text-muted-foreground">
              Comprehensive real-time security intelligence and system health monitoring
            </p>
          </div>

          {/* Global Controls */}
          <GlobalControls
            timeRange={timeRange}
            onTimeRangeChange={setTimeRange}
            environment={environment}
            onEnvironmentChange={setEnvironment}
            autoRefresh={autoRefresh}
            onAutoRefreshChange={setAutoRefresh}
          />

          {/* KPI Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
            <MetricCard
              title="Active Threats"
              value={metrics?.activeThreats?.value}
              trend={metrics?.activeThreats?.trend}
              trendValue={metrics?.activeThreats?.trendValue}
              icon="AlertTriangle"
              status={getMetricStatus('activeThreats', metrics?.activeThreats?.value)}
              sparklineData={metrics?.activeThreats?.sparklineData}
              unit=""
            />
            <MetricCard
              title="Authentication Success Rate"
              value={metrics?.authSuccessRate?.value}
              unit="%"
              trend={metrics?.authSuccessRate?.trend}
              trendValue={metrics?.authSuccessRate?.trendValue}
              icon="UserCheck"
              status={getMetricStatus('authSuccessRate', parseFloat(metrics?.authSuccessRate?.value))}
              sparklineData={metrics?.authSuccessRate?.sparklineData}
            />
            <MetricCard
              title="System Calls Per Minute"
              value={metrics?.systemCallsPerMin?.value}
              trend={metrics?.systemCallsPerMin?.trend}
              trendValue={metrics?.systemCallsPerMin?.trendValue}
              icon="Activity"
              status={getMetricStatus('systemCallsPerMin', metrics?.systemCallsPerMin?.value)}
              sparklineData={metrics?.systemCallsPerMin?.sparklineData}
              unit=""
            />
            <MetricCard
              title="Unauthorized Access Attempts"
              value={metrics?.unauthorizedAttempts?.value}
              trend={metrics?.unauthorizedAttempts?.trend}
              trendValue={metrics?.unauthorizedAttempts?.trendValue}
              icon="Lock"
              status={getMetricStatus('unauthorizedAttempts', metrics?.unauthorizedAttempts?.value)}
              sparklineData={metrics?.unauthorizedAttempts?.sparklineData}
              unit=""
            />
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-8">
            {/* Security Event Chart - Takes 2/3 of the width on desktop */}
            <div className="xl:col-span-2">
              <SecurityEventChart timeRange={timeRange} />
            </div>
            
            {/* Threat Feed - Takes 1/3 of the width on desktop */}
            <div className="xl:col-span-1">
              <ThreatFeed />
            </div>
          </div>

          {/* Security Heatmap - Full Width */}
          <div className="mb-8">
            <SecurityHeatmap />
          </div>

          {/* Footer Information */}
          <div className="bg-card border border-border rounded-lg p-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-2 md:space-y-0">
              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                <span>Last security scan: 2 minutes ago</span>
                <span>•</span>
                <span>Next scheduled scan: in 28 minutes</span>
              </div>
              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                <span>Monitoring {Math.floor(Math.random() * 50) + 150} endpoints</span>
                <span>•</span>
                <span>Data retention: 2 years</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SecurityOverview;