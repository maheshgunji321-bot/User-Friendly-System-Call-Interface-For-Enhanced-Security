import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const UserAccessTable = ({ users, onUserClick, className = "" }) => {
  const [sortBy, setSortBy] = useState('riskScore');
  const [sortOrder, setSortOrder] = useState('desc');
  const [searchTerm, setSearchTerm] = useState('');

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const filteredAndSortedUsers = users?.filter(user => 
      user?.username?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
      user?.department?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
      user?.location?.toLowerCase()?.includes(searchTerm?.toLowerCase())
    )?.sort((a, b) => {
      const aValue = a?.[sortBy];
      const bValue = b?.[sortBy];
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      }
      return aValue < bValue ? 1 : -1;
    });

  const getRiskScoreColor = (score) => {
    if (score >= 80) return 'text-error';
    if (score >= 60) return 'text-warning';
    if (score >= 40) return 'text-accent';
    return 'text-success';
  };

  const getRiskScoreBg = (score) => {
    if (score >= 80) return 'bg-error/10';
    if (score >= 60) return 'bg-warning/10';
    if (score >= 40) return 'bg-accent/10';
    return 'bg-success/10';
  };

  const MiniTrendChart = ({ trend }) => (
    <div className="flex items-end space-x-1 h-6 w-12">
      {trend?.map((point, index) => (
        <div
          key={index}
          className="flex-1 bg-primary/30 rounded-sm"
          style={{ height: `${(point / Math.max(...trend)) * 100}%` }}
        />
      ))}
    </div>
  );

  return (
    <div className={`bg-card border border-border rounded-lg p-6 ${className}`}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 space-y-4 sm:space-y-0">
        <div>
          <h3 className="text-lg font-semibold text-card-foreground mb-1">
            User Access Patterns
          </h3>
          <p className="text-sm text-muted-foreground">
            Frequent authenticators ranked by risk score and activity patterns
          </p>
        </div>
        
        <div className="flex space-x-2">
          <div className="relative">
            <Icon 
              name="Search" 
              size={16} 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" 
            />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e?.target?.value)}
              className="pl-10 pr-4 py-2 bg-input border border-border rounded-md text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          
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
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-3 px-2">
                <button
                  onClick={() => handleSort('username')}
                  className="flex items-center space-x-1 text-sm font-medium text-muted-foreground hover:text-foreground transition-smooth"
                >
                  <span>User</span>
                  <Icon 
                    name={sortBy === 'username' ? (sortOrder === 'asc' ? 'ChevronUp' : 'ChevronDown') : 'ChevronsUpDown'} 
                    size={14} 
                  />
                </button>
              </th>
              <th className="text-left py-3 px-2">
                <button
                  onClick={() => handleSort('loginCount')}
                  className="flex items-center space-x-1 text-sm font-medium text-muted-foreground hover:text-foreground transition-smooth"
                >
                  <span>Logins</span>
                  <Icon 
                    name={sortBy === 'loginCount' ? (sortOrder === 'asc' ? 'ChevronUp' : 'ChevronDown') : 'ChevronsUpDown'} 
                    size={14} 
                  />
                </button>
              </th>
              <th className="text-left py-3 px-2">
                <button
                  onClick={() => handleSort('riskScore')}
                  className="flex items-center space-x-1 text-sm font-medium text-muted-foreground hover:text-foreground transition-smooth"
                >
                  <span>Risk Score</span>
                  <Icon 
                    name={sortBy === 'riskScore' ? (sortOrder === 'asc' ? 'ChevronUp' : 'ChevronDown') : 'ChevronsUpDown'} 
                    size={14} 
                  />
                </button>
              </th>
              <th className="text-left py-3 px-2">
                <span className="text-sm font-medium text-muted-foreground">Location</span>
              </th>
              <th className="text-left py-3 px-2">
                <span className="text-sm font-medium text-muted-foreground">Trend</span>
              </th>
              <th className="text-left py-3 px-2">
                <button
                  onClick={() => handleSort('lastLogin')}
                  className="flex items-center space-x-1 text-sm font-medium text-muted-foreground hover:text-foreground transition-smooth"
                >
                  <span>Last Login</span>
                  <Icon 
                    name={sortBy === 'lastLogin' ? (sortOrder === 'asc' ? 'ChevronUp' : 'ChevronDown') : 'ChevronsUpDown'} 
                    size={14} 
                  />
                </button>
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredAndSortedUsers?.map((user) => (
              <tr 
                key={user?.id}
                onClick={() => onUserClick && onUserClick(user)}
                className="border-b border-border hover:bg-muted/50 cursor-pointer transition-smooth"
              >
                <td className="py-4 px-2">
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                        <Icon name="User" size={16} className="text-primary" />
                      </div>
                      {user?.isOnline && (
                        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-success rounded-full border-2 border-card" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-card-foreground">{user?.username}</p>
                      <p className="text-xs text-muted-foreground">{user?.department}</p>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-card-foreground">
                      {user?.loginCount?.toLocaleString()}
                    </span>
                    {user?.failedAttempts > 0 && (
                      <span className="text-xs text-error">
                        ({user?.failedAttempts} failed)
                      </span>
                    )}
                  </div>
                </td>
                <td className="py-4 px-2">
                  <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getRiskScoreBg(user?.riskScore)} ${getRiskScoreColor(user?.riskScore)}`}>
                    {user?.riskScore}
                  </div>
                </td>
                <td className="py-4 px-2">
                  <div className="flex items-center space-x-2">
                    <Icon name="MapPin" size={14} className="text-muted-foreground" />
                    <span className="text-sm text-card-foreground">{user?.location}</span>
                  </div>
                </td>
                <td className="py-4 px-2">
                  <MiniTrendChart trend={user?.activityTrend} />
                </td>
                <td className="py-4 px-2">
                  <div className="flex items-center space-x-2">
                    <Icon name="Clock" size={14} className="text-muted-foreground" />
                    <span className="text-sm text-card-foreground">{user?.lastLogin}</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {filteredAndSortedUsers?.length === 0 && (
        <div className="text-center py-8">
          <Icon name="Users" size={48} className="text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No users found matching your search criteria</p>
        </div>
      )}
      <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
        <span>Showing {filteredAndSortedUsers?.length} of {users?.length} users</span>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-success rounded-full" />
            <span>Online</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-error rounded-full" />
            <span>High Risk</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserAccessTable;