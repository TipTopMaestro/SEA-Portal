import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, ROLES } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import ProtectedRoute from './layouts/ProtectedRoute';
import AppLayout from './layouts/AppLayout';

// Pages
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import HRManagementPage from './pages/hr/HRManagementPage';
import MembershipPage from './pages/membership/MembershipPage';
import TryoutsPage from './pages/tryouts/TryoutsPage';
import AttendancePage from './pages/attendance/AttendancePage';
import FinancePage from './pages/finance/FinancePage';
import UnauthorizedPage from './pages/UnauthorizedPage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  return (
    <BrowserRouter>
      <NotificationProvider>
        <AuthProvider>
          <Routes>
            {/* Public Auth Routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/unauthorized" element={<UnauthorizedPage />} />

            {/* Protected Core Application Shell */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <AppLayout />
                </ProtectedRoute>
              }
            >
              {/* Default redirect to Dashboard */}
              <Route index element={<Navigate to="/dashboard" replace />} />

              {/* Module 6: Dashboards & Role Analytics */}
              <Route path="dashboard" element={<DashboardPage />} />

              {/* Module 1: HR Management & RBAC */}
              <Route path="hr" element={<HRManagementPage />} />

              {/* Module 2: Registration & Membership */}
              <Route path="membership" element={<MembershipPage />} />

              {/* Module 3: Tryout Evaluation & Queueing */}
              <Route path="tryouts" element={<TryoutsPage />} />

              {/* Module 4: QR-Code Attendance (Mobile-First) */}
              <Route path="attendance" element={<AttendancePage />} />

              {/* Module 5: Finance Tracking & Approvals */}
              <Route path="finance" element={<FinancePage />} />
            </Route>

            {/* 404 Catch-All */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </AuthProvider>
      </NotificationProvider>
    </BrowserRouter>
  );
}

export default App;
