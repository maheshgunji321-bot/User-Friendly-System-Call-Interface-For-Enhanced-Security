import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ThreatCorrelationMatrix = ({ correlations, onDrillDown }) => {
  const [selectedNode, setSelectedNode] = useState(null);
  const [viewMode, setViewMode] = useState('network'); // network, timeline, table

  const getCorrelationStrength = (strength) => {
    if (strength >= 0.8) return { color: 'text-error', bg: 'bg-error/20', label: 'High' };
    if (strength >= 0.6) return { color: 'text-warning', bg: 'bg-warning/20', label: 'Medium' };
    if (strength >= 0.4) return { color: 'text-accent', bg: 'bg-accent/20', label: 'Low' };
    return { color: 'text-muted-foreground', bg: 'bg-muted/20', label: 'Weak' };
  };

  const renderNetworkView = () => (
    <div className="relative h-96 bg-surface rounded-lg border border-border p-4">
      <div className="grid grid-cols-3 gap-4 h-full">
        {correlations?.map((correlation, index) => {
          const strengthConfig = getCorrelationStrength(correlation?.strength);
          return (
            <div
              key={correlation?.id}
              className={`
                relative p-3 rounded-lg border cursor-pointer transition-smooth
                ${selectedNode === correlation?.id ? 'border-primary bg-primary/10' : 'border-border bg-card'}
                hover:border-primary/50
              `}
              onClick={() => setSelectedNode(correlation?.id)}
            >
              <div className="flex items-center space-x-2 mb-2">
                <Icon name={correlation?.icon} size={16} className="text-primary" />
                <span className="text-sm font-medium text-foreground">{correlation?.source}</span>
              </div>
              <div className="text-xs text-muted-foreground mb-2">{correlation?.type}</div>
              <div className={`text-xs px-2 py-1 rounded ${strengthConfig?.bg} ${strengthConfig?.color}`}>
                {strengthConfig?.label} ({(correlation?.strength * 100)?.toFixed(0)}%)
              </div>
              {/* Connection lines */}
              {correlation?.connections && correlation?.connections?.map((conn, connIndex) => (
                <div
                  key={connIndex}
                  className="absolute top-1/2 left-full w-8 h-0.5 bg-primary/50 transform -translate-y-1/2"
                  style={{ display: index < correlations?.length - 1 ? 'block' : 'none' }}
                />
              ))}
            </div>
          );
        })}
      </div>
      
      {selectedNode && (
        <div className="absolute bottom-4 right-4 p-3 bg-popover border border-border rounded-lg shadow-lg">
          <div className="text-sm font-medium text-foreground mb-2">Correlation Details</div>
          <div className="text-xs text-muted-foreground space-y-1">
            <div>Events: {correlations?.find(c => c?.id === selectedNode)?.eventCount}</div>
            <div>Time Span: {correlations?.find(c => c?.id === selectedNode)?.timeSpan}</div>
            <div>Confidence: {(correlations?.find(c => c?.id === selectedNode)?.strength * 100)?.toFixed(1)}%</div>
          </div>
          <Button
            variant="outline"
            size="xs"
            onClick={() => onDrillDown(selectedNode)}
            iconName="ZoomIn"
            iconPosition="left"
            className="mt-2 w-full"
          >
            Drill Down
          </Button>
        </div>
      )}
    </div>
  );

  const renderTimelineView = () => (
    <div className="space-y-3">
      {correlations?.map((correlation) => {
        const strengthConfig = getCorrelationStrength(correlation?.strength);
        return (
          <div key={correlation?.id} className="flex items-center space-x-4 p-3 bg-card rounded-lg border border-border">
            <div className="flex-shrink-0">
              <div className={`w-3 h-3 rounded-full ${strengthConfig?.bg}`} />
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <Icon name={correlation?.icon} size={14} className="text-primary" />
                <span className="text-sm font-medium text-foreground">{correlation?.source}</span>
                <span className={`text-xs px-2 py-0.5 rounded ${strengthConfig?.bg} ${strengthConfig?.color}`}>
                  {strengthConfig?.label}
                </span>
              </div>
              <div className="text-xs text-muted-foreground">{correlation?.description}</div>
            </div>
            <div className="text-xs text-muted-foreground">{correlation?.timestamp}</div>
          </div>
        );
      })}
    </div>
  );

  const renderTableView = () => (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border">
            <th className="text-left p-3 text-muted-foreground font-medium">Source</th>
            <th className="text-left p-3 text-muted-foreground font-medium">Type</th>
            <th className="text-left p-3 text-muted-foreground font-medium">Strength</th>
            <th className="text-left p-3 text-muted-foreground font-medium">Events</th>
            <th className="text-left p-3 text-muted-foreground font-medium">Time Span</th>
            <th className="text-left p-3 text-muted-foreground font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {correlations?.map((correlation) => {
            const strengthConfig = getCorrelationStrength(correlation?.strength);
            return (
              <tr key={correlation?.id} className="border-b border-border hover:bg-muted/5">
                <td className="p-3">
                  <div className="flex items-center space-x-2">
                    <Icon name={correlation?.icon} size={14} className="text-primary" />
                    <span className="text-foreground">{correlation?.source}</span>
                  </div>
                </td>
                <td className="p-3 text-muted-foreground">{correlation?.type}</td>
                <td className="p-3">
                  <span className={`px-2 py-1 rounded text-xs ${strengthConfig?.bg} ${strengthConfig?.color}`}>
                    {(correlation?.strength * 100)?.toFixed(0)}%
                  </span>
                </td>
                <td className="p-3 text-muted-foreground">{correlation?.eventCount}</td>
                <td className="p-3 text-muted-foreground">{correlation?.timeSpan}</td>
                <td className="p-3">
                  <Button
                    variant="ghost"
                    size="xs"
                    onClick={() => onDrillDown(correlation?.id)}
                    iconName="ExternalLink"
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="bg-card rounded-lg border border-border">
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center space-x-2">
          <Icon name="GitBranch" size={20} className="text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Threat Correlation Matrix</h3>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant={viewMode === 'network' ? 'default' : 'ghost'}
            size="xs"
            onClick={() => setViewMode('network')}
            iconName="Network"
          >
            Network
          </Button>
          <Button
            variant={viewMode === 'timeline' ? 'default' : 'ghost'}
            size="xs"
            onClick={() => setViewMode('timeline')}
            iconName="Clock"
          >
            Timeline
          </Button>
          <Button
            variant={viewMode === 'table' ? 'default' : 'ghost'}
            size="xs"
            onClick={() => setViewMode('table')}
            iconName="Table"
          >
            Table
          </Button>
        </div>
      </div>
      
      <div className="p-4">
        {viewMode === 'network' && renderNetworkView()}
        {viewMode === 'timeline' && renderTimelineView()}
        {viewMode === 'table' && renderTableView()}
      </div>
    </div>
  );
};

export default ThreatCorrelationMatrix;