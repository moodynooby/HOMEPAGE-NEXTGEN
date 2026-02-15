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

import { ThemeContextProvider, useThemeContext } from '@/contexts/ThemeContext';
import { getTheme } from '@/theme/theme';
import CommandPalette from '@/components/CommandPalette';
import LandingPage from '@/components/LandingPage';
const SpeedDial = lazy(() => import('@/components/Projects'));
const ProjectDetail = lazy(() => import('@/components/ProjectDetail'));
const LinkTree = lazy(() => import('@/components/LinkTree'));
const WebDesignServices = lazy(() => import('@/components/WebDesignServices'));

const AppContent = () => {
  const { mode } = useThemeContext();
  const systemPreference = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  const effectiveMode = mode === 'system' ? systemPreference : mode;
  const theme = getTheme(effectiveMode);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <CommandPalette>
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
        </CommandPalette>
      </BrowserRouter>
    </ThemeProvider>
  );
};

const root = createRoot(document.getElementById('root'));

root.render(
  <StrictMode>
    <ThemeContextProvider>
      <AppContent />
    </ThemeContextProvider>
  </StrictMode>,
);
