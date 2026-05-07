import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/common/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import KYC from './pages/KYC';
import Campaigns from './pages/Campaigns';
import MarketingTools from './pages/MarketingTools';
import Analytics from './pages/Analytics';
import Payouts from './pages/Payouts';
import AdminPanel from './pages/AdminPanel';
import AdminAffiliates from './pages/AdminAffiliates';
import AdminCampaigns from './pages/AdminCampaigns';
import AdminPayouts from './pages/AdminPayouts';
import AdminConversions from './pages/AdminConversions';
import AdminSettings from './pages/AdminSettings';
import Integrations from './pages/Integrations';
import Shop from './pages/Shop';
import { AuthContext } from './context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = React.useContext(AuthContext);
  if (loading) return null;
  if (!user) return <Navigate to="/login" />;
  if (allowedRoles && !allowedRoles.includes(user.role)) return <Navigate to="/" />;
  return children;
};

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/shop" element={<Shop />} />
        <Route path="/integrations" element={<Integrations />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/kyc" element={
          <ProtectedRoute>
            <KYC />
          </ProtectedRoute>
        } />
        <Route path="/" element={
          <ProtectedRoute allowedRoles={['affiliate']}>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/campaigns" element={
          <ProtectedRoute allowedRoles={['affiliate']}>
            <Campaigns />
          </ProtectedRoute>
        } />
        <Route path="/marketing" element={
          <ProtectedRoute allowedRoles={['affiliate']}>
            <MarketingTools />
          </ProtectedRoute>
        } />
        <Route path="/analytics" element={
          <ProtectedRoute allowedRoles={['affiliate']}>
            <Analytics />
          </ProtectedRoute>
        } />
        <Route path="/payouts" element={
          <ProtectedRoute allowedRoles={['affiliate']}>
            <Payouts />
          </ProtectedRoute>
        } />
        <Route path="/admin" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminPanel />
          </ProtectedRoute>
        } />
        <Route path="/admin/affiliates" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminAffiliates />
          </ProtectedRoute>
        } />
        <Route path="/admin/campaigns" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminCampaigns />
          </ProtectedRoute>
        } />
        <Route path="/admin/payouts" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminPayouts />
          </ProtectedRoute>
        } />
        <Route path="/admin/conversions" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminConversions />
          </ProtectedRoute>
        } />
        <Route path="/admin/settings" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminSettings />
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
}

export default App;
