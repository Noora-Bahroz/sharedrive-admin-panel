import { createTheme, type Theme } from '@mui/material/styles';
import { font, radius } from './tokens';

type ThemeMode = 'light' | 'dark';

const lightPalette = {
  mode: 'light' as const,
  background: { default: '#F5F5F5', paper: '#FFFFFF' },
  primary: { main: '#1A1A1A', contrastText: '#FFFFFF' },
  secondary: { main: '#C8F227', contrastText: '#1A1A1A' },
  error: { main: '#E5484D' },
  warning: { main: '#F2A93B' },
  success: { main: '#4ADE80' },
  info: { main: '#4FD1C5' },
  text: { primary: '#1A1A1A', secondary: '#666666' },
  divider: '#E0E0E0',
};

const darkPalette = {
  mode: 'dark' as const,
  background: { default: '#0A0A0A', paper: '#1A1A1A' },
  primary: { main: '#F0F0F0', contrastText: '#0A0A0A' },
  secondary: { main: '#C8F227', contrastText: '#0A0A0A' },
  error: { main: '#E5484D' },
  warning: { main: '#F2A93B' },
  success: { main: '#4ADE80' },
  info: { main: '#4FD1C5' },
  text: { primary: '#F0F0F0', secondary: '#999999' },
  divider: '#333333',
};

const shared = {
  typography: {
    fontFamily: font.body,
    h1: { fontFamily: font.display, fontWeight: 600 },
    h2: { fontFamily: font.display, fontWeight: 600 },
    h3: { fontFamily: font.display, fontWeight: 600 },
    h4: { fontFamily: font.display, fontWeight: 600 },
    h5: { fontFamily: font.display, fontWeight: 600 },
    h6: { fontFamily: font.display, fontWeight: 600 },
    button: { textTransform: 'none', fontWeight: 600 },
  },
  shape: { borderRadius: radius.md },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: { backgroundImage: 'none' },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: { fontFamily: font.body },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: radius.sm },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { fontWeight: 600, fontFamily: font.body },
      },
    },
  },
};

export function createAppTheme(mode: ThemeMode): Theme {
  const palette = mode === 'dark' ? darkPalette : lightPalette;
  return createTheme({ palette, ...shared });
}
