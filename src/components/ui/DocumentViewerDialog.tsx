import { useEffect, useState } from 'react';
import { Dialog, DialogTitle, DialogContent, CircularProgress, Box, Typography } from '@mui/material';
import { useViewDocument } from '@/hooks/useDriverActions';
import { color } from '@/theme/tokens';

interface Props {
  open: boolean;
  onClose: () => void;
  title: string;
  storagePath: string | null;
}

export function DocumentViewerDialog({ open, onClose, title, storagePath }: Props) {
  const { mutate, data, isPending, reset } = useViewDocument();
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    if (open && storagePath) {
      mutate(storagePath, { onSuccess: (res) => setUrl(res.url) });
    }
    if (!open) {
      setUrl(null);
      reset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, storagePath]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 320 }}>
        {isPending && <CircularProgress sx={{ color: color.brand }} />}
        {!isPending && url && (
          <Box component="img" src={url} sx={{ maxWidth: '100%', maxHeight: 480, borderRadius: 1 }} />
        )}
        {!isPending && !url && data === undefined && (
          <Typography sx={{ color: color.textSecondary }}>No document selected.</Typography>
        )}
      </DialogContent>
    </Dialog>
  );
}
