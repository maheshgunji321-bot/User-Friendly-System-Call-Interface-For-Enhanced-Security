import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('connected');
  const [timeRange, setTimeRange] = useState('1h');
  const [isTimeRangeOpen, setIsTimeRangeOpen] = useState(false);

  const navigationItems = [
    {
      label: 'Security Overview',
      path: '/security-overview',
      icon: 'Shield',
      tooltip: 'Real-time security intelligence and system health metrics'
    },
    {
      label: 'Authentication Analytics',
      path: '/authentication-analytics',
      icon: 'UserCheck',
      tooltip: 'User access pattern investigation and authentication threat detection'
    },
    {
      label: 'System Call Monitor',
      path: '/system-call-monitor',
      icon: 'Activity',
      tooltip: 'System-level activity analysis and anomaly detection'
    },
    {
      label: 'Threat Detection Center',
      path: '/threat-detection-center',
      icon: 'AlertTriangle',
      tooltip: 'Active incident management and security response coordination'
    }
  ];

  const timeRangeOptions = [
    { value: '15m', label: '15 minutes' },
    { value: '1h', label: '1 hour' },
    { value: '4h', label: '4 hours' },
    { value: '24h', label: '24 hours' }
  ];

  useEffect(() => {
    // Simulate WebSocket connection monitoring
    const interval = setInterval(() => {
      const statuses = ['connected', 'connecting', 'disconnected'];
      const randomStatus = statuses?.[Math.floor(Math.random() * statuses?.length)];
      if (Math.random() > 0.9) {
        setConnectionStatus(randomStatus);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleNavigation = (path) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  const handleLogoClick = () => {
    navigate('/security-overview');
  };

  const getConnectionStatusColor = () => {
    switch (connectionStatus) {
      case 'connected':
        return 'text-success';
      case 'connecting':
        return 'text-warning';
      case 'disconnected':
        return 'text-error';
      default:
        return 'text-muted-foreground';
    }
  };

  const getConnectionStatusIcon = () => {
    switch (connectionStatus) {
      case 'connected':
        return 'Wifi';
      case 'connecting':
        return 'WifiOff';
      case 'disconnected':
        return 'WifiOff';
      default:
        return 'Wifi';
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-navigation bg-background border-b border-border">
      <div className="flex items-center justify-between h-16 px-6">
        {/* Logo Section */}
        <div 
          className="flex items-center cursor-pointer transition-smooth hover:opacity-80"
          onClick={handleLogoClick}
        >
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Icon 
                name="Shield" 
                size={32} 
                className="text-primary" 
              />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-success rounded-full animate-pulse-status"></div>
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-semibold text-foreground">SecureCall</span>
              <span className="text-xs text-muted-foreground font-mono">Analytics</span>
            </div>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          {navigationItems?.map((item) => {
            const isActive = location?.pathname === item?.path;
            return (
              <button
                key={item?.path}
                onClick={() => handleNavigation(item?.path)}
                className={`
                  flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium
                  transition-smooth focus-ring
                  ${isActive 
                    ? 'bg-primary text-primary-foreground' 
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  }
                `}
                title={item?.tooltip}
              >
                <Icon name={item?.icon} size={16} />
                <span>{item?.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right Section */}
        <div className="flex items-center space-x-4">
          {/* Connection Status Indicator */}
          <div className="hidden sm:flex items-center space-x-2">
            <Icon 
              name={getConnectionStatusIcon()} 
              size={16} 
              className={`${getConnectionStatusColor()} ${connectionStatus === 'connecting' ? 'animate-pulse' : ''}`}
            />
            <span className={`text-xs font-medium ${getConnectionStatusColor()}`}>
              {connectionStatus === 'connected' ? 'Live' : 
               connectionStatus === 'connecting' ? 'Connecting...' : 'Offline'}
            </span>
          </div>

          {/* Time Range Selector */}
          <div className="relative">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsTimeRangeOpen(!isTimeRangeOpen)}
              iconName="Clock"
              iconPosition="left"
              className="hidden sm:flex"
            >
              {timeRangeOptions?.find(option => option?.value === timeRange)?.label}
            </Button>
            
            {isTimeRangeOpen && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-popover border border-border rounded-md shadow-lg z-dropdown">
                <div className="py-1">
                  {timeRangeOptions?.map((option) => (
                    <button
                      key={option?.value}
                      onClick={() => {
                        setTimeRange(option?.value);
                        setIsTimeRangeOpen(false);
                      }}
                      className={`
                        w-full text-left px-4 py-2 text-sm transition-smooth
                        ${timeRange === option?.value 
                          ? 'bg-accent text-accent-foreground' 
                          : 'text-popover-foreground hover:bg-muted'
                        }
                      `}
                    >
                      {option?.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden"
          >
            <Icon name={isMobileMenuOpen ? "X" : "Menu"} size={20} />
          </Button>
        </div>
      </div>
      {/* Mobile Navigation Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-card border-t border-border">
          <nav className="px-4 py-4 space-y-2">
            {navigationItems?.map((item) => {
              const isActive = location?.pathname === item?.path;
              return (
                <button
                  key={item?.path}
                  onClick={() => handleNavigation(item?.path)}
                  className={`
                    w-full flex items-center space-x-3 px-4 py-3 rounded-md text-sm font-medium
                    transition-smooth
                    ${isActive 
                      ? 'bg-primary text-primary-foreground' 
                      : 'text-card-foreground hover:bg-muted'
                    }
                  `}
                >
                  <Icon name={item?.icon} size={18} />
                  <span>{item?.label}</span>
                </button>
              );
            })}
            
            {/* Mobile Connection Status */}
            <div className="flex items-center justify-between px-4 py-3 border-t border-border mt-4">
              <div className="flex items-center space-x-2">
                <Icon 
                  name={getConnectionStatusIcon()} 
                  size={16} 
                  className={getConnectionStatusColor()}
                />
                <span className={`text-sm font-medium ${getConnectionStatusColor()}`}>
                  Connection: {connectionStatus}
                </span>
              </div>
            </div>

            {/* Mobile Time Range */}
            <div className="px-4 py-2">
              <span className="text-xs text-muted-foreground">Time Range</span>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {timeRangeOptions?.map((option) => (
                  <button
                    key={option?.value}
                    onClick={() => {
                      setTimeRange(option?.value);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`
                      px-3 py-2 text-sm rounded-md transition-smooth
                      ${timeRange === option?.value 
                        ? 'bg-accent text-accent-foreground' 
                        : 'bg-muted text-muted-foreground hover:text-foreground'
                      }
                    `}
                  >
                    {option?.label}
                  </button>
                ))}
              </div>
            </div>
          </nav>
        </div>
      )}
      {/* Click outside to close dropdowns */}
      {(isTimeRangeOpen || isMobileMenuOpen) && (
        <div 
          className="fixed inset-0 z-50" 
          onClick={() => {
            setIsTimeRangeOpen(false);
            setIsMobileMenuOpen(false);
          }}
        />
      )}
    </header>
  );
};

export default Header;