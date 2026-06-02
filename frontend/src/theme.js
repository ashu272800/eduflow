import { createTheme } from '@mui/material/styles';

const getThemeOptions = (mode) => createTheme({
  palette: {
    mode,
    primary: {
      main: mode === 'light' ? '#3B82F6' : '#60A5FA', // Sleek blue
      light: '#93C5FD',
      dark: '#1D4ED8',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: mode === 'light' ? '#10B981' : '#34D399', // Harmonic green
      light: '#6EE7B7',
      dark: '#047857',
      contrastText: '#FFFFFF',
    },
    background: {
      default: mode === 'light' ? '#F8FAFC' : '#0F172A', // Slate 50 / Slate 900
      paper: mode === 'light' ? '#FFFFFF' : '#1E293B',   // White / Slate 800
    },
    text: {
      primary: mode === 'light' ? '#1E293B' : '#F1F5F9',
      secondary: mode === 'light' ? '#64748B' : '#94A3B8',
    },
    divider: mode === 'light' ? '#E2E8F0' : '#334155',
  },
  typography: {
    fontFamily: '"Outfit", "Inter", "Roboto", sans-serif',
    h1: { fontSize: '2.5rem', fontWeight: 700, letterSpacing: '-0.02em' },
    h2: { fontSize: '2rem', fontWeight: 700, letterSpacing: '-0.01em' },
    h3: { fontSize: '1.75rem', fontWeight: 600 },
    h4: { fontSize: '1.5rem', fontWeight: 600 },
    h5: { fontSize: '1.25rem', fontWeight: 600 },
    h6: { fontSize: '1rem', fontWeight: 600 },
    subtitle1: { fontSize: '1rem', fontWeight: 500 },
    body1: { fontSize: '0.875rem', lineHeight: 1.5 },
    body2: { fontSize: '0.75rem', lineHeight: 1.43 },
    button: { textTransform: 'none', fontWeight: 600, fontSize: '0.875rem' },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          boxShadow: 'none',
          padding: '8px 16px',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            boxShadow: 'none',
            transform: 'translateY(-1px)',
          },
          '&:active': {
            transform: 'translateY(0)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          boxShadow: mode === 'light' 
            ? '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px 0 rgba(0, 0, 0, 0.03)' 
            : '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          border: `1px solid ${mode === 'light' ? '#E2E8F0' : '#334155'}`,
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          padding: '16px',
          borderBottom: `1px solid ${mode === 'light' ? '#F1F5F9' : '#334155'}`,
        },
        head: {
          fontWeight: 600,
          backgroundColor: mode === 'light' ? '#F8FAFC' : '#1E293B',
          color: mode === 'light' ? '#64748B' : '#94A3B8',
        },
      },
    },
  },
});

export default getThemeOptions;
