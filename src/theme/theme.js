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
        // Rich Dark Mode with depth
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
          default: '#0d0b09', // Deep Charcoal
          paper: '#1a1512', // Dark Coffee
        },
        text: {
          primary: '#f5f0e8',
          secondary: '#b8b3a8',
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
          backgroundImage: mode === 'dark' 
            ? 'url("https://www.transparenttextures.com/patterns/dark-leather.png")'
            : 'url("https://www.transparenttextures.com/patterns/natural-paper.png")',
          transition: 'background-color 0.3s ease-in-out, background-image 0.3s ease-in-out',
        },
        '*': {
          transition: 'background-color 0.2s ease, color 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease',
        },
        '@media (prefers-reduced-motion: reduce)': {
          '*': {
            animationDuration: '0.01ms !important',
            animationIterationCount: '1 !important',
            transitionDuration: '0.01ms !important',
          },
        },
      }),
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 32,
          padding: '10px 24px',
          transition: 'transform 0.2s ease, box-shadow 0.2s ease',
          '&:hover': {
            transform: 'translateY(-2px)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          borderRadius: 24,
          transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out, background-color 0.3s ease',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out, background-color 0.3s ease',
          '&:hover': {
            transform: 'translateY(-4px)',
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          transition: 'background-color 0.2s ease, transform 0.2s ease',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            transition: 'box-shadow 0.2s ease',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          transition: 'background-color 0.2s ease, color 0.2s ease',
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          transition: 'background-color 0.2s ease',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          transition: 'transform 0.3s ease',
        },
      },
    },
  },
});

export const getTheme = (mode) => createTheme(getDesignTokens(mode));
