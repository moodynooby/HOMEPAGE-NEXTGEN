import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import LandingPage from './LandingPage'
import { BrowserRouter } from "react-router";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { teal, red } from '@mui/material/colors';
const customTheme = createTheme({
  palette: {
    primary: {
      main: teal[500],    // Medium teal shade
      light: teal[300],   // Lighter teal
      dark: teal[700],    // Darker teal
    },
    secondary: {
      main: red[500],     // Medium red shade
      light: red[300],    // Lighter red
      dark: red[700],     // Darker red
    },
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
  spacing: 8, // Base spacing unit (8px)
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
        <ThemeProvider theme={customTheme}>
    <BrowserRouter>
    <LandingPage />
    </BrowserRouter>
    </ThemeProvider>
  </StrictMode>,
)
