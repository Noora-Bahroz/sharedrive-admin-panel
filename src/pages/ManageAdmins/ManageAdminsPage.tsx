/**
 * ManageAdmins.tsx — Admin panel page for granting and revoking admin access.
 *
 * SECURITY FLOW (Spark Plan — no Cloud Functions)
 *   1. Lists current admins from the `admins` Firestore collection.
 *   2. Grants admin by looking up user by email, then creating admins/{uid}.
 *   3. Revokes admin by deleting admins/{uid}.
 *   4. All mutations go through the Firestore client SDK.
 *      Firestore Security Rules enforce admin-only access on the admins collection.
 */

import { useState, useEffect } from 'react';
import {
  Box, Paper, Typography, TextField, Button, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, IconButton, Dialog, DialogTitle,
  DialogContent, DialogContentText, DialogActions, Alert, Chip, Avatar,
  CircularProgress,
} from '@mui/material';
import { ShieldCheck, ShieldOff, Trash2, RefreshCw, UserPlus } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAdminClaim } from '@/auth/useAdminClaim';
import { grantAdmin, revokeAdmin, listAdmins, type AdminEntry } from '@/services/adminApi';
import { color, font } from '@/theme/tokens';

export function ManageAdminsPage() {
  const { user: currentUser } = useAdminClaim();

  const [admins, setAdmins] = useState<AdminEntry[]>([]);
  const [loadingList, setLoadingList] = useState(false);
  const [listLoaded, setListLoaded] = useState(false);
  const [listError, setListError] = useState<string | null>(null);

  const [grantEmail, setGrantEmail] = useState('');
  const [granting, setGranting] = useState(false);

  const [revokeTarget, setRevokeTarget] = useState<AdminEntry | null>(null);
  const [revoking, setRevoking] = useState(false);

  const [successDialog, setSuccessDialog] = useState<{ open: boolean; email: string }>({
    open: false, email: '',
  });

  const loadAdmins = async () => {
    setLoadingList(true);
    setListError(null);
    try {
      const entries = await listAdmins();
      setAdmins(entries);
      setListLoaded(true);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to load admins.';
      setListError(message);
      toast.error(message);
    } finally {
      setLoadingList(false);
    }
  };

  useEffect(() => {
    loadAdmins();
  }, []);

  const handleGrant = async () => {
    if (!grantEmail.trim()) return;
    setGranting(true);
    try {
      await grantAdmin(grantEmail.trim());
      toast.success(`Admin access granted to ${grantEmail}`);
      const email = grantEmail.trim();
      setGrantEmail('');
      setSuccessDialog({ open: true, email });
      await loadAdmins();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to grant admin.';
      toast.error(message);
    } finally {
      setGranting(false);
    }
  };

  const handleRevoke = async () => {
    if (!revokeTarget) return;
    setRevoking(true);
    try {
      await revokeAdmin(revokeTarget.uid);
      toast.success(`Admin access revoked from ${revokeTarget.email ?? revokeTarget.uid}`);
      setRevokeTarget(null);
      await loadAdmins();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to revoke admin.';
      toast.error(message);
    } finally {
      setRevoking(false);
    }
  };

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" sx={{ fontFamily: font.display, fontWeight: 700, mb: 0.5 }}>
          Manage Admins
        </Typography>
        <Typography variant="body2" sx={{ color: color.textSecondary }}>
          Grant or revoke administrator access. All actions are logged to the audit trail.
        </Typography>
      </Box>

      {/* Grant admin form */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 600 }}>
          <UserPlus size={16} style={{ verticalAlign: 'middle', marginRight: 6 }} />
          Grant Admin Access
        </Typography>
        <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
          <TextField
            size="small"
            placeholder="user@example.com"
            value={grantEmail}
            onChange={(e) => setGrantEmail(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleGrant()}
            sx={{ flex: 1 }}
            disabled={granting}
          />
          <Button
            variant="contained"
            startIcon={granting ? <CircularProgress size={16} /> : <ShieldCheck size={16} />}
            onClick={handleGrant}
            disabled={granting || !grantEmail.trim()}
            sx={{ textTransform: 'none', minWidth: 140 }}
          >
            {granting ? 'Granting…' : 'Grant Admin'}
          </Button>
        </Box>
        <Alert severity="info" sx={{ mt: 1.5 }}>
          The user must already have a ShareDrive account. They will gain admin access
          immediately on their next login.
        </Alert>
      </Paper>

      {/* Admin list */}
      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
            Current Admins ({admins.length})
          </Typography>
          <Button
            size="small"
            startIcon={<RefreshCw size={14} />}
            onClick={loadAdmins}
            disabled={loadingList}
            sx={{ textTransform: 'none', color: color.textSecondary }}
          >
            {loadingList ? 'Loading…' : 'Refresh'}
          </Button>
        </Box>

        {loadingList && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
            <CircularProgress size={24} sx={{ color: color.brand }} />
          </Box>
        )}

        {!loadingList && listError && (
          <Alert severity="error" sx={{ mb: 1 }}>{listError}</Alert>
        )}

        {!loadingList && listLoaded && admins.length === 0 && (
          <Typography sx={{ color: color.textSecondary, py: 2, textAlign: 'center' }}>
            No admins found. Use the form above to grant admin access.
          </Typography>
        )}

        {!loadingList && listLoaded && admins.length > 0 && (
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Admin</TableCell>
                  <TableCell>UID</TableCell>
                  <TableCell>Granted</TableCell>
                  <TableCell align="right">Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {admins.map((admin) => {
                  const isSelf = admin.uid === currentUser?.uid;
                  return (
                    <TableRow key={admin.uid} hover>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <Avatar sx={{ width: 28, height: 28, bgcolor: color.brandMuted, fontSize: 12 }}>
                            {admin.email?.[0]?.toUpperCase() ?? '?'}
                          </Avatar>
                          <Box>
                            <Box sx={{ fontWeight: 500 }}>
                              {admin.displayName ?? admin.email ?? 'Unknown'}
                              {isSelf && (
                                <Chip
                                  label="You"
                                  size="small"
                                  sx={{
                                    ml: 1, height: 18, fontSize: 10,
                                    bgcolor: `${color.brand}20`, color: color.brand,
                                  }}
                                />
                              )}
                            </Box>
                            {admin.displayName && (
                              <Box sx={{ fontSize: 12, color: color.textSecondary }}>{admin.email}</Box>
                            )}
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell sx={{ fontFamily: font.mono, fontSize: 12, color: color.textSecondary }}>
                        {admin.uid.slice(0, 12)}…
                      </TableCell>
                      <TableCell sx={{ fontSize: 13, color: color.textSecondary }}>
                        {admin.grantedBy === 'bootstrap-script' || admin.grantedBy === 'admin-panel'
                          ? 'Admin Panel'
                          : (admin.grantedBy ?? 'unknown').slice(0, 8) + '…'}
                      </TableCell>
                      <TableCell align="right">
                        <IconButton
                          size="small"
                          disabled={isSelf}
                          title={isSelf ? 'Cannot revoke your own access' : 'Revoke admin'}
                          onClick={() => setRevokeTarget(admin)}
                          sx={{ color: isSelf ? color.textDisabled : color.danger }}
                        >
                          <ShieldOff size={16} />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

      {/* Revoke confirmation dialog */}
      <Dialog open={!!revokeTarget} onClose={() => setRevokeTarget(null)} PaperProps={{ sx: { bgcolor: color.surfaceRaised, maxWidth: 420 } }}>
        <DialogTitle sx={{ fontFamily: font.display }}>Revoke Admin Access?</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: color.textSecondary }}>
            Are you sure you want to revoke admin access from{' '}
            <strong>{revokeTarget?.email ?? revokeTarget?.uid}</strong>?
            They will lose access to the admin panel on their next login.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setRevokeTarget(null)} sx={{ textTransform: 'none', color: color.textSecondary }}>Cancel</Button>
          <Button
            variant="contained"
            color="error"
            startIcon={revoking ? <CircularProgress size={16} /> : <Trash2 size={16} />}
            onClick={handleRevoke}
            disabled={revoking}
            sx={{ textTransform: 'none' }}
          >
            {revoking ? 'Revoking…' : 'Revoke Access'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Success dialog */}
      <Dialog open={successDialog.open} onClose={() => setSuccessDialog({ open: false, email: '' })} PaperProps={{ sx: { bgcolor: color.surfaceRaised, maxWidth: 420 } }}>
        <DialogTitle sx={{ fontFamily: font.display }}>Admin Access Granted</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: color.textSecondary }}>
            <strong>{successDialog.email}</strong> now has admin access.
            They can sign in to the admin panel immediately.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button variant="contained" onClick={() => setSuccessDialog({ open: false, email: '' })} sx={{ textTransform: 'none' }}>
            Got it
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
