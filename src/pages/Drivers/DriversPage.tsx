import { useState } from 'react';
import {
  Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Avatar, TextField, Typography,
} from '@mui/material';
import { useLiveCollection } from '@/hooks/useLiveCollection';
import { DataTablePagination } from '@/components/tables/DataTablePagination';
import { color, font } from '@/theme/tokens';
import type { Driver } from '@/types/models';

export function DriversPage() {
  const [search, setSearch] = useState('');

  const { rows, loading, error, hasMore, isFirstPage, nextPage, prevPage } = useLiveCollection<Driver>('drivers', {
    pageSize: 20,
  });

  const filtered = rows.filter((d) =>
    `${d.fullName ?? ''} ${d.email ?? ''}`.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <Box>
      <TextField
        size="small"
        placeholder="Search by name or email"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        sx={{ width: 280, mb: 2 }}
      />

      {error && (
        <Paper sx={{ p: 2, mb: 2, backgroundColor: `${color.danger}1A`, border: `1px solid ${color.danger}40` }}>
          <Typography sx={{ color: color.danger, fontSize: 13 }}>
            Error loading drivers: {error}
          </Typography>
        </Paper>
      )}

      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Driver</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Email</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {!loading && filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={3} sx={{ textAlign: 'center', py: 4, color: color.textSecondary }}>
                  No drivers found.
                </TableCell>
              </TableRow>
            )}
            {!loading && filtered.map((d) => (
              <TableRow key={d.id} hover>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Avatar sx={{ width: 28, height: 28, bgcolor: color.brandMuted, fontSize: 12 }}>
                      {(d.fullName ?? '?')[0]?.toUpperCase()}
                    </Avatar>
                    <Box sx={{ fontWeight: 500 }}>{d.fullName ?? 'Unknown'}</Box>
                  </Box>
                </TableCell>
                <TableCell sx={{ fontFamily: font.mono, fontSize: 13 }}>{d.phoneNumber ?? '—'}</TableCell>
                <TableCell sx={{ fontSize: 13, color: color.textSecondary }}>{d.email ?? '—'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <DataTablePagination isFirstPage={isFirstPage} hasMore={hasMore} onPrev={prevPage} onNext={nextPage} />
    </Box>
  );
}
