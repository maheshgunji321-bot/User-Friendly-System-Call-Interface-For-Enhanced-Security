import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';

const ProcessSidebar = ({ onProcessSelect, selectedProcess, refreshRate }) => {
  const [processes, setProcesses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('callCount');

  // Mock process data generation
  const generateProcessData = () => {
    const processNames = [
      'kernel', 'systemd', 'chrome', 'firefox', 'vscode', 'docker', 'nginx', 'mysql',
      'node', 'python', 'ssh', 'apache', 'postgres', 'redis', 'mongodb', 'java',
      'bash', 'zsh', 'vim', 'git', 'npm', 'yarn', 'webpack', 'electron'
    ];

    return processNames?.map((name, index) => {
      const baseCallCount = Math.floor(Math.random() * 10000) + 100;
      const isAnomalous = Math.random() > 0.85;
      const cpuUsage = Math.random() * 100;
      const memoryUsage = Math.random() * 100;
      
      return {
        id: index + 1,
        name,
        pid: 1000 + index,
        callCount: baseCallCount + Math.floor(Math.random() * 1000),
        callsPerSecond: Math.floor(Math.random() * 50) + 1,
        cpuUsage: Math.round(cpuUsage * 10) / 10,
        memoryUsage: Math.round(memoryUsage * 10) / 10,
        riskLevel: isAnomalous ? 'high' : cpuUsage > 70 ? 'medium' : 'low',
        isAnomalous,
        status: Math.random() > 0.1 ? 'running' : 'sleeping',
        startTime: new Date(Date.now() - Math.random() * 86400000)?.toISOString(),
        lastActivity: new Date(Date.now() - Math.random() * 3600000)?.toISOString()
      };
    });
  };

  useEffect(() => {
    const updateProcesses = () => {
      setProcesses(generateProcessData());
    };

    updateProcesses();
    const interval = setInterval(updateProcesses, refreshRate * 1000);
    return () => clearInterval(interval);
  }, [refreshRate]);

  const filteredProcesses = processes?.filter(process =>
    process.name?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
    process.pid?.toString()?.includes(searchTerm)
  );

  const sortedProcesses = [...filteredProcesses]?.sort((a, b) => {
    switch (sortBy) {
      case 'callCount':
        return b?.callCount - a?.callCount;
      case 'cpuUsage':
        return b?.cpuUsage - a?.cpuUsage;
      case 'memoryUsage':
        return b?.memoryUsage - a?.memoryUsage;
      case 'name':
        return a?.name?.localeCompare(b?.name);
      default:
        return 0;
    }
  });

  const getRiskColor = (riskLevel) => {
    switch (riskLevel) {
      case 'high':
        return 'text-error';
      case 'medium':
        return 'text-warning';
      case 'low':
        return 'text-success';
      default:
        return 'text-muted-foreground';
    }
  };

  const getRiskIcon = (riskLevel) => {
    switch (riskLevel) {
      case 'high':
        return 'AlertTriangle';
      case 'medium':
        return 'AlertCircle';
      case 'low':
        return 'CheckCircle';
      default:
        return 'Circle';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'running':
        return 'text-success';
      case 'sleeping':
        return 'text-muted-foreground';
      default:
        return 'text-muted-foreground';
    }
  };

  return (
    <div className="bg-card rounded-lg border border-border p-4 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Icon name="List" size={18} className="text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Processes</h3>
        </div>
        <span className="text-xs text-muted-foreground">
          {processes?.length} total
        </span>
      </div>
      {/* Search and Sort Controls */}
      <div className="space-y-3 mb-4">
        <div className="relative">
          <Icon 
            name="Search" 
            size={16} 
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" 
          />
          <input
            type="text"
            placeholder="Search processes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e?.target?.value)}
            className="w-full pl-10 pr-4 py-2 bg-input border border-border rounded-md text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e?.target?.value)}
          className="w-full px-3 py-2 bg-input border border-border rounded-md text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        >
          <option value="callCount">Sort by Call Count</option>
          <option value="cpuUsage">Sort by CPU Usage</option>
          <option value="memoryUsage">Sort by Memory Usage</option>
          <option value="name">Sort by Name</option>
        </select>
      </div>
      {/* Process List */}
      <div className="flex-1 overflow-y-auto space-y-2">
        {sortedProcesses?.map((process) => (
          <div
            key={process.id}
            onClick={() => onProcessSelect(process.name === selectedProcess ? null : process.name)}
            className={`
              p-3 rounded-lg border cursor-pointer transition-smooth
              ${selectedProcess === process.name 
                ? 'border-primary bg-primary/10' :'border-border hover:border-muted-foreground hover:bg-muted/50'
              }
            `}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center space-x-2">
                <Icon 
                  name={getRiskIcon(process.riskLevel)} 
                  size={14} 
                  className={getRiskColor(process.riskLevel)} 
                />
                <span className="font-medium text-foreground text-sm truncate">
                  {process.name}
                </span>
                {process.isAnomalous && (
                  <div className="w-2 h-2 bg-error rounded-full animate-pulse-status"></div>
                )}
              </div>
              <div className="flex items-center space-x-1">
                <Icon 
                  name="Circle" 
                  size={8} 
                  className={getStatusColor(process.status)} 
                />
                <span className="text-xs text-muted-foreground">
                  PID {process.pid}
                </span>
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Calls:</span>
                <span className="text-foreground font-mono">
                  {process.callCount?.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Rate:</span>
                <span className="text-foreground font-mono">
                  {process.callsPerSecond}/s
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">CPU:</span>
                <span className="text-foreground font-mono">
                  {process.cpuUsage}%
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Memory:</span>
                <span className="text-foreground font-mono">
                  {process.memoryUsage}%
                </span>
              </div>
            </div>

            {/* Resource usage bars */}
            <div className="mt-2 space-y-1">
              <div className="flex items-center space-x-2">
                <span className="text-xs text-muted-foreground w-8">CPU</span>
                <div className="flex-1 bg-muted rounded-full h-1">
                  <div 
                    className={`h-1 rounded-full transition-smooth ${
                      process.cpuUsage > 80 ? 'bg-error' : 
                      process.cpuUsage > 60 ? 'bg-warning' : 'bg-success'
                    }`}
                    style={{ width: `${process.cpuUsage}%` }}
                  ></div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-xs text-muted-foreground w-8">MEM</span>
                <div className="flex-1 bg-muted rounded-full h-1">
                  <div 
                    className={`h-1 rounded-full transition-smooth ${
                      process.memoryUsage > 80 ? 'bg-error' : 
                      process.memoryUsage > 60 ? 'bg-warning' : 'bg-success'
                    }`}
                    style={{ width: `${process.memoryUsage}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Summary Stats */}
      <div className="mt-4 pt-4 border-t border-border">
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="text-center">
            <div className="text-muted-foreground">Running</div>
            <div className="text-success font-medium">
              {processes?.filter(p => p?.status === 'running')?.length}
            </div>
          </div>
          <div className="text-center">
            <div className="text-muted-foreground">High Risk</div>
            <div className="text-error font-medium">
              {processes?.filter(p => p?.riskLevel === 'high')?.length}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProcessSidebar;