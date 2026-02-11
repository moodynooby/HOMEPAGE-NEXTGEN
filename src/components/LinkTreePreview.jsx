import {
  Box,
  Typography,
  Paper,
  Button,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { motion } from 'motion/react';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import GitHubIcon from '@mui/icons-material/GitHub';
import EmailIcon from '@mui/icons-material/Email';
import InstagramIcon from '@mui/icons-material/Instagram';
import WebIcon from '@mui/icons-material/Web';
import { Link } from 'react-router-dom';

import socialLinks from '@/content/socialLinks.json';

const iconMap = {
  LinkedIn: LinkedInIcon,
  GitHub: GitHubIcon,
  Email: EmailIcon,
  Instagram: InstagramIcon,
  'Addons Profile': WebIcon,
};

const MotionPaper = motion(Paper);

export default function LinkTreePreview() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box sx={{ width: '100%' }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 2,
          mb: 3,
        }}
      >
        <Box>
          <Typography variant={isMobile ? 'h4' : 'h3'} color="primary" sx={{ fontWeight: 700 }}>
            Find Me Online
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Quick links to the places I post and build.
          </Typography>
        </Box>
        <Button component={Link} to="/links" variant="outlined" size="small">
          View profile
        </Button>
      </Box>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: 'repeat(3, minmax(0, 1fr))',
            sm: 'repeat(5, minmax(0, 1fr))',
          },
          gap: 2,
        }}
      >
        {socialLinks.map((social, index) => {
          const IconComponent = iconMap[social.alt];
          if (!IconComponent) return null;
          return (
            <MotionPaper
              key={social.alt}
              component="a"
              href={social.link}
              target="_blank"
              rel="noopener noreferrer"
              elevation={0}
              variant="glass"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.08 }}
              sx={{
                textDecoration: 'none',
                color: 'text.primary',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 1,
                p: 2,
                borderRadius: 3,
                transition: 'all 0.3s ease',
                '&:hover': {
                  borderColor: theme.custom.glass.borderActive,
                  boxShadow: theme.custom.glass.shadowActive,
                  transform: 'translateY(-2px)',
                },
              }}
            >
              <IconComponent sx={{ fontSize: 26, color: 'primary.main' }} />
              <Typography variant="caption" sx={{ fontWeight: 600 }}>
                {social.alt}
              </Typography>
            </MotionPaper>
          );
        })}
      </Box>
    </Box>
  );
}
