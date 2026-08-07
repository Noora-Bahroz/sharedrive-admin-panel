import { Box, Typography, IconButton, Avatar } from '@mui/material';
import { LogOut, Moon, Sun } from 'lucide-react';
import { signOut } from 'firebase/auth';
import { auth } from '@/firebase/config';
import { useAuth } from '@/context/AuthContext';
import { useThemeMode } from '@/context/ThemeContext';
import { color } from '@/theme/tokens';

export function Topbar({ title }: { title: string }) {
  const { user } = useAuth();
  const { mode, toggleTheme } = useThemeMode();

  return (
    <Box
      component="header"
      sx={{
        height: 64,
        px: 4,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: `1px solid ${color.border}`,
      }}
    >
      <Typography variant="h5">{title}</Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <IconButton size="small" onClick={toggleTheme} sx={{ color: color.textSecondary }}>
          {mode === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </IconButton>
        <Avatar sx={{ width: 32, height: 32, bgcolor: color.brandMuted, fontSize: 13 }}>
          {user?.email?.[0]?.toUpperCase()}
        </Avatar>
        <Typography variant="body2" sx={{ color: color.textSecondary }}>
          {user?.email}
        </Typography>
        <IconButton size="small" onClick={() => signOut(auth)} sx={{ color: color.textSecondary }}>
          <LogOut size={18} />
        </IconButton>
      </Box>
    </Box>
  );
}
