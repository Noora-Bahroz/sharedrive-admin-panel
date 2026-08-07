import { Box, Paper, Typography, Alert } from '@mui/material';
import { Users, Car, MapPinned, CheckCircle2, XCircle, Clock } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { KpiCard } from '@/components/cards/KpiCard';
import { useLiveCollection } from '@/hooks/useLiveCollection';
import { useCollectionCount } from '@/hooks/useCollectionCount';
import { where } from 'firebase/firestore';
import { color, font } from '@/theme/tokens';

const growthData = [
  { month: 'Feb', users: 40 }, { month: 'Mar', users: 78 }, { month: 'Apr', users: 120 },
  { month: 'May', users: 190 }, { month: 'Jun', users: 260 }, { month: 'Jul', users: 310 },
];

export function DashboardPage() {
  const { rows: activeRides, error: ridesError } = useLiveCollection('rides', {
    extraConstraints: [where('status', '==', 'in_progress')],
    pageSize: 500,
    filterKey: 'in_progress',
  });
  const { rows: pendingRequests, error: requestsError } = useLiveCollection('rideRequests', {
    extraConstraints: [where('status', '==', 'pending')],
    pageSize: 500,
    filterKey: 'pending_requests',
  });

  const totalUsers = useCollectionCount('users');
  const totalDrivers = useCollectionCount('drivers');
  const completedRides = useCollectionCount('rides', [where('status', '==', 'completed')]);
  const cancelledRides = useCollectionCount('rides', [where('status', '==', 'cancelled')]);

  const anyError = ridesError || requestsError
    || totalUsers.error || totalDrivers.error
    || completedRides.error || cancelledRides.error;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {anyError && (
        <Alert severity="error" sx={{ backgroundColor: `${color.danger}1A`, border: `1px solid ${color.danger}40` }}>
          Some data failed to load. Check console for details.
        </Alert>
      )}

      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <KpiCard label="Active Rides" value={activeRides.length} icon={MapPinned} accent={color.info} />
        <KpiCard label="Pending Ride Requests" value={pendingRequests.length} icon={Clock} accent={color.warning} />
        <KpiCard label="Total Users" value={totalUsers.count ?? '—'} icon={Users} />
        <KpiCard label="Total Drivers" value={totalDrivers.count ?? '—'} icon={Car} />
        <KpiCard label="Completed Rides" value={completedRides.count ?? '—'} icon={CheckCircle2} accent={color.success} />
        <KpiCard label="Cancelled Rides" value={cancelledRides.count ?? '—'} icon={XCircle} accent={color.danger} />
      </Box>

      <Paper sx={{ p: 3 }}>
        <Typography sx={{ fontFamily: font.display, fontWeight: 600, mb: 2 }}>
          Monthly User Growth
        </Typography>
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={growthData}>
            <CartesianGrid strokeDasharray="3 3" stroke={color.border} />
            <XAxis dataKey="month" stroke={color.textSecondary} fontSize={12} />
            <YAxis stroke={color.textSecondary} fontSize={12} />
            <Tooltip
              contentStyle={{ background: color.surfaceRaised, border: `1px solid ${color.border}`, borderRadius: 8 }}
            />
            <Line type="monotone" dataKey="users" stroke={color.brand} strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </Paper>
    </Box>
  );
}
