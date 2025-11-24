import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import ThreatLevelIndicator from './components/ThreatLevelIndicator';
import SecurityMetricsBar from './components/SecurityMetricsBar';
import ActiveIncidentCard from './components/ActiveIncidentCard';
import ThreatCorrelationMatrix from './components/ThreatCorrelationMatrix';
import ThreatIntelligenceFeed from './components/ThreatIntelligenceFeed';
import IncidentTimeline from './components/IncidentTimeline';
import ThreatHuntingPanel from './components/ThreatHuntingPanel';

const ThreatDetectionCenter = () => {
  const [currentThreatLevel, setCurrentThreatLevel] = useState('high');
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  // Mock data for security metrics
  const securityMetrics = [
    {
      id: 1,
      type: 'incidents',
      label: 'Active Incidents',
      value: 23,
      unit: '',
      threshold: 15,
      trend: 'up',
      changePercent: 12,
      description: 'Currently under investigation',
      icon: 'AlertTriangle'
    },
    {
      id: 2,
      type: 'response_time',
      label: 'Mean Response Time',
      value: 4.2,
      unit: 'min',
      threshold: 5.0,
      trend: 'down',
      changePercent: 8,
      description: 'Average time to first response',
      icon: 'Clock'
    },
    {
      id: 3,
      type: 'security_score',
      label: 'Security Posture Score',
      value: 87,
      unit: '/100',
      target: 95,
      trend: 'up',
      changePercent: 3,
      description: 'Overall security health',
      icon: 'Shield'
    },
    {
      id: 4,
      type: 'threats_blocked',
      label: 'Threats Blocked',
      value: 1247,
      unit: 'today',
      trend: 'up',
      changePercent: 15,
      description: 'Automated threat prevention',
      icon: 'ShieldCheck'
    }
  ];

  // Mock data for active incidents
  const activeIncidents = [
    {
      id: 'INC-2024-001',
      title: 'Suspicious Network Traffic from External IP',
      description: 'Multiple failed authentication attempts detected from IP 203.0.113.45 targeting critical infrastructure systems.',
      severity: 'critical',
      status: 'investigating',
      detectedAt: '2 hours ago',
      source: 'Network IDS',
      assignedTo: 'Sarah Chen',
      affectedAssets: '3 servers'
    },
    {
      id: 'INC-2024-002',
      title: 'Malware Detection on Endpoint',
      description: 'Trojan.Win32.Agent detected on workstation WS-FINANCE-07 with potential data exfiltration capabilities.',
      severity: 'high',
      status: 'contained',
      detectedAt: '45 minutes ago',
      source: 'Endpoint Protection',
      assignedTo: 'Mike Rodriguez',
      affectedAssets: '1 workstation'
    },
    {
      id: 'INC-2024-003',
      title: 'Privilege Escalation Attempt',
      description: 'User account john.doe@company.com attempted to access administrative functions without proper authorization.',
      severity: 'medium',
      status: 'investigating',
      detectedAt: '1 hour ago',
      source: 'Identity Management',
      assignedTo: null,
      affectedAssets: '1 user account'
    },
    {
      id: 'INC-2024-004',
      title: 'Phishing Email Campaign Detected',
      description: 'Mass phishing campaign targeting employee credentials with fake Microsoft Office 365 login pages.',
      severity: 'high',
      status: 'escalated',
      detectedAt: '3 hours ago',
      source: 'Email Security',
      assignedTo: 'Lisa Wang',
      affectedAssets: '47 email accounts'
    }
  ];

  // Mock data for threat correlations
  const threatCorrelations = [
    {
      id: 'CORR-001',
      source: 'Network Traffic',
      type: 'Anomalous Behavior',
      strength: 0.89,
      eventCount: 156,
      timeSpan: '2 hours',
      icon: 'Network',
      connections: ['CORR-002'],
      description: 'Unusual outbound traffic patterns detected'
    },
    {
      id: 'CORR-002',
      source: 'Authentication Logs',
      type: 'Failed Logins',
      strength: 0.76,
      eventCount: 89,
      timeSpan: '1.5 hours',
      icon: 'UserX',
      connections: ['CORR-003'],
      description: 'Multiple failed authentication attempts'
    },
    {
      id: 'CORR-003',
      source: 'Endpoint Detection',
      type: 'Process Injection',
      strength: 0.92,
      eventCount: 23,
      timeSpan: '45 minutes',
      icon: 'Cpu',
      connections: [],
      description: 'Suspicious process injection activities'
    }
  ];

  // Mock data for threat intelligence feed
  const threatIntelligenceFeeds = [
    {
      id: 'TI-001',
      type: 'malware',
      title: 'New Ransomware Variant Targeting Healthcare Sector',
      description: 'A new variant of the BlackCat ransomware has been observed targeting healthcare organizations with improved evasion techniques and faster encryption capabilities.',
      source: 'CyberThreat Alliance',
      confidence: 95,
      timestamp: '15 minutes ago',
      indicators: ['203.0.113.45', 'malware.exe', 'C2-server.com']
    },
    {
      id: 'TI-002',
      type: 'phishing',
      title: 'Microsoft Office 365 Credential Harvesting Campaign',
      description: 'Large-scale phishing campaign using compromised legitimate domains to host fake Office 365 login pages targeting corporate users.',
      source: 'Microsoft Threat Intelligence',
      confidence: 88,
      timestamp: '32 minutes ago',
      indicators: ['fake-o365-login.com', 'credential-harvest.php', '198.51.100.23']
    },
    {
      id: 'TI-003',
      type: 'vulnerability',
      title: 'Critical Apache Struts RCE Vulnerability Exploited',
      description: 'Active exploitation of CVE-2023-50164 in Apache Struts framework allowing remote code execution on vulnerable web applications.',
      source: 'CISA',
      confidence: 92,
      timestamp: '1 hour ago',
      indicators: ['struts-exploit.jar', '/admin/upload.action', '192.0.2.100']
    },
    {
      id: 'TI-004',
      type: 'botnet',
      title: 'Emotet Botnet Infrastructure Resurfaces',
      description: 'The Emotet botnet has re-emerged with new command and control infrastructure after a period of inactivity, targeting financial institutions.',
      source: 'Proofpoint',
      confidence: 85,
      timestamp: '2 hours ago',
      indicators: ['emotet-c2.net', 'banking-trojan.dll', '203.0.113.67']
    },
    {
      id: 'TI-005',
      type: 'ioc',
      title: 'Suspicious Domain Registration Pattern',
      description: 'Multiple domains registered with similar patterns potentially used for typosquatting attacks against major technology companies.',
      source: 'DomainTools',
      confidence: 78,
      timestamp: '3 hours ago',
      indicators: ['microsooft.com', 'googlle.com', 'amazoon.com']
    }
  ];

  // Mock data for incident timeline
  const incidentTimelineData = [
    {
      id: 'TL-001',
      type: 'detection',
      title: 'Initial Threat Detection',
      description: 'Automated security system detected suspicious network traffic from external IP address attempting to access internal resources.',
      timestamp: new Date(Date.now() - 7200000)?.toISOString(), // 2 hours ago
      actor: 'Security System',
      severity: 'high',
      affectedSystems: 'Firewall, IDS',
      evidenceCount: 3,
      details: {
        attackVector: 'Network-based intrusion attempt',
        impact: 'Potential data exfiltration risk',
        mitigation: 'IP address blocked, monitoring enhanced',
        status: 'Active investigation',
        timeline: [
          { time: '14:30', action: 'Initial detection by IDS' },
          { time: '14:32', action: 'Automated IP blocking activated' },
          { time: '14:35', action: 'SOC team notified' }
        ]
      }
    },
    {
      id: 'TL-002',
      type: 'analysis',
      title: 'Threat Analysis Initiated',
      description: 'Security analyst began detailed investigation of the detected threat, analyzing network logs and identifying attack patterns.',
      timestamp: new Date(Date.now() - 6600000)?.toISOString(), // 1.8 hours ago
      actor: 'Sarah Chen',
      severity: 'high',
      affectedSystems: 'SIEM, Log Analysis',
      evidenceCount: 7,
      details: {
        attackVector: 'Multi-vector attack analysis',
        impact: 'Confirmed malicious intent',
        mitigation: 'Enhanced monitoring deployed',
        status: 'Analysis in progress'
      }
    },
    {
      id: 'TL-003',
      type: 'containment',
      title: 'Containment Measures Deployed',
      description: 'Additional security controls activated to prevent lateral movement and protect critical assets from potential compromise.',
      timestamp: new Date(Date.now() - 5400000)?.toISOString(), // 1.5 hours ago
      actor: 'Mike Rodriguez',
      severity: 'medium',
      affectedSystems: 'Network Segmentation',
      evidenceCount: 2,
      details: {
        attackVector: 'Containment protocol execution',
        impact: 'Threat movement restricted',
        mitigation: 'Network isolation implemented',
        status: 'Containment successful'
      }
    },
    {
      id: 'TL-004',
      type: 'response',
      title: 'Incident Response Coordination',
      description: 'Cross-functional incident response team assembled to coordinate comprehensive threat mitigation and system recovery efforts.',
      timestamp: new Date(Date.now() - 3600000)?.toISOString(), // 1 hour ago
      actor: 'Lisa Wang',
      severity: 'high',
      affectedSystems: 'All Systems',
      evidenceCount: 5,
      details: {
        attackVector: 'Coordinated response strategy',
        impact: 'Organizational threat response',
        mitigation: 'Full incident response protocol',
        status: 'Response team active'
      }
    }
  ];

  // Mock data for saved queries
  const savedQueries = [
    {
      id: 'QUERY-001',
      name: 'High Severity Network Anomalies',
      type: 'builder',
      parameters: {
        source: 'network',
        timeRange: '24h',
        severity: 'high',
        keywords: 'anomaly, intrusion',
        ipAddress: '',
        userId: ''
      },
      timestamp: '2024-11-06T10:30:00Z'
    },
    {
      id: 'QUERY-002',
      name: 'Failed Authentication Analysis',
      type: 'custom',
      parameters: {
        query: `SELECT user_id, ip_address, COUNT(*) as failed_attempts
FROM auth_logs 
WHERE success = false 
AND timestamp > NOW() - INTERVAL 1 HOUR
GROUP BY user_id, ip_address
HAVING failed_attempts > 5
ORDER BY failed_attempts DESC`
      },
      timestamp: '2024-11-05T15:45:00Z'
    },
    {
      id: 'QUERY-003',
      name: 'Malware Detection Summary',
      type: 'builder',
      parameters: {
        source: 'endpoint',
        timeRange: '7d',
        severity: 'critical',
        keywords: 'malware, trojan, virus',
        ipAddress: '',
        userId: ''
      },
      timestamp: '2024-11-04T09:15:00Z'
    }
  ];

  const handleEscalateIncident = (incidentId) => {
    console.log('Escalating incident:', incidentId);
    // Implementation for incident escalation
  };

  const handleAssignIncident = (incidentId) => {
    console.log('Assigning incident:', incidentId);
    // Implementation for incident assignment
  };

  const handleViewIncidentDetails = (incidentId) => {
    setSelectedIncident(incidentId);
    console.log('Viewing incident details:', incidentId);
  };

  const handleDrillDownCorrelation = (correlationId) => {
    console.log('Drilling down correlation:', correlationId);
    // Implementation for correlation drill-down
  };

  const handleRefreshThreatFeed = () => {
    setRefreshKey(prev => prev + 1);
    console.log('Refreshing threat intelligence feed');
  };

  const handleViewEvidence = (incidentId) => {
    console.log('Viewing evidence for incident:', incidentId);
    // Implementation for evidence viewing
  };

  const handleAddResponse = (incidentId) => {
    console.log('Adding response to incident:', incidentId);
    // Implementation for adding response
  };

  const handleExecuteQuery = (query) => {
    console.log('Executing query:', query);
    // Implementation for query execution
  };

  const handleSaveQuery = (query) => {
    console.log('Saving query:', query);
    // Implementation for saving query
  };

  useEffect(() => {
    // Simulate real-time threat level updates
    const interval = setInterval(() => {
      const levels = ['low', 'medium', 'high', 'critical'];
      const randomLevel = levels?.[Math.floor(Math.random() * levels?.length)];
      if (Math.random() > 0.8) {
        setCurrentThreatLevel(randomLevel);
      }
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16">
        <div className="max-w-7xl mx-auto p-6 space-y-6">
          {/* Priority Status Bar */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <ThreatLevelIndicator 
                level={currentThreatLevel}
                score={87}
                trend="up"
              />
            </div>
            <div className="flex items-center justify-center lg:justify-end">
              <div className="text-center lg:text-right">
                <div className="text-2xl font-bold text-foreground">
                  {new Date()?.toLocaleTimeString()}
                </div>
                <div className="text-sm text-muted-foreground">
                  Last Updated: {new Date()?.toLocaleString()}
                </div>
              </div>
            </div>
          </div>

          {/* Security Metrics */}
          <SecurityMetricsBar metrics={securityMetrics} />

          {/* Main Dashboard Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Alert Management Section */}
            <div className="lg:col-span-1 space-y-4">
              <div className="bg-card rounded-lg border border-border">
                <div className="p-4 border-b border-border">
                  <h3 className="text-lg font-semibold text-foreground flex items-center space-x-2">
                    <span>Active Incidents</span>
                    <span className="text-sm bg-error text-error-foreground px-2 py-1 rounded-full">
                      {activeIncidents?.length}
                    </span>
                  </h3>
                </div>
                <div className="p-4 space-y-4 max-h-96 overflow-y-auto">
                  {activeIncidents?.map((incident) => (
                    <ActiveIncidentCard
                      key={incident?.id}
                      incident={incident}
                      onEscalate={handleEscalateIncident}
                      onAssign={handleAssignIncident}
                      onViewDetails={handleViewIncidentDetails}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Threat Correlation Matrix */}
            <div className="lg:col-span-2">
              <ThreatCorrelationMatrix
                correlations={threatCorrelations}
                onDrillDown={handleDrillDownCorrelation}
              />
            </div>
          </div>

          {/* Secondary Dashboard Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Threat Intelligence Feed */}
            <div className="lg:col-span-1">
              <ThreatIntelligenceFeed
                feeds={threatIntelligenceFeeds}
                onRefresh={handleRefreshThreatFeed}
              />
            </div>

            {/* Incident Timeline */}
            <div className="lg:col-span-3">
              <IncidentTimeline
                incidents={incidentTimelineData}
                onViewEvidence={handleViewEvidence}
                onAddResponse={handleAddResponse}
              />
            </div>
          </div>

          {/* Threat Hunting Panel */}
          <ThreatHuntingPanel
            savedQueries={savedQueries}
            onExecuteQuery={handleExecuteQuery}
            onSaveQuery={handleSaveQuery}
          />
        </div>
      </main>
    </div>
  );
};

export default ThreatDetectionCenter;