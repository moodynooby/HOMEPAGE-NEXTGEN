import { useState, useEffect, useRef, lazy, Suspense } from 'react';
import { Box, Typography, Button, IconButton, Chip } from '@mui/material';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import CodeIcon from '@mui/icons-material/Code';
import SchoolIcon from '@mui/icons-material/School';
import WorkIcon from '@mui/icons-material/Work';
import GroupsIcon from '@mui/icons-material/Groups';
import HandshakeIcon from '@mui/icons-material/Handshake';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';

import ButtonAppBar from '@/components/Header';
import TypingHero from '@/components/TypingHero';
import GitHubStats from '@/components/GitHubStats';
import EnhancedSkills from '@/components/EnhancedSkills';

const LinkTree = lazy(() => import('@/components/LinkTree'));
const Projects = lazy(() => import('@/components/Projects'));

const GITHUB_USERNAME = 'moodynooby';

function HeroCard() {
  return (
    <Box sx={{ textAlign: 'center' }}>
      <TypingHero
        name="Manas Doshi"
        tagline="I love"
      />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            gap: 2,
            justifyContent: 'center',
            mt: 4,
          }}
        >
          <Button
            variant="contained"
            size="large"
            href="https://flowcv.com/resume/woofkdsq4sse"
            sx={{
              minWidth: 180,
              background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #818cf8 0%, #6366f1 100%)',
              },
            }}
          >
            View My Resume
          </Button>
          <Button
            component={Link}
            to="/projects"
            variant="outlined"
            size="large"
            sx={{ minWidth: 180 }}
          >
            See My Work
          </Button>
        </Box>
      </motion.div>
    </Box>
  );
}

function AboutCard() {
  return (
    <Box>
      <Typography variant="h2" gutterBottom color="primary">
        About Me
      </Typography>
      <Box sx={{ mt: 4 }}>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' },
            gap: 2,
            mb: 4,
          }}
        >
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                p: 2,
                borderRadius: 2,
                bgcolor: 'rgba(99, 102, 241, 0.08)',
              }}
            >
              <SchoolIcon sx={{ color: 'secondary.main' }} />
              <Box>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  Studying
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                  CSE at Ahmedabad University
                </Typography>
              </Box>
            </Box>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                p: 2,
                borderRadius: 2,
                bgcolor: 'rgba(16, 185, 129, 0.08)',
              }}
            >
              <WorkIcon sx={{ color: 'success.main' }} />
              <Box>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  Focus
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                  Web, Embedded & ML
                </Typography>
              </Box>
            </Box>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                p: 2,
                borderRadius: 2,
                bgcolor: 'rgba(245, 158, 11, 0.08)',
              }}
            >
              <GroupsIcon sx={{ color: 'warning.main' }} />
              <Box>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  Involved
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                  IEEE AU Student Chapter
                </Typography>
              </Box>
            </Box>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                p: 2,
                borderRadius: 2,
                bgcolor: 'rgba(139, 92, 246, 0.08)',
              }}
            >
              <HandshakeIcon sx={{ color: 'info.main' }} />
              <Box>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  Open to
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                  Internships & Collaborations
                </Typography>
              </Box>
            </Box>
          </motion.div>
        </Box>

        <Typography
          variant="h5"
          gutterBottom
          color="primary"
          sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}
        >
          Core Skills <CodeIcon sx={{ verticalAlign: 'middle' }} />
        </Typography>
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: 1.5,
            maxWidth: 600,
            mx: 'auto',
          }}
        >
          {['React', 'Python', 'C/C++', 'Node.js', 'JavaScript', 'TypeScript', 'HTML/CSS', 'Git'].map(
            (skill, index) => (
              <motion.div
                key={skill}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.5 + index * 0.05 }}
              >
                <Chip
                  label={skill}
                  color={index % 2 === 0 ? 'primary' : 'secondary'}
                  variant="outlined"
                  sx={{
                    fontWeight: 500,
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: 2,
                    },
                    transition: 'all 0.2s ease',
                  }}
                />
              </motion.div>
            ),
          )}
        </Box>
      </Box>
    </Box>
  );
}

function ProjectsCard() {
  return (
    <Box sx={{ textAlign: 'center' }}>
      <Suspense
        fallback={(
          <Box
            sx={{
              height: 200,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Typography>Loading Projects...</Typography>
          </Box>
        )}
      >
        <Projects />
      </Suspense>
    </Box>
  );
}

function LinksCard() {
  return (
    <Box>
      <Suspense
        fallback={(
          <Box
            sx={{
              height: 200,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Typography>Loading Links...</Typography>
          </Box>
        )}
      >
        <LinkTree />
      </Suspense>
    </Box>
  );
}

function StatsCard() {
  return (
    <Box>
      <GitHubStats username={GITHUB_USERNAME} />
      <Box sx={{ mt: 4 }}>
        <EnhancedSkills username={GITHUB_USERNAME} />
      </Box>
    </Box>
  );
}

const cards = [
  {
    id: 1,
    content: <HeroCard />,
  },
  {
    id: 2,
    content: <AboutCard />,
  },
  {
    id: 3,
    content: <StatsCard />,
  },
  {
    id: 4,
    content: <ProjectsCard />,
  },
  {
    id: 5,
    content: <LinksCard />,
  },
];

function LandingPage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const cardRefs = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = cardRefs.current.indexOf(entry.target);
            if (index !== -1) setCurrentIndex(index);
          }
        });
      },
      { threshold: 0.6 },
    );

    cardRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  const scrollToCard = (index) => {
    cardRefs.current[index]?.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    });
  };

  return (
    <div className="Container">
      <ButtonAppBar />
      <Box
        sx={{
          height: 'calc(100vh - 70px)',
          marginTop: '70px',
          overflowY: 'scroll',
          scrollSnapType: 'y mandatory',
          scrollBehavior: 'smooth',
        }}
      >
        {cards.map((card, index) => (
          <Box
            key={card.id}
            ref={(el) => {
              cardRefs.current[index] = el;
            }}
            sx={{
              minHeight: 'calc(100vh - 70px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              scrollSnapAlign: 'center',
              p: { xs: 2, sm: 3, md: 4 },
            }}
          >
            <Box
              sx={{
                width: { xs: '100%', sm: '90%', md: '80%' },
                maxWidth: '900px',
                bgcolor: 'background.paper',
                borderRadius: 4,
                p: { xs: 3, sm: 4, md: 6 },
                boxShadow: currentIndex === index ? 12 : 6,
                border: '1px solid',
                borderColor: currentIndex === index ? 'primary.main' : 'divider',
                transition: 'all 0.3s ease',
              }}
            >
              {card.content}
            </Box>
          </Box>
        ))}
      </Box>

      <Box
        sx={{
          position: 'fixed',
          right: { xs: 16, md: 32 },
          top: '50%',
          transform: 'translateY(-50%)',
          display: { xs: 'none', md: 'flex' },
          flexDirection: 'column',
          gap: 2,
          zIndex: 1000,
        }}
      >
        <IconButton
          onClick={() =>
            scrollToCard(
              currentIndex === 0 ? cards.length - 1 : currentIndex - 1,
            )
          }
          sx={{
            bgcolor: 'primary.main',
            color: 'primary.contrastText',
            '&:hover': { bgcolor: 'primary.dark' },
          }}
        >
          <KeyboardArrowUpIcon />
        </IconButton>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          {cards.map((_, index) => (
            <Box
              key={index}
              onClick={() => scrollToCard(index)}
              sx={{
                width: 12,
                height: currentIndex === index ? 40 : 12,
                borderRadius: 6,
                bgcolor:
                  currentIndex === index ? 'primary.main' : 'action.disabled',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
              }}
            />
          ))}
        </Box>

        <IconButton
          onClick={() =>
            scrollToCard(
              currentIndex === cards.length - 1 ? 0 : currentIndex + 1,
            )
          }
          sx={{
            bgcolor: 'primary.main',
            color: 'primary.contrastText',
            '&:hover': { bgcolor: 'primary.dark' },
          }}
        >
          <KeyboardArrowDownIcon />
        </IconButton>
      </Box>

      <Typography
        variant="caption"
        sx={{
          position: 'sticky',
          bottom: 16,
          right: 16,
          color: 'text.secondary',
          zIndex: 999,
        }}
      >
        Last updated 2025
      </Typography>
    </div>
  );
}

export default LandingPage;
