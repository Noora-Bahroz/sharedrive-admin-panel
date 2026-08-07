import { Component, type ReactNode } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { color, font } from '@/theme/tokens';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Admin panel error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Box
          sx={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: color.bg,
          }}
        >
          <Box sx={{ textAlign: 'center', maxWidth: 500, p: 4 }}>
            <Typography
              variant="h5"
              sx={{ fontFamily: font.display, fontWeight: 700, mb: 1, color: color.danger }}
            >
              Something went wrong
            </Typography>
            <Typography sx={{ color: color.textSecondary, mb: 1, fontSize: 13, wordBreak: 'break-word' }}>
              {this.state.error?.message || 'An unexpected error occurred.'}
            </Typography>
            <Typography sx={{ color: color.textDisabled, mb: 3, fontSize: 12 }}>
              {this.state.error?.stack?.split('\n').slice(0, 3).join('\n')}
            </Typography>
            <Button
              variant="contained"
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.href = '/dashboard';
              }}
              sx={{ textTransform: 'none' }}
            >
              Go to Dashboard
            </Button>
          </Box>
        </Box>
      );
    }

    return this.props.children;
  }
}
