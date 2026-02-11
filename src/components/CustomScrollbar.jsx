import * as React from 'react';
import PropTypes from 'prop-types';
import { Box, IconButton } from '@mui/material';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { motion, AnimatePresence } from 'motion/react';
import { useTheme } from '@mui/material/styles';

export default function CustomScrollbar({ children, maxHeight, showControls = true }) {
  const scrollRef = React.useRef(null);
  const [showUp, setShowUp] = React.useState(false);
  const [showDown, setShowDown] = React.useState(false);
  const [scrollProgress, setScrollProgress] = React.useState(0);
  const theme = useTheme();

  const checkScroll = React.useCallback(() => {
    const element = scrollRef.current;
    if (!element) return;

    const canScrollUp = element.scrollTop > 10;
    const canScrollDown = element.scrollTop < element.scrollHeight - element.clientHeight - 10;

    setShowUp(canScrollUp);
    setShowDown(canScrollDown);
    setScrollProgress(
      element.scrollTop / (element.scrollHeight - element.clientHeight) || 0,
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

  const scrollUp = () => {
    const element = scrollRef.current;
    if (!element) return;

    const scrollAmount = element.clientHeight * 0.75;
    element.scrollTo({
      top: Math.max(0, element.scrollTop - scrollAmount),
      behavior: 'smooth',
    });
  };

  const scrollDown = () => {
    const element = scrollRef.current;
    if (!element) return;

    const scrollAmount = element.clientHeight * 0.75;
    element.scrollTo({
      top: Math.min(element.scrollHeight - element.clientHeight, element.scrollTop + scrollAmount),
      behavior: 'smooth',
    });
  };

  const handleScrollTo = (e) => {
    const element = scrollRef.current;
    if (!element) return;

    const rect = element.getBoundingClientRect();
    const clickY = e.clientY - rect.top;
    const percentage = clickY / rect.height;

    element.scrollTo({
      top: percentage * (element.scrollHeight - element.clientHeight),
      behavior: 'smooth',
    });
  };

  return (
    <Box sx={{ position: 'relative', height: '100%' }}>
      <Box
        ref={scrollRef}
        sx={{
          height: maxHeight || '100%',
          overflowY: 'auto',
          overflowX: 'hidden',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          pr: 1.5,
          '&::-webkit-scrollbar': {
            display: 'none',
          },
        }}
      >
        {children}
      </Box>

      {showControls && (
        <Box
          sx={{
            position: 'absolute',
            right: 0,
            top: 0,
            bottom: 0,
            width: 32,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            py: 1,
            zIndex: 10,
          }}
        >
          <AnimatePresence>
            {showUp && (
              <motion.div
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.2 }}
              >
                <IconButton
                  size="small"
                  onClick={scrollUp}
                  sx={{
                    mb: 0.5,
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
                  <KeyboardArrowUpIcon fontSize="small" />
                </IconButton>
              </motion.div>
            )}
          </AnimatePresence>

          <Box
            onClick={handleScrollTo}
            sx={{
              flex: 1,
              width: 4,
              borderRadius: 2,
              background: 'rgba(0, 0, 0, 0.06)',
              position: 'relative',
              my: showUp || showDown ? 0.5 : 1,
              cursor: 'pointer',
            }}
          >
            <motion.div
              style={{
                position: 'absolute',
                top: `${scrollProgress * 100}%`,
                left: 0,
                right: 0,
                height: '40px',
                transform: 'translateY(-50%)',
                borderRadius: 2,
                background: theme.palette.primary.main,
                boxShadow: theme.custom.glass.shadow,
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: showUp || showDown ? 1 : 0 }}
            />
          </Box>

          <AnimatePresence>
            {showDown && (
              <motion.div
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.2 }}
              >
                <IconButton
                  size="small"
                  onClick={scrollDown}
                  sx={{
                    mt: 0.5,
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
                  <KeyboardArrowDownIcon fontSize="small" />
                </IconButton>
              </motion.div>
            )}
          </AnimatePresence>
        </Box>
      )}
    </Box>
  );
}

CustomScrollbar.propTypes = {
  children: PropTypes.node.isRequired,
  maxHeight: PropTypes.string,
  showControls: PropTypes.bool,
};

