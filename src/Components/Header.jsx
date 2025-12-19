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
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';

import socialLinks from '../Content/socialLinks.json';

// Create the icon mapping
const iconMap = {
  'LinkedIn': LinkedInIcon,
  'GitHub': GitHubIcon,
  'Twitter': TwitterIcon,
  'Email': EmailIcon,
  'Instagram': InstagramIcon,
  'Addons Profile': WebIcon,
};

function SocialLinksComponent() {
  return (
    <Box sx={{ display: 'flex', gap: 1.5 }}>
      {socialLinks.map((social, index) => {
        const IconComponent = iconMap[social.alt];
        if (!IconComponent) return null;
        return (
          <motion.div
            key={index}
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
          >
            <IconButton
              href={social.link}
              target="_blank"
              sx={{
                color: 'primary.contrastText',
                bgcolor: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                '&:hover': {
                  bgcolor: 'secondary.main',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              <IconComponent />
            </IconButton>
          </motion.div>
        );
      })}
    </Box>
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
    <Box>
      <AppBar
        position="fixed"
        sx={{
          background: 'linear-gradient(135deg, rgba(63, 81, 181, 0.95) 0%, rgba(156, 39, 176, 0.9) 100%)',
          backdropFilter: 'blur(20px)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between', py: 1 }}>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Typography
              variant="h4"
              component={Link}
              to="/"
              sx={{
                fontFamily: '\'Winky Sans\', serif',
                fontWeight: 'bold',
                background: 'linear-gradient(45deg, #FFF 30%, #FFD54F 90%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textDecoration: 'none',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                '&:hover': {
                  filter: 'brightness(1.2)',
                },
              }}
            >
              Manas Doshi
            </Typography>
          </motion.div>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {!isMobile && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                style={{ display: 'flex', gap: '12px' }}
              >
                <Chip
                  component={Link}
                  to="/"
                  label="Home"
                  clickable
                  sx={{
                    bgcolor: 'rgba(255, 255, 255, 0.15)',
                    color: 'white',
                    fontWeight: 600,
                    fontSize: '0.9rem',
                    '&:hover': {
                      bgcolor: 'secondary.main',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                    },
                    transition: 'all 0.3s ease',
                  }}
                />
                <Chip
                  component={Link}
                  to="/projects"
                  label="My Projects"
                  clickable
                  sx={{
                    bgcolor: 'rgba(255, 255, 255, 0.15)',
                    color: 'white',
                    fontWeight: 600,
                    fontSize: '0.9rem',
                    '&:hover': {
                      bgcolor: 'secondary.main',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                    },
                    transition: 'all 0.3s ease',
                  }}
                />
                <Chip
                  component={Link}
                  to="/links"
                  label="Profile"
                  clickable
                  sx={{
                    bgcolor: 'rgba(255, 255, 255, 0.15)',
                    color: 'white',
                    fontWeight: 600,
                    fontSize: '0.9rem',
                    '&:hover': {
                      bgcolor: 'secondary.main',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                    },
                    transition: 'all 0.3s ease',
                  }}
                />
              </motion.div>
            )}

            {isMobile ? (
              <motion.div whileTap={{ scale: 0.9 }}>
                <IconButton
                  color="inherit"
                  onClick={handleMenuOpen}
                  sx={{
                    bgcolor: 'rgba(255, 255, 255, 0.1)',
                    '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.2)' },
                  }}
                >
                  <MenuIcon />
                </IconButton>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
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
        PaperProps={{
          sx: {
            bgcolor: 'rgba(63, 81, 181, 0.95)',
            backdropFilter: 'blur(20px)',
            color: 'white',
            mt: 1,
          },
        }}
      >
        <MenuItem component={Link} to="/" onClick={handleMenuClose}>
          Home
        </MenuItem>
        <MenuItem component={Link} to="/projects" onClick={handleMenuClose}>
          My Projects
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
            >
              <IconComponent sx={{ mr: 1 }} />
              {social.alt}
            </MenuItem>
          );
        })}
      </Menu>
    </Box>
  );
}