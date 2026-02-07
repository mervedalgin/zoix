import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Toaster } from 'react-hot-toast'
import App from './App.jsx'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
    <Toaster
      position="top-center"
      toastOptions={{
        style: {
          background: 'rgba(13,13,20,0.95)',
          color: '#00ffc8',
          border: '1px solid rgba(0,255,200,0.3)',
          fontFamily: "'Orbitron', sans-serif",
          fontSize: '0.75rem',
          letterSpacing: '1px',
        },
      }}
    />
  </StrictMode>,
)
