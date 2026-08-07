import { useEffect, useState } from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import { doc, setDoc, serverTimestamp, getDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { db } from '@/firebase/config';
import { useAuth } from '@/context/AuthContext';
import { color, font } from '@/theme/tokens';

export function BootstrapAdminPage() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [status, setStatus] = useState('Checking...');

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      navigate('/login');
      return;
    }

    const bootstrap = async () => {
      try {
        const adminDoc = await getDoc(doc(db, 'admins', user.uid));
        if (adminDoc.exists()) {
          setStatus('You are already an admin. Redirecting...');
          setTimeout(() => { window.location.href = '/dashboard'; }, 1500);
          return;
        }

        await setDoc(doc(db, 'admins', user.uid), {
          email: user.email,
          displayName: user.email?.split('@')[0] ?? 'Admin',
          createdAt: serverTimestamp(),
          grantedBy: 'self-bootstrap',
        });

        setStatus('Admin access granted! Redirecting...');
        setTimeout(() => { window.location.href = '/dashboard'; }, 1500);
      } catch (err) {
        setStatus(`Error: ${(err as Error).message}`);
      }
    };

    bootstrap();
  }, [user, authLoading, navigate]);

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: color.bg }}>
      <Box sx={{ textAlign: 'center' }}>
        <CircularProgress sx={{ color: color.brand, mb: 2 }} />
        <Typography sx={{ fontFamily: font.display, fontWeight: 600 }}>{status}</Typography>
      </Box>
    </Box>
  );
}
