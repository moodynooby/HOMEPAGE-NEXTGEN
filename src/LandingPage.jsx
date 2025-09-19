import ButtonAppBar from './Components/Header'
import './Styles/LandingPage.css';
import { Box, Typography, Button, Container } from '@mui/material';
import { teal } from '@mui/material/colors';

function LandingPage() {
  return (
    <>
      <ButtonAppBar/>   
      <Container maxWidth="lg" sx={{ py: 8 }} >
        <Box 
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', lg: 'row' }, // Stack on mobile, side-by-side on desktop
            alignItems: 'center',
            gap: { xs: 4, lg: 8 }, // More space on larger screens
            backgroundColor: 'background.paper',
            borderRadius: 2,
            p: { xs: 3, md: 6 }, // Responsive padding
            boxShadow: 3,
          }}
        >
          {/* Image Section */}
          <iframe src="https://iet799-my.sharepoint.com/personal/manas_d_ahduni_edu_in/_layouts/15/embed.aspx?UniqueId=79deb5cf-398b-409d-9c23-6674e48b55b8" width="360" height="360" frameborder="0" scrolling="no" allowfullscreen title="generated-image"></iframe>
          {/* Content Section */}
          <Box 
            sx={{ 
              flex: 1,
              textAlign: { xs: 'center', lg: 'left' }, // Center on mobile, left on desktop
              order: { xs: 2, lg: 2 },
            }}
          >
            <Typography 
              variant="h2" 
              component="h1"
              sx={{ 
                fontSize: { xs: '2.5rem', md: '3.5rem', lg: '4rem' }, // Responsive font size
                fontWeight: 700,
                mb: 3,
                background: `linear-gradient(135deg, ${teal[500]} 0%, ${teal[700]} 100%)`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Hi, I'm Manas Doshi
            </Typography>
            
            <Typography 
              variant="h6"
              sx={{ 
                mb: 4,
                color: 'text.secondary',
                lineHeight: 1.6,
                fontSize: { xs: '1rem', md: '1.25rem' }, // Responsive text
              }}
            >
              I am a professional problem-solver who happens to really enjoy turning ideas into reality.
              <br />
              I create, I learn, I occasionally break things, and I always fix them better than before.
              <br/>
              Currently building this website 😅
            </Typography>
            
            <Button 
              variant="contained" 
              size="large"
              href='https://iet799-my.sharepoint.com/:b:/g/personal/manas_d_ahduni_edu_in/EVY_BkiInyBDqvSv50a2pDkBZ27J-yTJwBkobezhrkR1-g?e=B6miwV'
              sx={{
                px: 4,
                py: 1.5,
                fontSize: { xs: '1rem', md: '1.1rem' },
                borderRadius: 3,
                boxShadow: `0 4px 15px ${teal[500]}30`, // Custom shadow with theme color
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: `0 6px 20px ${teal[500]}40`,
                }
              }}
            >
              View My Resume
            </Button>
          </Box>
        </Box>
      </Container>
    </>
  )
}

export default LandingPage
