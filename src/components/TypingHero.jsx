import { useState, useEffect, useCallback } from 'react';
import { Box, Typography } from '@mui/material';
import { motion, AnimatePresence } from 'motion/react';
import PropTypes from 'prop-types';

const phrases = [
  'building web applications',
  'exploring embedded systems',
  'diving into machine learning',
  'creating amazing user experiences',
  'solving real-world problems',
  'learning new technologies',
];

const TYPING_SPEED = 80;
const DELETING_SPEED = 40;
const PAUSE_DURATION = 2000;

export default function TypingHero({ name, tagline }) {
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const typeNextCharacter = useCallback(() => {
    const currentPhrase = phrases[currentPhraseIndex];

    if (isPaused) {
      return;
    }

    if (isDeleting) {
      setCurrentText((prev) => prev.slice(0, -1));
      if (currentText.length === 0) {
        setIsDeleting(false);
        setCurrentPhraseIndex((prev) => (prev + 1) % phrases.length);
      }
    } else {
      setCurrentText(currentPhrase.slice(0, currentText.length + 1));
      if (currentText.length + 1 === currentPhrase.length) {
        setIsPaused(true);
        setTimeout(() => {
          setIsPaused(false);
          setIsDeleting(true);
        }, PAUSE_DURATION);
      }
    }
  }, [currentPhraseIndex, currentText, isDeleting, isPaused]);

  useEffect(() => {
    const timeout = setTimeout(
      typeNextCharacter,
      isDeleting ? DELETING_SPEED : TYPING_SPEED,
    );
    return () => clearTimeout(timeout);
  }, [typeNextCharacter, isDeleting]);

  return (
    <Box sx={{ textAlign: 'center' }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Typography
          variant="h1"
          sx={{
            fontWeight: 800,
            fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
            letterSpacing: '-0.02em',
            mb: 2,
            background: (theme) =>
              theme.palette.mode === 'dark'
                ? 'linear-gradient(135deg, #f8fafc 0%, #94a3b8 100%)'
                : 'linear-gradient(135deg, #1e293b 0%, #475569 100%)',
            backgroundClip: 'text',
            textFillColor: 'transparent',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Hi, I&apos;m {name}
        </Typography>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <Typography
          variant="h6"
          sx={{
            color: 'text.secondary',
            fontSize: { xs: '1rem', sm: '1.125rem', md: '1.25rem' },
            mb: 1,
            minHeight: '2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexWrap: 'wrap',
            gap: 1,
          }}
          aria-live="polite"
          aria-atomic="true"
        >
          <span>{tagline}</span>
          <Box
            component="span"
            sx={{
              color: 'secondary.main',
              fontWeight: 600,
              position: 'relative',
              display: 'inline-flex',
              alignItems: 'center',
            }}
          >
            <AnimatePresence mode="wait">
              <motion.span
                key={currentPhraseIndex + currentText}
                initial={{ opacity: 0.5 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0.5 }}
                transition={{ duration: 0.1 }}
              >
                {currentText}
              </motion.span>
            </AnimatePresence>
            <Box
              component="span"
              sx={{
                display: 'inline-block',
                width: '2px',
                height: '1.2em',
                bgcolor: 'secondary.main',
                ml: 0.5,
                animation: 'blink 1s step-end infinite',
                '@keyframes blink': {
                  '0%, 50%': { opacity: 1 },
                  '51%, 100%': { opacity: 0 },
                },
              }}
            />
          </Box>
        </Typography>
      </motion.div>
    </Box>
  );
}

TypingHero.propTypes = {
  name: PropTypes.string.isRequired,
  tagline: PropTypes.string,
};

TypingHero.defaultProps = {
  tagline: 'I love',
};
