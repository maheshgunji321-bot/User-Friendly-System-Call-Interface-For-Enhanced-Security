import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const GlobalControls = ({ 
  onSystemSelect, 
  onProcessFilter, 
  onCallTypeFilter, 
  onRefreshRateChange,
  selectedSystem,
  processFilter,
  callTypeFilter,
  refreshRate 
}) => {
  const [isExporting, setIsExporting] = useState(false);

  // Mock system options
  const systemOptions = [
    { value: 'all', label: 'All Systems' },
    { value: 'web-server-01', label: 'Web Server 01' },
    { value: 'web-server-02', label: 'Web Server 02' },
    { value: 'db-server-01', label: 'Database Server 01' },
    { value: 'app-server-01', label: 'Application Server 01' },
    { value: 'cache-server-01', label: 'Cache Server 01' }
  ];

  // Mock process filter options
  const processOptions = [
    { value: '', label: 'All Processes' },
    { value: 'kernel', label: 'Kernel Processes' },
    { value: 'user', label: 'User Processes' },
    { value: 'system', label: 'System Processes' },
    { value: 'network', label: 'Network Processes' },
    { value: 'database', label: 'Database Processes' }
  ];

  // Mock call type options
  const callTypeOptions = [
    { value: 'read', label: 'Read Operations' },
    { value: 'write', label: 'Write Operations' },
    { value: 'network', label: 'Network Operations' },
    { value: 'file', label: 'File Operations' },
    { value: 'memory', label: 'Memory Operations' },
    { value: 'process', label: 'Process Operations' }
  ];

  // Refresh rate options
  const refreshRateOptions = [
    { value: 5, label: '5 seconds' },
    { value: 10, label: '10 seconds' },
    { value: 30, label: '30 seconds' },
    { value: 60, label: '1 minute' }
  ];

  const handleExportData = async () => {
    setIsExporting(true);
    
    // Simulate export process
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Create mock CSV data
    const csvContent = [
      ['Timestamp', 'System', 'Process', 'Call Type', 'Count', 'CPU Usage', 'Memory Usage'],
      ['2025-11-07 11:19:01', 'web-server-01', 'nginx', 'read', '1250', '15.2', '8.5'],
      ['2025-11-07 11:19:01', 'web-server-01', 'nginx', 'write', '850', '12.1', '7.8'],
      ['2025-11-07 11:19:01', 'db-server-01', 'mysql', 'read', '2100', '25.6', '45.2'],
      ['2025-11-07 11:19:01', 'db-server-01', 'mysql', 'write', '1200', '18.9', '42.1']
    ]?.map(row => row?.join(','))?.join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `system-call-monitor-${new Date()?.toISOString()?.split('T')?.[0]}.csv`;
    document.body?.appendChild(a);
    a?.click();
    document.body?.removeChild(a);
    URL.revokeObjectURL(url);
    
    setIsExporting(false);
  };

  const handleScreenshot = () => {
    // Simulate screenshot capture
    const canvas = document.createElement('canvas');
    const ctx = canvas?.getContext('2d');
    canvas.width = 1200;
    canvas.height = 800;
    
    // Create a simple mock screenshot
    ctx.fillStyle = '#0F172A';
    ctx?.fillRect(0, 0, canvas?.width, canvas?.height);
    ctx.fillStyle = '#F8FAFC';
    ctx.font = '24px Inter';
    ctx?.fillText('System Call Monitor Dashboard', 50, 50);
    ctx.font = '16px Inter';
    ctx?.fillText(`Captured: ${new Date()?.toLocaleString()}`, 50, 80);
    
    // Convert to blob and download
    canvas?.toBlob((blob) => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `system-call-monitor-${new Date()?.toISOString()?.split('T')?.[0]}.png`;
      document.body?.appendChild(a);
      a?.click();
      document.body?.removeChild(a);
      URL.revokeObjectURL(url);
    });
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6 mb-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0">
        {/* Left Section - Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 flex-1 lg:mr-6">
          {/* System Selector */}
          <Select
            label="System"
            options={systemOptions}
            value={selectedSystem}
            onChange={onSystemSelect}
            placeholder="Select system..."
            className="w-full"
          />

          {/* Process Filter */}
          <Select
            label="Process Filter"
            options={processOptions}
            value={processFilter}
            onChange={onProcessFilter}
            placeholder="Filter by process..."
            className="w-full"
          />

          {/* Call Type Filter */}
          <Select
            label="Call Types"
            options={callTypeOptions}
            value={callTypeFilter}
            onChange={onCallTypeFilter}
            multiple
            searchable
            placeholder="Select call types..."
            className="w-full"
          />

          {/* Refresh Rate */}
          <Select
            label="Refresh Rate"
            options={refreshRateOptions}
            value={refreshRate}
            onChange={onRefreshRateChange}
            className="w-full"
          />
        </div>

        {/* Right Section - Actions */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Real-time Status */}
          <div className="flex items-center space-x-2 px-3 py-2 bg-success/10 rounded-lg">
            <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
            <span className="text-xs font-medium text-success">Live</span>
            <span className="text-xs text-muted-foreground">
              Updates every {refreshRate}s
            </span>
          </div>

          {/* Export Actions */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportData}
            loading={isExporting}
            iconName="Download"
            iconPosition="left"
          >
            Export Data
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleScreenshot}
            iconName="Camera"
            iconPosition="left"
          >
            Screenshot
          </Button>

          {/* Refresh Button */}
          <Button
            variant="default"
            size="sm"
            onClick={() => window.location?.reload()}
            iconName="RefreshCw"
            iconPosition="left"
          >
            Refresh
          </Button>
        </div>
      </div>
      {/* Active Filters Display */}
      <div className="mt-4 pt-4 border-t border-border">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-muted-foreground">Active Filters:</span>
          
          {selectedSystem && selectedSystem !== 'all' && (
            <div className="flex items-center space-x-1 px-2 py-1 bg-primary/10 text-primary rounded-md">
              <Icon name="Server" size={12} />
              <span className="text-xs">
                {systemOptions?.find(s => s?.value === selectedSystem)?.label}
              </span>
              <button
                onClick={() => onSystemSelect('all')}
                className="ml-1 hover:bg-primary/20 rounded-full p-0.5"
              >
                <Icon name="X" size={10} />
              </button>
            </div>
          )}

          {processFilter && (
            <div className="flex items-center space-x-1 px-2 py-1 bg-success/10 text-success rounded-md">
              <Icon name="Filter" size={12} />
              <span className="text-xs">
                {processOptions?.find(p => p?.value === processFilter)?.label}
              </span>
              <button
                onClick={() => onProcessFilter('')}
                className="ml-1 hover:bg-success/20 rounded-full p-0.5"
              >
                <Icon name="X" size={10} />
              </button>
            </div>
          )}

          {callTypeFilter && callTypeFilter?.length > 0 && (
            <div className="flex items-center space-x-1 px-2 py-1 bg-warning/10 text-warning rounded-md">
              <Icon name="Layers" size={12} />
              <span className="text-xs">
                {callTypeFilter?.length} call type{callTypeFilter?.length > 1 ? 's' : ''}
              </span>
              <button
                onClick={() => onCallTypeFilter([])}
                className="ml-1 hover:bg-warning/20 rounded-full p-0.5"
              >
                <Icon name="X" size={10} />
              </button>
            </div>
          )}

          {(!selectedSystem || selectedSystem === 'all') && !processFilter && (!callTypeFilter || callTypeFilter?.length === 0) && (
            <span className="text-xs text-muted-foreground italic">No filters applied</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default GlobalControls;