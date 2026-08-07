import { Box, IconButton, Typography } from '@mui/material';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { color } from '@/theme/tokens';

interface Props {
  isFirstPage: boolean;
  hasMore: boolean;
  onPrev: () => void;
  onNext: () => void;
}

/** Fix #4: pagination controls for the cursor-based useLiveCollection hook. */
export function DataTablePagination({ isFirstPage, hasMore, onPrev, onNext }: Props) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 1, mt: 2 }}>
      <IconButton size="small" onClick={onPrev} disabled={isFirstPage} sx={{ color: color.textSecondary }}>
        <ChevronLeft size={18} />
      </IconButton>
      <Typography variant="body2" sx={{ color: color.textSecondary }}>Page</Typography>
      <IconButton size="small" onClick={onNext} disabled={!hasMore} sx={{ color: color.textSecondary }}>
        <ChevronRight size={18} />
      </IconButton>
    </Box>
  );
}
