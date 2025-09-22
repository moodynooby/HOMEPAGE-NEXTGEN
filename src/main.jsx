import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import { teal, red } from '@mui/material/colors';

import LandingPage from './Components/LandingPage';
import SpeedDial from './Components/Projects';

const customTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: teal[500],
      light: teal[300],
      dark: teal[700],
      contrastText: '#fff',
    },
    secondary: {
      main: red[500],
      light: red[300],
      dark: red[700],
      contrastText: '#fff',
    },
    background: {
      default: '#ffffff',
      paper: '#f5f5f5',
    }
  },
  typography: {
    fontFamily: '"Alan Sans","Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
    }
  },
  spacing: 8,
  components: {
    MuiCssBaseline: {
      styleOverrides: `
        html, body, #root {
          height: 100%;
          margin: 0;
          padding: 0;
        }
      `
    }
  }
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
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>
);
