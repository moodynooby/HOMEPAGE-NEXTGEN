import * as React from 'react';
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  useMediaQuery,
  Chip,
  ToggleButtonGroup,
  ToggleButton,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import MenuIcon from '@mui/icons-material/Menu';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import GitHubIcon from '@mui/icons-material/GitHub';
import TwitterIcon from '@mui/icons-material/Twitter';
import EmailIcon from '@mui/icons-material/Email';
import InstagramIcon from '@mui/icons-material/Instagram';
import WebIcon from '@mui/icons-material/Web';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import BrightnessMediumIcon from '@mui/icons-material/BrightnessMedium';
import SearchIcon from '@mui/icons-material/Search';
import KeyboardIcon from '@mui/icons-material/Keyboard';
import { useKBar } from 'kbar';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';

import socialLinks from '@/content/socialLinks.json';
import { useThemeContext } from '@/contexts/ThemeContext';

// Icon mapping
const iconMap = {
  LinkedIn: LinkedInIcon,
  GitHub: GitHubIcon,
  Twitter: TwitterIcon,
  Email: EmailIcon,
  Instagram: InstagramIcon,
  'Addons Profile': WebIcon,
};

function SocialLinksComponent() {
  return (

    <Box sx={{ display: 'flex', gap: 1 }}>
      {socialLinks.map((social, index) => {
        const IconComponent = iconMap[social.alt];
        if (!IconComponent) return null;
        return (
          <motion.div
            key={index}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 400, damping: 17 }}
          >
            <IconButton
              href={social.link}
              target="_blank"
              size="small"
              sx={{
                color: 'primary.main',
                bgcolor: 'background.paper',
                boxShadow:
                  '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
                '&:hover': {
                  bgcolor: 'primary.light',
                  boxShadow: '0 4px 12px rgba(107, 114, 128, 0.3)',
                  transform: 'translateY(-1px)',
                },
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
            >
              <IconComponent fontSize="small" />
            </IconButton>
          </motion.div>
        );
      })}
    </Box>
  );
}

export default function ButtonAppBar() {
  const [menuAnchorEl, setMenuAnchorEl] = React.useState(null);
  const [activeLink, setActiveLink] = React.useState('/');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { mode, setThemeMode } = useThemeContext();
  const { query } = useKBar();

  const handleMenuOpen = (event) => {
    setMenuAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };

  React.useEffect(() => {
    setActiveLink(window.location.pathname);
  }, []);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          background: theme.palette.mode === 'light'
            ? 'linear-gradient(135deg, rgba(255,250,240,0.95) 0%, rgba(255,245,230,0.95) 100%)'
            : 'linear-gradient(135deg, rgba(26,21,18,0.95) 0%, rgba(13,11,9,0.95) 100%)',
          backdropFilter: 'saturate(180%) blur(16px)',
          boxShadow: theme.shadows[3],
          borderBottom: `1px solid ${theme.palette.divider}`,
          borderRadius: '16px 16px 16px 16px',
          top: { xs: 0, md: '12px' },
          left: { md: '50%' },
          transform: { md: 'translateX(-50%)' },
          width: { md: 'calc(100% - 48px)' },
          maxWidth: '1200px',
        }}
      >
        <Toolbar
          sx={{
            justifyContent: 'space-between',
            px: { xs: 2, md: 3 },
            py: 1.5,
          }}
        >
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            <Typography
              variant="h5"
              component={Link}
              to="/"
              sx={{
                fontFamily: theme.typography.fontFamily,
                fontWeight: 700,
                color: 'text.primary',
                textDecoration: 'none',
                cursor: 'pointer',
                letterSpacing: '-0.02em',
                transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  color: 'primary.dark',
                  transform: 'scale(1.02)',
                },
              }}
            >
              Manas Doshi
            </Typography>

          </motion.div>

          <Box
            onClick={query.toggle}
            sx={{
              display: { xs: 'none', sm: 'flex' },
              alignItems: 'center',
              gap: 0.5,
              px: 1.5,
              py: 0.75,
              borderRadius: 2,
              minWidth:'20vw',
              border: `1px solid ${theme.palette.divider}`,
              bgcolor: 'rgba(107, 114, 128, 0.08)',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              '&:hover': {
                bgcolor: 'primary.light',
                borderColor: 'primary.main',
                transform: 'scale(1.02)',
              },
              justifyItems:'baseline',
              justifyContent:'space-between',
            }}
          >
            <SearchIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500 }}>
              Search
            </Typography>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.25,
                ml: 1,
                px: 0.75,
                py: 0.25,
                borderRadius: 1,
                bgcolor: theme.palette.mode === 'light' ? 'grey.200' : 'grey.800',
                border: `1px solid ${theme.palette.divider}`,
              }}
            >
              <KeyboardIcon sx={{ fontSize: 12, color: 'text.secondary' }} />
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, fontSize: '10px' }}>
                K
              </Typography>
            </Box>
          </Box>


          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            {!isMobile && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                style={{ display: 'flex', gap: '8px' }}
              >
                <Chip
                  component={Link}
                  to="/"
                  label="Home"
                  clickable
                  size="small"
                  variant={activeLink === '/' ? 'filled' : 'outlined'}
                  sx={{
                    bgcolor: activeLink === '/' ? 'primary.main' : 'transparent',
                    color: activeLink === '/' ? 'primary.contrastText' : 'text.primary',
                    fontWeight: 600,
                    fontSize: '0.875rem',
                    borderRadius: 20,
                    borderColor: activeLink === '/' ? 'primary.main' : 'divider',
                    '&:hover': {
                      bgcolor: activeLink === '/' ? 'primary.dark' : 'primary.light',
                      transform: 'translateY(-2px)',
                      boxShadow: theme.shadows[4],
                    },
                    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                  }}
                />
                <Chip
                  component={Link}
                  to="/projects"
                  label="Projects"
                  clickable
                  size="small"
                  variant={activeLink === '/projects' ? 'filled' : 'outlined'}
                  sx={{
                    bgcolor: activeLink === '/projects' ? 'primary.main' : 'transparent',
                    color: activeLink === '/projects' ? 'primary.contrastText' : 'text.primary',
                    fontWeight: 600,
                    fontSize: '0.875rem',
                    borderRadius: 20,
                    borderColor: activeLink === '/projects' ? 'primary.main' : 'divider',
                    '&:hover': {
                      bgcolor: activeLink === '/projects' ? 'primary.dark' : 'primary.light',
                      transform: 'translateY(-2px)',
                      boxShadow: theme.shadows[4],
                    },
                    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                  }}
                />
                <Chip
                  component={Link}
                  to="/links"
                  label="Profile"
                  clickable
                  size="small"
                  variant={activeLink === '/links' ? 'filled' : 'outlined'}
                  sx={{
                    bgcolor: activeLink === '/links' ? 'primary.main' : 'transparent',
                    color: activeLink === '/links' ? 'primary.contrastText' : 'text.primary',
                    fontWeight: 600,
                    fontSize: '0.875rem',
                    borderRadius: 20,
                    borderColor: activeLink === '/links' ? 'primary.main' : 'divider',
                    '&:hover': {
                      bgcolor: activeLink === '/links' ? 'primary.dark' : 'primary.light',
                      transform: 'translateY(-2px)',
                      boxShadow: theme.shadows[4],
                    },
                    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                  }}

                />
              </motion.div>
            )}

            <ToggleButtonGroup
              value={mode}
              exclusive
              onChange={(_, newMode) => newMode && setThemeMode(newMode)}
              size="small"
              sx={{
                '& .MuiToggleButton-root': {
                  border: `1px solid ${theme.palette.divider}`,
                  px: 1,
                  py: 0.5,
                  '&.Mui-selected': {
                    bgcolor: 'primary.main',
                    color: 'primary.contrastText',
                    '&:hover': {
                      bgcolor: 'primary.dark',
                    },
                  },
                },
              }}
            >
              <ToggleButton value="light" aria-label="light mode">
                <LightModeIcon fontSize="small" />
              </ToggleButton>
              <ToggleButton value="system" aria-label="system mode">
                <BrightnessMediumIcon fontSize="small" />
              </ToggleButton>
              <ToggleButton value="dark" aria-label="dark mode">
                <DarkModeIcon fontSize="small" />
              </ToggleButton>
            </ToggleButtonGroup>
            {isMobile ? (
              <motion.div whileTap={{ scale: 0.95 }}>
                <IconButton
                  onClick={handleMenuOpen}
                  sx={{
                    color: 'primary.main',
                    bgcolor: 'rgba(107, 114, 128, 0.12)',
                    '&:hover': {
                      bgcolor: 'primary.light',
                      transform: 'scale(1.1)',
                    },
                    transition: 'all 0.2s ease',
                  }}
                >
                  <MenuIcon />
                </IconButton>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <SocialLinksComponent />
              </motion.div>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      <Menu
        anchorEl={menuAnchorEl}
        open={Boolean(menuAnchorEl)}
        onClose={handleMenuClose}
        slotProps={{
          paper: {
            sx: {
              mt: 1,
              bgcolor: 'background.paper',
              boxShadow: theme.shadows[8],
              minWidth: 200,
              '& .MuiMenuItem-root': {
                fontWeight: 500,
                borderRadius: 8,
                mx: 0.5,
                my: 0.25,
                '&:hover': {
                  bgcolor: 'primary.light',
                },
              },
            },
          },
        }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <MenuItem component={Link} to="/" onClick={handleMenuClose}>
          Home
        </MenuItem>
        <MenuItem component={Link} to="/projects" onClick={handleMenuClose}>
          Projects
        </MenuItem>
        <MenuItem component={Link} to="/links" onClick={handleMenuClose}>
          Profile
        </MenuItem>

        {socialLinks.map((social, index) => {
          const IconComponent = iconMap[social.alt];
          if (!IconComponent) return null;
          return (
            <MenuItem
              key={index}
              component="a"
              href={social.link}
              target="_blank"
              onClick={handleMenuClose}
              sx={{ py: 1.25 }}
            >
              <IconComponent sx={{ mr: 1.5, color: 'primary.main' }} />
              {social.alt}
            </MenuItem>
          );
        })}
      </Menu>
    </Box>
  );
}
