import './Styles/LandingPage.css';
import ButtonAppBar from './Components/Header';
import { Box, Typography, Button, Container } from '@mui/material';
import { teal } from '@mui/material/colors';
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineOppositeContent
} from '@mui/lab';
import ChildCareIcon from '@mui/icons-material/ChildCare';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import TerminalIcon from '@mui/icons-material/Terminal';
import PeopleTwoToneIcon from '@mui/icons-material/PeopleTwoTone';
import LocalLibraryIcon from '@mui/icons-material/LocalLibrary';
function LandingPage() {
  return (
    <div className="Container">
      <ButtonAppBar/>   
      <Container maxWidth="lg"  
          sx={{
            display: 'flex',
            flexDirection: { xs: 'row', lg: 'column' }, // Stack on mobile, side-by-side on desktop
            alignItems: 'center',
            gap: { xs: 4, lg: 8 }, // More space on larger screens
            p: { xs: 3, md: 6 }, // Responsive padding
            boxShadow: 3,
             py: 8
          }}
        >
 
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


          {/* Content Section */}
          <Box 
            sx={{ 
              flex: 1,
              textAlign: { xs: 'center', lg: 'left' }, // Center on mobile, left on desktop
              order: { xs: 2, lg: 2 },
              maxWidth: { xs: '40%', md: '60%', lg: '100%'},
              minWidth: { xs: '300px', md: '400px', lg: '500px'}
            }}
          >      
            <Typography 
              variant="h2" gutterBottom color='primary'
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
              Or sometimes I make things that are intentionally "not modern" just like this website or "modern"  like my addons based on need in market .
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
          {/* Content Section */}
          <Box 
            sx={{ 
              flex: 1,
              textAlign: { xs: 'center', lg: 'left' }, // Center on mobile, left on desktop
              order: { xs: 2, lg: 2 },
              maxWidth: { xs: '40%', md: '60%', lg: '100%'},
              minWidth: { xs: '300px', md: '400px', lg: '500px'}
            }}
          >      
            <Typography 
              variant="h2" gutterBottom color='primary'
            >
About Me            </Typography>
    <Timeline position="alternate">
      <TimelineItem>
        <TimelineOppositeContent color="text.secondary">
          1st December 2007
        </TimelineOppositeContent>
        <TimelineSeparator>
          <TimelineDot color="primary">
            <ChildCareIcon />
          </TimelineDot>
          <TimelineConnector sx={{ bgcolor: 'secondary.main'  ,opacity:'0.2'}}  />
        </TimelineSeparator>
        <TimelineContent>Born!!</TimelineContent>
      </TimelineItem>
      <TimelineItem>
        <TimelineSeparator>
          <TimelineDot color="primary" variant="outlined">
          <TerminalIcon/>
          </TimelineDot >
          <TimelineConnector sx={{ bgcolor: 'secondary.main' ,opacity:'0.2' }}  />
        </TimelineSeparator>
        <TimelineContent  >
Code      </TimelineContent>
      </TimelineItem>
      <TimelineItem>
        <TimelineOppositeContent color="text.secondary">August 2025</TimelineOppositeContent>
        <TimelineSeparator>
          <TimelineDot sx={{ bgcolor: 'secondary.main' }}  >
            <WorkspacePremiumIcon />
          </TimelineDot>
          <TimelineConnector />
        </TimelineSeparator>
        <TimelineContent>Started CSE Degree at AU        </TimelineContent>
      </TimelineItem>
            <TimelineItem>
        <TimelineOppositeContent color="text.secondary">2024-25
</TimelineOppositeContent>
        <TimelineSeparator>
          <TimelineDot color="info" variant="two-tone">
            <PeopleTwoToneIcon />
          </TimelineDot>
          <TimelineConnector />
        </TimelineSeparator>
        <TimelineContent >   2 WebExt reached 100s of users  </TimelineContent>
      </TimelineItem>

      <TimelineItem>
        <TimelineOppositeContent color="text.secondary" > Sept 2025   
</TimelineOppositeContent>
        <TimelineSeparator>
          <TimelineDot color="secondary" variant="outlined">
            <LocalLibraryIcon />
          </TimelineDot>
          <TimelineConnector />
        </TimelineSeparator>
        <TimelineContent>Joined IEEE AU SC        </TimelineContent>
      </TimelineItem>
    </Timeline>          </Box>
        </Box>

      </Container>
    </div>
  )
}

export default LandingPage
