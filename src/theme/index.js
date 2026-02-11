import { createTheme, responsiveFontSizes } from '@mui/material/styles';

const getTheme = () => {
  const theme = createTheme({
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
    custom: {
      glass: {
        bg: 'rgba(255, 255, 255, 0.72)',
        bgStrong: 'rgba(255, 255, 255, 0.85)',
        border: 'rgba(255, 255, 255, 0.4)',
        borderActive: 'rgba(99, 102, 241, 0.25)',
        shadow: '0 4px 16px rgba(15, 23, 42, 0.06), 0 1px 4px rgba(15, 23, 42, 0.04)',
        shadowActive: '0 8px 32px rgba(15, 23, 42, 0.1), 0 2px 8px rgba(15, 23, 42, 0.06)',
        blur: 'saturate(180%) blur(16px)',
        highlight: 'linear-gradient(90deg, rgba(99, 102, 241, 0.15) 0%, rgba(129, 140, 248, 0.08) 100%)',
      },
      glassChip: {
        bg: 'rgba(107, 114, 128, 0.06)',
        bgHover: 'rgba(107, 114, 128, 0.12)',
        border: 'rgba(107, 114, 128, 0.15)',
      },
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
      '0px 1px 3px rgba(15, 23, 42, 0.06), 0px 1px 2px rgba(15, 23, 42, 0.08)',
      '0px 3px 6px rgba(15, 23, 42, 0.07), 0px 3px 6px rgba(15, 23, 42, 0.08)',
      '0px 10px 20px rgba(15, 23, 42, 0.08), 0px 6px 6px rgba(15, 23, 42, 0.06)',
      '0px 14px 28px rgba(15, 23, 42, 0.10), 0px 10px 10px rgba(15, 23, 42, 0.06)',
      '0px 19px 38px rgba(15, 23, 42, 0.12), 0px 15px 12px rgba(15, 23, 42, 0.06)',
      ...Array(20).fill('0px 25px 50px rgba(15, 23, 42, 0.15)'),
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
          * {
            scrollbar-width: thin;
            scrollbar-color: rgba(148, 163, 184, 0.35) rgba(241, 245, 249, 0.4);
          }
          *::-webkit-scrollbar {
            width: 8px;
            height: 8px;
          }
          *::-webkit-scrollbar-track {
            background: rgba(241, 245, 249, 0.4);
            border-radius: 0;
          }
          *::-webkit-scrollbar-thumb {
            background: rgba(148, 163, 184, 0.35);
            border-radius: 4px;
            border: 2px solid rgba(241, 245, 249, 0.4);
            background-clip: content-box;
          }
          *::-webkit-scrollbar-thumb:hover {
            background: rgba(100, 116, 139, 0.5);
          }
          *::-webkit-scrollbar-corner {
            background: rgba(241, 245, 249, 0.4);
          }
          @supports not (backdrop-filter: saturate(180%) blur(16px)) {
            .glass-surface {
              backdrop-filter: none !important;
            }
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
              boxShadow: '0 4px 12px rgba(99, 102, 241, 0.18)',
            },
          },
          contained: {
            boxShadow: '0 2px 6px rgba(51, 65, 85, 0.12)',
          },
          outlined: {
            borderWidth: 1.5,
            borderColor: 'rgba(203, 213, 225, 0.8)',
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
          },
        },
        variants: [
          {
            props: { variant: 'glass' },
            style: {
              background: 'rgba(255, 255, 255, 0.72)',
              backdropFilter: 'saturate(180%) blur(16px)',
              border: '1px solid rgba(255, 255, 255, 0.4)',
              boxShadow: '0 4px 16px rgba(15, 23, 42, 0.06), 0 1px 4px rgba(15, 23, 42, 0.04)',
              '@supports not (backdrop-filter: saturate(180%) blur(16px))': {
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'none',
              },
            },
          },
          {
            props: { variant: 'glassStrong' },
            style: {
              background: 'rgba(255, 255, 255, 0.85)',
              backdropFilter: 'saturate(180%) blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.5)',
              boxShadow: '0 6px 20px rgba(15, 23, 42, 0.08), 0 2px 6px rgba(15, 23, 42, 0.04)',
              '@supports not (backdrop-filter: saturate(180%) blur(20px))': {
                background: 'rgba(255, 255, 255, 0.98)',
                backdropFilter: 'none',
              },
            },
          },
        ],
      },
      MuiAppBar: {
        defaultProps: {
          elevation: 0,
        },
        styleOverrides: {
          root: {
            backdropFilter: 'saturate(180%) blur(16px)',
            background: 'rgba(255, 255, 255, 0.85)',
            borderBottom: '1px solid rgba(226, 232, 240, 0.7)',
            '@supports not (backdrop-filter: saturate(180%) blur(16px))': {
              background: 'rgba(255, 255, 255, 0.98)',
              backdropFilter: 'none',
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 16,
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            border: '1px solid rgba(226, 232, 240, 0.6)',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: '0 12px 24px rgba(15, 23, 42, 0.1), 0 6px 12px rgba(15, 23, 42, 0.06)',
              borderColor: 'rgba(99, 102, 241, 0.2)',
            },
          },
        },
        variants: [
          {
            props: { variant: 'glass' },
            style: {
              background: 'rgba(255, 255, 255, 0.72)',
              backdropFilter: 'saturate(180%) blur(16px)',
              border: '1px solid rgba(255, 255, 255, 0.4)',
              boxShadow: '0 4px 16px rgba(15, 23, 42, 0.06), 0 1px 4px rgba(15, 23, 42, 0.04)',
              '@supports not (backdrop-filter: saturate(180%) blur(16px))': {
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'none',
              },
            },
          },
        ],
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
            backgroundColor: 'rgba(107, 114, 128, 0.06)',
            '&:hover': {
              backgroundColor: 'rgba(107, 114, 128, 0.12)',
            },
          },
        },
      },
      MuiSpeedDial: {
        styleOverrides: {
          root: {
            '& .MuiSpeedDialAction-fab': {
              bgcolor: 'rgba(248, 250, 252, 0.9)',
              color: '#334155',
              backdropFilter: 'blur(8px)',
              '&:hover': {
                bgcolor: 'rgba(241, 245, 249, 0.95)',
              },
            },
          },
        },
      },
    },
  });

  return responsiveFontSizes(theme);
};

export default getTheme;
