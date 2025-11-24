import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const IncidentTimeline = ({ incidents, onViewEvidence, onAddResponse }) => {
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [timeFilter, setTimeFilter] = useState('24h');

  const getEventTypeConfig = (type) => {
    switch (type) {
      case 'detection':
        return { icon: 'Eye', color: 'text-primary', bg: 'bg-primary/10' };
      case 'analysis':
        return { icon: 'Search', color: 'text-accent', bg: 'bg-accent/10' };
      case 'containment':
        return { icon: 'Shield', color: 'text-warning', bg: 'bg-warning/10' };
      case 'response':
        return { icon: 'Zap', color: 'text-success', bg: 'bg-success/10' };
      case 'escalation':
        return { icon: 'ArrowUp', color: 'text-error', bg: 'bg-error/10' };
      case 'resolution':
        return { icon: 'CheckCircle', color: 'text-success', bg: 'bg-success/10' };
      default:
        return { icon: 'Clock', color: 'text-muted-foreground', bg: 'bg-muted/10' };
    }
  };

  const timeFilterOptions = [
    { value: '1h', label: '1 Hour' },
    { value: '6h', label: '6 Hours' },
    { value: '24h', label: '24 Hours' },
    { value: '7d', label: '7 Days' }
  ];

  const filteredIncidents = incidents?.filter(incident => {
    const now = new Date();
    const incidentTime = new Date(incident.timestamp);
    const timeDiff = now - incidentTime;
    
    switch (timeFilter) {
      case '1h':
        return timeDiff <= 60 * 60 * 1000;
      case '6h':
        return timeDiff <= 6 * 60 * 60 * 1000;
      case '24h':
        return timeDiff <= 24 * 60 * 60 * 1000;
      case '7d':
        return timeDiff <= 7 * 24 * 60 * 60 * 1000;
      default:
        return true;
    }
  });

  return (
    <div className="bg-card rounded-lg border border-border">
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center space-x-2">
          <Icon name="Timeline" size={20} className="text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Incident Timeline</h3>
        </div>
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1">
            {timeFilterOptions?.map((option) => (
              <Button
                key={option?.value}
                variant={timeFilter === option?.value ? 'default' : 'ghost'}
                size="xs"
                onClick={() => setTimeFilter(option?.value)}
              >
                {option?.label}
              </Button>
            ))}
          </div>
        </div>
      </div>
      <div className="p-4">
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-border"></div>
          
          <div className="space-y-6">
            {filteredIncidents?.map((incident, index) => {
              const eventConfig = getEventTypeConfig(incident?.type);
              const isSelected = selectedIncident === incident?.id;
              
              return (
                <div key={incident?.id} className="relative flex items-start space-x-4">
                  {/* Timeline node */}
                  <div className={`
                    relative z-10 flex items-center justify-center w-12 h-12 rounded-full border-2
                    ${eventConfig?.bg} ${eventConfig?.color} border-current
                  `}>
                    <Icon name={eventConfig?.icon} size={20} />
                  </div>
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div 
                      className={`
                        p-4 rounded-lg border cursor-pointer transition-smooth
                        ${isSelected ? 'border-primary bg-primary/5' : 'border-border bg-surface hover:border-primary/50'}
                      `}
                      onClick={() => setSelectedIncident(isSelected ? null : incident?.id)}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <span className={`text-xs px-2 py-1 rounded ${eventConfig?.bg} ${eventConfig?.color} font-medium`}>
                            {incident?.type?.toUpperCase()}
                          </span>
                          <span className="text-sm font-medium text-foreground">
                            {incident?.title}
                          </span>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {new Date(incident.timestamp)?.toLocaleTimeString()}
                        </span>
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-3">
                        {incident?.description}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                          <span>Actor: {incident?.actor}</span>
                          <span>Severity: {incident?.severity}</span>
                          {incident?.affectedSystems && (
                            <span>Systems: {incident?.affectedSystems}</span>
                          )}
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          {incident?.evidenceCount > 0 && (
                            <Button
                              variant="ghost"
                              size="xs"
                              onClick={(e) => {
                                e?.stopPropagation();
                                onViewEvidence(incident?.id);
                              }}
                              iconName="FileText"
                              iconPosition="left"
                            >
                              Evidence ({incident?.evidenceCount})
                            </Button>
                          )}
                          <Button
                            variant="outline"
                            size="xs"
                            onClick={(e) => {
                              e?.stopPropagation();
                              onAddResponse(incident?.id);
                            }}
                            iconName="Plus"
                            iconPosition="left"
                          >
                            Add Response
                          </Button>
                        </div>
                      </div>
                      
                      {/* Expanded details */}
                      {isSelected && incident?.details && (
                        <div className="mt-4 pt-4 border-t border-border">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                            <div>
                              <span className="text-muted-foreground">Attack Vector:</span>
                              <div className="text-foreground mt-1">{incident?.details?.attackVector}</div>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Impact:</span>
                              <div className="text-foreground mt-1">{incident?.details?.impact}</div>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Mitigation:</span>
                              <div className="text-foreground mt-1">{incident?.details?.mitigation}</div>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Status:</span>
                              <div className="text-foreground mt-1">{incident?.details?.status}</div>
                            </div>
                          </div>
                          
                          {incident?.details?.timeline && (
                            <div className="mt-4">
                              <span className="text-muted-foreground">Response Timeline:</span>
                              <div className="mt-2 space-y-2">
                                {incident?.details?.timeline?.map((event, eventIndex) => (
                                  <div key={eventIndex} className="flex items-center space-x-2 text-xs">
                                    <span className="text-muted-foreground">{event?.time}</span>
                                    <span className="text-foreground">{event?.action}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        
        {filteredIncidents?.length === 0 && (
          <div className="text-center py-8">
            <Icon name="Clock" size={48} className="text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No incidents found for the selected time range</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default IncidentTimeline;