import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography } from '@mui/material';
import { color, font } from '@/theme/tokens';

/**
 * SetupPage — now just redirects to /login.
 *
 * First admin is created manually in Firestore Console:
 *   1. Sign up via the mobile app (or create via Firebase Console Auth)
 *   2. In Firestore Console, create a document at admins/{uid} with: {}
 *   3. That user can now log in to the admin panel.
 */
export function SetupPage() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate('/login', { replace: true });
  }, [navigate]);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: color.bg,
      }}
    >
      <Box sx={{ textAlign: 'center' }}>
        <Typography sx={{ fontFamily: font.display, fontWeight: 700, mb: 1 }} variant="h5">
          Share<Box component="span" sx={{ color: color.brand }}>Drive</Box>
        </Typography>
        <Typography sx={{ color: color.textSecondary }}>
          Redirecting to sign in…
        </Typography>
      </Box>
    </Box>
  );
}
