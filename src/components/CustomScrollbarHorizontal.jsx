import * as React from 'react';
import PropTypes from 'prop-types';
import { Box, IconButton } from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { motion, AnimatePresence } from 'motion/react';
import { useTheme } from '@mui/material/styles';

export default function CustomScrollbarHorizontal({ children, showControls = true }) {
  const scrollRef = React.useRef(null);
  const [showLeft, setShowLeft] = React.useState(false);
  const [showRight, setShowRight] = React.useState(false);
  const [scrollProgress, setScrollProgress] = React.useState(0);
  const theme = useTheme();

  const checkScroll = React.useCallback(() => {
    const element = scrollRef.current;
    if (!element) return;

    const canScrollLeft = element.scrollLeft > 10;
    const canScrollRight = element.scrollLeft < element.scrollWidth - element.clientWidth - 10;

    setShowLeft(canScrollLeft);
    setShowRight(canScrollRight);
    setScrollProgress(
      element.scrollLeft / (element.scrollWidth - element.clientWidth) || 0,
    );
  }, []);

  React.useEffect(() => {
    const element = scrollRef.current;
    if (!element) return;

    checkScroll();
    element.addEventListener('scroll', checkScroll, { passive: true });
    window.addEventListener('resize', checkScroll);

    return () => {
      element.removeEventListener('scroll', checkScroll);
      window.removeEventListener('resize', checkScroll);
    };
  }, [checkScroll, children]);

  const scrollLeft = () => {
    const element = scrollRef.current;
    if (!element) return;

    const scrollAmount = element.clientWidth * 0.75;
    element.scrollTo({
      left: Math.max(0, element.scrollLeft - scrollAmount),
      behavior: 'smooth',
    });
  };

  const scrollRight = () => {
    const element = scrollRef.current;
    if (!element) return;

    const scrollAmount = element.clientWidth * 0.75;
    element.scrollTo({
      left: Math.min(element.scrollWidth - element.clientWidth, element.scrollLeft + scrollAmount),
      behavior: 'smooth',
    });
  };

  return (
    <Box sx={{ position: 'relative', width: '100%' }}>
      {showControls && (
        <>
          <AnimatePresence>
            {showLeft && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.2 }}
                style={{
                  position: 'absolute',
                  left: 8,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  zIndex: 10,
                }}
              >
                <IconButton
                  size="small"
                  onClick={scrollLeft}
                  sx={{
                    background: theme.custom.glass.bg,
                    backdropFilter: theme.custom.glass.blur,
                    boxShadow: theme.custom.glass.shadow,
                    border: '1px solid',
                    borderColor: theme.custom.glass.border,
                    color: 'primary.main',
                    '&:hover': {
                      background: theme.custom.glass.bgStrong,
                      boxShadow: theme.custom.glass.shadowActive,
                    },
                  }}
                >
                  <ChevronLeftIcon fontSize="small" />
                </IconButton>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {showRight && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.2 }}
                style={{
                  position: 'absolute',
                  right: 8,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  zIndex: 10,
                }}
              >
                <IconButton
                  size="small"
                  onClick={scrollRight}
                  sx={{
                    background: theme.custom.glass.bg,
                    backdropFilter: theme.custom.glass.blur,
                    boxShadow: theme.custom.glass.shadow,
                    border: '1px solid',
                    borderColor: theme.custom.glass.border,
                    color: 'primary.main',
                    '&:hover': {
                      background: theme.custom.glass.bgStrong,
                      boxShadow: theme.custom.glass.shadowActive,
                    },
                  }}
                >
                  <ChevronRightIcon fontSize="small" />
                </IconButton>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}

      <Box
        ref={scrollRef}
        sx={{
          width: '100%',
          overflowX: 'auto',
          overflowY: 'hidden',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          scrollSnapType: { xs: 'x mandatory', sm: 'none' },
          py: showLeft || showRight ? 1 : 0,
          px: showLeft || showRight ? 5 : 0,
          '&::-webkit-scrollbar': {
            display: 'none',
          },
        }}
      >
        {children}
      </Box>

      {showControls && (showLeft || showRight) && (
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 32,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            px: 4,
            zIndex: 10,
          }}
        >
          <Box
            sx={{
              width: '100%',
              height: 4,
              borderRadius: 2,
              background: 'rgba(0, 0, 0, 0.06)',
              position: 'relative',
            }}
          >
            <motion.div
              style={{
                position: 'absolute',
                left: `${scrollProgress * 100}%`,
                top: 0,
                bottom: 0,
                width: '40px',
                transform: 'translateX(-50%)',
                borderRadius: 2,
                background: theme.palette.primary.main,
                boxShadow: theme.custom.glass.shadow,
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            />
          </Box>
        </Box>
      )}
    </Box>
  );
}

CustomScrollbarHorizontal.propTypes = {
  children: PropTypes.node.isRequired,
  showControls: PropTypes.bool,
};

