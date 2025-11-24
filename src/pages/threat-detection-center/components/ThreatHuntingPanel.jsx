import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const ThreatHuntingPanel = ({ savedQueries, onExecuteQuery, onSaveQuery }) => {
  const [activeTab, setActiveTab] = useState('builder');
  const [queryBuilder, setQueryBuilder] = useState({
    source: '',
    timeRange: '24h',
    severity: '',
    keywords: '',
    ipAddress: '',
    userId: ''
  });
  const [customQuery, setCustomQuery] = useState('');
  const [queryName, setQueryName] = useState('');

  const sourceOptions = [
    { value: '', label: 'All Sources' },
    { value: 'firewall', label: 'Firewall Logs' },
    { value: 'ids', label: 'IDS/IPS' },
    { value: 'endpoint', label: 'Endpoint Detection' },
    { value: 'network', label: 'Network Traffic' },
    { value: 'auth', label: 'Authentication Logs' }
  ];

  const timeRangeOptions = [
    { value: '1h', label: 'Last Hour' },
    { value: '6h', label: 'Last 6 Hours' },
    { value: '24h', label: 'Last 24 Hours' },
    { value: '7d', label: 'Last 7 Days' },
    { value: '30d', label: 'Last 30 Days' }
  ];

  const severityOptions = [
    { value: '', label: 'All Severities' },
    { value: 'critical', label: 'Critical' },
    { value: 'high', label: 'High' },
    { value: 'medium', label: 'Medium' },
    { value: 'low', label: 'Low' }
  ];

  const handleBuilderChange = (field, value) => {
    setQueryBuilder(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleExecuteBuilderQuery = () => {
    const query = {
      type: 'builder',
      parameters: queryBuilder,
      timestamp: new Date()?.toISOString()
    };
    onExecuteQuery(query);
  };

  const handleExecuteCustomQuery = () => {
    const query = {
      type: 'custom',
      query: customQuery,
      timestamp: new Date()?.toISOString()
    };
    onExecuteQuery(query);
  };

  const handleSaveQuery = () => {
    if (!queryName?.trim()) return;
    
    const query = {
      name: queryName,
      type: activeTab,
      parameters: activeTab === 'builder' ? queryBuilder : { query: customQuery },
      timestamp: new Date()?.toISOString()
    };
    onSaveQuery(query);
    setQueryName('');
  };

  const handleLoadSavedQuery = (savedQuery) => {
    if (savedQuery?.type === 'builder') {
      setQueryBuilder(savedQuery?.parameters);
      setActiveTab('builder');
    } else {
      setCustomQuery(savedQuery?.parameters?.query);
      setActiveTab('custom');
    }
  };

  return (
    <div className="bg-card rounded-lg border border-border">
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center space-x-2">
          <Icon name="Search" size={20} className="text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Threat Hunting</h3>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant={activeTab === 'builder' ? 'default' : 'ghost'}
            size="xs"
            onClick={() => setActiveTab('builder')}
          >
            Query Builder
          </Button>
          <Button
            variant={activeTab === 'custom' ? 'default' : 'ghost'}
            size="xs"
            onClick={() => setActiveTab('custom')}
          >
            Custom Query
          </Button>
          <Button
            variant={activeTab === 'saved' ? 'default' : 'ghost'}
            size="xs"
            onClick={() => setActiveTab('saved')}
          >
            Saved Queries
          </Button>
        </div>
      </div>
      <div className="p-4">
        {activeTab === 'builder' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Select
                label="Data Source"
                options={sourceOptions}
                value={queryBuilder?.source}
                onChange={(value) => handleBuilderChange('source', value)}
              />
              <Select
                label="Time Range"
                options={timeRangeOptions}
                value={queryBuilder?.timeRange}
                onChange={(value) => handleBuilderChange('timeRange', value)}
              />
              <Select
                label="Severity"
                options={severityOptions}
                value={queryBuilder?.severity}
                onChange={(value) => handleBuilderChange('severity', value)}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Input
                label="Keywords"
                type="text"
                placeholder="malware, phishing, etc."
                value={queryBuilder?.keywords}
                onChange={(e) => handleBuilderChange('keywords', e?.target?.value)}
              />
              <Input
                label="IP Address"
                type="text"
                placeholder="192.168.1.1"
                value={queryBuilder?.ipAddress}
                onChange={(e) => handleBuilderChange('ipAddress', e?.target?.value)}
              />
              <Input
                label="User ID"
                type="text"
                placeholder="user@domain.com"
                value={queryBuilder?.userId}
                onChange={(e) => handleBuilderChange('userId', e?.target?.value)}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Input
                type="text"
                placeholder="Query name (optional)"
                value={queryName}
                onChange={(e) => setQueryName(e?.target?.value)}
                className="flex-1"
              />
              <Button
                variant="outline"
                onClick={handleSaveQuery}
                disabled={!queryName?.trim()}
                iconName="Save"
                iconPosition="left"
              >
                Save Query
              </Button>
              <Button
                variant="default"
                onClick={handleExecuteBuilderQuery}
                iconName="Play"
                iconPosition="left"
              >
                Execute
              </Button>
            </div>
          </div>
        )}

        {activeTab === 'custom' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Custom Query (KQL/SQL)
              </label>
              <textarea
                className="w-full h-32 p-3 bg-input border border-border rounded-md text-foreground font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder={`SELECT * FROM security_events 
WHERE severity = 'high' 
AND timestamp > NOW() - INTERVAL 24 HOUR
ORDER BY timestamp DESC`}
                value={customQuery}
                onChange={(e) => setCustomQuery(e?.target?.value)}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Input
                type="text"
                placeholder="Query name (optional)"
                value={queryName}
                onChange={(e) => setQueryName(e?.target?.value)}
                className="flex-1"
              />
              <Button
                variant="outline"
                onClick={handleSaveQuery}
                disabled={!queryName?.trim() || !customQuery?.trim()}
                iconName="Save"
                iconPosition="left"
              >
                Save Query
              </Button>
              <Button
                variant="default"
                onClick={handleExecuteCustomQuery}
                disabled={!customQuery?.trim()}
                iconName="Play"
                iconPosition="left"
              >
                Execute
              </Button>
            </div>
          </div>
        )}

        {activeTab === 'saved' && (
          <div className="space-y-3">
            {savedQueries?.length === 0 ? (
              <div className="text-center py-8">
                <Icon name="BookOpen" size={48} className="text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No saved queries yet</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Create and save queries using the Builder or Custom tabs
                </p>
              </div>
            ) : (
              savedQueries?.map((query) => (
                <div key={query?.id} className="p-3 bg-surface rounded-lg border border-border">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <Icon 
                        name={query?.type === 'builder' ? 'Settings' : 'Code'} 
                        size={16} 
                        className="text-primary" 
                      />
                      <span className="font-medium text-foreground">{query?.name}</span>
                      <span className={`text-xs px-2 py-1 rounded ${
                        query?.type === 'builder' ? 'bg-primary/10 text-primary' : 'bg-accent/10 text-accent'
                      }`}>
                        {query?.type}
                      </span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {new Date(query.timestamp)?.toLocaleDateString()}
                    </span>
                  </div>

                  <div className="text-sm text-muted-foreground mb-3">
                    {query?.type === 'builder' ? (
                      <div className="space-y-1">
                        {query?.parameters?.source && <div>Source: {query?.parameters?.source}</div>}
                        {query?.parameters?.timeRange && <div>Time: {query?.parameters?.timeRange}</div>}
                        {query?.parameters?.severity && <div>Severity: {query?.parameters?.severity}</div>}
                        {query?.parameters?.keywords && <div>Keywords: {query?.parameters?.keywords}</div>}
                      </div>
                    ) : (
                      <div className="font-mono text-xs bg-muted p-2 rounded">
                        {query?.parameters?.query?.substring(0, 100)}...
                      </div>
                    )}
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="xs"
                      onClick={() => handleLoadSavedQuery(query)}
                      iconName="Upload"
                      iconPosition="left"
                    >
                      Load
                    </Button>
                    <Button
                      variant="ghost"
                      size="xs"
                      onClick={() => onExecuteQuery(query)}
                      iconName="Play"
                      iconPosition="left"
                    >
                      Execute
                    </Button>
                    <Button
                      variant="ghost"
                      size="xs"
                      iconName="Trash2"
                      className="text-error hover:text-error"
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ThreatHuntingPanel;