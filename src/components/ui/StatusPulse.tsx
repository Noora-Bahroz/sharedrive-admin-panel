import { Box, keyframes } from '@mui/material';
import { statusColor } from '@/theme/tokens';

const pulse = keyframes`
  0%   { box-shadow: 0 0 0 0 currentColor; opacity: 1; }
  70%  { box-shadow: 0 0 0 6px transparent; opacity: 0.4; }
  100% { box-shadow: 0 0 0 0 transparent; opacity: 1; }
`;

/**
 * The one animated element in the whole app, used ONLY for statuses that
 * are genuinely live right now: an in-progress ride, a pending driver
 * request. Everything else in the interface — including every other
 * status chip — is static, so this stays meaningful instead of decorative.
 */
export function StatusPulse({ status }: { status: string }) {
  const isLive = status === 'in_progress' || status === 'pending' || status === 'requested';
  const c = statusColor[status] ?? '#8B93A1';

  return (
    <Box
      component="span"
      sx={{
        display: 'inline-block',
        width: 8,
        height: 8,
        borderRadius: '50%',
        backgroundColor: c,
        color: c,
        animation: isLive ? `${pulse} 2s ease-in-out infinite` : 'none',
      }}
    />
  );
}
