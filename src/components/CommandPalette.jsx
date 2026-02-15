import {
  KBarProvider,
  KBarPortal,
  KBarPositioner,
  KBarAnimator,
  KBarSearch,
  KBarResults,
  useMatches,
} from 'kbar';
import { useNavigate } from 'react-router-dom';
import { useTheme, Box, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import {
  Home,
  AccountTree,
  Person,
  Settings,
  Brightness4,
  GitHub,
  LinkedIn,
  Language,
} from '@mui/icons-material';

import { useThemeContext } from '@/contexts/ThemeContext';

export default function CommandPalette({ children }) {
  const navigate = useNavigate();
  const { toggleColorMode } = useThemeContext();
  const theme = useTheme();

  const actions = [
    {
      id: 'home',
      name: 'Home',
      shortcut: ['h'],
      keywords: 'go-home',
      perform: () => navigate('/'),
      icon: <Home />,
    },
    {
      id: 'projects',
      name: 'Projects',
      shortcut: ['p'],
      keywords: 'go-projects',
      perform: () => navigate('/projects'),
      icon: <AccountTree />,
    },
    {
      id: 'profile',
      name: 'Profile / Links',
      shortcut: ['l'],
      keywords: 'go-links-profile',
      perform: () => navigate('/links'),
      icon: <Person />,
    },
    {
      id: 'services',
      name: 'Web Design Services',
      shortcut: ['s'],
      keywords: 'services-hire',
      perform: () => navigate('/services'),
      icon: <Settings />,
    },
    {
      id: 'theme',
      name: 'Toggle Theme',
      shortcut: ['t'],
      keywords: 'change-theme-dark-light',
      perform: () => toggleColorMode(),
      icon: <Brightness4 />,
    },
    {
      id: 'github',
      name: 'GitHub Profile',
      shortcut: ['g'],
      keywords: 'external-github',
      perform: () => window.open('https://github.com/moodynooby', '_blank'),
      icon: <GitHub />,
    },
    {
      id: 'linkedin',
      name: 'LinkedIn Profile',
      shortcut: ['i'],
      keywords: 'external-linkedin',
      perform: () => window.open('https://www.linkedin.com/in/manas-doshi-644751363', '_blank'),
      icon: <LinkedIn />,
    },
    {
      id: 'addons',
      name: 'Mozilla Add-ons Profile',
      shortcut: ['a'],
      keywords: 'external-mozilla-addons',
      perform: () => window.open('https://addons.mozilla.org/en-US/firefox/user/17859963/', '_blank'),
      icon: <Language />,
    },
  ];

  return (
    <KBarProvider actions={actions}>
      <KBarPortal>
        <KBarPositioner style={{ zIndex: 9999, backdropFilter: 'blur(4px)', background: 'rgba(0,0,0,0.5)' }}>
          <KBarAnimator
            style={{
              maxWidth: '600px',
              width: '100%',
              background: theme.palette.background.paper,
              color: theme.palette.text.primary,
              borderRadius: '16px',
              overflow: 'hidden',
              boxShadow: theme.shadows[24],
            }}
          >
            <Box sx={{ p: 2, borderBottom: `1px solid ${theme.palette.divider}` }}>
              <KBarSearch
                style={{
                  padding: '12px 16px',
                  fontSize: '16px',
                  width: '100%',
                  boxSizing: 'border-box',
                  outline: 'none',
                  border: 'none',
                  background: 'transparent',
                  color: theme.palette.text.primary,
                }}
              />
            </Box>
            <RenderResults />
          </KBarAnimator>
        </KBarPositioner>
      </KBarPortal>
      {children}
    </KBarProvider>
  );
}

function RenderResults() {
  const { results } = useMatches();
  const theme = useTheme();

  return (
    <KBarResults
      items={results}
      onRender={({ item, active }) =>
        typeof item === 'string' ? (
          <Box sx={{ p: 2 }}>
            <Typography variant="caption" sx={{ textTransform: 'uppercase', opacity: 0.5, fontWeight: 700 }}>
              {item}
            </Typography>
          </Box>
        ) : (
          <Box
            sx={{
              px: 3,
              py: 2,
              background: active ? theme.palette.action.hover : 'transparent',
              borderLeft: `4px solid ${active ? theme.palette.primary.main : 'transparent'}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              {item.icon && <Box sx={{ display: 'flex', opacity: 0.7 }}>{item.icon}</Box>}
              <Typography variant="body1" sx={{ fontWeight: active ? 600 : 400 }}>
                {item.name}
              </Typography>
            </Box>
            {item.shortcut?.length > 0 && (
              <Box sx={{ display: 'flex', gap: 0.5 }}>
                {item.shortcut.map((sc) => (
                  <Box
                    key={sc}
                    sx={{
                      px: 1,
                      py: 0.5,
                      borderRadius: 1,
                      bgcolor: theme.palette.action.selected,
                      fontSize: '10px',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                    }}
                  >
                    {sc}
                  </Box>
                ))}
              </Box>
            )}
          </Box>
        )
      }
    />
  );
}

CommandPalette.propTypes = {
  children: PropTypes.node,
};
