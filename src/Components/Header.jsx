import * as React from 'react';
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  Button,
  IconButton,
  ButtonGroup,
  Menu,
  MenuItem,
  useMediaQuery
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import MenuIcon from '@mui/icons-material/Menu';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import GitHubIcon from '@mui/icons-material/GitHub';
import TwitterIcon from '@mui/icons-material/Twitter';
import EmailIcon from '@mui/icons-material/Email';
import InstagramIcon from '@mui/icons-material/Instagram';
import WebIcon from '@mui/icons-material/Web';
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
    <ButtonGroup className="flex gap-2 ml-auto">
      {socialLinks.map((social, index) => {
        const IconComponent = iconMap[social.alt];
        if (!IconComponent) return null;
        return (
          <Button
            key={index}
            href={social.link}
            color="inherit"
            startIcon={<IconComponent />}
            target="_blank"
            variant="outlined"
          >
            {social.alt}
          </Button>
        );
      })}
    </ButtonGroup>
  );
}

function SocialLinksMenu({ open, anchorEl, onClose }) {
  return (
    <Menu anchorEl={anchorEl} open={open} onClose={onClose}>
      {socialLinks.map((social, index) => {
        const IconComponent = iconMap[social.alt];
        if (!IconComponent) return null;
        return (
          <MenuItem
            key={index}
            component="a"
            href={social.link}
            target="_blank"
            onClick={onClose}
          >
            <IconComponent style={{ marginRight: 8 }} />
            {social.alt}
          </MenuItem>
        );
      })}
    </Menu>
  );
}

export default function ButtonAppBar() {
  const [menuAnchorEl, setMenuAnchorEl] = React.useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleMenuOpen = (event) => {
    setMenuAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };


  return (
    <Box >
      <AppBar position="static" color="primary" elevation={5} enableColorOnDark  >
        <Toolbar sx={{   display: 'flex',flexDirection: 'row',justifyContent: 'space-between',flexGrow: 1,}}>
          <Typography
            variant="h4"
            component="div"
            sx={{ fontFamily: "'Winky Sans', serif" ,padding: '10px' , fontWeight: 'bold'}}
          >
            Manas Doshi
          </Typography>
<Button variant="contained" color="success">My Projects</Button>
          {isMobile ? (
            <>
              <IconButton
                color="inherit"
                onClick={handleMenuOpen}
                sx={{ ml: 'auto'}}
              >
                <MenuIcon />
              </IconButton>
              <SocialLinksMenu
                open={Boolean(menuAnchorEl)}
                anchorEl={menuAnchorEl}
                onClose={handleMenuClose}
              />
            </>
          ) : (
            <SocialLinksComponent />
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
}