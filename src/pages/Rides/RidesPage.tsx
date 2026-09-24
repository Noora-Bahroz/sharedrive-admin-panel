import { useState } from 'react';
import {
  Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  ToggleButtonGroup, ToggleButton, Typography,
} from '@mui/material';
import { where } from 'firebase/firestore';
import { useLiveCollection } from '@/hooks/useLiveCollection';
import { DataTablePagination } from '@/components/tables/DataTablePagination';
import { StatusChip } from '@/components/ui/StatusChip';
import { font, color } from '@/theme/tokens';
import type { Ride } from '@/types/models';

type Filter = 'all' | 'requested' | 'accepted' | 'started' | 'in_progress' | 'completed' | 'cancelled';

function formatRideDate(value: unknown): string {
  if (!value) return '—';
  let date: Date | null = null;
  if (typeof value === 'object' && value !== null && 'toDate' in value) {
    date = (value as { toDate: () => Date }).toDate();
  } else if (value instanceof Date) {
    date = value;
  }
  if (!date) return '—';
  return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
    + ' ' + date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
}

export function RidesPage() {
  const [filter, setFilter] = useState<Filter>('all');

  const { rows, loading, error, hasMore, isFirstPage, nextPage, prevPage } = useLiveCollection<Ride>('rides', {
    extraConstraints: filter === 'all' ? [] : [where('status', '==', filter)],
    orderByField: 'createdAt',
    orderDirection: 'desc',
    pageSize: 50,
    filterKey: filter,
  });

  return (
    <Box>
      <ToggleButtonGroup size="small" value={filter} exclusive onChange={(_, v) => v && setFilter(v)} sx={{ mb: 2, flexWrap: 'wrap' }}>
        <ToggleButton value="all">All</ToggleButton>
        <ToggleButton value="requested">Requested</ToggleButton>
        <ToggleButton value="accepted">Accepted</ToggleButton>
        <ToggleButton value="started">Started</ToggleButton>
        <ToggleButton value="in_progress">In progress</ToggleButton>
        <ToggleButton value="completed">Completed</ToggleButton>
        <ToggleButton value="cancelled">Cancelled</ToggleButton>
      </ToggleButtonGroup>

      {error && (
        <Paper sx={{ p: 2, mb: 2, backgroundColor: `${color.danger}1A`, border: `1px solid ${color.danger}40` }}>
          <Typography sx={{ color: color.danger, fontSize: 13 }}>
            Error loading rides: {error}
          </Typography>
        </Paper>
      )}

      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Passenger</TableCell>
              <TableCell>Driver</TableCell>
              <TableCell>Route</TableCell>
              <TableCell>Vehicle</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Fare</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {!loading && rows.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} sx={{ textAlign: 'center', py: 4, color: color.textSecondary }}>
                  No rides found.
                </TableCell>
              </TableRow>
            )}
            {!loading && rows.map((r) => (
              <TableRow key={r.id} hover>
                <TableCell sx={{ fontWeight: 500 }}>{r.passengerName ?? '—'}</TableCell>
                <TableCell>{r.driverName ?? '—'}</TableCell>
                <TableCell sx={{ fontSize: 13, color: color.textSecondary }}>
                  {r.origin ?? '?'} → {r.destination ?? '?'}
                </TableCell>
                <TableCell sx={{ textTransform: 'capitalize' }}>{r.rideName ?? '—'}</TableCell>
                <TableCell sx={{ fontSize: 13, color: color.textSecondary }}>{formatRideDate(r.createdAt)}</TableCell>
                <TableCell sx={{ fontFamily: font.mono }}>Rs {r.fare ?? 0}</TableCell>
                <TableCell><StatusChip status={r.status ?? 'unknown'} /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <DataTablePagination isFirstPage={isFirstPage} hasMore={hasMore} onPrev={prevPage} onNext={nextPage} />
    </Box>
  );
}
