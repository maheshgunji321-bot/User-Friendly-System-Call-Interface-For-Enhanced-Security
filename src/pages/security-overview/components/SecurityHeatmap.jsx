import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const SecurityHeatmap = () => {
  const [heatmapData, setHeatmapData] = useState([]);
  const [selectedComponent, setSelectedComponent] = useState(null);
  const [viewMode, setViewMode] = useState('activity'); // activity, threats, performance

  const systemComponents = [
    { id: 'web-servers', name: 'Web Servers', category: 'Infrastructure' },
    { id: 'database', name: 'Database Cluster', category: 'Infrastructure' },
    { id: 'api-gateway', name: 'API Gateway', category: 'Services' },
    { id: 'auth-service', name: 'Authentication', category: 'Services' },
    { id: 'file-storage', name: 'File Storage', category: 'Storage' },
    { id: 'load-balancer', name: 'Load Balancer', category: 'Network' },
    { id: 'firewall', name: 'Firewall', category: 'Security' },
    { id: 'vpn-gateway', name: 'VPN Gateway', category: 'Network' },
    { id: 'monitoring', name: 'Monitoring', category: 'Operations' },
    { id: 'backup-system', name: 'Backup System', category: 'Storage' },
    { id: 'cdn', name: 'CDN', category: 'Network' },
    { id: 'cache-layer', name: 'Cache Layer', category: 'Performance' }
  ];

  const timeSlots = [
    '00:00', '02:00', '04:00', '06:00', '08:00', '10:00',
    '12:00', '14:00', '16:00', '18:00', '20:00', '22:00'
  ];

  useEffect(() => {
    generateHeatmapData();
  }, [viewMode]);

  const generateHeatmapData = () => {
    const data = [];
    
    systemComponents?.forEach(component => {
      timeSlots?.forEach(timeSlot => {
        let intensity;
        
        switch (viewMode) {
          case 'activity':
            intensity = Math.random() * 100;
            break;
          case 'threats':
            intensity = Math.random() * 50 + (component?.category === 'Security' ? 20 : 0);
            break;
          case 'performance':
            intensity = Math.random() * 80 + 20;
            break;
          default:
            intensity = Math.random() * 100;
        }
        
        data?.push({
          component: component?.id,
          componentName: component?.name,
          category: component?.category,
          timeSlot,
          intensity: Math.floor(intensity),
          events: Math.floor(Math.random() * 500) + 50,
          threats: Math.floor(Math.random() * 10),
          responseTime: Math.floor(Math.random() * 200) + 50
        });
      });
    });
    
    setHeatmapData(data);
  };

  const getIntensityColor = (intensity) => {
    if (intensity >= 80) return 'bg-error text-error-foreground';
    if (intensity >= 60) return 'bg-warning text-warning-foreground';
    if (intensity >= 40) return 'bg-accent text-accent-foreground';
    if (intensity >= 20) return 'bg-success text-success-foreground';
    return 'bg-muted text-muted-foreground';
  };

  const getIntensityOpacity = (intensity) => {
    return Math.max(0.1, intensity / 100);
  };

  const handleCellClick = (cellData) => {
    setSelectedComponent(cellData);
  };

  const viewModes = [
    { key: 'activity', label: 'Activity Level', icon: 'Activity' },
    { key: 'threats', label: 'Threat Density', icon: 'AlertTriangle' },
    { key: 'performance', label: 'Performance', icon: 'Zap' }
  ];

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-card-foreground">Security Activity Heatmap</h2>
          <p className="text-sm text-muted-foreground">System component activity patterns over 24 hours</p>
        </div>
        
        <div className="flex items-center space-x-2">
          {viewModes?.map((mode) => (
            <Button
              key={mode?.key}
              variant={viewMode === mode?.key ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode(mode?.key)}
              iconName={mode?.icon}
              iconPosition="left"
            >
              {mode?.label}
            </Button>
          ))}
        </div>
      </div>
      {/* Heatmap Grid */}
      <div className="overflow-x-auto">
        <div className="min-w-full">
          {/* Time Headers */}
          <div className="flex mb-2">
            <div className="w-40 flex-shrink-0"></div>
            {timeSlots?.map(timeSlot => (
              <div key={timeSlot} className="flex-1 min-w-16 text-center">
                <span className="text-xs text-muted-foreground font-medium">{timeSlot}</span>
              </div>
            ))}
          </div>
          
          {/* Heatmap Rows */}
          {systemComponents?.map(component => (
            <div key={component?.id} className="flex items-center mb-1">
              <div className="w-40 flex-shrink-0 pr-4">
                <div className="text-sm font-medium text-card-foreground">{component?.name}</div>
                <div className="text-xs text-muted-foreground">{component?.category}</div>
              </div>
              
              {timeSlots?.map(timeSlot => {
                const cellData = heatmapData?.find(
                  data => data?.component === component?.id && data?.timeSlot === timeSlot
                );
                
                return (
                  <div
                    key={`${component?.id}-${timeSlot}`}
                    className="flex-1 min-w-16 h-12 mx-0.5 rounded cursor-pointer transition-smooth hover:scale-105 hover:shadow-md border border-border/50"
                    style={{
                      backgroundColor: cellData ? 
                        (viewMode === 'threats' ? 
                          `rgba(239, 68, 68, ${getIntensityOpacity(cellData?.intensity)})` :
                          viewMode === 'performance' ?
                          `rgba(16, 185, 129, ${getIntensityOpacity(cellData?.intensity)})` :
                          `rgba(30, 64, 175, ${getIntensityOpacity(cellData?.intensity)})`) :
                        'var(--color-muted)'
                    }}
                    onClick={() => cellData && handleCellClick(cellData)}
                    title={cellData ? 
                      `${component?.name} at ${timeSlot}\n${viewMode === 'activity' ? 'Activity' : viewMode === 'threats' ? 'Threats' : 'Performance'}: ${cellData?.intensity}%\nEvents: ${cellData?.events}\nThreats: ${cellData?.threats}` : 
                      'No data'
                    }
                  >
                    <div className="w-full h-full flex items-center justify-center">
                      {cellData && (
                        <span className="text-xs font-medium text-white drop-shadow-sm">
                          {cellData?.intensity}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
      {/* Legend */}
      <div className="flex items-center justify-between mt-6 pt-4 border-t border-border">
        <div className="flex items-center space-x-4">
          <span className="text-sm text-muted-foreground">Intensity:</span>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded bg-muted"></div>
            <span className="text-xs text-muted-foreground">Low</span>
          </div>
          <div className="flex items-center space-x-2">
            <div 
              className="w-4 h-4 rounded"
              style={{
                backgroundColor: viewMode === 'threats' ? 'rgba(239, 68, 68, 0.5)' :
                  viewMode === 'performance'? 'rgba(16, 185, 129, 0.5)': 'rgba(30, 64, 175, 0.5)'
              }}
            ></div>
            <span className="text-xs text-muted-foreground">Medium</span>
          </div>
          <div className="flex items-center space-x-2">
            <div 
              className="w-4 h-4 rounded"
              style={{
                backgroundColor: viewMode === 'threats' ? 'rgba(239, 68, 68, 1)' :
                  viewMode === 'performance'? 'rgba(16, 185, 129, 1)': 'rgba(30, 64, 175, 1)'
              }}
            ></div>
            <span className="text-xs text-muted-foreground">High</span>
          </div>
        </div>
        
        <Button
          variant="outline"
          size="sm"
          onClick={generateHeatmapData}
          iconName="RefreshCw"
          iconPosition="left"
        >
          Refresh Data
        </Button>
      </div>
      {/* Selected Component Details Modal */}
      {selectedComponent && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-lg p-6 max-w-md w-full shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-card-foreground">
                {selectedComponent?.componentName}
              </h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSelectedComponent(null)}
              >
                <Icon name="X" size={20} />
              </Button>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Time Slot:</span>
                <span className="text-sm font-medium text-card-foreground">{selectedComponent?.timeSlot}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Category:</span>
                <span className="text-sm font-medium text-card-foreground">{selectedComponent?.category}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Intensity:</span>
                <span className="text-sm font-medium text-card-foreground">{selectedComponent?.intensity}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Events:</span>
                <span className="text-sm font-medium text-card-foreground">{selectedComponent?.events}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Threats:</span>
                <span className="text-sm font-medium text-card-foreground">{selectedComponent?.threats}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Avg Response:</span>
                <span className="text-sm font-medium text-card-foreground">{selectedComponent?.responseTime}ms</span>
              </div>
            </div>
            
            <div className="mt-6 flex space-x-2">
              <Button variant="outline" size="sm" className="flex-1">
                View Details
              </Button>
              <Button variant="default" size="sm" className="flex-1">
                Investigate
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SecurityHeatmap;