import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import LandingPage from './LandingPage'
import { BrowserRouter } from "react-router";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
    <LandingPage />
    </BrowserRouter>
  </StrictMode>,
)
