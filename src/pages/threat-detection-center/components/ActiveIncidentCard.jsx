import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ActiveIncidentCard = ({ incident, onEscalate, onAssign, onViewDetails }) => {
  const getSeverityConfig = (severity) => {
    switch (severity) {
      case 'critical':
        return {
          color: 'text-error',
          bgColor: 'bg-error/10',
          borderColor: 'border-error',
          icon: 'AlertTriangle'
        };
      case 'high':
        return {
          color: 'text-warning',
          bgColor: 'bg-warning/10',
          borderColor: 'border-warning',
          icon: 'AlertCircle'
        };
      case 'medium':
        return {
          color: 'text-accent',
          bgColor: 'bg-accent/10',
          borderColor: 'border-accent',
          icon: 'Info'
        };
      case 'low':
        return {
          color: 'text-success',
          bgColor: 'bg-success/10',
          borderColor: 'border-success',
          icon: 'CheckCircle'
        };
      default:
        return {
          color: 'text-muted-foreground',
          bgColor: 'bg-muted/10',
          borderColor: 'border-muted',
          icon: 'Shield'
        };
    }
  };

  const getStatusConfig = (status) => {
    switch (status) {
      case 'investigating':
        return { color: 'text-warning', label: 'Investigating' };
      case 'contained':
        return { color: 'text-accent', label: 'Contained' };
      case 'resolved':
        return { color: 'text-success', label: 'Resolved' };
      case 'escalated':
        return { color: 'text-error', label: 'Escalated' };
      default:
        return { color: 'text-muted-foreground', label: 'New' };
    }
  };

  const severityConfig = getSeverityConfig(incident?.severity);
  const statusConfig = getStatusConfig(incident?.status);

  return (
    <div className={`p-4 rounded-lg border ${severityConfig?.borderColor} bg-card hover:bg-muted/5 transition-smooth`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-2">
          <Icon name={severityConfig?.icon} size={16} className={severityConfig?.color} />
          <span className={`text-xs font-medium px-2 py-1 rounded ${severityConfig?.bgColor} ${severityConfig?.color}`}>
            {incident?.severity?.toUpperCase()}
          </span>
          <span className={`text-xs font-medium px-2 py-1 rounded bg-muted ${statusConfig?.color}`}>
            {statusConfig?.label}
          </span>
        </div>
        <span className="text-xs text-muted-foreground">#{incident?.id}</span>
      </div>
      <h4 className="font-semibold text-foreground mb-2 line-clamp-2">
        {incident?.title}
      </h4>
      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
        {incident?.description}
      </p>
      <div className="space-y-2 mb-4">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Detected:</span>
          <span className="text-foreground">{incident?.detectedAt}</span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Source:</span>
          <span className="text-foreground">{incident?.source}</span>
        </div>
        {incident?.assignedTo && (
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Assigned:</span>
            <span className="text-foreground">{incident?.assignedTo}</span>
          </div>
        )}
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Affected Assets:</span>
          <span className="text-foreground">{incident?.affectedAssets}</span>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="xs"
          onClick={() => onViewDetails(incident?.id)}
          iconName="Eye"
          iconPosition="left"
          className="flex-1"
        >
          Details
        </Button>
        <Button
          variant="secondary"
          size="xs"
          onClick={() => onAssign(incident?.id)}
          iconName="User"
          iconPosition="left"
        >
          Assign
        </Button>
        {incident?.severity === 'critical' && (
          <Button
            variant="destructive"
            size="xs"
            onClick={() => onEscalate(incident?.id)}
            iconName="ArrowUp"
            iconPosition="left"
          >
            Escalate
          </Button>
        )}
      </div>
    </div>
  );
};

export default ActiveIncidentCard;