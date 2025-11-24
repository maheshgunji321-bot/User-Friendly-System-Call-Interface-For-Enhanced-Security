import React, { useState, useEffect, useMemo } from 'react';
import Icon from '../../../components/AppIcon';

const SystemCallHeatmap = ({ selectedProcess, onProcessSelect, refreshRate }) => {
  const [heatmapData, setHeatmapData] = useState([]);
  const [hoveredCell, setHoveredCell] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(1);

  // Mock system call data generation
  const generateHeatmapData = () => {
    const processes = [
      'kernel', 'systemd', 'chrome', 'firefox', 'vscode', 'docker', 'nginx', 'mysql',
      'node', 'python', 'ssh', 'apache', 'postgres', 'redis', 'mongodb', 'java'
    ];
    
    const callTypes = [
      'read', 'write', 'open', 'close', 'fork', 'exec', 'mmap', 'socket',
      'connect', 'bind', 'listen', 'accept', 'sendto', 'recvfrom', 'ioctl', 'fcntl'
    ];

    const timeSlots = 24; // 24 hour slots
    const data = [];

    processes?.forEach((process, pIndex) => {
      for (let hour = 0; hour < timeSlots; hour++) {
        callTypes?.forEach((callType, cIndex) => {
          const baseIntensity = Math.random() * 100;
          const timeMultiplier = Math.sin((hour / 24) * Math.PI * 2) * 0.3 + 0.7;
          const processMultiplier = process === 'kernel' ? 2 : process === 'chrome' ? 1.5 : 1;
          
          const intensity = Math.max(0, baseIntensity * timeMultiplier * processMultiplier);
          const isAnomalous = Math.random() > 0.95;
          
          data?.push({
            process,
            callType,
            hour,
            intensity: Math.round(intensity),
            callCount: Math.round(intensity * 10),
            isAnomalous,
            riskLevel: isAnomalous ? 'high' : intensity > 70 ? 'medium' : 'low',
            timestamp: new Date(2025, 10, 7, hour, 0, 0)?.toISOString()
          });
        });
      }
    });

    return data;
  };

  useEffect(() => {
    const updateData = () => {
      setHeatmapData(generateHeatmapData());
    };

    updateData();
    const interval = setInterval(updateData, refreshRate * 1000);
    return () => clearInterval(interval);
  }, [refreshRate]);

  const filteredData = useMemo(() => {
    if (!selectedProcess) return heatmapData;
    return heatmapData?.filter(item => item?.process === selectedProcess);
  }, [heatmapData, selectedProcess]);

  const getIntensityColor = (intensity, isAnomalous) => {
    if (isAnomalous) return 'bg-error';
    if (intensity > 80) return 'bg-warning';
    if (intensity > 60) return 'bg-amber-600';
    if (intensity > 40) return 'bg-amber-500';
    if (intensity > 20) return 'bg-amber-400';
    return 'bg-muted';
  };

  const getIntensityOpacity = (intensity) => {
    return Math.max(0.1, intensity / 100);
  };

  const processes = [...new Set(heatmapData.map(item => item.process))];
  const callTypes = [...new Set(heatmapData.map(item => item.callType))];
  const hours = [...new Set(heatmapData.map(item => item.hour))]?.sort((a, b) => a - b);

  const handleCellClick = (process, callType, hour) => {
    const cellData = heatmapData?.find(
      item => item?.process === process && item?.callType === callType && item?.hour === hour
    );
    if (cellData && onProcessSelect) {
      onProcessSelect(process);
    }
  };

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.2, 2));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.2, 0.5));
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Icon name="Grid3X3" size={20} className="text-primary" />
          <h3 className="text-lg font-semibold text-foreground">System Call Heatmap</h3>
          {selectedProcess && (
            <span className="px-2 py-1 bg-primary text-primary-foreground text-xs rounded-md">
              Filtered: {selectedProcess}
            </span>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={handleZoomOut}
            className="p-1 hover:bg-muted rounded transition-smooth"
            title="Zoom Out"
          >
            <Icon name="ZoomOut" size={16} className="text-muted-foreground" />
          </button>
          <span className="text-xs text-muted-foreground px-2">
            {Math.round(zoomLevel * 100)}%
          </span>
          <button
            onClick={handleZoomIn}
            className="p-1 hover:bg-muted rounded transition-smooth"
            title="Zoom In"
          >
            <Icon name="ZoomIn" size={16} className="text-muted-foreground" />
          </button>
        </div>
      </div>
      <div className="overflow-auto max-h-96" style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'top left' }}>
        <div className="grid gap-1 min-w-max" style={{ gridTemplateColumns: `120px repeat(${hours?.length}, 40px)` }}>
          {/* Header row */}
          <div className="sticky left-0 bg-card z-10"></div>
          {hours?.map(hour => (
            <div key={hour} className="text-xs text-center text-muted-foreground p-1">
              {hour?.toString()?.padStart(2, '0')}:00
            </div>
          ))}

          {/* Process rows */}
          {processes?.map(process => (
            <React.Fragment key={process}>
              <div className="sticky left-0 bg-card z-10 text-xs font-medium text-foreground p-2 border-r border-border">
                {process}
              </div>
              {hours?.map(hour => {
                const cellData = filteredData?.find(
                  item => item?.process === process && item?.hour === hour
                );
                const avgIntensity = cellData ? cellData?.intensity : 0;
                const isAnomalous = cellData ? cellData?.isAnomalous : false;
                
                return (
                  <div
                    key={`${process}-${hour}`}
                    className={`
                      relative h-8 cursor-pointer border border-border/50 transition-smooth
                      ${getIntensityColor(avgIntensity, isAnomalous)}
                      hover:ring-2 hover:ring-primary hover:ring-opacity-50
                    `}
                    style={{ opacity: getIntensityOpacity(avgIntensity) }}
                    onClick={() => handleCellClick(process, 'all', hour)}
                    onMouseEnter={() => setHoveredCell({ process, hour, data: cellData })}
                    onMouseLeave={() => setHoveredCell(null)}
                  >
                    {isAnomalous && (
                      <div className="absolute top-0 right-0 w-2 h-2 bg-error rounded-full animate-pulse-status"></div>
                    )}
                  </div>
                );
              })}
            </React.Fragment>
          ))}
        </div>
      </div>
      {/* Hover tooltip */}
      {hoveredCell && (
        <div className="fixed z-tooltip bg-popover border border-border rounded-lg shadow-lg p-3 pointer-events-none"
             style={{ 
               left: '50%', 
               top: '50%', 
               transform: 'translate(-50%, -50%)',
               maxWidth: '250px'
             }}>
          <div className="text-sm font-medium text-popover-foreground mb-2">
            {hoveredCell?.process} @ {hoveredCell?.hour?.toString()?.padStart(2, '0')}:00
          </div>
          {hoveredCell?.data && (
            <div className="space-y-1 text-xs text-muted-foreground">
              <div>Intensity: {hoveredCell?.data?.intensity}%</div>
              <div>Call Count: {hoveredCell?.data?.callCount?.toLocaleString()}</div>
              <div>Risk Level: 
                <span className={`ml-1 ${
                  hoveredCell?.data?.riskLevel === 'high' ? 'text-error' :
                  hoveredCell?.data?.riskLevel === 'medium' ? 'text-warning' : 'text-success'
                }`}>
                  {hoveredCell?.data?.riskLevel}
                </span>
              </div>
              {hoveredCell?.data?.isAnomalous && (
                <div className="text-error font-medium">⚠ Anomalous Activity</div>
              )}
            </div>
          )}
        </div>
      )}
      {/* Legend */}
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
        <div className="flex items-center space-x-4">
          <span className="text-xs text-muted-foreground">Intensity:</span>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-muted rounded"></div>
            <span className="text-xs text-muted-foreground">Low</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-amber-500 rounded"></div>
            <span className="text-xs text-muted-foreground">Medium</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-warning rounded"></div>
            <span className="text-xs text-muted-foreground">High</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-error rounded"></div>
            <span className="text-xs text-muted-foreground">Anomalous</span>
          </div>
        </div>
        
        <div className="text-xs text-muted-foreground">
          Last updated: {new Date()?.toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
};

export default SystemCallHeatmap;