import { useEffect, useState } from 'react';
import { Box, Paper, Typography, Avatar, Divider, Chip } from '@mui/material';
import { UserCircle, ShieldCheck } from 'lucide-react';
import { doc, getDoc } from 'firebase/firestore';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/firebase/config';
import { color, font } from '@/theme/tokens';

export function ProfilePage() {
  const { user } = useAuth();
  const [adminName, setAdminName] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    getDoc(doc(db, 'admins', user.uid)).then((snap) => {
      if (snap.exists()) {
        setAdminName(snap.data().displayName ?? snap.data().email ?? null);
      }
    });
  }, [user]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <UserCircle size={20} color={color.brand} />
        <Typography variant="h6" sx={{ fontFamily: font.display, fontWeight: 600 }}>
          My Profile
        </Typography>
      </Box>

      <Paper sx={{ p: 4, maxWidth: 500 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          <Avatar sx={{ width: 64, height: 64, bgcolor: color.brand, color: '#1A1A1A', fontSize: 28, fontWeight: 700 }}>
            {(adminName ?? user?.email ?? '?')[0]?.toUpperCase()}
          </Avatar>
          <Box>
            <Typography variant="h5" sx={{ fontFamily: font.display, fontWeight: 700 }}>
              {adminName ?? 'Administrator'}
            </Typography>
            <Chip
              icon={<ShieldCheck size={14} />}
              label="Admin"
              size="small"
              sx={{
                mt: 0.5,
                bgcolor: `${color.brand}20`,
                color: '#1A1A1A',
                border: `1px solid ${color.brand}40`,
              }}
            />
          </Box>
        </Box>

        <Divider sx={{ mb: 3 }} />

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          <Box>
            <Typography variant="caption" sx={{ color: color.textSecondary, textTransform: 'uppercase', letterSpacing: 1 }}>
              Name
            </Typography>
            <Typography sx={{ fontSize: 14 }}>
              {adminName ?? '—'}
            </Typography>
          </Box>

          <Box>
            <Typography variant="caption" sx={{ color: color.textSecondary, textTransform: 'uppercase', letterSpacing: 1 }}>
              Email
            </Typography>
            <Typography sx={{ fontFamily: font.mono, fontSize: 14 }}>
              {user?.email ?? '—'}
            </Typography>
          </Box>

          <Box>
            <Typography variant="caption" sx={{ color: color.textSecondary, textTransform: 'uppercase', letterSpacing: 1 }}>
              User ID
            </Typography>
            <Typography sx={{ fontFamily: font.mono, fontSize: 13, wordBreak: 'break-all' }}>
              {user?.uid ?? '—'}
            </Typography>
          </Box>

          <Box>
            <Typography variant="caption" sx={{ color: color.textSecondary, textTransform: 'uppercase', letterSpacing: 1 }}>
              Email Verified
            </Typography>
            <Typography sx={{ fontSize: 14, color: user?.emailVerified ? color.success : color.warning }}>
              {user?.emailVerified ? 'Yes' : 'No'}
            </Typography>
          </Box>

          <Box>
            <Typography variant="caption" sx={{ color: color.textSecondary, textTransform: 'uppercase', letterSpacing: 1 }}>
              Role
            </Typography>
            <Typography sx={{ fontSize: 14 }}>
              Administrator
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}
