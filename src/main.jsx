import { StrictMode, lazy, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import {
  ThemeProvider,
  CssBaseline,
  Box,
  CircularProgress,
} from '@mui/material';
import { createTheme, responsiveFontSizes } from '@mui/material/styles';
import { tokens } from '@/theme';
import LandingPage from '@/components/LandingPage';
const SpeedDial = lazy(() => import('@/components/Projects'));
const ProjectDetail = lazy(() => import('@/components/ProjectDetail'));
const LinkTree = lazy(() => import('@/components/LinkTree'));
const WebDesignServices = lazy(() => import('@/components/WebDesignServices'));

let customTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: tokens.colors.primary.main,
      light: tokens.colors.primary.light,
      dark: tokens.colors.primary.dark,
      contrastText: tokens.colors.primary.contrastText,
    },
    secondary: {
      main: tokens.colors.secondary.main,
      light: tokens.colors.secondary.light,
      dark: tokens.colors.secondary.dark,
      contrastText: tokens.colors.secondary.contrastText,
    },
    success: {
      main: tokens.colors.success.main,
      light: tokens.colors.success.light,
      dark: tokens.colors.success.dark,
    },
    info: {
      main: tokens.colors.info.main,
      light: tokens.colors.info.light,
      dark: tokens.colors.info.dark,
    },
    background: {
      default: tokens.colors.background.default,
      paper: tokens.colors.background.paper,
    },
    text: {
      primary: tokens.colors.text.primary,
      secondary: tokens.colors.text.secondary,
    },
    divider: tokens.colors.divider,
  },
  typography: {
    fontFamily: tokens.typography.fontFamily,
    h1: {
      fontSize: '3rem',
      fontWeight: 800,
      letterSpacing: '-0.02em',
      color: tokens.colors.primary.dark,
    },
    h2: {
      fontSize: '2.5rem',
      fontWeight: 700,
      letterSpacing: '-0.01em',
    },
    h4: {
      fontSize: '1.75rem',
      fontWeight: 600,
    },
    h6: {
      fontSize: '1.125rem',
      fontWeight: 500,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.7,
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },
  spacing: tokens.spacing.default,
  shape: {
    borderRadius: tokens.borderRadius.default,
  },
  shadows: tokens.shadows,
  components: {
    MuiCssBaseline: {
      styleOverrides: `
        html, body, #root {
          height: 100%;
          margin: 0;
          padding: 0;
          scroll-behavior: smooth;
        }
        *::-webkit-scrollbar {
          width: 6px;
        }
        *::-webkit-scrollbar-track {
          background: rgba(241, 245, 249, 0.5);
          border-radius: ${tokens.borderRadius.default}px;
        }
        *::-webkit-scrollbar-thumb {
          background: rgba(148, 163, 184, 0.4);
          border-radius: ${tokens.borderRadius.default}px;
        }
        *::-webkit-scrollbar-thumb:hover {
          background: rgba(100, 116, 139, 0.6);
        }
      `,
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: tokens.borderRadius.default,
          padding: '12px 28px',
          fontSize: '0.95rem',
          fontWeight: 600,
          height: 48,
          transition: tokens.transitions.default,
          '&:hover': {
            transform: 'translateY(-1px)',
            boxShadow: tokens.shadows[4],
          },
        },
        contained: {
          boxShadow: '0 2px 8px rgba(51, 65, 85, 0.15)',
        },
        outlined: {
          borderWidth: 1.5,
          borderColor: '#CBD5E1',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backdropFilter: tokens.backdropFilters.md,
        },
        elevation1: {
          background: tokens.colors.glass.paper,
          backdropFilter: tokens.backdropFilters.md,
          border: `1px solid rgba(255, 255, 255, 0.3)`,
        },
        elevation3: {
          background: tokens.colors.glass.paperHigh,
          backdropFilter: tokens.backdropFilters.lg,
        },
      },
    },
    MuiAppBar: {
      defaultProps: {
        elevation: 0,
      },
      styleOverrides: {
        root: {
          backdropFilter: tokens.backdropFilters.default,
          background: tokens.colors.glass.appBar,
          borderBottom: `1px solid ${tokens.colors.divider}`,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: tokens.borderRadius.lg,
          transition: tokens.transitions.medium,
          border: '1px solid rgba(226, 232, 240, 0.8)',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: tokens.shadows[4],
            borderColor: '#94A3B8',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          height: 32,
          fontWeight: 500,
          fontSize: '0.8rem',
          borderRadius: tokens.borderRadius.md,
        },
        filled: {
          backgroundColor: tokens.colors.chip.default,
          '&:hover': {
            backgroundColor: tokens.colors.chip.hover,
          },
        },
      },
    },
    MuiSpeedDial: {
      styleOverrides: {
        root: {
          '& .MuiSpeedDialAction-fab': {
            bgcolor: tokens.colors.background.default,
            color: tokens.colors.primary.main,
            '&:hover': {
              bgcolor: tokens.colors.background.paper,
            },
          },
        },
      },
    },
  },
});

customTheme = responsiveFontSizes(customTheme);

const root = createRoot(document.getElementById('root'));

root.render(
  <StrictMode>
    <ThemeProvider theme={customTheme}>
      <CssBaseline />
      <BrowserRouter>
        <Suspense
          fallback={
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100vh',
                bgcolor: 'background.default',
              }}
            >
              <CircularProgress
                size={48}
                thickness={4}
                sx={{ color: 'secondary.main' }}
              />
            </Box>
          }
        >
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/projects" element={<SpeedDial />} />
            <Route path="/projects/:projectName" element={<ProjectDetail />} />
            <Route path="/links" element={<LinkTree />} />
            <Route path="/services" element={<WebDesignServices />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>,
);