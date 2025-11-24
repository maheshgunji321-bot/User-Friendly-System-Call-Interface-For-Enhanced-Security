import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ThreatIntelligenceFeed = ({ feeds, onRefresh }) => {
  const [selectedFeed, setSelectedFeed] = useState('all');
  const [autoRefresh, setAutoRefresh] = useState(true);

  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(() => {
        onRefresh();
      }, 30000); // Refresh every 30 seconds

      return () => clearInterval(interval);
    }
  }, [autoRefresh, onRefresh]);

  const getThreatTypeConfig = (type) => {
    switch (type) {
      case 'malware':
        return { icon: 'Bug', color: 'text-error', bg: 'bg-error/10' };
      case 'phishing':
        return { icon: 'Mail', color: 'text-warning', bg: 'bg-warning/10' };
      case 'botnet':
        return { icon: 'Network', color: 'text-accent', bg: 'bg-accent/10' };
      case 'vulnerability':
        return { icon: 'Shield', color: 'text-error', bg: 'bg-error/10' };
      case 'ioc':
        return { icon: 'Eye', color: 'text-primary', bg: 'bg-primary/10' };
      default:
        return { icon: 'AlertTriangle', color: 'text-muted-foreground', bg: 'bg-muted/10' };
    }
  };

  const getConfidenceLevel = (confidence) => {
    if (confidence >= 90) return { label: 'High', color: 'text-success', bg: 'bg-success/10' };
    if (confidence >= 70) return { label: 'Medium', color: 'text-warning', bg: 'bg-warning/10' };
    return { label: 'Low', color: 'text-error', bg: 'bg-error/10' };
  };

  const filteredFeeds = selectedFeed === 'all' 
    ? feeds 
    : feeds?.filter(feed => feed?.type === selectedFeed);

  const feedTypes = ['all', ...new Set(feeds.map(feed => feed.type))];

  return (
    <div className="bg-card rounded-lg border border-border h-full flex flex-col">
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center space-x-2">
          <Icon name="Rss" size={20} className="text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Threat Intelligence</h3>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="xs"
            onClick={() => setAutoRefresh(!autoRefresh)}
            iconName={autoRefresh ? "Pause" : "Play"}
            className={autoRefresh ? "text-success" : "text-muted-foreground"}
          />
          <Button
            variant="ghost"
            size="xs"
            onClick={onRefresh}
            iconName="RefreshCw"
          />
        </div>
      </div>
      <div className="p-4 border-b border-border">
        <div className="flex flex-wrap gap-2">
          {feedTypes?.map((type) => (
            <Button
              key={type}
              variant={selectedFeed === type ? 'default' : 'ghost'}
              size="xs"
              onClick={() => setSelectedFeed(type)}
              className="capitalize"
            >
              {type}
            </Button>
          ))}
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {filteredFeeds?.map((feed) => {
          const typeConfig = getThreatTypeConfig(feed?.type);
          const confidenceConfig = getConfidenceLevel(feed?.confidence);
          
          return (
            <div key={feed?.id} className="p-3 bg-surface rounded-lg border border-border hover:border-primary/50 transition-smooth">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <Icon name={typeConfig?.icon} size={16} className={typeConfig?.color} />
                  <span className={`text-xs px-2 py-1 rounded ${typeConfig?.bg} ${typeConfig?.color} font-medium`}>
                    {feed?.type?.toUpperCase()}
                  </span>
                  <span className={`text-xs px-2 py-1 rounded ${confidenceConfig?.bg} ${confidenceConfig?.color}`}>
                    {confidenceConfig?.label}
                  </span>
                </div>
                <span className="text-xs text-muted-foreground">{feed?.timestamp}</span>
              </div>
              <h4 className="text-sm font-medium text-foreground mb-2 line-clamp-2">
                {feed?.title}
              </h4>
              <p className="text-xs text-muted-foreground mb-3 line-clamp-3">
                {feed?.description}
              </p>
              <div className="space-y-2">
                {feed?.indicators && feed?.indicators?.length > 0 && (
                  <div>
                    <span className="text-xs text-muted-foreground">IOCs:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {feed?.indicators?.slice(0, 3)?.map((indicator, index) => (
                        <span key={index} className="text-xs px-2 py-1 bg-muted rounded font-mono">
                          {indicator}
                        </span>
                      ))}
                      {feed?.indicators?.length > 3 && (
                        <span className="text-xs text-muted-foreground">
                          +{feed?.indicators?.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-4">
                    <span className="text-muted-foreground">
                      Source: <span className="text-foreground">{feed?.source}</span>
                    </span>
                    <span className="text-muted-foreground">
                      Confidence: <span className="text-foreground">{feed?.confidence}%</span>
                    </span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Button
                      variant="ghost"
                      size="xs"
                      iconName="ExternalLink"
                      className="text-muted-foreground hover:text-foreground"
                    />
                    <Button
                      variant="ghost"
                      size="xs"
                      iconName="Bookmark"
                      className="text-muted-foreground hover:text-foreground"
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="p-4 border-t border-border">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Last updated: {new Date()?.toLocaleTimeString()}</span>
          <span>{filteredFeeds?.length} threats</span>
        </div>
      </div>
    </div>
  );
};

export default ThreatIntelligenceFeed;