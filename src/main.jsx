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
import { createTheme } from '@mui/material/styles';

import LandingPage from '@/components/LandingPage';
const SpeedDial = lazy(() => import('@/components/Projects'));
const ProjectDetail = lazy(() => import('@/components/ProjectDetail'));
const LinkTree = lazy(() => import('@/components/LinkTree'));
const WebDesignServices = lazy(() => import('@/components/WebDesignServices'));

const customTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#334155',
      light: '#475569',
      dark: '#1e293b',
      contrastText: '#F8FAFC',
    },
    secondary: {
      main: '#6366f1',
      light: '#818cf8',
      dark: '#4f46e5',
      contrastText: '#FFFFFF',
    },
    success: {
      main: '#10B981',
      light: '#34D399',
      dark: '#059669',
    },
    info: {
      main: '#0EA5E9',
      light: '#38BDF8',
      dark: '#0284C7',
    },
    background: {
      default: '#F8FAFC',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#0F172A',
      secondary: '#475569',
    },
    divider: 'rgba(71, 85, 105, 0.12)',
  },
  typography: {
    fontFamily:
      '"Alan Sans", "Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '3rem',
      fontWeight: 800,
      letterSpacing: '-0.02em',
      color: '#1e293b',
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
  spacing: 4,
  shape: {
    borderRadius: 12,
  },
  shadows: [
    'none',
    '0px 1px 3px rgba(15, 23, 42, 0.08), 0px 1px 2px rgba(15, 23, 42, 0.12)',
    '0px 3px 6px rgba(15, 23, 42, 0.09), 0px 3px 6px rgba(15, 23, 42, 0.12)',
    '0px 10px 20px rgba(15, 23, 42, 0.12), 0px 6px 6px rgba(15, 23, 42, 0.12)',
    '0px 14px 28px rgba(15, 23, 42, 0.15), 0px 10px 10px rgba(15, 23, 42, 0.12)',
    '0px 19px 38px rgba(15, 23, 42, 0.20), 0px 15px 12px rgba(15, 23, 42, 0.12)',
    ...Array(20).fill('0px 25px 50px rgba(15, 23, 42, 0.25)'),
  ],
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
          border-radius: 12px;
        }
        *::-webkit-scrollbar-thumb {
          background: rgba(148, 163, 184, 0.4);
          border-radius: 12px;
        }
        *::-webkit-scrollbar-thumb:hover {
          background: rgba(100, 116, 139, 0.6);
        }
      `,
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          padding: '12px 28px',
          fontSize: '0.95rem',
          fontWeight: 600,
          height: 48,
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-1px)',
            boxShadow: '0 4px 12px rgba(99, 102, 241, 0.2)',
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
          backdropFilter: 'saturate(180%) blur(20px)',
        },
        elevation1: {
          background: 'rgba(255, 255, 255, 0.85)',
          backdropFilter: 'saturate(180%) blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
        },
        elevation3: {
          background: 'rgba(255, 255, 255, 0.92)',
          backdropFilter: 'saturate(180%) blur(24px)',
        },
      },
    },
    MuiAppBar: {
      defaultProps: {
        elevation: 0,
      },
      styleOverrides: {
        root: {
          backdropFilter: 'saturate(180%) blur(20px)',
          background: 'rgba(255, 255, 255, 0.8)',
          borderBottom: '1px solid rgba(226, 232, 240, 0.8)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          border: '1px solid rgba(226, 232, 240, 0.8)',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
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
          borderRadius: 8,
        },
        filled: {
          backgroundColor: '#F1F5F9',
          '&:hover': {
            backgroundColor: '#E2E8F0',
          },
        },
      },
    },
    MuiSpeedDial: {
      styleOverrides: {
        root: {
          '& .MuiSpeedDialAction-fab': {
            bgcolor: '#F8FAFC',
            color: '#334155',
            '&:hover': {
              bgcolor: '#F1F5F9',
            },
          },
        },
      },
    },
  },
});

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
