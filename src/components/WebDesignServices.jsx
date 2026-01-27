import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Paper,
  Chip,
  useTheme,
  Stack,
} from '@mui/material';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import BrushIcon from '@mui/icons-material/Brush';
import CodeIcon from '@mui/icons-material/Code';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import SearchIcon from '@mui/icons-material/Search';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import SendIcon from '@mui/icons-material/Send';

export default function WebDesignServices() {
  const theme = useTheme();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 80,
        damping: 15,
      },
    },
  };

  const processSteps = [
    {
      id: 1,
      title: 'Discovery',
      desc: 'We dive deep into your brand, goals, and audience to create a strategic roadmap.',
      icon: <SearchIcon />,
      color: theme.palette.info.main,
    },
    {
      id: 2,
      title: 'Design',
      desc: 'Crafting high-fidelity mockups with focus on UX/UI and modern aesthetics.',
      icon: <BrushIcon />,
      color: theme.palette.secondary.main,
    },
    {
      id: 3,
      title: 'Development',
      desc: 'Clean, semantic code implementation using React, Next.js, and other modern tech.',
      icon: <CodeIcon />,
      color: theme.palette.warning?.main || '#F59E0B',
    },
    {
      id: 4,
      title: 'Launch',
      desc: 'Testing, optimization, and deployment. We ensure a smooth lift-off.',
      icon: <RocketLaunchIcon />,
      color: theme.palette.success.main,
    },
  ];

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: 'background.default',
        overflowX: 'hidden',
        position: 'relative',
      }}
    >
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: '100vh',
          zIndex: 0,
          pointerEvents: 'none',
          overflow: 'hidden',
          bgcolor: 'background.default',
        }}
      >
        {[
          {
            color: theme.palette.primary.main,
            top: '20%',
            left: '10%',
            delay: 0,
          },
          {
            color: theme.palette.secondary.main,
            top: '70%',
            left: '80%',
            delay: 2,
          },
          { color: theme.palette.info.main, top: '40%', left: '60%', delay: 4 },
          {
            color: theme.palette.success.main,
            top: '80%',
            left: '20%',
            delay: 1,
          },
        ].map((blob, i) => (
          <Box
            key={i}
            component={motion.div}
            animate={{
              y: [0, -50, 0],
              x: [0, 30, 0],
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 10 + i * 2,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: blob.delay,
            }}
            sx={{
              position: 'absolute',
              top: blob.top,
              left: blob.left,
              width: { xs: 300, md: 500 },
              height: { xs: 300, md: 500 },
              borderRadius: '50%',
              background: `radial-gradient(circle, ${blob.color}40 0%, transparent 70%)`,
              filter: 'blur(60px)',
              transform: 'translate(-50%, -50%)',
            }}
          />
        ))}
      </Box>

      <Container
        maxWidth="lg"
        sx={{ pt: 20, pb: 15, position: 'relative', zIndex: 1 }}
      >
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
        >
          <Box sx={{ textAlign: 'center', mb: 12 }}>
            <motion.div variants={itemVariants}>
              <Chip
                icon={
                  <AutoAwesomeIcon sx={{ fontSize: '1.2rem !important' }} />
                }
                label="Future Forward Inc"
                sx={{
                  mb: 4,
                  py: 3,
                  px: 2,
                  fontSize: '1rem',
                  fontWeight: 600,
                  borderRadius: '50px',
                  background: `linear-gradient(135deg, ${theme.palette.background.paper}90, ${theme.palette.background.paper}50)`,
                  backdropFilter: 'blur(20px)',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.05)',
                  border: `1px solid ${theme.palette.divider}`,
                }}
              />
            </motion.div>

            <motion.div variants={itemVariants}>
              <Typography
                variant="h1"
                sx={{
                  fontSize: { xs: '3rem', md: '5rem' },
                  fontWeight: 800,
                  letterSpacing: '-0.02em',
                  lineHeight: 1.1,
                  mb: 4,
                  background: `linear-gradient(to right, ${theme.palette.text.primary}, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  backgroundSize: '200% auto',
                  backgroundClip: 'text',
                  textFillColor: 'transparent',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  animation: 'gradient 8s ease infinite',
                  '@keyframes gradient': {
                    '0%': { backgroundPosition: '0% 50%' },
                    '50%': { backgroundPosition: '100% 50%' },
                    '100%': { backgroundPosition: '0% 50%' },
                  },
                }}
              >
                We Build Digital <br />
                Masterpieces
              </Typography>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Typography
                variant="h4"
                sx={{
                  mb: 6,
                  color: 'text.secondary',
                  fontWeight: 400,
                  maxWidth: '800px',
                  mx: 'auto',
                  lineHeight: 1.6,
                  fontSize: { xs: '1.2rem', md: '1.5rem' },
                }}
              >
                Elevate your brand with a website that combines
                <b> stunning aesthetics</b>, <b>seamless functionality</b>, and
                <b> cutting-edge performance</b>.
              </Typography>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={3}
                justifyContent="center"
              >
                <Button
                  variant="contained"
                  size="large"
                  endIcon={<SendIcon />}
                  sx={{
                    borderRadius: '50px',
                    fontSize: '1.2rem',
                    py: 1.5,
                    px: 5,
                    textTransform: 'none',
                    background: theme.palette.text.primary,
                    color: theme.palette.background.default,
                    '&:hover': {
                      background: theme.palette.text.primary,
                      transform: 'scale(1.05)',
                      boxShadow: `0 10px 40px ${theme.palette.text.primary}40`,
                    },
                  }}
                  onClick={() => {
                    const section = document.getElementById('pricing');
                    if (section) {
                      section.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                >
                  Start a Project
                </Button>
                <Button
                  component={Link}
                  to="/projects"
                  variant="outlined"
                  size="large"
                  sx={{
                    borderRadius: '50px',
                    fontSize: '1.2rem',
                    py: 1.5,
                    px: 5,
                    textTransform: 'none',
                    borderWidth: '2px',
                    borderColor: theme.palette.divider,
                    background: 'rgba(255,255,255,0.5)',
                    backdropFilter: 'blur(10px)',
                    '&:hover': {
                      borderWidth: '2px',
                      borderColor: theme.palette.text.primary,
                      background: 'rgba(255,255,255,0.8)',
                    },
                  }}
                >
                  See Our Work
                </Button>
              </Stack>
            </motion.div>
          </Box>
        </motion.div>
      </Container>

      {/* Process Section */}
      <Box
        sx={{
          bgcolor: 'secondary.main',
          color: 'secondary.contrastText',
          py: 15,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Container maxWidth="lg">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Typography
              variant="h2"
              align="center"
              sx={{ mb: 2, fontWeight: 800, color: '#fff' }}
            >
              How We Work
            </Typography>
            <Typography
              variant="h5"
              align="center"
              sx={{
                mb: 10,
                color: 'rgba(255,255,255,0.7)',
                maxWidth: 600,
                mx: 'auto',
              }}
            >
              A simple, transparent process tailored to deliver excellence.
            </Typography>
          </motion.div>

          <Box sx={{ position: 'relative' }}>
            {/* Connection Line */}
            <Box
              sx={{
                position: 'absolute',
                top: { xs: '3rem', md: '3.5rem' },
                left: 0,
                right: 0,
                height: '2px',
                background: 'rgba(255,255,255,0.1)',
                display: { xs: 'none', md: 'block' },
                zIndex: 0,
              }}
            >
              <motion.div
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.5, ease: 'easeInOut', delay: 0.5 }}
                style={{
                  width: '100%',
                  height: '100%',
                  background: '#fff',
                  transformOrigin: 'left',
                }}
              />
            </Box>

            <Grid container spacing={4}>
              {processSteps.map((step, index) => (
                <Grid item xs={12} sm={6} md={3} key={step.id}>
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.2 + 0.5 }}
                  >
                    <Box sx={{ position: 'relative', p: 3 }}>
                      <Typography
                        variant="h1"
                        sx={{
                          position: 'absolute',
                          top: -30,
                          left: 0,
                          fontSize: '8rem',
                          fontWeight: 900,
                          color: 'rgba(255,255,255,0.05)',
                          lineHeight: 1,
                          zIndex: 0,
                          fontFamily: 'monospace',
                        }}
                      >
                        0{step.id}
                      </Typography>
                      <Box sx={{ position: 'relative', zIndex: 1 }}>
                        <Box
                          component={motion.div}
                          whileHover={{ scale: 1.2, rotate: 10 }}
                          sx={{
                            mb: 3,
                            color: '#fff',
                            width: 60,
                            height: 60,
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: 'rgba(255,255,255,0.1)',
                            backdropFilter: 'blur(10px)',
                            border: '1px solid rgba(255,255,255,0.2)',
                            boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                          }}
                        >
                          {step.icon}
                        </Box>
                        <Typography
                          variant="h5"
                          sx={{ fontWeight: 700, mb: 1, color: '#fff' }}
                        >
                          {step.title}
                        </Typography>
                        <Typography
                          variant="body1"
                          sx={{ color: 'rgba(255,255,255,0.7)' }}
                        >
                          {step.desc}
                        </Typography>
                      </Box>
                    </Box>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Container>
      </Box>
      {/* Pricing Section */}
      <Container
        maxWidth="lg"
        sx={{ pb: 15, position: 'relative', zIndex: 1, marginTop: '100px' }}
        id="pricing"
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <Typography
            variant="h2"
            align="center"
            sx={{ mb: 2, fontWeight: 800 }}
          >
            Unbeatable Value
          </Typography>
          <Typography
            variant="h5"
            align="center"
            sx={{ mb: 10, color: 'text.secondary', maxWidth: 600, mx: 'auto' }}
          >
            Premium design at a fraction of the agency cost. Limited time offers
            available.
          </Typography>
        </motion.div>

        <Grid
          container
          spacing={4}
          alignItems="flex-start"
          alignContent="flex-start"
          justifyContent="center"
        >
          {[
            {
              title: 'Startup',
              oldPrice: '2,999',
              price: '1,499',
              save: 'SAVE 50%',
              features: [
                '5 Page Website',
                'Mobile Responsive',
                'SEO Basic',
                'Contact Form',
              ],
              color: theme.palette.info.main,
              delay: 0,
            },
            {
              title: 'Business',
              oldPrice: '5,999',
              price: '3,499',
              save: 'BEST VALUE',
              features: [
                '10 Page Website',
                'CMS Integration',
                'Advanced SEO',
                'Speed Optimization',
                'Analytics Setup',
              ],
              color: theme.palette.secondary.main,
              delay: 1,
              highlight: true,
            },
            {
              title: 'Enterprise',
              oldPrice: '12,000+',
              price: '7,999',
              save: 'SAVE 4K+',
              features: [
                'Custom Web App',
                'E-commerce',
                'User Customization',
                'Priority Support',
                'A/B Testing',
              ],
              color: theme.palette.primary.main,
              delay: 2,
            },
          ].map((tier, index) => (
            <Grid item xs={12} md={4} key={index}>
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
              >
                <Paper
                  elevation={0}
                  sx={{
                    p: 4,
                    borderRadius: 4,
                    border: tier.highlight
                      ? `2px solid ${tier.color}`
                      : `1px solid ${theme.palette.divider}`,
                    background: tier.highlight
                      ? `linear-gradient(135deg, ${tier.color}10, ${theme.palette.background.paper})`
                      : 'rgba(255, 255, 255, 0.05)',
                    backdropFilter: 'blur(20px)',
                    position: 'relative',
                    transform: tier.highlight ? { md: 'scale(1.1)' } : 'none',
                    zIndex: tier.highlight ? 2 : 1,
                    overflow: 'visible',
                  }}
                >
                  {/* Save Badge */}
                  <Box
                    sx={{
                      position: 'absolute',
                      top: -15,
                      right: 20,
                      bgcolor: tier.color,
                      color: '#fff',
                      py: 0.5,
                      px: 2,
                      borderRadius: 50,
                      fontWeight: 700,
                      fontSize: '0.875rem',
                      boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
                      animation: tier.highlight ? 'bounce 2s infinite' : 'none',
                      '@keyframes bounce': {
                        '0%': { transform: 'translateY(0)' },
                        '50%': { transform: 'translateY(-5px)' },
                      },
                    }}
                  >
                    {tier.save}
                  </Box>

                  <Typography
                    variant="h5"
                    component="div"
                    sx={{ fontWeight: 700, color: 'text.secondary', mb: 2 }}
                  >
                    {tier.title}
                  </Typography>

                  <Box sx={{ display: 'flex', alignItems: 'baseline', mb: 1 }}>
                    <Typography
                      component="span"
                      sx={{
                        textDecoration: 'line-through',
                        color: 'text.disabled',
                        fontSize: '1.25rem',
                        mr: 2,
                        fontWeight: 500,
                      }}
                    >
                      {tier.oldPrice}
                    </Typography>
                    <Typography
                      component="span"
                      variant="h3"
                      sx={{
                        fontWeight: 800,
                        color: tier.highlight ? tier.color : 'text.primary',
                      }}
                    >
                      {tier.price}
                    </Typography>
                  </Box>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 4 }}
                  >
                    One-time payment. No hidden fees.
                  </Typography>

                  <Stack spacing={2} sx={{ mb: 4 }}>
                    {tier.features.map((line, idx) => (
                      <Box
                        key={idx}
                        sx={{ display: 'flex', alignItems: 'center', gap: 2 }}
                      >
                        <CheckCircleIcon
                          sx={{ color: tier.color, fontSize: '1.25rem' }}
                        />
                        <Typography variant="body1">{line}</Typography>
                      </Box>
                    ))}
                  </Stack>

                  <Button
                    variant={tier.highlight ? 'contained' : 'outlined'}
                    fullWidth
                    size="large"
                    sx={{
                      borderRadius: 50,
                      py: 1.5,
                      bgcolor: tier.highlight ? tier.color : 'transparent',
                      borderColor: tier.color,
                      color: tier.highlight ? '#fff' : tier.color,
                      '&:hover': {
                        bgcolor: tier.highlight
                          ? tier.color
                          : `${tier.color}10`,
                        borderColor: tier.color,
                      },
                    }}
                    href="mailto:future.frwad@gmail.com"
                  >
                    Choose Plan
                  </Button>
                </Paper>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* CTA Section */}
      <Container maxWidth="md" sx={{ py: 20, textAlign: 'center' }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
        >
          <Paper
            elevation={0}
            sx={{
              p: { xs: 4, md: 8 },
              borderRadius: 8,
              background: `linear-gradient(135deg, ${theme.palette.primary.main}10, ${theme.palette.info.main}10)`,
              backdropFilter: 'blur(20px)',
              border: `1px solid ${theme.palette.divider}`,
            }}
          >
            <Typography variant="h2" gutterBottom sx={{ fontWeight: 800 }}>
              Ready to build something amazing?
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ mb: 5 }}>
              Let&apos;s turn your vision into reality. Get in touch today.
            </Typography>
            <Button
              component={motion(Link)}
              to="/links"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              variant="contained"
              size="large"
              sx={{
                borderRadius: 50,
                px: 6,
                py: 2,
                fontSize: '1.2rem',
                boxShadow: `0 10px 30px ${theme.palette.primary.main}50`,
                background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                animation: 'pulse 2s infinite',
                '@keyframes pulse': {
                  '0%': {
                    boxShadow: `0 0 0 0 ${theme.palette.primary.main}70`,
                  },
                  '70%': {
                    boxShadow: `0 0 0 20px ${theme.palette.primary.main}00`,
                  },
                  '100%': {
                    boxShadow: `0 0 0 0 ${theme.palette.primary.main}00`,
                  },
                },
              }}
            >
              Contact Us
            </Button>
          </Paper>
        </motion.div>
      </Container>
    </Box>
  );
}
