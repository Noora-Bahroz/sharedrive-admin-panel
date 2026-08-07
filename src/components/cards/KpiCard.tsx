import { Paper, Typography, Box } from '@mui/material';
import type { LucideIcon } from 'lucide-react';
import { color, font } from '@/theme/tokens';

interface KpiCardProps {
  label: string;
  value: number | string;
  icon: LucideIcon;
  accent?: string;
}

export function KpiCard({ label, value, icon: Icon, accent = color.brand }: KpiCardProps) {
  return (
    <Paper sx={{ p: 2.5, flex: '1 1 200px', minWidth: 180 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Typography variant="body2" sx={{ color: color.textSecondary }}>{label}</Typography>
        <Icon size={16} color={accent} />
      </Box>
      <Typography sx={{ fontFamily: font.display, fontWeight: 700, mt: 1 }} variant="h4">
        {value}
      </Typography>
    </Paper>
  );
}
