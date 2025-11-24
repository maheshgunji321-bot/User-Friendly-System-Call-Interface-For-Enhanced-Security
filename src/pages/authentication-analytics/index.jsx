import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import MetricsCard from './components/MetricsCard';
import AuthenticationChart from './components/AuthenticationChart';
import UserAccessTable from './components/UserAccessTable';
import AuthenticationTimeline from './components/AuthenticationTimeline';
import FilterPanel from './components/FilterPanel';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const AuthenticationAnalytics = () => {
  const [filters, setFilters] = useState({
    dateRange: '24h',
    userGroups: [],
    regions: [],
    authMethods: [],
    riskLevel: 'all',
    showSuspiciousOnly: false
  });
  
  const [savedBookmarks, setSavedBookmarks] = useState([]);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [isAutoRefresh, setIsAutoRefresh] = useState(true);

  // Mock data for metrics
  const metricsData = [
    {
      title: "Authentication Success Rate",
      value: "94.2%",
      change: "+2.1%",
      changeType: "positive",
      icon: "CheckCircle",
      trend: [65, 72, 68, 85, 92, 88, 94],
      description: "Successful logins vs total attempts"
    },
    {
      title: "Unique User Sessions",
      value: "2,847",
      change: "+156",
      changeType: "positive",
      icon: "Users",
      trend: [45, 52, 48, 65, 72, 68, 85],
      description: "Active authenticated sessions"
    },
    {
      title: "Failed Login Attempts",
      value: "342",
      change: "-23",
      changeType: "positive",
      icon: "XCircle",
      trend: [85, 78, 82, 65, 58, 62, 45],
      description: "Unsuccessful authentication attempts"
    },
    {
      title: "Average Session Duration",
      value: "4.2h",
      change: "+0.3h",
      changeType: "positive",
      icon: "Clock",
      trend: [35, 42, 38, 55, 62, 58, 75],
      description: "Mean time between login and logout"
    }
  ];

  // Mock data for authentication chart
  const chartData = [
    {
      time: "00:00",
      successful: 145,
      failed: 12,
      suspiciousActivity: 3,
      passwordSuccess: 89,
      passwordFailed: 8,
      mfaSuccess: 34,
      mfaFailed: 2,
      ssoSuccess: 22,
      ssoFailed: 2,
      biometricSuccess: 0,
      biometricFailed: 0
    },
    {
      time: "04:00",
      successful: 89,
      failed: 8,
      suspiciousActivity: 1,
      passwordSuccess: 56,
      passwordFailed: 5,
      mfaSuccess: 21,
      mfaFailed: 2,
      ssoSuccess: 12,
      ssoFailed: 1,
      biometricSuccess: 0,
      biometricFailed: 0
    },
    {
      time: "08:00",
      successful: 456,
      failed: 34,
      suspiciousActivity: 8,
      passwordSuccess: 278,
      passwordFailed: 22,
      mfaSuccess: 112,
      mfaFailed: 7,
      ssoSuccess: 66,
      ssoFailed: 5,
      biometricSuccess: 0,
      biometricFailed: 0
    },
    {
      time: "12:00",
      successful: 623,
      failed: 45,
      suspiciousActivity: 12,
      passwordSuccess: 389,
      passwordFailed: 28,
      mfaSuccess: 156,
      mfaFailed: 11,
      ssoSuccess: 78,
      ssoFailed: 6,
      biometricSuccess: 0,
      biometricFailed: 0
    },
    {
      time: "16:00",
      successful: 534,
      failed: 38,
      suspiciousActivity: 9,
      passwordSuccess: 334,
      passwordFailed: 24,
      mfaSuccess: 134,
      mfaFailed: 9,
      ssoSuccess: 66,
      ssoFailed: 5,
      biometricSuccess: 0,
      biometricFailed: 0
    },
    {
      time: "20:00",
      successful: 298,
      failed: 22,
      suspiciousActivity: 5,
      passwordSuccess: 186,
      passwordFailed: 14,
      mfaSuccess: 74,
      mfaFailed: 5,
      ssoSuccess: 38,
      ssoFailed: 3,
      biometricSuccess: 0,
      biometricFailed: 0
    }
  ];

  // Mock data for user access table
  const usersData = [
    {
      id: 1,
      username: "sarah.johnson",
      department: "Security Operations",
      location: "New York, US",
      loginCount: 1247,
      failedAttempts: 3,
      riskScore: 25,
      isOnline: true,
      activityTrend: [45, 52, 48, 65, 72, 68, 85],
      lastLogin: "2 minutes ago"
    },
    {
      id: 2,
      username: "michael.chen",
      department: "Development",
      location: "San Francisco, US",
      loginCount: 892,
      failedAttempts: 8,
      riskScore: 67,
      isOnline: true,
      activityTrend: [65, 58, 72, 45, 62, 78, 55],
      lastLogin: "15 minutes ago"
    },
    {
      id: 3,
      username: "alex.rodriguez",
      department: "IT Administration",
      location: "London, UK",
      loginCount: 1456,
      failedAttempts: 15,
      riskScore: 84,
      isOnline: false,
      activityTrend: [85, 78, 92, 65, 88, 72, 95],
      lastLogin: "1 hour ago"
    },
    {
      id: 4,
      username: "emma.wilson",
      department: "Data Analytics",
      location: "Toronto, CA",
      loginCount: 634,
      failedAttempts: 2,
      riskScore: 18,
      isOnline: true,
      activityTrend: [35, 42, 38, 55, 62, 58, 75],
      lastLogin: "5 minutes ago"
    },
    {
      id: 5,
      username: "david.kumar",
      department: "Security Operations",
      location: "Mumbai, IN",
      loginCount: 1123,
      failedAttempts: 12,
      riskScore: 73,
      isOnline: false,
      activityTrend: [75, 68, 82, 55, 78, 65, 88],
      lastLogin: "3 hours ago"
    },
    {
      id: 6,
      username: "lisa.thompson",
      department: "Management",
      location: "Sydney, AU",
      loginCount: 445,
      failedAttempts: 1,
      riskScore: 12,
      isOnline: true,
      activityTrend: [25, 32, 28, 45, 52, 48, 65],
      lastLogin: "8 minutes ago"
    }
  ];

  // Mock data for authentication timeline
  const timelineEvents = [
    {
      id: 1,
      type: "login",
      status: "success",
      username: "sarah.johnson",
      timestamp: "2025-11-07 11:16:23",
      location: "New York, US",
      ipAddress: "192.168.1.45",
      device: "MacBook Pro",
      method: "Multi-Factor Auth",
      riskScore: 25,
      details: "Standard login from recognized device and location"
    },
    {
      id: 2,
      type: "failed",
      status: "suspicious",
      username: "alex.rodriguez",
      timestamp: "2025-11-07 11:14:56",
      location: "Moscow, RU",
      ipAddress: "185.220.101.42",
      device: "Unknown Device",
      method: "Password",
      riskScore: 95,
      details: "Multiple failed attempts from unusual geographic location. Account temporarily locked."
    },
    {
      id: 3,
      type: "login",
      status: "success",
      username: "michael.chen",
      timestamp: "2025-11-07 11:12:18",
      location: "San Francisco, US",
      ipAddress: "10.0.0.123",
      device: "iPhone 15",
      method: "Biometric",
      riskScore: 15,
      details: "Mobile login using Touch ID authentication"
    },
    {
      id: 4,
      type: "mfa_challenge",
      status: "success",
      username: "emma.wilson",
      timestamp: "2025-11-07 11:10:45",
      location: "Toronto, CA",
      ipAddress: "192.168.2.67",
      device: "Windows Laptop",
      method: "SMS Code",
      riskScore: 30,
      details: "MFA challenge completed successfully after password verification"
    },
    {
      id: 5,
      type: "password_reset",
      status: "success",
      username: "david.kumar",
      timestamp: "2025-11-07 11:08:32",
      location: "Mumbai, IN",
      ipAddress: "103.21.58.14",
      device: "Android Phone",
      method: "Email Link",
      riskScore: 45,
      details: "Password reset initiated and completed via secure email link"
    },
    {
      id: 6,
      type: "login",
      status: "failed",
      username: "lisa.thompson",
      timestamp: "2025-11-07 11:06:12",
      location: "Sydney, AU",
      ipAddress: "203.12.45.89",
      device: "iPad",
      method: "Password",
      riskScore: 55,
      details: "Incorrect password entered. User notified via email."
    },
    {
      id: 7,
      type: "logout",
      status: "success",
      username: "john.doe",
      timestamp: "2025-11-07 11:04:28",
      location: "Berlin, DE",
      ipAddress: "85.214.132.45",
      device: "Chrome Browser",
      method: "Manual Logout",
      riskScore: 10,
      details: "User initiated logout from web application"
    },
    {
      id: 8,
      type: "account_locked",
      status: "suspicious",
      username: "suspicious.user",
      timestamp: "2025-11-07 11:02:15",
      location: "Unknown",
      ipAddress: "tor.exit.node",
      device: "Unknown",
      method: "Brute Force",
      riskScore: 100,
      details: "Account locked due to multiple failed login attempts from Tor network. Security team notified."
    }
  ];

  // Auto-refresh functionality
  useEffect(() => {
    if (isAutoRefresh) {
      const interval = setInterval(() => {
        setLastUpdated(new Date());
      }, 30000); // 30 seconds

      return () => clearInterval(interval);
    }
  }, [isAutoRefresh]);

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleSaveBookmark = (bookmark) => {
    setSavedBookmarks(prev => [...prev, bookmark]);
  };

  const handleLoadBookmark = (bookmark) => {
    setFilters(bookmark?.filters);
  };

  const handleChartDrillDown = (data) => {
    console.log('Chart drill-down:', data);
    // Implement drill-down functionality
  };

  const handleUserClick = (user) => {
    console.log('User clicked:', user);
    // Implement user detail view
  };

  const handleEventClick = (event) => {
    console.log('Event clicked:', event);
    // Implement event detail view
  };

  const handleRefresh = () => {
    setLastUpdated(new Date());
  };

  const handleExportData = () => {
    console.log('Exporting authentication analytics data...');
    // Implement data export functionality
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Page Header */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8 space-y-4 lg:space-y-0">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Authentication Analytics
              </h1>
              <p className="text-muted-foreground">
                Monitor user access patterns and identify suspicious authentication activities through interactive data exploration
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Icon name="Clock" size={16} />
                <span>Last updated: {lastUpdated?.toLocaleTimeString()}</span>
              </div>
              
              <div className="flex space-x-2">
                <Button
                  variant={isAutoRefresh ? "default" : "outline"}
                  size="sm"
                  onClick={() => setIsAutoRefresh(!isAutoRefresh)}
                  iconName={isAutoRefresh ? "Pause" : "Play"}
                  iconPosition="left"
                >
                  Auto-refresh
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRefresh}
                  iconName="RefreshCw"
                  iconPosition="left"
                >
                  Refresh
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleExportData}
                  iconName="Download"
                  iconPosition="left"
                >
                  Export
                </Button>
              </div>
            </div>
          </div>

          {/* Metrics Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
            {metricsData?.map((metric, index) => (
              <MetricsCard
                key={index}
                title={metric?.title}
                value={metric?.value}
                change={metric?.change}
                changeType={metric?.changeType}
                icon={metric?.icon}
                trend={metric?.trend}
                description={metric?.description}
              />
            ))}
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 mb-8">
            {/* Authentication Chart - 8 columns */}
            <div className="xl:col-span-8">
              <AuthenticationChart
                data={chartData}
                onDrillDown={handleChartDrillDown}
              />
            </div>
            
            {/* Filter Panel - 4 columns */}
            <div className="xl:col-span-4">
              <FilterPanel
                filters={filters}
                onFiltersChange={handleFiltersChange}
                onSaveBookmark={handleSaveBookmark}
                savedBookmarks={savedBookmarks}
                onLoadBookmark={handleLoadBookmark}
              />
            </div>
          </div>

          {/* User Access Table */}
          <div className="mb-8">
            <UserAccessTable
              users={usersData}
              onUserClick={handleUserClick}
            />
          </div>

          {/* Authentication Timeline */}
          <div>
            <AuthenticationTimeline
              events={timelineEvents}
              onEventClick={handleEventClick}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default AuthenticationAnalytics;