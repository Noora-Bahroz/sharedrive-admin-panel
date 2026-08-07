import { Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import { MessageSquareWarning } from 'lucide-react';
import { useLiveCollection } from '@/hooks/useLiveCollection';
import { DataTablePagination } from '@/components/tables/DataTablePagination';
import { StatusChip } from '@/components/ui/StatusChip';
import { color, font } from '@/theme/tokens';

export function ComplaintsPage() {
  const { rows, loading, error, hasMore, isFirstPage, nextPage, prevPage } = useLiveCollection('complaints', {
    pageSize: 20,
  });

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <MessageSquareWarning size={20} color={color.warning} />
        <Typography variant="h6" sx={{ fontFamily: font.display, fontWeight: 600 }}>
          Complaints
        </Typography>
      </Box>

      {error && (
        <Paper sx={{ p: 2, mb: 2, backgroundColor: `${color.danger}1A`, border: `1px solid ${color.danger}40` }}>
          <Typography sx={{ color: color.danger, fontSize: 13 }}>Error: {error}</Typography>
        </Paper>
      )}

      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Complaint</TableCell>
              <TableCell>User</TableCell>
              <TableCell>Ride</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {!loading && rows.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} sx={{ textAlign: 'center', py: 4, color: color.textSecondary }}>
                  No complaints found.
                </TableCell>
              </TableRow>
            )}
            {!loading && rows.map((c: any) => (
              <TableRow key={c.id} hover>
                <TableCell sx={{ fontSize: 13 }}>{c.description ?? c.text ?? c.id}</TableCell>
                <TableCell sx={{ fontSize: 13 }}>{c.userName ?? c.passengerName ?? '—'}</TableCell>
                <TableCell sx={{ fontSize: 13, fontFamily: font.mono }}>{c.rideId ? c.rideId.slice(0, 8) + '…' : '—'}</TableCell>
                <TableCell><StatusChip status={c.status ?? 'pending'} /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <DataTablePagination isFirstPage={isFirstPage} hasMore={hasMore} onPrev={prevPage} onNext={nextPage} />
    </Box>
  );
}
