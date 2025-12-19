import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  CardMedia,
  CardActionArea,
  Grid,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

import projects from '../Content/projects.json';

import ButtonAppBar from './Header';

const MotionCard = motion.create(Card);

export default function Projects() {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleProjectClick = (projectName) => {
    navigate(`/projects/${projectName}`);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        pb: 8,
      }}
    >
      <ButtonAppBar />
      <Container maxWidth="lg" sx={{ pt: 12 }}>
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <Typography
            variant={isMobile ? 'h3' : 'h2'}
            sx={{
              color: 'white',
              fontWeight: 800,
              textAlign: 'center',
              mb: 2,
              textShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
            }}
          >
            My Projects
          </Typography>
          <Typography
            variant={isMobile ? 'body1' : 'h6'}
            sx={{
              color: 'rgba(255, 255, 255, 0.9)',
              textAlign: 'center',
              mb: 6,
              fontWeight: 400,
            }}
          >
            Click on any project to explore in detail
          </Typography>
        </motion.div>

        <Grid container spacing={isMobile ? 2 : 4}>
          {projects.map((project, idx) => (
            <Grid
              item
              key={project.githubName}
              xs={12}
              sm={6}
              md={4}
            >
              <MotionCard
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: idx * 0.1, duration: 0.5 }}
                whileHover={{ y: -8, transition: { duration: 0.2 } }}
                sx={{
                  height: '100%',
                  bgcolor: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: 3,
                  overflow: 'hidden',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    boxShadow: '0 12px 48px rgba(0, 0, 0, 0.3)',
                  },
                }}
              >
                <CardActionArea
                  onClick={() => handleProjectClick(project.githubName)}
                  sx={{ height: '100%' }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      bgcolor: 'white',
                      p: 3,
                      minHeight: 180,
                    }}
                  >
                    <CardMedia
                      component="img"
                      image={project.githubImg}
                      alt={project.githubName}
                      sx={{
                        width: 'auto',
                        height: 120,
                        objectFit: 'contain',
                      }}
                    />
                  </Box>
                  <CardContent sx={{ p: 3 }}>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 700,
                        color: theme.palette.primary.main,
                        textAlign: 'center',
                        mb: 1,
                      }}
                    >
                      {project.githubName}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: theme.palette.text.secondary,
                        textAlign: 'center',
                      }}
                    >
                      Click to view details
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </MotionCard>
            </Grid>
          ))}
        </Grid>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          <Typography
            variant={isMobile ? 'h5' : 'h4'}
            sx={{
              color: 'white',
              textAlign: 'center',
              mt: 8,
              fontWeight: 600,
              textShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
            }}
          >
            And Much More...
          </Typography>
        </motion.div>
      </Container>
    </Box>
  );
}
