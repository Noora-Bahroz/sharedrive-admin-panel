import { Navigate, Outlet } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';
import { useAuth } from '@/context/AuthContext';

/**
 * Guards every admin route. Two failure modes handled distinctly:
 *  - not logged in at all           -> /login
 *  - logged in but not admin        -> /login with a clear "not authorized"
 *    reason, since a passenger/driver account signing into the wrong app
 *    should get an honest answer, not a silent redirect loop.
 */
export function ProtectedRoute() {
  const { user, isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress sx={{ color: 'primary.main' }} />
      </Box>
    );
  }

  if (!user) return <Navigate to="/login" replace />;
  if (!isAdmin) return <Navigate to="/login" replace state={{ reason: 'not-authorized' }} />;

  return <Outlet />;
}
