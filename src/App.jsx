import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import DashboardOverview from './pages/DashboardOverview';
import HostMetrics from './pages/HostMetrics';
import IncidentCenter from './pages/IncidentCenter';
import AlertsConfig from './pages/AlertsConfig';
import HospitalManagement from './pages/HospitalManagement';
import Layout from './components/Layout';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        
        {/* Main App Routes */}
        <Route path="/app" element={<Layout />}>
          <Route index element={<DashboardOverview />} />
          <Route path="host/:hostId" element={<HostMetrics />} />
          <Route path="incidents" element={<IncidentCenter />} />
          <Route path="alerts" element={<AlertsConfig />} />
          <Route path="hms" element={<HospitalManagement />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
