import {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
} from 'react';
import PropTypes from 'prop-types';

const ThemeContext = createContext(undefined);

export function ThemeProvider({ children }) {
  const [mode, setMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedMode = localStorage.getItem('portfolio-theme-mode');
      if (savedMode) {
        return savedMode;
      }
      const prefersDark = window.matchMedia(
        '(prefers-color-scheme: dark)',
      ).matches;
      return prefersDark ? 'dark' : 'light';
    }
    return 'light';
  });

  useEffect(() => {
    localStorage.setItem('portfolio-theme-mode', mode);
  }, [mode]);

  const toggleTheme = () => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  const value = useMemo(
    () => ({
      mode,
      toggleTheme,
      isDark: mode === 'dark',
    }),
    [mode],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

ThemeProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export function useThemeMode() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useThemeMode must be used within a ThemeProvider');
  }
  return context;
}
