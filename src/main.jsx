import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import LP from './LandingPage'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <LP />
  </StrictMode>,
)
