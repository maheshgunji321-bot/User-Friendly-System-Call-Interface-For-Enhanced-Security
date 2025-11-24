import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import Header from '../../components/ui/Header';
import GlobalControls from './components/GlobalControls';
import MetricCards from './components/MetricCards';
import SystemCallHeatmap from './components/SystemCallHeatmap';
import ProcessSidebar from './components/ProcessSidebar';
import SystemCallTimeline from './components/SystemCallTimeline';

const SystemCallMonitor = () => {
  // Global state management
  const [selectedSystem, setSelectedSystem] = useState('all');
  const [processFilter, setProcessFilter] = useState('');
  const [callTypeFilter, setCallTypeFilter] = useState([]);
  const [refreshRate, setRefreshRate] = useState(10);
  const [selectedProcess, setSelectedProcess] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [activeTab, setActiveTab] = useState('heatmap');

  // Responsive design detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Handle process selection from sidebar or heatmap
  const handleProcessSelect = (processName) => {
    setSelectedProcess(processName);
  };

  // Handle global control changes
  const handleSystemSelect = (system) => {
    setSelectedSystem(system);
    // Reset process selection when system changes
    if (system !== selectedSystem) {
      setSelectedProcess(null);
    }
  };

  const handleProcessFilter = (filter) => {
    setProcessFilter(filter);
  };

  const handleCallTypeFilter = (types) => {
    setCallTypeFilter(types);
  };

  const handleRefreshRateChange = (rate) => {
    setRefreshRate(rate);
  };

  // Mobile tab navigation
  const mobileTabOptions = [
    { id: 'heatmap', label: 'Heatmap', icon: 'Grid3X3' },
    { id: 'timeline', label: 'Timeline', icon: 'TrendingUp' },
    { id: 'processes', label: 'Processes', icon: 'List' }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>System Call Monitor - SecureCall Analytics</title>
        <meta name="description" content="Real-time system call monitoring dashboard for security operations teams detecting anomalous behavior and potential threats." />
      </Helmet>
      <Header />
      <main className="pt-16">
        <div className="container mx-auto px-4 py-6">
          {/* Page Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              System Call Monitor
            </h1>
            <p className="text-muted-foreground">
              Real-time visibility into system call activities for security operations teams detecting anomalous behavior and potential threats.
            </p>
          </div>

          {/* Global Controls */}
          <GlobalControls
            selectedSystem={selectedSystem}
            processFilter={processFilter}
            callTypeFilter={callTypeFilter}
            refreshRate={refreshRate}
            onSystemSelect={handleSystemSelect}
            onProcessFilter={handleProcessFilter}
            onCallTypeFilter={handleCallTypeFilter}
            onRefreshRateChange={handleRefreshRateChange}
          />

          {/* Metric Cards */}
          <MetricCards
            selectedProcess={selectedProcess}
            refreshRate={refreshRate}
          />

          {/* Mobile Tab Navigation */}
          {isMobile && (
            <div className="mb-6">
              <div className="flex bg-card rounded-lg border border-border p-1">
                {mobileTabOptions?.map((tab) => (
                  <button
                    key={tab?.id}
                    onClick={() => setActiveTab(tab?.id)}
                    className={`
                      flex-1 flex items-center justify-center space-x-2 py-2 px-3 rounded-md text-sm font-medium transition-smooth
                      ${activeTab === tab?.id 
                        ? 'bg-primary text-primary-foreground' 
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                      }
                    `}
                  >
                    <span>{tab?.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-16 gap-6">
            {/* Desktop Layout */}
            {!isMobile ? (
              <>
                {/* Process Sidebar - 4 columns */}
                <div className="lg:col-span-4">
                  <ProcessSidebar
                    onProcessSelect={handleProcessSelect}
                    selectedProcess={selectedProcess}
                    refreshRate={refreshRate}
                  />
                </div>

                {/* Main Visualization Area - 12 columns */}
                <div className="lg:col-span-12 space-y-6">
                  {/* System Call Heatmap */}
                  <SystemCallHeatmap
                    selectedProcess={selectedProcess}
                    onProcessSelect={handleProcessSelect}
                    refreshRate={refreshRate}
                  />

                  {/* System Call Timeline */}
                  <SystemCallTimeline
                    selectedProcess={selectedProcess}
                    refreshRate={refreshRate}
                  />
                </div>
              </>
            ) : (
              /* Mobile Layout - Tabbed Content */
              (<div className="col-span-full">
                {activeTab === 'heatmap' && (
                  <SystemCallHeatmap
                    selectedProcess={selectedProcess}
                    onProcessSelect={handleProcessSelect}
                    refreshRate={refreshRate}
                  />
                )}
                {activeTab === 'timeline' && (
                  <SystemCallTimeline
                    selectedProcess={selectedProcess}
                    refreshRate={refreshRate}
                  />
                )}
                {activeTab === 'processes' && (
                  <ProcessSidebar
                    onProcessSelect={handleProcessSelect}
                    selectedProcess={selectedProcess}
                    refreshRate={refreshRate}
                  />
                )}
              </div>)
            )}
          </div>

          {/* Additional Information Panel */}
          <div className="mt-8 bg-card rounded-lg border border-border p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Monitoring Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-sm">
              <div>
                <h4 className="font-medium text-foreground mb-2">Data Sources</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• Operating System APIs</li>
                  <li>• Kernel system call logs</li>
                  <li>• Process monitoring tools</li>
                  <li>• Performance counters</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-foreground mb-2">Detection Capabilities</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• Anomalous call patterns</li>
                  <li>• Privilege escalation attempts</li>
                  <li>• Unusual process behavior</li>
                  <li>• Performance impact analysis</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-foreground mb-2">Export Options</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• CSV data export</li>
                  <li>• Dashboard screenshots</li>
                  <li>• Incident documentation</li>
                  <li>• Historical data archives</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SystemCallMonitor;