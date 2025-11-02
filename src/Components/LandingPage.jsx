import { useState, useEffect, useRef } from 'react';
import { Box, Typography, Button, IconButton } from '@mui/material';
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineOppositeContent,
} from '@mui/lab';
import ChildCareIcon from '@mui/icons-material/ChildCare';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import TerminalIcon from '@mui/icons-material/Terminal';
import PeopleTwoToneIcon from '@mui/icons-material/PeopleTwoTone';
import LocalLibraryIcon from '@mui/icons-material/LocalLibrary';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import PropTypes from 'prop-types';

import ButtonAppBar from './Header';

const cards = [
  {
    id: 1,
    content: (
      <Box sx={{ textAlign: { xs: 'center', lg: 'left' } }}>
        <Typography variant="h2" gutterBottom color="primary">
          Hi, I&apos;m Manas Doshi
        </Typography>
        <Typography
          variant="h6"
          sx={{
            mb: 4,
            color: 'text.secondary',
            lineHeight: 1.6,
            fontSize: { xs: '1rem', md: '1.25rem' },
          }}
        >
          I am a professional problem-solver who happens to really enjoy turning
          ideas into reality.
          <br />
          I create, I learn, I occasionally break things, and I always fix them
          better than before.
        </Typography>
        <Button
          variant="contained"
          size="large"
          href="https://drive.google.com/file/d/1eJOQt0RYOFuC2p0p6Bh9c9jQ8hcL4tDL/view?usp=sharing"
          sx={{ fontSize: { xs: '1rem', md: '1.1rem' } }}
        >
          View My Resume
        </Button>
      </Box>
    ),
  },
  {
    id: 2,
    content: (
      <Box sx={{ textAlign: { xs: 'center', lg: 'left' } }}>
        <Typography variant="h2" gutterBottom color="primary">
          About Me
        </Typography>
        <Timeline position="alternate">
          <TimelineItem>
            <TimelineOppositeContent color="text.secondary">
              1st December 2007
            </TimelineOppositeContent>
            <TimelineSeparator>
              <TimelineDot color="primary">
                <ChildCareIcon />
              </TimelineDot>
              <TimelineConnector sx={{ bgcolor: 'secondary.main', opacity: 0.2 }} />
            </TimelineSeparator>
            <TimelineContent>Born!!</TimelineContent>
          </TimelineItem>
          <TimelineItem>
            <TimelineSeparator>
              <TimelineDot color="primary" variant="outlined">
                <TerminalIcon />
              </TimelineDot>
              <TimelineConnector sx={{ bgcolor: 'secondary.main', opacity: 0.2 }} />
            </TimelineSeparator>
            <TimelineContent>Code</TimelineContent>
          </TimelineItem>
          <TimelineItem>
            <TimelineOppositeContent color="text.secondary">
              August 2025
            </TimelineOppositeContent>
            <TimelineSeparator>
              <TimelineDot sx={{ bgcolor: 'secondary.main' }}>
                <WorkspacePremiumIcon />
              </TimelineDot>
              <TimelineConnector />
            </TimelineSeparator>
            <TimelineContent>Started CSE Degree at AU</TimelineContent>
          </TimelineItem>
          <TimelineItem>
            <TimelineOppositeContent color="text.secondary">
              2024-25
            </TimelineOppositeContent>
            <TimelineSeparator>
              <TimelineDot color="info" variant="two-tone">
                <PeopleTwoToneIcon />
              </TimelineDot>
              <TimelineConnector />
            </TimelineSeparator>
            <TimelineContent>2 Apps each reached 100s of users</TimelineContent>
          </TimelineItem>
          <TimelineItem>
            <TimelineOppositeContent color="text.secondary">
              Sept 2025
            </TimelineOppositeContent>
            <TimelineSeparator>
              <TimelineDot color="secondary" variant="outlined">
                <LocalLibraryIcon />
              </TimelineDot>
              <TimelineConnector />
            </TimelineSeparator>
            <TimelineContent>Joined IEEE AU SC</TimelineContent>
          </TimelineItem>
        </Timeline>
      </Box>
    ),
  },
  {
    id: 3,
    content: (
      <Box sx={{ textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom color="primary" sx={{ mb: 3 }}>
          Check Out Some of My Projects
        </Typography>
        <Button component={Link} to="/projects" variant="contained" size="large">
          Take Me There
        </Button>
      </Box>
    ),
  },
];

function Card({ children, isVisible }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, rotateX: 15 }}
      whileInView={{ opacity: 1, scale: 1, rotateX: 0 }}
      viewport={{ amount: 0.5, once: false }}
      transition={{
        type: 'spring',
        stiffness: 200,
        damping: 25,
      }}
      style={{
        width: '100%',
        minHeight: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Box
        sx={{
          width: '100%',
          backgroundColor: 'background.paper',
          borderRadius: 4,
          p: { xs: 4, md: 6 },
          boxShadow: isVisible ? 12 : 6,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '1px solid',
          borderColor: isVisible ? 'primary.main' : 'divider',
          transition: 'all 0.3s ease',
          transform: isVisible ? 'scale(1)' : 'scale(0.95)',
        }}
      >
        {children}
      </Box>
    </motion.div>
  );
}

Card.propTypes = {
  children: PropTypes.node.isRequired,
  isVisible: PropTypes.bool.isRequired,
};

function LandingPage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = useRef(null);
  const cardRefs = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = cardRefs.current.indexOf(entry.target);
            if (index !== -1) {
              setCurrentIndex(index);
            }
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

  const nextCard = () => {
    const nextIndex = currentIndex === cards.length - 1 ? 0 : currentIndex + 1;
    scrollToCard(nextIndex);
  };

  const prevCard = () => {
    const prevIndex = currentIndex === 0 ? cards.length - 1 : currentIndex - 1;
    scrollToCard(prevIndex);
  };

  return (
    <div className="Container">
      <ButtonAppBar />
      <Box
        ref={containerRef}
        sx={{
          height: 'calc(100vh - 70px)',
          marginTop: '70px',
          overflowY: 'scroll',
          scrollSnapType: 'y mandatory',
          scrollBehavior: 'smooth',
          '&::-webkit-scrollbar': {
            width: '8px',
          },
          '&::-webkit-scrollbar-track': {
            background: 'background.default',
          },
          '&::-webkit-scrollbar-thumb': {
            background: 'primary.main',
            borderRadius: '4px',
          },
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
              padding: { xs: 2, md: 4 },
            }}
          >
            <Box
              sx={{
                width: { xs: '100%', sm: '90%', md: '80%', lg: '70%' },
                maxWidth: '900px',
                minHeight: { xs: '500px', md: '600px' },
              }}
            >
              <Card isVisible={currentIndex === index}>{card.content}</Card>
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
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          zIndex: 1000,
        }}
      >
        <IconButton
          onClick={prevCard}
          sx={{
            bgcolor: 'primary.main',
            color: 'primary.contrastText',
            '&:hover': { bgcolor: 'primary.dark' },
            boxShadow: 3,
          }}
        >
          <KeyboardArrowUpIcon />
        </IconButton>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, alignItems: 'center' }}>
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
                boxShadow: currentIndex === index ? 2 : 0,
                '&:hover': {
                  bgcolor: currentIndex === index ? 'primary.dark' : 'action.hover',
                },
              }}
            />
          ))}
        </Box>

        <IconButton
          onClick={nextCard}
          sx={{
            bgcolor: 'primary.main',
            color: 'primary.contrastText',
            '&:hover': { bgcolor: 'primary.dark' },
            boxShadow: 3,
          }}
        >
          <KeyboardArrowDownIcon />
        </IconButton>
      </Box>
    </div>
  );
}

export default LandingPage;
