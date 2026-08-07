import { Chip } from '@mui/material';
import { statusColor } from '@/theme/tokens';
import { StatusPulse } from './StatusPulse';

export function StatusChip({ status }: { status: string }) {
  const safeStatus = status ?? 'unknown';
  const c = statusColor[safeStatus] ?? '#8B93A1';
  const label = safeStatus.replace(/_/g, ' ');

  return (
    <Chip
      size="small"
      icon={<StatusPulse status={safeStatus} />}
      label={label}
      sx={{
        textTransform: 'capitalize',
        backgroundColor: `${c}1A`,
        color: c,
        border: `1px solid ${c}40`,
        '& .MuiChip-icon': { marginLeft: '8px' },
      }}
    />
  );
}
