import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { createAppTheme } from '@/theme/muiTheme';
import { AuthProvider } from '@/context/AuthContext';
import { ThemeProvider as AppThemeProvider, useThemeMode } from '@/context/ThemeContext';
import { AppRoutes } from '@/routes/AppRoutes';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1, refetchOnWindowFocus: false } },
});

function ThemedApp() {
  const { mode } = useThemeMode();
  const theme = createAppTheme(mode);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <QueryClientProvider client={queryClient}>
        <ErrorBoundary>
          <AuthProvider>
            <BrowserRouter>
              <AppRoutes />
            </BrowserRouter>
            <Toaster
              position="top-right"
              toastOptions={{
                style: {
                  background: 'var(--color-surface-raised)',
                  color: 'var(--color-text-primary)',
                  border: '1px solid var(--color-border)',
                },
              }}
            />
          </AuthProvider>
        </ErrorBoundary>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default function App() {
  return (
    <AppThemeProvider>
      <ThemedApp />
    </AppThemeProvider>
  );
}
