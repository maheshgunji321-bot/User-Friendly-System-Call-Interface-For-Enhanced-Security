import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { Checkbox } from '../../../components/ui/Checkbox';

const FilterPanel = ({ 
  filters, 
  onFiltersChange, 
  onSaveBookmark, 
  savedBookmarks = [],
  onLoadBookmark,
  className = "" 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [bookmarkName, setBookmarkName] = useState('');
  const [showBookmarkInput, setShowBookmarkInput] = useState(false);

  const dateRangePresets = [
    { label: 'Last 15 minutes', value: '15m' },
    { label: 'Last hour', value: '1h' },
    { label: 'Last 4 hours', value: '4h' },
    { label: 'Last 24 hours', value: '24h' },
    { label: 'Last 7 days', value: '7d' },
    { label: 'Last 30 days', value: '30d' },
    { label: 'Custom range', value: 'custom' }
  ];

  const userGroups = [
    { id: 'admin', label: 'Administrators', count: 12 },
    { id: 'developer', label: 'Developers', count: 45 },
    { id: 'analyst', label: 'Security Analysts', count: 23 },
    { id: 'support', label: 'Support Team', count: 18 },
    { id: 'manager', label: 'Managers', count: 8 },
    { id: 'contractor', label: 'Contractors', count: 15 }
  ];

  const geographicRegions = [
    { id: 'north-america', label: 'North America', count: 1245 },
    { id: 'europe', label: 'Europe', count: 892 },
    { id: 'asia-pacific', label: 'Asia Pacific', count: 567 },
    { id: 'south-america', label: 'South America', count: 234 },
    { id: 'africa', label: 'Africa', count: 123 },
    { id: 'middle-east', label: 'Middle East', count: 89 }
  ];

  const authenticationMethods = [
    { id: 'password', label: 'Password', count: 2156 },
    { id: 'mfa', label: 'Multi-Factor Auth', count: 1834 },
    { id: 'sso', label: 'Single Sign-On', count: 1245 },
    { id: 'biometric', label: 'Biometric', count: 567 },
    { id: 'certificate', label: 'Certificate', count: 234 }
  ];

  const handleFilterChange = (key, value) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  const handleGroupToggle = (groupId, checked) => {
    const currentGroups = filters?.userGroups || [];
    const newGroups = checked 
      ? [...currentGroups, groupId]
      : currentGroups?.filter(id => id !== groupId);
    
    handleFilterChange('userGroups', newGroups);
  };

  const handleRegionToggle = (regionId, checked) => {
    const currentRegions = filters?.regions || [];
    const newRegions = checked 
      ? [...currentRegions, regionId]
      : currentRegions?.filter(id => id !== regionId);
    
    handleFilterChange('regions', newRegions);
  };

  const handleMethodToggle = (methodId, checked) => {
    const currentMethods = filters?.authMethods || [];
    const newMethods = checked 
      ? [...currentMethods, methodId]
      : currentMethods?.filter(id => id !== methodId);
    
    handleFilterChange('authMethods', newMethods);
  };

  const handleSaveBookmark = () => {
    if (bookmarkName?.trim() && onSaveBookmark) {
      onSaveBookmark({
        name: bookmarkName?.trim(),
        filters: filters,
        timestamp: new Date()?.toISOString()
      });
      setBookmarkName('');
      setShowBookmarkInput(false);
    }
  };

  const clearAllFilters = () => {
    onFiltersChange({
      dateRange: '24h',
      userGroups: [],
      regions: [],
      authMethods: [],
      riskLevel: 'all',
      showSuspiciousOnly: false
    });
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (filters?.userGroups?.length > 0) count++;
    if (filters?.regions?.length > 0) count++;
    if (filters?.authMethods?.length > 0) count++;
    if (filters?.riskLevel && filters?.riskLevel !== 'all') count++;
    if (filters?.showSuspiciousOnly) count++;
    return count;
  };

  return (
    <div className={`bg-card border border-border rounded-lg ${className}`}>
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Icon name="Filter" size={20} className="text-primary" />
            <h3 className="text-lg font-semibold text-card-foreground">Filters</h3>
            {getActiveFilterCount() > 0 && (
              <div className="px-2 py-1 bg-primary/20 text-primary rounded-full text-xs font-medium">
                {getActiveFilterCount()} active
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAllFilters}
              iconName="X"
              iconPosition="left"
            >
              Clear
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              <Icon name={isExpanded ? "ChevronUp" : "ChevronDown"} size={16} />
            </Button>
          </div>
        </div>
      </div>
      <div className={`transition-all duration-300 ${isExpanded ? 'max-h-none' : 'max-h-0 overflow-hidden'}`}>
        <div className="p-4 space-y-6">
          {/* Date Range */}
          <div>
            <label className="block text-sm font-medium text-card-foreground mb-3">
              Date Range
            </label>
            <div className="grid grid-cols-2 gap-2">
              {dateRangePresets?.map(preset => (
                <button
                  key={preset?.value}
                  onClick={() => handleFilterChange('dateRange', preset?.value)}
                  className={`
                    px-3 py-2 text-sm rounded-md border transition-smooth text-left
                    ${filters?.dateRange === preset?.value 
                      ? 'bg-primary text-primary-foreground border-primary' 
                      : 'bg-background text-foreground border-border hover:bg-muted'
                    }
                  `}
                >
                  {preset?.label}
                </button>
              ))}
            </div>
            
            {filters?.dateRange === 'custom' && (
              <div className="mt-3 grid grid-cols-2 gap-2">
                <Input
                  type="datetime-local"
                  label="Start Date"
                  value={filters?.startDate || ''}
                  onChange={(e) => handleFilterChange('startDate', e?.target?.value)}
                />
                <Input
                  type="datetime-local"
                  label="End Date"
                  value={filters?.endDate || ''}
                  onChange={(e) => handleFilterChange('endDate', e?.target?.value)}
                />
              </div>
            )}
          </div>

          {/* User Groups */}
          <div>
            <label className="block text-sm font-medium text-card-foreground mb-3">
              User Groups
            </label>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {userGroups?.map(group => (
                <Checkbox
                  key={group?.id}
                  label={
                    <div className="flex items-center justify-between w-full">
                      <span>{group?.label}</span>
                      <span className="text-xs text-muted-foreground">({group?.count})</span>
                    </div>
                  }
                  checked={filters?.userGroups?.includes(group?.id) || false}
                  onChange={(e) => handleGroupToggle(group?.id, e?.target?.checked)}
                />
              ))}
            </div>
          </div>

          {/* Geographic Regions */}
          <div>
            <label className="block text-sm font-medium text-card-foreground mb-3">
              Geographic Regions
            </label>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {geographicRegions?.map(region => (
                <Checkbox
                  key={region?.id}
                  label={
                    <div className="flex items-center justify-between w-full">
                      <span>{region?.label}</span>
                      <span className="text-xs text-muted-foreground">({region?.count})</span>
                    </div>
                  }
                  checked={filters?.regions?.includes(region?.id) || false}
                  onChange={(e) => handleRegionToggle(region?.id, e?.target?.checked)}
                />
              ))}
            </div>
          </div>

          {/* Authentication Methods */}
          <div>
            <label className="block text-sm font-medium text-card-foreground mb-3">
              Authentication Methods
            </label>
            <div className="space-y-2">
              {authenticationMethods?.map(method => (
                <Checkbox
                  key={method?.id}
                  label={
                    <div className="flex items-center justify-between w-full">
                      <span>{method?.label}</span>
                      <span className="text-xs text-muted-foreground">({method?.count})</span>
                    </div>
                  }
                  checked={filters?.authMethods?.includes(method?.id) || false}
                  onChange={(e) => handleMethodToggle(method?.id, e?.target?.checked)}
                />
              ))}
            </div>
          </div>

          {/* Risk Level */}
          <div>
            <label className="block text-sm font-medium text-card-foreground mb-3">
              Risk Level
            </label>
            <select
              value={filters?.riskLevel || 'all'}
              onChange={(e) => handleFilterChange('riskLevel', e?.target?.value)}
              className="w-full px-3 py-2 bg-input border border-border rounded-md text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="all">All Risk Levels</option>
              <option value="low">Low Risk (0-39)</option>
              <option value="medium">Medium Risk (40-69)</option>
              <option value="high">High Risk (70-89)</option>
              <option value="critical">Critical Risk (90-100)</option>
            </select>
          </div>

          {/* Additional Options */}
          <div className="space-y-3">
            <Checkbox
              label="Show suspicious activity only"
              checked={filters?.showSuspiciousOnly || false}
              onChange={(e) => handleFilterChange('showSuspiciousOnly', e?.target?.checked)}
            />
            
            <Checkbox
              label="Include failed authentication attempts"
              checked={filters?.includeFailedAttempts || false}
              onChange={(e) => handleFilterChange('includeFailedAttempts', e?.target?.checked)}
            />
          </div>

          {/* Bookmarks */}
          <div className="border-t border-border pt-4">
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-medium text-card-foreground">
                Saved Filters
              </label>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowBookmarkInput(!showBookmarkInput)}
                iconName="Bookmark"
                iconPosition="left"
              >
                Save Current
              </Button>
            </div>
            
            {showBookmarkInput && (
              <div className="flex space-x-2 mb-3">
                <Input
                  placeholder="Filter name..."
                  value={bookmarkName}
                  onChange={(e) => setBookmarkName(e?.target?.value)}
                  className="flex-1"
                />
                <Button
                  variant="default"
                  size="sm"
                  onClick={handleSaveBookmark}
                  disabled={!bookmarkName?.trim()}
                >
                  Save
                </Button>
              </div>
            )}
            
            {savedBookmarks?.length > 0 ? (
              <div className="space-y-2 max-h-24 overflow-y-auto">
                {savedBookmarks?.map((bookmark, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 bg-muted/50 rounded-md"
                  >
                    <button
                      onClick={() => onLoadBookmark && onLoadBookmark(bookmark)}
                      className="flex-1 text-left text-sm text-card-foreground hover:text-primary transition-smooth"
                    >
                      {bookmark?.name}
                    </button>
                    <span className="text-xs text-muted-foreground">
                      {new Date(bookmark.timestamp)?.toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-muted-foreground text-center py-2">
                No saved filters yet
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;