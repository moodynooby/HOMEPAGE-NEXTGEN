/**
 * Design tokens - centralized constants for all styling values
 * This file provides a single source of truth for colors, spacing, transitions, etc.
 */

const tokens = {
  colors: {
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
    warning: {
      main: '#F59E0B',
      light: '#FBBF24',
      dark: '#D97706',
    },
    info: {
      main: '#0EA5E9',
      light: '#38BDF8',
      dark: '#0284C7',
    },
    error: {
      main: '#EF4444',
      light: '#F87171',
      dark: '#DC2626',
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
    glass: {
      appBar: 'rgba(255, 255, 255, 0.92)',
      paper: 'rgba(255, 255, 255, 0.85)',
      paperHigh: 'rgba(255, 255, 255, 0.92)',
      translucent: 'rgba(255, 255, 255, 0.7)',
      overlay: 'rgba(255, 255, 255, 0.15)',
      overlayHover: 'rgba(255, 255, 255, 0.25)',
    },
    chip: {
      default: 'rgba(107, 114, 128, 0.08)',
      hover: 'rgba(107, 114, 128, 0.12)',
    },
    gradients: {
      primary: 'linear-gradient(135deg, #334155 0%, #475569 100%)',
      secondary: 'linear-gradient(135deg, #6366f1 0%, #818cf8 100%)',
      hero: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      card: 'linear-gradient(135deg, rgba(71, 85, 105, 0.08) 0%, rgba(255, 255, 255, 0.92) 100%)',
      text: 'linear-gradient(135deg, #1e293b 0%, #334155 50%, #0F172A 100%)',
    },
  },
  borderRadius: {
    none: 0,
    xs: 3,
    sm: 4,
    md: 8,
    default: 12,
    lg: 16,
    xl: 20,
    pill: 50,
    round: 999,
  },
  spacing: {
    xs: 1,
    sm: 2,
    md: 3,
    default: 4,
    lg: 6,
    xl: 8,
    xxl: 12,
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
  transitions: {
    fast: 'all 0.15s cubic-bezier(0.4, 0, 0.2, 1)',
    default: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
    medium: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    slow: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    spring: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
  },
  backdropFilters: {
    sm: 'blur(10px)',
    default: 'saturate(180%) blur(12px)',
    md: 'saturate(180%) blur(20px)',
    lg: 'saturate(180%) blur(24px)',
  },
  zIndex: {
    drawer: 1000,
    modal: 1100,
    snackbar: 1200,
    tooltip: 1300,
    fixed: 1000,
    nav: 1100,
  },
  typography: {
    fontFamily: '"Alan Sans", "Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    displayFontFamily: '"Winky Sans", "Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  },
  animation: {
    fast: '0.15s',
    default: '0.2s',
    medium: '0.3s',
    slow: '0.4s',
    page: '0.5s',
    stagger: '0.1s',
  },
};

export default tokens;
