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

import LandingPage from './Components/LandingPage';
const SpeedDial = lazy(() => import('./Components/Projects'));
const ProjectDetail = lazy(() => import('./Components/ProjectDetail'));
const LinkTree = lazy(() => import('./Components/LinkTree'));

const customTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#6B7280',
      light: '#9CA3AF',
      dark: '#4B5563',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#9CA3AF',
      light: '#D1D5DB',
      dark: '#6B7280',
      contrastText: '#111827',
    },
    success: {
      main: '#6EE7B7',
      light: '#86EFAC',
      dark: '#4ADE80',
    },
    info: {
      main: '#60A5FA',
      light: '#93C5FD',
      dark: '#3B82F6',
    },
    background: {
      default: '#F9FAFB',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#111827',
      secondary: '#6B7280',
    },
    divider: 'rgba(107, 114, 128, 0.12)', // M3 divider tone
  },
  typography: {
    fontFamily:
      '"Alan Sans", "Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '3rem',
      fontWeight: 800,
      letterSpacing: '-0.02em',
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
  spacing: 4, // M3 standard spacing unit
  shape: {
    borderRadius: 12,
  },
  shadows: [
    // M3 tonal elevations (neutral + primary surface)
    'none',
    '0px 1px 3px rgba(0, 0, 0, 0.12), 0px 1px 2px rgba(0, 0, 0, 0.24)',
    '0px 3px 6px rgba(0, 0, 0, 0.16), 0px 3px 6px rgba(0, 0, 0, 0.23)',
    '0px 10px 20px rgba(0, 0, 0, 0.19), 0px 6px 6px rgba(0, 0, 0, 0.23)',
    '0px 14px 28px rgba(0, 0, 0, 0.25), 0px 10px 10px rgba(0, 0, 0, 0.22)',
    '0px 19px 38px rgba(0, 0, 0, 0.30), 0px 15px 12px rgba(0, 0, 0, 0.22)',
    ...Array(20).fill('0px 25px 50px rgba(0, 0, 0, 0.25)'),
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
          background: rgba(229, 231, 235, 0.5);
          border-radius: 12px;
        }
        *::-webkit-scrollbar-thumb {
          background: rgba(107, 114, 128, 0.4);
          border-radius: 12px;
        }
        *::-webkit-scrollbar-thumb:hover {
          background: rgba(107, 114, 128, 0.6);
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
            boxShadow: ({ palette }) => `0 4px 12px ${palette.primary.main}20`,
          },
        },
        contained: {
          boxShadow: ({ palette }) => `0 2px 8px ${palette.primary.main}15`,
        },
        outlined: {
          borderWidth: 1.5,
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
        },
        elevation3: {
          background: 'rgba(255, 255, 255, 0.92)',
          backdropFilter: 'saturate(180%) blur(24px)',
        },
      },
    },
    MuiAppBar: {
      defaultProps: {
        elevation: 2,
      },
      styleOverrides: {
        root: {
          backdropFilter: 'saturate(180%) blur(20px)',
          background: 'rgba(255, 255, 255, 0.92)',
          borderBottom: ({ palette }) => `1px solid ${palette.divider}`,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: ({ shadows }) => shadows[8],
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
          borderRadius: 20,
        },
      },
    },
    MuiSpeedDial: {
      styleOverrides: {
        root: {
          '& .MuiSpeedDialAction-fab': {
            bgcolor: ({ palette }) => palette.primary.main,
            boxShadow: ({ shadows }) => shadows[4],
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
              <CircularProgress size={48} thickness={4} />
            </Box>
          }
        >
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/projects" element={<SpeedDial />} />
            <Route path="/projects/:projectName" element={<ProjectDetail />} />
            <Route path="/links" element={<LinkTree />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>,
);
