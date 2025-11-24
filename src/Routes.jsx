import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import NotFound from "pages/NotFound";
import AuthenticationAnalytics from './pages/authentication-analytics';
import ThreatDetectionCenter from './pages/threat-detection-center';
import SystemCallMonitor from './pages/system-call-monitor';
import SecurityOverview from './pages/security-overview';

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Define your route here */}
        <Route path="/" element={<SecurityOverview />} />
        <Route path="/authentication-analytics" element={<AuthenticationAnalytics />} />
        <Route path="/threat-detection-center" element={<ThreatDetectionCenter />} />
        <Route path="/system-call-monitor" element={<SystemCallMonitor />} />
        <Route path="/security-overview" element={<SecurityOverview />} />
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;
