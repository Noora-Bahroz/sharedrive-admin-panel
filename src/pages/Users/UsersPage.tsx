import { useState } from 'react';
import {
  Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Avatar, TextField, ToggleButtonGroup, ToggleButton, IconButton, Menu, MenuItem,
  Typography,
} from '@mui/material';
import { MoreVertical } from 'lucide-react';
import { where, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import toast from 'react-hot-toast';
import { useLiveCollection } from '@/hooks/useLiveCollection';
import { DataTablePagination } from '@/components/tables/DataTablePagination';
import { StatusChip } from '@/components/ui/StatusChip';
import { db } from '@/firebase/config';
import { color, font } from '@/theme/tokens';
import type { AppUser } from '@/types/models';

export function UsersPage() {
  const [roleFilter, setRoleFilter] = useState<'all' | 'user' | 'driver'>('all');
  const [search, setSearch] = useState('');
  const [menuAnchor, setMenuAnchor] = useState<{ el: HTMLElement; user: AppUser } | null>(null);

  const { rows, loading, error, hasMore, isFirstPage, nextPage, prevPage } = useLiveCollection('users', {
    extraConstraints: roleFilter === 'all' ? [] : [where('role', '==', roleFilter)],
    pageSize: 20,
    filterKey: roleFilter,
  });

  const filtered = (rows as any[]).filter((u) =>
    `${u.fullName ?? u.name ?? u.displayName ?? ''} ${u.email ?? ''}`.toLowerCase().includes(search.toLowerCase()),
  );

  const toggleStatus = async (u: AppUser) => {
    try {
      const next = u.status === 'active' ? 'suspended' : 'active';
      await updateDoc(doc(db, 'users', u.id), { status: next });
      toast.success(next === 'suspended' ? `${u.fullName ?? 'User'} suspended` : `${u.fullName ?? 'User'} activated`);
    } catch (err) {
      toast.error(`Failed: ${(err as Error).message}`);
    }
    setMenuAnchor(null);
  };

  const handleDelete = async (u: AppUser) => {
    try {
      await deleteDoc(doc(db, 'users', u.id));
      toast.success(`${u.fullName ?? 'User'} deleted`);
    } catch (err) {
      toast.error(`Failed to delete: ${(err as Error).message}`);
    }
    setMenuAnchor(null);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', gap: 2, mb: 2, alignItems: 'center' }}>
        <TextField
          size="small"
          placeholder="Search by name or email"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ width: 280 }}
        />
        <ToggleButtonGroup
          size="small"
          value={roleFilter}
          exclusive
          onChange={(_, v) => v && setRoleFilter(v)}
        >
          <ToggleButton value="all">All</ToggleButton>
          <ToggleButton value="user">Passengers</ToggleButton>
          <ToggleButton value="driver">Drivers</ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {error && (
        <Paper sx={{ p: 2, mb: 2, backgroundColor: `${color.danger}1A`, border: `1px solid ${color.danger}40` }}>
          <Typography sx={{ color: color.danger, fontSize: 13 }}>
            Error loading users: {error}
          </Typography>
        </Paper>
      )}

      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>User</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right" />
            </TableRow>
          </TableHead>
          <TableBody>
            {!loading && filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} sx={{ textAlign: 'center', py: 4, color: color.textSecondary }}>
                  No users found.
                </TableCell>
              </TableRow>
            )}
            {!loading && filtered.map((u: any) => (
              <TableRow key={u.id} hover>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Avatar sx={{ width: 28, height: 28, bgcolor: color.brandMuted, fontSize: 12 }}>
                      {(u.fullName ?? u.name ?? u.displayName ?? '?')[0]?.toUpperCase()}
                    </Avatar>
                    <Box>
                      <Box sx={{ fontWeight: 500 }}>{u.fullName ?? u.name ?? u.displayName ?? 'Unknown'}</Box>
                      <Box sx={{ fontSize: 12, color: color.textSecondary }}>{u.email ?? '—'}</Box>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell sx={{ fontFamily: font.mono, fontSize: 13 }}>{u.phoneNumber ?? u.phone ?? '—'}</TableCell>
                <TableCell sx={{ textTransform: 'capitalize' }}>{u.role === 'user' ? 'Passenger' : u.role ?? '—'}</TableCell>
                <TableCell><StatusChip status={u.status ?? 'unknown'} /></TableCell>
                <TableCell align="right">
                  <IconButton size="small" onClick={(e) => setMenuAnchor({ el: e.currentTarget, user: u })}>
                    <MoreVertical size={16} />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <DataTablePagination isFirstPage={isFirstPage} hasMore={hasMore} onPrev={prevPage} onNext={nextPage} />

      <Menu anchorEl={menuAnchor?.el} open={!!menuAnchor} onClose={() => setMenuAnchor(null)}>
        <MenuItem onClick={() => menuAnchor && toggleStatus(menuAnchor.user)}>
          {menuAnchor?.user.status === 'active' ? 'Suspend user' : 'Activate user'}
        </MenuItem>
        <MenuItem sx={{ color: color.danger }} onClick={() => menuAnchor && handleDelete(menuAnchor.user)}>
          Delete user
        </MenuItem>
      </Menu>
    </Box>
  );
}
