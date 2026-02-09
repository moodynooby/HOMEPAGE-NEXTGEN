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
  Fade,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';

import projects from '@/content/projects.json';
import ButtonAppBar from '@/components/Header';

const MotionCard = motion(Card);

export default function Projects() {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleProjectClick = (projectName) => {
    navigate(`/projects/${projectName}`);
  };

  return (
    <>
      <ButtonAppBar />
      <Box
        sx={{
          pt: { xs: 10, md: 14 },
          pb: 8,
        }}
      >
        <Container maxWidth="lg" >
          <motion.div
            initial={{ y: -30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <Fade in timeout={800}>
              <Typography
                variant={isMobile ? 'h3' : 'h2'}
                sx={{
                  fontWeight: 800,
                  textAlign: 'center',
                  mb: 2,
                  background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 50%, ${theme.palette.text.primary} 100%)`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  marginTop: { xs: 2, md: 4 },
                }}
              >
                My Projects
              </Typography>
            </Fade>
            <Fade in timeout={1000}>
              <Typography
                variant="h6"
                sx={{
                  color: 'text.secondary',
                  textAlign: 'center',
                  mb: 8,
                  fontWeight: 400,
                  mx: 'auto',
                  lineHeight: 1.6,
                }}
              >
                Explore my latest work across web development, embedded systems,
                machine learning, and more. Click any project for full details.
              </Typography>
            </Fade>
          </motion.div>

          <Grid container spacing={4}>
            {projects.map((project, idx) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={project.githubName} >
                <MotionCard
                  initial={{ y: 40, opacity: 0, scale: 0.95 }}
                  animate={{ y: 0, opacity: 1, scale: 1 }}
                  transition={{
                    delay: idx * 0.1 + 0.3,
                    duration: 0.6,
                    ease: 'easeOut',
                  }}
                  whileHover={{
                    y: -8,
                    scale: 1.02,
                    transition: { duration: 0.3, ease: 'easeOut' },
                  }}
                  whileTap={{ scale: 0.98 }}
                  sx={{
                    height: '100%',
                    borderRadius: 3,
                    overflow: 'hidden',
                    boxShadow: theme.shadows[3],
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    bgcolor: 'background.paper',
                    backdropFilter: 'saturate(180%) blur(20px)',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.4)',
                      zIndex: 0,
                    },
                  }}
                >
                  <CardActionArea
                    onClick={() => handleProjectClick(project.githubName)}
                    sx={{
                      height: '100%',
                      p: 0,
                      position: 'relative',
                      zIndex: 1,
                    }}
                  >
                    <Box
                      sx={{
                        position: 'relative',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        bgcolor: ({ palette }) =>
                          `linear-gradient(135deg, ${palette.primary.light}15 0%, ${palette.background.paper} 100%)`,
                        p: { xs: 2, md: 3 },
                        minHeight: { xs: 140, md: 180 },
                      }}
                    >
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.3 }}
                      >
                        <CardMedia
                          component="img"
                          image={project.githubImg}
                          alt={project.githubName}
                          sx={{
                            width: 'auto',
                            height: { xs: 80, md: 100 },
                            objectFit: 'contain',
                            filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.15))',
                          }}
                        />
                      </motion.div>
                    </Box>
                    <CardContent sx={{ p: { xs: 2.5, md: 3 }, pt: 0 }}>
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 700,
                          color: 'text.primary',
                          textAlign: 'center',
                          mb: 1.5,
                          lineHeight: 1.3,
                        }}
                      >
                        {project.githubName}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: 'text.secondary',
                          textAlign: 'center',
                          lineHeight: 1.5,
                          fontWeight: 400,
                        }}
                      >
                        Explore details →
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </MotionCard>
              </Grid>
            ))}
          </Grid>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            style={{ marginTop: '4rem' }}
          >
            <Fade in timeout={600}>
              <Typography
                variant={isMobile ? 'h4' : 'h3'}
                sx={{
                  fontWeight: 700,
                  textAlign: 'center',
                  color: 'text.primary',
                  mb: 2,
                  letterSpacing: '-0.01em',
                }}
              >
                And Much More...
              </Typography>
            </Fade>
            <Typography
              variant="h6"
              sx={{
                color: 'text.secondary',
                textAlign: 'center',
                fontWeight: 400,
                maxWidth: 500,
                mx: 'auto',
              }}
            >
              Check my GitHub for complete codebase and ongoing experiments.
            </Typography>
          </motion.div>
        </Container>
      </Box >
    </>
  );
}
