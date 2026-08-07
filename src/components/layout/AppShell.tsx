import { Box } from '@mui/material';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { color } from '@/theme/tokens';

const TITLES: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/users': 'Users',
  '/drivers': 'Driver Verification',
  '/rides': 'Rides',
  '/complaints': 'Complaints',
  '/notifications': 'Notifications',
  '/analytics': 'Analytics',
  '/settings': 'Settings',
  '/profile': 'Profile',
};

export function AppShell() {
  const { pathname } = useLocation();
  const title = TITLES[pathname] ?? 'ShareDrive Admin';

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: color.bg }}>
      <Sidebar />
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Topbar title={title} />
        <Box component="main" sx={{ p: 4, flex: 1 }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}
