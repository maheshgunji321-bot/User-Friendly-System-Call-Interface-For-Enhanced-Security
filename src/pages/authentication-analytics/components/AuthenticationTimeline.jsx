import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const AuthenticationTimeline = ({ events, onEventClick, className = "" }) => {
  const [filterType, setFilterType] = useState('all');
  const [timeRange, setTimeRange] = useState('24h');
  const [showSuspiciousOnly, setShowSuspiciousOnly] = useState(false);

  const eventTypes = [
    { value: 'all', label: 'All Events', icon: 'Activity' },
    { value: 'login', label: 'Logins', icon: 'LogIn' },
    { value: 'logout', label: 'Logouts', icon: 'LogOut' },
    { value: 'failed', label: 'Failed Attempts', icon: 'XCircle' },
    { value: 'suspicious', label: 'Suspicious', icon: 'AlertTriangle' }
  ];

  const timeRanges = [
    { value: '1h', label: 'Last Hour' },
    { value: '6h', label: 'Last 6 Hours' },
    { value: '24h', label: 'Last 24 Hours' },
    { value: '7d', label: 'Last 7 Days' }
  ];

  const getEventIcon = (type, status) => {
    if (status === 'suspicious') return 'AlertTriangle';
    switch (type) {
      case 'login': return status === 'success' ? 'LogIn' : 'XCircle';
      case 'logout': return 'LogOut';
      case 'password_reset': return 'Key';
      case 'mfa_challenge': return 'Shield';
      case 'account_locked': return 'Lock';
      default: return 'Activity';
    }
  };

  const getEventColor = (type, status) => {
    if (status === 'suspicious') return 'text-warning';
    if (status === 'failed' || type === 'account_locked') return 'text-error';
    if (status === 'success') return 'text-success';
    return 'text-muted-foreground';
  };

  const getEventBgColor = (type, status) => {
    if (status === 'suspicious') return 'bg-warning/10 border-warning/20';
    if (status === 'failed' || type === 'account_locked') return 'bg-error/10 border-error/20';
    if (status === 'success') return 'bg-success/10 border-success/20';
    return 'bg-muted/10 border-border';
  };

  const filteredEvents = events?.filter(event => {
    if (filterType !== 'all' && event?.type !== filterType && !(filterType === 'suspicious' && event?.status === 'suspicious')) {
      return false;
    }
    if (showSuspiciousOnly && event?.status !== 'suspicious') {
      return false;
    }
    return true;
  });

  const formatEventDescription = (event) => {
    const baseDescription = `${event?.username} ${event?.type === 'login' ? 'logged in' : 
                            event?.type === 'logout' ? 'logged out' :
                            event?.type === 'failed' ? 'failed login attempt' :
                            event?.type === 'password_reset' ? 'reset password' :
                            event?.type === 'mfa_challenge' ? 'completed MFA challenge' :
                            event?.type === 'account_locked' ? 'account locked' : event?.type}`;
    
    if (event?.location) {
      return `${baseDescription} from ${event?.location}`;
    }
    return baseDescription;
  };

  return (
    <div className={`bg-card border border-border rounded-lg p-6 ${className}`}>
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 space-y-4 lg:space-y-0">
        <div>
          <h3 className="text-lg font-semibold text-card-foreground mb-1">
            Authentication Timeline
          </h3>
          <p className="text-sm text-muted-foreground">
            Real-time authentication events with suspicious activity highlighting
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
          <div className="flex space-x-2">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e?.target?.value)}
              className="px-3 py-2 bg-input border border-border rounded-md text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            >
              {timeRanges?.map(range => (
                <option key={range?.value} value={range?.value}>
                  {range?.label}
                </option>
              ))}
            </select>
            
            <select
              value={filterType}
              onChange={(e) => setFilterType(e?.target?.value)}
              className="px-3 py-2 bg-input border border-border rounded-md text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            >
              {eventTypes?.map(type => (
                <option key={type?.value} value={type?.value}>
                  {type?.label}
                </option>
              ))}
            </select>
          </div>
          
          <div className="flex space-x-2">
            <Button
              variant={showSuspiciousOnly ? "default" : "outline"}
              size="sm"
              onClick={() => setShowSuspiciousOnly(!showSuspiciousOnly)}
              iconName="AlertTriangle"
              iconPosition="left"
            >
              Suspicious Only
            </Button>
            
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
      <div className="space-y-4 max-h-96 overflow-y-auto">
        {filteredEvents?.map((event, index) => (
          <div
            key={event?.id}
            onClick={() => onEventClick && onEventClick(event)}
            className={`
              flex items-start space-x-4 p-4 rounded-lg border cursor-pointer
              transition-smooth hover:shadow-md
              ${getEventBgColor(event?.type, event?.status)}
            `}
          >
            <div className="flex-shrink-0">
              <div className={`
                w-10 h-10 rounded-full flex items-center justify-center
                ${event?.status === 'suspicious' ? 'bg-warning/20' :
                  event?.status === 'failed' ? 'bg-error/20' :
                  event?.status === 'success' ? 'bg-success/20' : 'bg-muted/20'}
              `}>
                <Icon 
                  name={getEventIcon(event?.type, event?.status)} 
                  size={20} 
                  className={getEventColor(event?.type, event?.status)}
                />
              </div>
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-card-foreground mb-1">
                    {formatEventDescription(event)}
                  </p>
                  
                  <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <Icon name="Clock" size={12} />
                      <span>{event?.timestamp}</span>
                    </div>
                    
                    {event?.ipAddress && (
                      <div className="flex items-center space-x-1">
                        <Icon name="Globe" size={12} />
                        <span>{event?.ipAddress}</span>
                      </div>
                    )}
                    
                    {event?.device && (
                      <div className="flex items-center space-x-1">
                        <Icon name="Smartphone" size={12} />
                        <span>{event?.device}</span>
                      </div>
                    )}
                    
                    {event?.method && (
                      <div className="flex items-center space-x-1">
                        <Icon name="Key" size={12} />
                        <span>{event?.method}</span>
                      </div>
                    )}
                  </div>
                  
                  {event?.details && (
                    <p className="text-xs text-muted-foreground mt-2">
                      {event?.details}
                    </p>
                  )}
                </div>
                
                <div className="flex items-center space-x-2 ml-4">
                  {event?.status === 'suspicious' && (
                    <div className="flex items-center space-x-1 px-2 py-1 bg-warning/20 text-warning rounded-full text-xs font-medium">
                      <Icon name="AlertTriangle" size={12} />
                      <span>Suspicious</span>
                    </div>
                  )}
                  
                  {event?.riskScore && (
                    <div className={`
                      px-2 py-1 rounded-full text-xs font-medium
                      ${event?.riskScore >= 80 ? 'bg-error/20 text-error' :
                        event?.riskScore >= 60 ? 'bg-warning/20 text-warning' :
                        event?.riskScore >= 40 ? 'bg-accent/20 text-accent': 'bg-success/20 text-success'}
                    `}>
                      Risk: {event?.riskScore}
                    </div>
                  )}
                  
                  <Icon name="ChevronRight" size={16} className="text-muted-foreground" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {filteredEvents?.length === 0 && (
        <div className="text-center py-12">
          <Icon name="Activity" size={48} className="text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground mb-2">No authentication events found</p>
          <p className="text-sm text-muted-foreground">
            Try adjusting your filters or time range
          </p>
        </div>
      )}
      <div className="mt-6 flex items-center justify-between text-xs text-muted-foreground border-t border-border pt-4">
        <span>Showing {filteredEvents?.length} of {events?.length} events</span>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Icon name="RefreshCw" size={12} />
            <span>Auto-refresh: 30s</span>
          </div>
          <div className="flex items-center space-x-2">
            <Icon name="Database" size={12} />
            <span>Last updated: {new Date()?.toLocaleTimeString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthenticationTimeline;