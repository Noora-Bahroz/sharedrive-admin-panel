import { Box, Typography, Paper } from '@mui/material';
import { color, font } from '@/theme/tokens';

/**
 * Fix #7: this project is scoped MVP-first. Everything wired up so far
 * (Auth, Dashboard, Users, Drivers, Rides) is real. These sections are
 * Phase 2 — the nav item exists so the information architecture is
 * visible end-to-end, but building them now would be scope creep against
 * the graduation timeline. Swap this component out page by page.
 */
export function Phase2Placeholder({ title }: { title: string }) {
  return (
    <Paper sx={{ p: 6, textAlign: 'center' }}>
      <Typography sx={{ fontFamily: font.display, fontWeight: 600, mb: 1 }} variant="h6">
        {title} — Phase 2
      </Typography>
      <Box sx={{ color: color.textSecondary, fontSize: 14, maxWidth: 420, mx: 'auto' }}>
        Planned after the MVP (Auth, Dashboard, Users, Drivers, Rides) ships.
        See docs/ROADMAP.md for the phase breakdown.
      </Box>
    </Paper>
  );
}
