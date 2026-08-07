import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import { RequireAdmin } from '@/auth/RequireAdmin';
import { AppShell } from '@/components/layout/AppShell';
import { LoginPage } from '@/pages/Login/LoginPage';
import { SetupPage } from '@/pages/Setup/SetupPage';
import { DashboardPage } from '@/pages/Dashboard/DashboardPage';
import { UsersPage } from '@/pages/Users/UsersPage';
import { DriversPage } from '@/pages/Drivers/DriversPage';
import { RidesPage } from '@/pages/Rides/RidesPage';
import { ComplaintsPage } from '@/pages/Complaints/ComplaintsPage';
import { NotificationsPage } from '@/pages/Notifications/NotificationsPage';
import { AnalyticsPage } from '@/pages/Analytics/AnalyticsPage';
import { SettingsPage } from '@/pages/Settings/SettingsPage';
import { ProfilePage } from '@/pages/Profile/ProfilePage';
import { BootstrapAdminPage } from '@/pages/BootstrapAdminPage';
import { ManageAdminsPage } from '@/pages/ManageAdmins/ManageAdminsPage';

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/setup" element={<SetupPage />} />
      <Route path="/bootstrap-admin" element={<BootstrapAdminPage />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<AppShell />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/users" element={<UsersPage />} />
          <Route path="/drivers" element={<DriversPage />} />
          <Route path="/rides" element={<RidesPage />} />
          <Route path="/complaints" element={<ComplaintsPage />} />
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>
      </Route>

      <Route element={<RequireAdmin />}>
        <Route element={<AppShell />}>
          <Route path="/manage-admins" element={<ManageAdminsPage />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
