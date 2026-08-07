import { Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import { Bell } from 'lucide-react';
import { useLiveCollection } from '@/hooks/useLiveCollection';
import { DataTablePagination } from '@/components/tables/DataTablePagination';
import { color, font } from '@/theme/tokens';

export function NotificationsPage() {
  const { rows, loading, error, hasMore, isFirstPage, nextPage, prevPage } = useLiveCollection('notifications', {
    pageSize: 20,
  });

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <Bell size={20} color={color.info} />
        <Typography variant="h6" sx={{ fontFamily: font.display, fontWeight: 600 }}>
          Notifications
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
              <TableCell>Notification</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {!loading && rows.length === 0 && (
              <TableRow>
                <TableCell colSpan={3} sx={{ textAlign: 'center', py: 4, color: color.textSecondary }}>
                  No notifications yet.
                </TableCell>
              </TableRow>
            )}
            {!loading && rows.map((n: any) => (
              <TableRow key={n.id} hover>
                <TableCell sx={{ fontSize: 13 }}>{n.message ?? n.title ?? n.body ?? '—'}</TableCell>
                <TableCell sx={{ fontSize: 13, textTransform: 'capitalize' }}>{n.type ?? '—'}</TableCell>
                <TableCell sx={{ fontSize: 13, textTransform: 'capitalize', color: n.read ? color.textSecondary : color.brand }}>
                  {n.read ? 'Read' : 'Unread'}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <DataTablePagination isFirstPage={isFirstPage} hasMore={hasMore} onPrev={prevPage} onNext={nextPage} />
    </Box>
  );
}
