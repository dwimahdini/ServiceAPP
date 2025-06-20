import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import UserDashboard from './components/Dashboard/UserDashboard3';
import AdminDashboard from './components/Dashboard/AdminDashboard';
import Services from './pages/Services';
import BengkelPage from './pages/user/BengkelPage';
import LayananMotorPage from './pages/user/LayananMotorPage';
import LayananMobilPage from './pages/user/LayananMobilPage';
import PsikologiPage from './pages/user/PsikologiPage';
import DetailDokterPage from './pages/user/DetailDokterPage';
import OpoWaePage from './pages/user/OpoWaePage';
import TransaksiPage from './pages/user/TransaksiPage';
import TransactionDashboard from './pages/admin/TransactionDashboard';
import AllTransactions from './pages/admin/AllTransactions';
import TransactionDetail from './pages/admin/TransactionDetail';
import CreateTransaction from './pages/admin/CreateTransaction';
import RevenueAnalytics from './pages/admin/RevenueAnalytics';
import ServiceManagement from './pages/admin/ServiceManagement';
import DatabaseManagementPage from './pages/admin/DatabaseManagementPage';

import UserDashboardPage from './pages/user/UserDashboardPage';
import AdminLoginTest from './components/Debug/AdminLoginTest';
import Contact from './pages/Contact';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Debug Routes - Remove in production */}
            <Route path="/admin-test" element={<AdminLoginTest />} />

            {/* Protected Routes - User */}
            <Route
              path="/user/dashboard"
              element={
                <ProtectedRoute requiredRole="user">
                  <UserDashboard />
                </ProtectedRoute>
              }
            />

            {/* Protected Routes - Admin */}
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute requiredRole="admin">
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />

            {/* Services Page */}
            <Route
              path="/services"
              element={
                <ProtectedRoute>
                  <Services />
                </ProtectedRoute>
              }
            />

            {/* Bengkel Page */}
            <Route
              path="/bengkel"
              element={
                <ProtectedRoute>
                  <BengkelPage />
                </ProtectedRoute>
              }
            />

            {/* Layanan Motor Page */}
            <Route
              path="/layanan-motor"
              element={
                <ProtectedRoute>
                  <LayananMotorPage />
                </ProtectedRoute>
              }
            />

            {/* Layanan Mobil Page */}
            <Route
              path="/layanan-mobil"
              element={
                <ProtectedRoute>
                  <LayananMobilPage />
                </ProtectedRoute>
              }
            />

            {/* Psikologi Page */}
            <Route
              path="/psikologi"
              element={
                <ProtectedRoute>
                  <PsikologiPage />
                </ProtectedRoute>
              }
            />

            {/* Detail Dokter Page */}
            <Route
              path="/psikologi/dokter/:id"
              element={
                <ProtectedRoute>
                  <DetailDokterPage />
                </ProtectedRoute>
              }
            />

            {/* Opo Wae Page */}
            <Route
              path="/opo-wae"
              element={
                <ProtectedRoute>
                  <OpoWaePage />
                </ProtectedRoute>
              }
            />

            {/* Transaksi Page */}
            <Route
              path="/transaksi"
              element={
                <ProtectedRoute>
                  <TransaksiPage />
                </ProtectedRoute>
              }
            />

            {/* Admin Service Management */}
            <Route
              path="/admin/services"
              element={
                <ProtectedRoute requiredRole="admin">
                  <ServiceManagement />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/database"
              element={
                <ProtectedRoute requiredRole="admin">
                  <DatabaseManagementPage />
                </ProtectedRoute>
              }
            />



            {/* User Dashboard */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute requiredRole="user">
                  <UserDashboardPage />
                </ProtectedRoute>
              }
            />

            {/* Admin Transaction Routes */}
            <Route
              path="/admin/transactions/dashboard"
              element={
                <ProtectedRoute requiredRole="admin">
                  <TransactionDashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/transactions"
              element={
                <ProtectedRoute requiredRole="admin">
                  <AllTransactions />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/transactions/create"
              element={
                <ProtectedRoute requiredRole="admin">
                  <CreateTransaction />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/transactions/analytics"
              element={
                <ProtectedRoute requiredRole="admin">
                  <RevenueAnalytics />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/transactions/:id"
              element={
                <ProtectedRoute requiredRole="admin">
                  <TransactionDetail />
                </ProtectedRoute>
              }
            />

            {/* Contact Page */}
            <Route path="/contact" element={<Contact />} />

            {/* Default redirect based on authentication */}
            <Route
              path="/"
              element={<Navigate to="/login" replace />}
            />

            {/* Catch all route */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
