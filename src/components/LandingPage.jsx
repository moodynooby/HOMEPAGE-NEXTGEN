import { useState, useEffect, useRef, lazy, Suspense, useMemo } from 'react';
import {
  Box,
  Typography,
  Button,
  IconButton,
  Chip,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import CodeIcon from '@mui/icons-material/Code';
import { Link } from 'react-router-dom';

import ButtonAppBar from '@/components/Header';
import GitHubStats from '@/components/GitHubStats';

const ProjectsPreview = lazy(() => import('@/components/ProjectsPreview'));
const LinkTreePreview = lazy(() => import('@/components/LinkTreePreview'));

const cards = [
  {
    id: 1,
    content: (
      <Box>
        <Typography variant="h2" gutterBottom color="primary">
          Hi, I&apos;m Manas Doshi
        </Typography>
        <Typography variant="h6" sx={{ mb: 4, color: 'text.secondary' }}>
          CSE student building web, embedded & ML projects. I create, I learn, I occasionally break things,
          and I always fix them better than before.
        </Typography>
        <Box sx={{
          display: 'flex',
          justifyContent: 'space-evenly',
          flexFlow: 'column',
          gap: '2px',


        }}>
          <Button
            variant="contained"
            size="large"
            href="https://flowcv.com/resume/woofkdsq4sse"
          >
            View My Resume
          </Button>
          <Button
            component={Link}
            to="/projects"
            variant="contained"
            size="large"

          >
            See My Work
          </Button>
        </Box>
      </Box>
    ),
  },
  {
    id: 2,
    content: (
      <Box>
        <Typography variant="h2" gutterBottom color="primary">
          About Me
        </Typography>
        <Box sx={{ mt: 4 }}>
          <Typography variant="body1" paragraph>
            <strong>Studying:</strong> CSE at Ahmedabad University
          </Typography>
          <Typography variant="body1" paragraph>
            <strong>Focus:</strong> Web development, embedded systems, ML & data science
          </Typography>
          <Typography variant="body1" paragraph>
            <strong>Involved:</strong> IEEE AU Student Chapter
          </Typography>
          <Typography variant="body1" paragraph>
            <strong>Open to:</strong> Internships, hackathons, collaborations
          </Typography>
          <Typography variant="h4" gutterBottom color="primary" sx={{ mb: 4 }}>
            Core Skills <CodeIcon sx={{ ml: 1, verticalAlign: 'middle' }} />
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 1.5, maxWidth: 600 }}>
            <Chip label="React" color="primary" variant="outlined" />
            <Chip label="Python" color="secondary" variant="outlined" />
            <Chip label="C/C++" color="primary" variant="outlined" />
            <Chip label="Node.js" color="secondary" variant="outlined" />

const introHighlights = [
  'Web Apps',
  'Embedded',
  'ML Experiments',
  'Open to Internships',
];

        </Box>
      </Box>
    ),
  },
  // {
  //   id: 'stats',
  //   content: (
  //     <GitHubStats />
  //   ),
  // },
  {
    id: 3,
    content: (
      <Box sx={{ textAlign: 'center' }}>
        <Suspense fallback={<Box sx={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Typography>Loading Projects...</Typography></Box>}>
          <Projects limit={3} showAppBar={false} />
          <Button
            component={Link}
            to="/projects"
            variant="contained"
            size="large"
            style={{ width: '100%' }}
          >
            See More..
          </Button>
        </Suspense>
      </Box>
    ),
  }, {
    id: 4,
    content: (
      <Box>
        <Suspense fallback={<Box sx={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Typography>Loading Links...</Typography></Box>}>
          <LinkTree />
        </Suspense>
      </Box>
    ),
  },
];

function LandingPage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const cardRefs = useRef([]);
  const scrollContainerRef = useRef(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');

  const cards = useMemo(
    () => [
      {
        id: 1,
        content: (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 3, md: 4 } }}>
            <Box sx={{ maxWidth: 560 }}>
              <Typography variant={isMobile ? 'h3' : 'h2'} gutterBottom color="primary">
                Hi, I&apos;m Manas Doshi
              </Typography>
              <Typography
                variant="h6"
                sx={{ mb: 1.5, color: 'text.secondary', fontSize: { xs: '1rem', md: '1.15rem' } }}
              >
                CSE student building web, embedded & ML projects. I create, I learn, I occasionally break
                things, and I always fix them better than before.
              </Typography>
            </Box>
            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                alignItems: { xs: 'stretch', sm: 'center' },
                gap: 2,
              }}
            >
              <Button
                variant="contained"
                size="large"
                href="https://flowcv.com/resume/woofkdsq4sse"
              >
                View My Resume
              </Button>
              <Button component={Link} to="/projects" variant="contained" size="large">
                See My Work
              </Button>
            </Box>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {introHighlights.map((highlight) => (
                <Chip key={highlight} label={highlight} color="secondary" size="small" />
              ))}
            </Box>
          </Box>
        ),
      },
      {
        id: 2,
        content: (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 3, md: 4 } }}>
            <Box>
              <Typography variant={isMobile ? 'h3' : 'h2'} gutterBottom color="primary">
                About Me
              </Typography>
              <Typography variant="body1" color="text.secondary">
                A snapshot of where I am, what I focus on, and the communities I contribute to.
              </Typography>
            </Box>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))' },
                gap: 2,
              }}
            >
              {aboutItems.map((item) => (
                <Box
                  key={item.label}
                  sx={{
                    p: 2,
                    borderRadius: 3,
                    bgcolor: 'rgba(255, 255, 255, 0.7)',
                    border: '1px solid',
                    borderColor: 'divider',
                  }}
                >
                  <Typography
                    variant="subtitle2"
                    sx={{
                      textTransform: 'uppercase',
                      letterSpacing: '0.08em',
                      color: 'text.secondary',
                      fontSize: '0.7rem',
                      mb: 0.5,
                    }}
                  >
                    {item.label}
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    {item.value}
                  </Typography>
                </Box>
              ))}
            </Box>
            <Box>
              <Typography variant="h4" gutterBottom color="primary" sx={{ mb: 3 }}>
                Core Skills <CodeIcon sx={{ ml: 1, verticalAlign: 'middle' }} />
              </Typography>
              <Box
                sx={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  justifyContent: { xs: 'flex-start', sm: 'center' },
                  gap: 1.5,
                  maxWidth: 700,
                }}
              >
                {skills.map((skill) => (
                  <Chip key={skill} label={skill} color="primary" variant="outlined" />
                ))}
              </Box>
            </Box>
          </Box>
        ),
      },
      {
        id: 3,
        content: (
          <Box sx={{ textAlign: 'left' }}>
            <Suspense
              fallback={
                <Box
                  sx={{
                    height: 220,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Typography>Loading Projects...</Typography>
                </Box>
              }
            >
              <ProjectsPreview />
            </Suspense>
          </Box>
        ),
      },
      {
        id: 4,
        content: (
          <Box>
            <Suspense
              fallback={
                <Box
                  sx={{
                    height: 220,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Typography>Loading Links...</Typography>
                </Box>
              }
            >
              <LinkTreePreview />
            </Suspense>
          </Box>
        ),
      },
    ],
    [isMobile],
  );

  useEffect(() => {
    if (!scrollContainerRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = cardRefs.current.indexOf(entry.target);
            if (index !== -1) setCurrentIndex(index);
          }
        });
      },
      { threshold: isMobile ? 0.35 : 0.6, root: scrollContainerRef.current },
    );

    cardRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, [isMobile]);

  const scrollToCard = (index) => {
    cardRefs.current[index]?.scrollIntoView({
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
      block: isMobile ? 'start' : 'center',
    });
  };

  return (
    <div className="Container">
      <ButtonAppBar />
      <Box
        ref={scrollContainerRef}
        className="LandingScroll"
        sx={{
          height: 'calc(100vh - 70px)',
          marginTop: '70px',
          overflowY: 'auto',
          scrollSnapType: isMobile ? 'y proximity' : 'y mandatory',
          scrollBehavior: prefersReducedMotion ? 'auto' : 'smooth',
          scrollPaddingTop: { xs: '90px', md: '110px' },
          touchAction: 'pan-y',
        }}
      >
        {cards.map((card, index) => (
          <Box
            key={card.id}
            ref={(el) => (cardRefs.current[index] = el)}
            sx={{
              minHeight: { xs: 'auto', md: 'calc(100vh - 70px)' },
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              scrollSnapAlign: isMobile ? 'start' : 'center',
              scrollSnapStop: isMobile ? 'normal' : 'always',
              scrollMarginTop: { xs: 90, md: 110 },
              px: { xs: 2, sm: 3 },
              py: { xs: 4, md: 6 },
            }}
          >
            <Box
              sx={{
                width: { xs: '100%', md: '80%' },
                maxWidth: '960px',
                bgcolor: 'background.paper',
                borderRadius: 4,
                p: { xs: 3, sm: 4, md: 6 },
                boxShadow: currentIndex === index ? 12 : 6,
                border: '1px solid',
                borderColor: currentIndex === index ? 'primary.main' : 'divider',
                position: 'relative',
                overflow: 'hidden',
                transition: 'all 0.3s ease',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 4,
                  background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                },
              }}
            >
              {card.content}
            </Box>
          </Box>
        ))}
      </Box>

      {!isMobile && (
        <Box
          sx={{
            position: 'fixed',
            right: 32,
            top: '50%',
            transform: 'translateY(-50%)',
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            zIndex: 1000,
          }}
        >
          <IconButton
            onClick={() =>
              scrollToCard(currentIndex === 0 ? cards.length - 1 : currentIndex - 1)
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
                  bgcolor: currentIndex === index ? 'primary.main' : 'action.disabled',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                }}
              />
            ))}
          </Box>

          <IconButton
            onClick={() =>
              scrollToCard(currentIndex === cards.length - 1 ? 0 : currentIndex + 1)
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
      )}

      {isMobile && (
        <Box
          sx={{
            position: 'fixed',
            bottom: 16,
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            px: 2,
            py: 1,
            borderRadius: 999,
            bgcolor: 'background.paper',
            boxShadow: 6,
            border: '1px solid',
            borderColor: 'divider',
            zIndex: 1000,
          }}
        >
          <IconButton
            size="small"
            onClick={() =>
              scrollToCard(currentIndex === 0 ? cards.length - 1 : currentIndex - 1)
            }
            sx={{ bgcolor: 'primary.main', color: 'primary.contrastText' }}
          >
            <KeyboardArrowUpIcon fontSize="small" />
          </IconButton>
          <Box sx={{ display: 'flex', gap: 1 }}>
            {cards.map((_, index) => (
              <Box
                key={index}
                onClick={() => scrollToCard(index)}
                sx={{
                  width: currentIndex === index ? 18 : 10,
                  height: 8,
                  borderRadius: 999,
                  bgcolor: currentIndex === index ? 'primary.main' : 'action.disabled',
                  transition: 'all 0.3s ease',
                }}
              />
            ))}
          </Box>
          <IconButton
            size="small"
            onClick={() =>
              scrollToCard(currentIndex === cards.length - 1 ? 0 : currentIndex + 1)
            }
            sx={{ bgcolor: 'primary.main', color: 'primary.contrastText' }}
          >
            <KeyboardArrowDownIcon fontSize="small" />
          </IconButton>
          <Typography variant="caption" color="text.secondary">
            {currentIndex + 1}/{cards.length}
          </Typography>
        </Box>
      )}

      <Typography
        variant="caption"
        sx={{
          position: 'fixed',
          bottom: { xs: 72, md: 16 },
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
