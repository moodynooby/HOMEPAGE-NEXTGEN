import { Box, Container, Typography, Paper, Avatar, useTheme } from '@mui/material';
import { motion } from 'motion/react';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import GitHubIcon from '@mui/icons-material/GitHub';
import EmailIcon from '@mui/icons-material/Email';
import InstagramIcon from '@mui/icons-material/Instagram';
import WebIcon from '@mui/icons-material/Web';
import PropTypes from 'prop-types';

import socialLinks from '@/content/socialLinks.json';

const iconMap = {
  'LinkedIn': LinkedInIcon,
  'GitHub': GitHubIcon,
  'Email': EmailIcon,
  'Instagram': InstagramIcon,
  'Addons Profile': WebIcon,
};

function LinkButton({ link, alt, index }) {
  const IconComponent = iconMap[alt];
  const theme = useTheme();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
    >
      <Paper
        component="a"
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        elevation={2}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 2,
          p: 2,
          textDecoration: 'none',
          color: 'text.primary',
          background: theme.palette.mode === 'light'
            ? 'linear-gradient(135deg, #ffffff 0%, #fdf5e6 100%)'
            : 'linear-gradient(135deg, #2d241e 0%, #1a1410 100%)',
          border: '2px solid',
          borderColor: 'primary.main',
          borderRadius: 4,
          transition: 'all 0.3s ease',
          '&:hover': {
            background: theme.palette.primary.main,
            color: 'primary.contrastText',
            boxShadow: `0 8px 24px ${theme.palette.primary.main}55`,
            borderColor: 'primary.light',
          },
        }}
      >
        {IconComponent && <IconComponent sx={{ fontSize: 28 }} />}
        <Typography variant="h6" fontWeight={600}>
          {alt}
        </Typography>
      </Paper>
    </motion.div>
  );
}

LinkButton.propTypes = {
  link: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired,
};

export default function LinkTree() {
  const theme = useTheme();
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        py: 6,
      }}
    >
      <Container maxWidth="sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Avatar
              sx={{
                width: 120,
                height: 120,
                mx: 'auto',
                mb: 3,
                bgcolor: 'background.paper',
                color: 'primary.main',
                fontSize: '3rem',
                fontWeight: 800,
                border: '4px solid',
                borderColor: 'primary.main',
                boxShadow: theme.shadows[10],
              }}
            >
              MD
            </Avatar>
            <Typography
              variant="h3"
              fontWeight={800}
              sx={{
                mb: 1,
                color: 'text.primary',
              }}
            >
              Manas Doshi
            </Typography>
          </Box>
        </motion.div>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {socialLinks.map((social, index) => (
            <LinkButton
              key={index}
              link={social.link}
              alt={social.alt}
              index={index}
            />
          ))}
        </Box>
      </Container>
    </Box>
  );
}
