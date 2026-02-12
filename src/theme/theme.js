import { createTheme } from '@mui/material/styles';

const getDesignTokens = (mode) => ({
  palette: {
    mode,
    ...(mode === 'light'
      ? {
        // Warm Organic Light Mode
        primary: {
          main: '#8c4b3e', // Terracotta
          light: '#be7b6a',
          dark: '#5c1f17',
          contrastText: '#fffaf0', // Floral White
        },
        secondary: {
          main: '#6b705c', // Sage/Olive
          light: '#9ba08b',
          dark: '#3f4331',
          contrastText: '#fffaf0',
        },
        background: {
          default: '#fffaf0', // Creamy/Floral White
          paper: '#fdf5e6', // Old Lace
        },
        text: {
          primary: '#2d241e',
          secondary: '#5c524b',
        },
      }
      : {
        // Warm Organic Dark Mode
        primary: {
          main: '#be7b6a', // Softer Terracotta
          light: '#efab99',
          dark: '#8c4b3e',
          contrastText: '#1a1410',
        },
        secondary: {
          main: '#a5a58d', // Lighter Sage
          light: '#d4d3bb',
          dark: '#797a61',
          contrastText: '#1a1410',
        },
        background: {
          default: '#1a1410', // Dark Coffee
          paper: '#2d241e', // Darker Bean
        },
        text: {
          primary: '#fffaf0',
          secondary: '#d4d3bb',
        },
      }),
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontWeight: 800 },
    h2: { fontWeight: 700 },
    h3: { fontWeight: 700 },
    button: { textTransform: 'none', fontWeight: 600 },
  },
  shape: {
    borderRadius: 24, // Organic/Soft
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: (theme) => ({
        body: {
          backgroundColor: theme.palette.background.default,
          backgroundImage: 'url("https://www.transparenttextures.com/patterns/natural-paper.png")', // Subtle texture
          transition: 'background-color 0.3s ease-in-out',
        },
      }),
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 32,
          padding: '10px 24px',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          borderRadius: 24,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
          '&:hover': {
            transform: 'translateY(-4px)',
          },
        },
      },
    },
  },
});

export const getTheme = (mode) => createTheme(getDesignTokens(mode));
