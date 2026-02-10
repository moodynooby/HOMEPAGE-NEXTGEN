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
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';

import socialLinks from '@/content/socialLinks.json';
import { useThemeMode } from '@/contexts/ThemeContext';

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
                boxShadow: (theme) =>
                  theme.palette.mode === 'dark'
                    ? '0 1px 3px rgba(0,0,0,0.3), 0 1px 2px rgba(0,0,0,0.4)'
                    : '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
                '&:hover': {
                  bgcolor: 'primary.light',
                  boxShadow: (theme) =>
                    theme.palette.mode === 'dark'
                      ? '0 4px 12px rgba(0, 0, 0, 0.4)'
                      : '0 4px 12px rgba(107, 114, 128, 0.3)',
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

function ThemeToggle() {
  const { isDark, toggleTheme } = useThemeMode();

  return (
    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
      <IconButton
        onClick={toggleTheme}
        size="small"
        sx={{
          color: 'primary.main',
          bgcolor: 'background.paper',
          boxShadow: (theme) =>
            theme.palette.mode === 'dark'
              ? '0 1px 3px rgba(0,0,0,0.3), 0 1px 2px rgba(0,0,0,0.4)'
              : '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
          '&:hover': {
            bgcolor: 'primary.light',
            color: 'primary.contrastText',
          },
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
        aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      >
        {isDark ? (
          <LightModeIcon fontSize="small" />
        ) : (
          <DarkModeIcon fontSize="small" />
        )}
      </IconButton>
    </motion.div>
  );
}

export default function ButtonAppBar() {
  const [menuAnchorEl, setMenuAnchorEl] = React.useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleMenuOpen = (event) => {
    setMenuAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        position="fixed"
        elevation={1}
        sx={{
          background: (theme) =>
            theme.palette.mode === 'dark'
              ? 'rgba(15, 23, 42, 0.92)'
              : 'rgba(255, 255, 255, 0.92)',
          backdropFilter: 'saturate(180%) blur(12px)',
          boxShadow: theme.shadows[2],
          borderBottom: `1px solid ${theme.palette.divider}`,
          borderRadius: '16px 16px 16px 16px',
          top: { xs: 0, md: '12px' },
          left: { md: '50%' },
          transform: { md: 'translateX(-50%)' },
          width: { md: 'calc(100% - 48px)' },
          maxWidth: '1200px',
          transition: 'background-color 0.3s ease, border-color 0.3s ease',
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

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            {!isMobile && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <Chip
                  component={Link}
                  to="/"
                  label="Home"
                  clickable
                  size="small"
                  sx={{
                    bgcolor: 'rgba(107, 114, 128, 0.08)',
                    color: 'text.primary',
                    fontWeight: 500,
                    fontSize: '0.875rem',
                    borderRadius: 20,
                    '&:hover': {
                      bgcolor: 'primary.light',
                      transform: 'translateY(-2px)',
                      boxShadow: theme.shadows[4],
                    },
                    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                    marginLeft: '2px',
                  }}
                />
                <Chip
                  component={Link}
                  to="/projects"
                  label="Projects"
                  clickable
                  size="small"
                  sx={{
                    bgcolor: 'rgba(107, 114, 128, 0.08)',
                    color: 'text.primary',
                    fontWeight: 500,
                    fontSize: '0.875rem',
                    borderRadius: 20,
                    '&:hover': {
                      bgcolor: 'primary.light',
                      transform: 'translateY(-2px)',
                      boxShadow: theme.shadows[4],
                    },
                    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                    marginLeft: '2px',
                  }}
                />
                <Chip
                  component={Link}
                  to="/links"
                  label="Profile"
                  clickable
                  size="small"
                  sx={{
                    bgcolor: 'rgba(107, 114, 128, 0.08)',
                    color: 'text.primary',
                    fontWeight: 500,
                    fontSize: '0.875rem',
                    borderRadius: 20,
                    '&:hover': {
                      bgcolor: 'primary.light',
                      transform: 'translateY(-2px)',
                      boxShadow: theme.shadows[4],
                    },
                    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                    marginLeft: '2px',
                  }}
                />
                <Chip
                  component={Link}
                  label="Get your own website"
                  to="/services"
                  clickable
                  size="small"
                  sx={{
                    bgcolor: 'rgba(107, 114, 128, 0.08)',
                    color: 'text.primary',
                    fontWeight: 500,
                    fontSize: '0.875rem',
                    borderRadius: 20,
                    '&:hover': {
                      bgcolor: 'primary.light',
                      transform: 'translateY(-2px)',
                      boxShadow: theme.shadows[4],
                    },
                    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                    marginLeft: '2px',
                  }}
                />
              </motion.div>
            )}

            <ThemeToggle />

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
        <MenuItem
          component={Link}
          to="/services"
          variant="contained"
          size="large"
          color="secondary"
          sx={{
            overflow: 'scroll',
          }}
        >
          Get your own website
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
