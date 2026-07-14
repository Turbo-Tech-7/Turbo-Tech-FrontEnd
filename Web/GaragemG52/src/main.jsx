import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ClienteContextProvider } from './context/ClienteContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ClienteContextProvider>
      <App />
    </ClienteContextProvider>
  </StrictMode>,
)
