import { NavLink } from 'react-router-dom';
import { Box, List, ListItemButton, ListItemIcon, ListItemText, Typography } from '@mui/material';
import {
  LayoutDashboard, Users, Car, MapPinned, MessageSquareWarning,
  Bell, BarChart3, Settings, UserCircle, ShieldCheck,
} from 'lucide-react';
import { color, font } from '@/theme/tokens';

const NAV = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, phase: 1 },
  { to: '/users', label: 'Users', icon: Users, phase: 1 },
  { to: '/drivers', label: 'Drivers', icon: Car, phase: 1 },
  { to: '/rides', label: 'Rides', icon: MapPinned, phase: 1 },
  { to: '/manage-admins', label: 'Manage Admins', icon: ShieldCheck, phase: 1 },
  { to: '/complaints', label: 'Complaints', icon: MessageSquareWarning, phase: 2 },
  { to: '/notifications', label: 'Notifications', icon: Bell, phase: 2 },
  { to: '/analytics', label: 'Analytics', icon: BarChart3, phase: 2 },
  { to: '/settings', label: 'Settings', icon: Settings, phase: 2 },
  { to: '/profile', label: 'Profile', icon: UserCircle, phase: 2 },
];

export function Sidebar() {
  return (
    <Box
      component="nav"
      sx={{
        width: 248,
        height: '100vh',
        position: 'sticky',
        top: 0,
        backgroundColor: color.surface,
        borderRight: `1px solid ${color.border}`,
        display: 'flex',
        flexDirection: 'column',
        py: 3,
      }}
    >
      <Typography
        sx={{ px: 3, mb: 3, fontFamily: font.display, fontWeight: 700, letterSpacing: 0.5 }}
        variant="h6"
      >
        Share<Box component="span" sx={{ color: color.brand }}>Drive</Box>
        <Typography component="span" sx={{ display: 'block', fontSize: 11, color: color.textSecondary, fontFamily: font.body, fontWeight: 400 }}>
          ADMIN
        </Typography>
      </Typography>

      <List sx={{ px: 1.5, flex: 1 }}>
        {NAV.map(({ to, label, icon: Icon }) => (
          <ListItemButton
            key={to}
            component={NavLink}
            to={to}
            sx={{
              borderRadius: 1.5,
              mb: 0.5,
              color: color.textSecondary,
              '&.active': {
                backgroundColor: `${color.brand}14`,
                color: color.brand,
                '& .MuiListItemIcon-root': { color: color.brand },
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: 36, color: 'inherit' }}>
              <Icon size={18} />
            </ListItemIcon>
            <ListItemText primary={label} primaryTypographyProps={{ fontSize: 14, fontWeight: 500 }} />
          </ListItemButton>
        ))}
      </List>
    </Box>
  );
}
