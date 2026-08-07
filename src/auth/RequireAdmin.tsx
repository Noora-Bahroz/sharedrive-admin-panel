/**
 * RequireAdmin — Route guard that blocks non-admin users from the admin panel.
 *
 * SECURITY NOTE: This component is a UX convenience, not the security boundary.
 * A determined attacker could modify the React source or disable JavaScript.
 * The REAL authorization is enforced server-side by Firestore Security Rules
 * which check exists(/admins/{request.auth.uid}) on every request.
 *
 * This component provides:
 *   1. A loading spinner while the auth state resolves.
 *   2. A redirect to /login if not authenticated.
 *   3. A visible "Access Denied" screen if authenticated but not admin.
 *      (vs. silently redirecting, which causes confusing redirect loops
 *       for passengers/drivers who open the admin panel URL by mistake.)
 */

import { Navigate, Outlet } from 'react-router-dom';
import { Box, Typography, Button } from '@mui/material';
import { ShieldOff } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { color, font } from '@/theme/tokens';

export function RequireAdmin() {
  const { user, isAdmin, loading } = useAuth();

  // Loading state: show a centered spinner while Firebase resolves auth.
  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
        sx={{ backgroundColor: color.bg }}
      >
        <Box sx={{ textAlign: 'center' }}>
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: '50%',
              border: `3px solid ${color.border}`,
              borderTopColor: color.brand,
              animation: 'spin 1s linear infinite',
              mx: 'auto',
              mb: 2,
              '@keyframes spin': { to: { transform: 'rotate(360deg)' } },
            }}
          />
          <Typography sx={{ color: color.textSecondary, fontSize: 14 }}>
            Verifying access…
          </Typography>
        </Box>
      </Box>
    );
  }

  // Not authenticated at all → redirect to login.
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Authenticated but NOT an admin → show a clear Access Denied screen.
  // This is intentionally NOT a redirect — a passenger/driver who ends up
  // here should understand WHY they can't proceed, not get bounced to login
  // in an infinite loop.
  if (!isAdmin) {
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
        <Box sx={{ textAlign: 'center', maxWidth: 400 }}>
          <ShieldOff size={64} style={{ color: color.danger, marginBottom: 16 }} />
          <Typography
            variant="h5"
            sx={{ fontFamily: font.display, fontWeight: 700, mb: 1 }}
          >
            Access Denied
          </Typography>
          <Typography sx={{ color: color.textSecondary, mb: 3 }}>
            Your account ({user.email}) does not have administrator privileges.
            Contact your system administrator if you believe this is an error.
          </Typography>
          <Button
            variant="contained"
            onClick={() => (window.location.href = '/login')}
            sx={{ textTransform: 'none' }}
          >
            Back to Sign In
          </Button>
        </Box>
      </Box>
    );
  }

  // Admin confirmed — render child routes.
  return <Outlet />;
}
