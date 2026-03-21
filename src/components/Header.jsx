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
  Button,
  ToggleButtonGroup,
  ToggleButton,
} from '@mui/material';
import { useTheme, alpha } from '@mui/material/styles';
import MenuIcon from '@mui/icons-material/Menu';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import GitHubIcon from '@mui/icons-material/GitHub';
import TwitterIcon from '@mui/icons-material/Twitter';
import EmailIcon from '@mui/icons-material/Email';
import InstagramIcon from '@mui/icons-material/Instagram';
import WebIcon from '@mui/icons-material/Web';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import SearchIcon from '@mui/icons-material/Search';
import { useKBar } from 'kbar';
import { Link } from 'react-router-dom';

import socialLinks from '@/content/socialLinks.json';
import { useThemeContext } from '@/contexts/ThemeContext';

const iconMap = {
  LinkedIn: LinkedInIcon,
  GitHub: GitHubIcon,
  Twitter: TwitterIcon,
  Email: EmailIcon,
  Instagram: InstagramIcon,
  'Addons Profile': WebIcon,
};

function SocialLinksComponent() {
  const theme = useTheme();
  return (
    <Box sx={{ display: 'flex', gap: 1 }}>
      {socialLinks.map((social, index) => {
        const IconComponent = iconMap[social.alt];
        if (!IconComponent) return null;
        return (
          <IconButton
            key={index}
            href={social.link}
            target="_blank"
            size="small"
            sx={{
              color: 'primary.main',
              border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
              borderRadius: 0,
              '&:hover': {
                bgcolor: alpha(theme.palette.primary.main, 0.05),
                borderColor: theme.palette.primary.main,
              },
            }}
          >
            <IconComponent fontSize="small" />
          </IconButton>
        );
      })}
    </Box>
  );
}

export default function ButtonAppBar() {
  const [menuAnchorEl, setMenuAnchorEl] = React.useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { mode, setThemeMode } = useThemeContext();
  const { query } = useKBar();

  const handleMenuOpen = (event) => setMenuAnchorEl(event.currentTarget);
  const handleMenuClose = () => setMenuAnchorEl(null);

  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Box
        sx={{
          pt: 4,
          pb: 2,
          px: 2,
          textAlign: 'center',
          bgcolor: 'background.default',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <Typography
          variant="h1"
          component={Link}
          to="/"
          sx={{
            display: 'block',
            fontSize: { xs: '3rem', md: '5rem' },
            color: 'text.primary',
            textDecoration: 'none',
            mb: 1,
            '&:hover': { opacity: 0.9 },
          }}
        >
          MANAS DOSHI
        </Typography>

        <Box
          sx={{
            borderTop: `2px solid ${theme.palette.text.primary}`,
            borderBottom: `1px solid ${alpha(theme.palette.text.primary, 0.2)}`,
            py: 0.5,
            my: 1,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            maxWidth: '1200px',
            mx: 'auto',
          }}
        >
          <Typography variant="overline" sx={{ fontWeight: 800 }}>
            VOL. I — NO. 1
          </Typography>
          <Typography variant="overline" sx={{ display: { xs: 'none', md: 'block' }, fontWeight: 800 }}>
            {currentDate.toUpperCase()}
          </Typography>
          <Typography variant="overline" sx={{ fontWeight: 800 }}>
            LATE EDITION
          </Typography>
        </Box>
      </Box>

      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          top: 0,
          zIndex: 10,
          bgcolor: alpha(theme.palette.background.default, 0.85),
          backdropFilter: 'blur(12px)',
          borderBottom: `1px solid ${alpha(theme.palette.text.primary, 0.1)}`,
        }}
      >
        <Toolbar
          variant="dense"
          sx={{
            justifyContent: 'center',
            gap: { xs: 1, md: 4 },
            minHeight: '48px !important',
          }}
        >
          {!isMobile ? (
            <>
              <Button component={Link} to="/" color="inherit">Dispatch</Button>
              <Button component={Link} to="/projects" color="inherit">The Portfolio</Button>
              <Button component={Link} to="/links" color="inherit">The Dossier</Button>
              <Box sx={{ width: '1px', height: '24px', bgcolor: 'divider', mx: 2 }} />
            </>
          ) : (
            <IconButton onClick={handleMenuOpen} color="inherit">
              <MenuIcon />
            </IconButton>
          )}

          <IconButton onClick={query.toggle} size="small" color="inherit">
            <SearchIcon fontSize="small" />
          </IconButton>

          <Box sx={{ flexGrow: isMobile ? 1 : 0 }} />

          <ToggleButtonGroup
            value={mode}
            exclusive
            onChange={(_, newMode) => newMode && setThemeMode(newMode)}
            size="small"
            sx={{
              '& .MuiToggleButton-root': {
                border: 'none',
                padding: '4px 8px',
                '&.Mui-selected': {
                  bgcolor: 'transparent',
                  color: 'secondary.main',
                  textDecoration: 'underline',
                },
              },
            }}
          >
            <ToggleButton value="light"><LightModeIcon sx={{ fontSize: 16 }} /></ToggleButton>
            <ToggleButton value="dark"><DarkModeIcon sx={{ fontSize: 16 }} /></ToggleButton>
          </ToggleButtonGroup>

          {!isMobile && (
            <>
              <Box sx={{ width: '1px', height: '24px', bgcolor: 'divider', mx: 2 }} />
              <SocialLinksComponent />
            </>
          )}
        </Toolbar>
      </AppBar>

      <Menu
        anchorEl={menuAnchorEl}
        open={Boolean(menuAnchorEl)}
        onClose={handleMenuClose}
        slotProps={{
          paper: {
            sx: {
              borderRadius: 0,
              minWidth: 200,
              bgcolor: 'background.default',
              border: `1px solid ${theme.palette.text.primary}`,
            },
          },
        }}
      >
        <MenuItem component={Link} to="/" onClick={handleMenuClose}>Dispatch</MenuItem>
        <MenuItem component={Link} to="/projects" onClick={handleMenuClose}>The Portfolio</MenuItem>
        <MenuItem component={Link} to="/links" onClick={handleMenuClose}>The Dossier</MenuItem>
      </Menu>
    </Box>
  );
}
