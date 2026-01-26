import { useState, useEffect, useRef, lazy, Suspense } from 'react';
import { Box, Typography, Button, IconButton, Chip } from '@mui/material';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import CodeIcon from '@mui/icons-material/Code';
import { Link } from 'react-router-dom';

import ButtonAppBar from '@/components/Header';

const LinkTree = lazy(() => import('@/components/LinkTree'));
const Projects = lazy(() => import('@/components/Projects'));

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
          justifyContent: 'space-between',
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
            Check Out Some of My Projects
          </Button>
          <Button
            component={Link}
            to="/services"
            variant="contained"
            size="large"
            color="secondary"
          >
            Get your own website
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

          </Box>

        </Box>
      </Box>
    ),
  },
  {
    id: 3,
    content: (
      <Box sx={{ textAlign: 'center' }}>
        <Suspense fallback={<Box sx={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Typography>Loading Projects...</Typography></Box>}>
          <Projects />
        </Suspense>
      </Box>
    ),
  },
  {
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
            ref={(el) => (cardRefs.current[index] = el)}
            sx={{
              minHeight: 'calc(100vh - 70px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              scrollSnapAlign: 'center',
              p: 4,
            }}
          >
            <Box
              sx={{
                width: { xs: '100%', md: '80%' },
                maxWidth: '900px',
                bgcolor: 'background.paper',
                borderRadius: 4,
                p: { xs: 4, md: 6 },
                boxShadow: currentIndex === index ? 12 : 6,
                border: '1px solid',
                borderColor:
                  currentIndex === index ? 'primary.main' : 'divider',
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
          position: 'fixed',
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
