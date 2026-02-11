import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  IconButton,
  Typography,
  Paper,
  Fab,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { ArrowBack, ArrowForward, GitHub, Close } from '@mui/icons-material';
import { motion } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

import projects from '@/content/projects.json';
import CustomScrollbar from '@/components/CustomScrollbar';

export default function ProjectDetail() {
  const { projectName } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const currentIndex = projects.findIndex((p) => p.githubName === projectName);
  const project = projects[currentIndex];

  const [markdown, setMarkdown] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!project) {
      navigate('/projects');
      return;
    }

    const cacheKey = `readme_${project.githubName}`;
    const cacheTimeKey = `readme_time_${project.githubName}`;
    const CACHE_DURATION = 1000 * 60 * 60 * 24;

    const cachedContent = localStorage.getItem(cacheKey);
    const cachedTime = localStorage.getItem(cacheTimeKey);

    if (cachedContent && cachedTime) {
      const age = Date.now() - parseInt(cachedTime);
      if (age < CACHE_DURATION) {
        setMarkdown(cachedContent);
        setLoading(false);
        return;
      }
    }

    setLoading(true);
    fetch(project.githubContentPath)
      .then((res) => res.text())
      .then((content) => {
        setMarkdown(content);
        localStorage.setItem(cacheKey, content);
        localStorage.setItem(cacheTimeKey, Date.now().toString());
        setLoading(false);
      })
      .catch(() => {
        setMarkdown('Failed to load content.');
        setLoading(false);
      });
  }, [project, navigate]);

  const handlePrevious = () => {
    if (currentIndex > 0) {
      navigate(`/projects/${projects[currentIndex - 1].githubName}`);
    }
  };

  const handleNext = () => {
    if (currentIndex < projects.length - 1) {
      navigate(`/projects/${projects[currentIndex + 1].githubName}`);
    }
  };

  const handleClose = () => {
    navigate('/projects');
  };

  if (!project) return null;

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <IconButton
          onClick={handleClose}
          sx={{
            position: 'fixed',
            top: 20,
            right: 20,
            zIndex: 1300,
            bgcolor: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(10px)',
            color: 'white',
            '&:hover': {
              bgcolor: 'rgba(255, 255, 255, 0.25)',
            },
          }}
        >
          <Close />
        </IconButton>

        <Container
          maxWidth="lg"
          sx={{
            pt: isMobile ? 8 : 10,
            pb: 8,
          }}
        >
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.5 }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 3,
                mb: 4,
                flexDirection: isMobile ? 'column' : 'row',
              }}
            >
              <Box
                component="img"
                src={project.githubImg}
                alt={project.githubName}
                sx={{
                  width: isMobile ? 80 : 120,
                  height: isMobile ? 80 : 120,
                  borderRadius: 3,
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                  bgcolor: 'white',
                  p: 2,
                }}
              />
              <Box sx={{ flex: 1, textAlign: isMobile ? 'center' : 'left' }}>
                <Typography
                  variant={isMobile ? 'h4' : 'h2'}
                  sx={{
                    color: 'white',
                    fontWeight: 800,
                    mb: 1,
                    textShadow: '0 2px 10px rgba(0, 0, 0, 0.3)',
                  }}
                >
                  {project.githubName}
                </Typography>
                <IconButton
                  component="a"
                  href={`https://github.com/moodynooby/${project.githubName}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    color: 'white',
                    bgcolor: 'rgba(255, 255, 255, 0.15)',
                    backdropFilter: 'blur(10px)',
                    '&:hover': {
                      bgcolor: 'rgba(255, 255, 255, 0.25)',
                      transform: 'scale(1.05)',
                    },
                    transition: 'all 0.3s',
                  }}
                >
                  <GitHub />
                </IconButton>
              </Box>
            </Box>
          </motion.div>

          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <Paper
              elevation={8}
              sx={{
                borderRadius: 4,
                bgcolor: 'rgba(255, 255, 255, 0.98)',
                backdropFilter: 'blur(20px)',
                minHeight: '60vh',
                maxHeight: '70vh',
                overflow: 'hidden',
              }}
            >
              <CustomScrollbar maxHeight="100%">
                <Box sx={{ p: isMobile ? 3 : 5 }}>
                  {loading ? (
                    <Typography variant="h6" sx={{ textAlign: 'center', py: 10 }}>
                      Loading...
                    </Typography>
                  ) : (
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={{
                        h1: ({ ...props }) => (
                          <Typography
                            variant="h3"
                            gutterBottom
                            sx={{ fontWeight: 700, mt: 3 }}
                            {...props}
                          />
                        ),
                        h2: ({ ...props }) => (
                          <Typography
                            variant="h4"
                            gutterBottom
                            sx={{ fontWeight: 600, mt: 3 }}
                            {...props}
                          />
                        ),
                        h3: ({ ...props }) => (
                          <Typography
                            variant="h5"
                            gutterBottom
                            sx={{ fontWeight: 600, mt: 2 }}
                            {...props}
                          />
                        ),
                        p: ({ ...props }) => (
                          <Typography
                            variant="body1"
                            paragraph
                            sx={{ lineHeight: 1.8 }}
                            {...props}
                          />
                        ),
                        a: ({ ...props }) => (
                          <a
                            style={{
                              color: theme.palette.primary.main,
                              textDecoration: 'none',
                              fontWeight: 500,
                              borderBottom: `2px solid ${theme.palette.primary.light}`,
                            }}
                            {...props}
                          />
                        ),
                        code: ({ inline, ...props }) =>
                          inline ? (
                            <code
                              style={{
                                backgroundColor: theme.palette.grey[100],
                                padding: '2px 6px',
                                borderRadius: '4px',
                                fontFamily: 'monospace',
                                fontSize: '0.9em',
                              }}
                              {...props}
                            />
                          ) : (
                            <pre
                              style={{
                                backgroundColor: theme.palette.grey[900],
                                color: theme.palette.grey[50],
                                padding: '16px',
                                borderRadius: '8px',
                                overflow: 'auto',
                                fontFamily: 'monospace',
                              }}
                            >
                              <code {...props} />
                            </pre>
                          ),
                        ul: ({ ...props }) => (
                          <ul
                            style={{ paddingLeft: '20px', lineHeight: 1.8 }}
                            {...props}
                          />
                        ),
                        ol: ({ ...props }) => (
                          <ol
                            style={{ paddingLeft: '20px', lineHeight: 1.8 }}
                            {...props}
                          />
                        ),
                        blockquote: ({ ...props }) => (
                          <Box
                            component="blockquote"
                            sx={{
                              borderLeft: `4px solid ${theme.palette.primary.main}`,
                              pl: 2,
                              ml: 0,
                              fontStyle: 'italic',
                              color: theme.palette.text.secondary,
                            }}
                            {...props}
                          />
                        ),
                      }}
                    >
                      {markdown}
                    </ReactMarkdown>
                  )}
                </Box>
              </CustomScrollbar>
            </Paper>
          </motion.div>
        </Container>

        {currentIndex > 0 && (
          <Fab
            onClick={handlePrevious}
            sx={{
              position: 'fixed',
              bottom: 40,
              left: isMobile ? 20 : 40,
              bgcolor: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(10px)',
              color: 'white',
              '&:hover': {
                bgcolor: 'rgba(255, 255, 255, 0.25)',
                transform: 'scale(1.1)',
              },
              transition: 'all 0.3s',
            }}
          >
            <ArrowBack />
          </Fab>
        )}

        {currentIndex < projects.length - 1 && (
          <Fab
            onClick={handleNext}
            sx={{
              position: 'fixed',
              bottom: 40,
              right: isMobile ? 20 : 40,
              bgcolor: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(10px)',
              color: 'white',
              '&:hover': {
                bgcolor: 'rgba(255, 255, 255, 0.25)',
                transform: 'scale(1.1)',
              },
              transition: 'all 0.3s',
            }}
          >
            <ArrowForward />
          </Fab>
        )}
      </motion.div>
    </Box>
  );
}

ProjectDetail.propTypes = {};
