import {
  Box,
  Typography,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Button,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';

import projects from '@/content/projects.json';

const MotionCard = motion(Card);

export default function ProjectsPreview() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const featuredProjects = projects.slice(0, 4);

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
            Featured Projects
          </Typography>
          <Typography variant="body1" color="text.secondary">
            A fast look at recent builds and experiments.
          </Typography>
        </Box>
        <Button component={Link} to="/projects" variant="outlined" size="small">
          View all
        </Button>
      </Box>
      <Box
        sx={{
          display: { xs: 'flex', sm: 'grid' },
          gridTemplateColumns: { sm: 'repeat(2, minmax(0, 1fr))', md: 'repeat(4, minmax(0, 1fr))' },
          gap: 2.5,
          overflowX: { xs: 'auto', sm: 'visible' },
          pb: { xs: 1, sm: 0 },
          scrollSnapType: { xs: 'x mandatory', sm: 'none' },
        }}
      >
        {featuredProjects.map((project, index) => (
          <MotionCard
            key={project.githubName}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.08 }}
            sx={{
              borderRadius: 3,
              bgcolor: 'background.paper',
              flex: { xs: '0 0 240px', sm: '1 1 auto' },
              scrollSnapAlign: { xs: 'center', sm: 'unset' },
            }}
          >
            <CardActionArea component={Link} to={`/projects/${project.githubName}`}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  minHeight: 120,
                  background: `linear-gradient(135deg, ${theme.palette.primary.light}14 0%, ${theme.palette.background.paper} 100%)`,
                }}
              >
                <CardMedia
                  component="img"
                  image={project.githubImg}
                  alt={project.githubName}
                  sx={{
                    width: 'auto',
                    height: 72,
                    objectFit: 'contain',
                    filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.12))',
                  }}
                />
              </Box>
              <CardContent sx={{ p: 2.5, pt: 1.5 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 0.5 }}>
                  {project.githubName}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Open details →
                </Typography>
              </CardContent>
            </CardActionArea>
          </MotionCard>
        ))}
      </Box>
    </Box>
  );
}
