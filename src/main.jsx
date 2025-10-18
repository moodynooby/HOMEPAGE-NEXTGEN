import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { createTheme } from '@mui/material/styles';

import LandingPage from './Components/LandingPage';
import SpeedDial from './Components/Projects';
import ProjectDetail from './Components/ProjectDetail';
import LinkTree from './Components/LinkTree';

const customTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#4F46E5',
      light: '#818CF8',
      dark: '#3730A3',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#F59E0B',
      light: '#FCD34D',
      dark: '#D97706',
      contrastText: '#1F2937',
    },
    success: {
      main: '#10B981',
      light: '#34D399',
      dark: '#059669',
    },
    info: {
      main: '#06B6D4',
      light: '#22D3EE',
      dark: '#0891B2',
    },
    background: {
      default: '#F9FAFB',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#1F2937',
      secondary: '#6B7280',
    },
  },
  typography: {
    fontFamily: '"Alan Sans", "Inter", "Roboto", "Helvetica", "Arial", sans-serif',
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
  spacing: 8,
  shape: {
    borderRadius: 12,
  },
  shadows: [
    'none',
    '0px 2px 4px rgba(79, 70, 229, 0.05)',
    '0px 4px 8px rgba(79, 70, 229, 0.08)',
    '0px 8px 16px rgba(79, 70, 229, 0.12)',
    '0px 12px 24px rgba(79, 70, 229, 0.15)',
    '0px 16px 32px rgba(79, 70, 229, 0.18)',
    ...Array(19).fill('0px 16px 32px rgba(79, 70, 229, 0.18)'),
  ],
  components: {
    MuiCssBaseline: {
      styleOverrides: `
        html, body, #root {
          height: 100%;
          margin: 0;
          padding: 0;
        }
      `,
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          padding: '10px 24px',
          fontSize: '1rem',
          fontWeight: 600,
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        },
        contained: {
          boxShadow: '0 4px 12px rgba(79, 70, 229, 0.25)',
          '&:hover': {
            boxShadow: '0 6px 20px rgba(79, 70, 229, 0.35)',
            transform: 'translateY(-2px)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
        elevation1: {
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
        },
        elevation3: {
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)',
        },
      },
    },
  },
});

const root = createRoot(document.getElementById('root'));

root.render(
  <StrictMode>
    <ThemeProvider theme={customTheme}>
      <CssBaseline /> {/* Reset CSS and apply MUI base styles */}
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/projects" element={<SpeedDial />} />
          <Route path="/projects/:projectName" element={<ProjectDetail />} />
          <Route path="/links" element={<LinkTree />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>,
);
