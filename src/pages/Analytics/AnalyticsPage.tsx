import { Box, Paper, Typography } from '@mui/material';
import { BarChart3 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useCollectionCount } from '@/hooks/useCollectionCount';
import { useLiveCollection } from '@/hooks/useLiveCollection';
import { where } from 'firebase/firestore';
import { color, font } from '@/theme/tokens';

const COLORS = [color.brand, color.warning, color.danger, color.info, color.success];

export function AnalyticsPage() {
  const totalUsers = useCollectionCount('users');
  const totalDrivers = useCollectionCount('drivers');
  const completedRides = useCollectionCount('rides', [where('status', '==', 'completed')]);
  const cancelledRides = useCollectionCount('rides', [where('status', '==', 'cancelled')]);
  const { rows: allRides } = useLiveCollection('rides', { pageSize: 500, filterKey: 'all_rides' });

  const statusData = [
    { name: 'Completed', value: completedRides.count ?? 0 },
    { name: 'Cancelled', value: cancelledRides.count ?? 0 },
    { name: 'Active', value: allRides.filter((r: any) => r.status === 'in_progress' || r.status === 'accepted').length },
    { name: 'Requested', value: allRides.filter((r: any) => r.status === 'requested').length },
  ].filter(d => d.value > 0);

  const roleData = [
    { name: 'Passengers', count: totalUsers.count ?? 0 },
    { name: 'Drivers', count: totalDrivers.count ?? 0 },
  ];

  const fareByStatus = [
    { name: 'Completed', fare: allRides.filter((r: any) => r.status === 'completed').reduce((sum: number, r: any) => sum + (r.fare ?? 0), 0) },
    { name: 'Cancelled', fare: allRides.filter((r: any) => r.status === 'cancelled').reduce((sum: number, r: any) => sum + (r.fare ?? 0), 0) },
  ];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <BarChart3 size={20} color={color.brand} />
        <Typography variant="h6" sx={{ fontFamily: font.display, fontWeight: 600 }}>
          Analytics
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <Paper sx={{ flex: 1, minWidth: 280, p: 3 }}>
          <Typography sx={{ fontFamily: font.display, fontWeight: 600, mb: 2 }}>Ride Status Distribution</Typography>
          {statusData.length > 0 ? (
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie data={statusData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                  {statusData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ background: color.surfaceRaised, border: `1px solid ${color.border}`, borderRadius: 8 }} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <Typography sx={{ color: color.textSecondary, textAlign: 'center', py: 4 }}>No ride data yet</Typography>
          )}
        </Paper>

        <Paper sx={{ flex: 1, minWidth: 280, p: 3 }}>
          <Typography sx={{ fontFamily: font.display, fontWeight: 600, mb: 2 }}>Users by Role</Typography>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={roleData}>
              <CartesianGrid strokeDasharray="3 3" stroke={color.border} />
              <XAxis dataKey="name" stroke={color.textSecondary} fontSize={12} />
              <YAxis stroke={color.textSecondary} fontSize={12} />
              <Tooltip contentStyle={{ background: color.surfaceRaised, border: `1px solid ${color.border}`, borderRadius: 8 }} />
              <Bar dataKey="count" fill={color.brand} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Paper>
      </Box>

      <Paper sx={{ p: 3 }}>
        <Typography sx={{ fontFamily: font.display, fontWeight: 600, mb: 2 }}>Fare Summary (PKR)</Typography>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={fareByStatus}>
            <CartesianGrid strokeDasharray="3 3" stroke={color.border} />
            <XAxis dataKey="name" stroke={color.textSecondary} fontSize={12} />
            <YAxis stroke={color.textSecondary} fontSize={12} />
            <Tooltip contentStyle={{ background: color.surfaceRaised, border: `1px solid ${color.border}`, borderRadius: 8 }} />
            <Bar dataKey="fare" fill={color.brand} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Paper>
    </Box>
  );
}
