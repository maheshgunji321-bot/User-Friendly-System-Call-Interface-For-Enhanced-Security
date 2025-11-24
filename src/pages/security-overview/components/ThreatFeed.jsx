import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ThreatFeed = () => {
  const [threats, setThreats] = useState([]);
  const [isAutoRefresh, setIsAutoRefresh] = useState(true);
  const [filter, setFilter] = useState('all');

  const severityLevels = [
    { key: 'all', label: 'All Threats', color: 'text-foreground' },
    { key: 'critical', label: 'Critical', color: 'text-error' },
    { key: 'high', label: 'High', color: 'text-warning' },
    { key: 'medium', label: 'Medium', color: 'text-accent' },
    { key: 'low', label: 'Low', color: 'text-success' }
  ];

  const mockThreats = [
    {
      id: 1,
      title: "Multiple Failed Authentication Attempts",
      description: "User account \'admin@company.com\' has 15 failed login attempts from IP 192.168.1.100 in the last 5 minutes",
      severity: "critical",
      timestamp: new Date(Date.now() - 120000),
      source: "Authentication Service",
      affectedSystems: ["Web Portal", "VPN Gateway"],
      status: "active"
    },
    {
      id: 2,
      title: "Suspicious System Call Pattern Detected",
      description: "Unusual sequence of file system calls detected on server \'prod-web-01\' indicating potential privilege escalation attempt",
      severity: "high",
      timestamp: new Date(Date.now() - 300000),
      source: "System Call Monitor",
      affectedSystems: ["Production Web Server"],
      status: "investigating"
    },
    {
      id: 3,
      title: "Unauthorized API Access Attempt",
      description: "API endpoint \'/admin/users\' accessed without proper authorization token from external IP address",
      severity: "medium",
      timestamp: new Date(Date.now() - 480000),
      source: "API Gateway",
      affectedSystems: ["User Management API"],
      status: "resolved"
    },
    {
      id: 4,
      title: "Anomalous Network Traffic Pattern",
      description: "Detected unusual outbound traffic volume from internal subnet 10.0.1.0/24 to external destinations",
      severity: "high",
      timestamp: new Date(Date.now() - 600000),
      source: "Network Monitor",
      affectedSystems: ["Internal Network", "Firewall"],
      status: "active"
    },
    {
      id: 5,
      title: "File Integrity Violation",
      description: "Critical system file '/etc/passwd' has been modified outside of approved maintenance window",
      severity: "critical",
      timestamp: new Date(Date.now() - 720000),
      source: "File Integrity Monitor",
      affectedSystems: ["Database Server"],
      status: "investigating"
    },
    {
      id: 6,
      title: "Brute Force Attack Detected",
      description: "SSH brute force attack detected from multiple IP addresses targeting server \'db-primary-01'",
      severity: "high",
      timestamp: new Date(Date.now() - 900000),
      source: "Intrusion Detection",
      affectedSystems: ["Database Server", "SSH Service"],
      status: "mitigated"
    },
    {
      id: 7,
      title: "Privilege Escalation Attempt",
      description: "User \'service_account\' attempted to execute commands with elevated privileges without proper authorization",
      severity: "medium",
      timestamp: new Date(Date.now() - 1200000),
      source: "Access Control Monitor",
      affectedSystems: ["Application Server"],
      status: "resolved"
    },
    {
      id: 8,
      title: "Malware Signature Detected",
      description: "Known malware signature found in uploaded file 'document.pdf' through web application",
      severity: "critical",
      timestamp: new Date(Date.now() - 1500000),
      source: "Antivirus Scanner",
      affectedSystems: ["Web Application", "File Storage"],
      status: "quarantined"
    }
  ];

  useEffect(() => {
    setThreats(mockThreats);
  }, []);

  useEffect(() => {
    if (!isAutoRefresh) return;

    const interval = setInterval(() => {
      // Simulate new threats being added
      if (Math.random() > 0.7) {
        const newThreat = {
          ...mockThreats?.[Math.floor(Math.random() * mockThreats?.length)],
          id: Date.now(),
          timestamp: new Date()
        };
        setThreats(prev => [newThreat, ...prev?.slice(0, 19)]);
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [isAutoRefresh]);

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'critical':
        return 'AlertCircle';
      case 'high':
        return 'AlertTriangle';
      case 'medium':
        return 'Info';
      case 'low':
        return 'CheckCircle';
      default:
        return 'AlertCircle';
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical':
        return 'text-error bg-error/10 border-error/20';
      case 'high':
        return 'text-warning bg-warning/10 border-warning/20';
      case 'medium':
        return 'text-accent bg-accent/10 border-accent/20';
      case 'low':
        return 'text-success bg-success/10 border-success/20';
      default:
        return 'text-muted-foreground bg-muted/10 border-border';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'text-error bg-error/10';
      case 'investigating':
        return 'text-warning bg-warning/10';
      case 'resolved':
        return 'text-success bg-success/10';
      case 'mitigated':
        return 'text-accent bg-accent/10';
      case 'quarantined':
        return 'text-secondary bg-secondary/10';
      default:
        return 'text-muted-foreground bg-muted/10';
    }
  };

  const filteredThreats = filter === 'all' 
    ? threats 
    : threats?.filter(threat => threat?.severity === filter);

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return timestamp?.toLocaleDateString();
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold text-card-foreground">Live Threat Feed</h2>
          <p className="text-sm text-muted-foreground">Real-time security alerts and incidents</p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant={isAutoRefresh ? "default" : "outline"}
            size="sm"
            onClick={() => setIsAutoRefresh(!isAutoRefresh)}
            iconName={isAutoRefresh ? "Pause" : "Play"}
            iconPosition="left"
          >
            {isAutoRefresh ? "Live" : "Paused"}
          </Button>
        </div>
      </div>
      {/* Severity Filter */}
      <div className="flex flex-wrap gap-1 mb-4">
        {severityLevels?.map((level) => (
          <button
            key={level?.key}
            onClick={() => setFilter(level?.key)}
            className={`
              px-3 py-1 rounded-md text-xs font-medium transition-smooth
              ${filter === level?.key
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80'
              }
            `}
          >
            {level?.label}
          </button>
        ))}
      </div>
      {/* Threat List */}
      <div className="flex-1 overflow-y-auto space-y-3">
        {filteredThreats?.map((threat) => (
          <div
            key={threat?.id}
            className={`p-4 rounded-lg border transition-smooth hover:shadow-md cursor-pointer ${getSeverityColor(threat?.severity)}`}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center space-x-2">
                <Icon 
                  name={getSeverityIcon(threat?.severity)} 
                  size={16} 
                  className={threat?.severity === 'critical' ? 'text-error' : threat?.severity === 'high' ? 'text-warning' : threat?.severity === 'medium' ? 'text-accent' : 'text-success'}
                />
                <span className="text-sm font-medium text-card-foreground">{threat?.title}</span>
              </div>
              <span className="text-xs text-muted-foreground">{formatTimeAgo(threat?.timestamp)}</span>
            </div>
            
            <p className="text-xs text-muted-foreground mb-3 leading-relaxed">
              {threat?.description}
            </p>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(threat?.status)}`}>
                  {threat?.status?.charAt(0)?.toUpperCase() + threat?.status?.slice(1)}
                </span>
                <span className="text-xs text-muted-foreground">
                  {threat?.source}
                </span>
              </div>
              
              <div className="flex items-center space-x-1">
                <Icon name="Server" size={12} className="text-muted-foreground" />
                <span className="text-xs text-muted-foreground">
                  {threat?.affectedSystems?.length} system{threat?.affectedSystems?.length !== 1 ? 's' : ''}
                </span>
              </div>
            </div>
          </div>
        ))}
        
        {filteredThreats?.length === 0 && (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Icon name="Shield" size={48} className="text-muted-foreground mb-4" />
            <p className="text-sm text-muted-foreground">No threats detected</p>
            <p className="text-xs text-muted-foreground">All systems are secure</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ThreatFeed;