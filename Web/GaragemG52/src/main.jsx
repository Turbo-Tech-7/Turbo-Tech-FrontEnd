import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ClienteContextProvider } from './context/ClienteContext.jsx'
import { OrcamentoContextProvider } from './context/OrcamentoContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ClienteContextProvider>
      <OrcamentoContextProvider>
        <App />
      </OrcamentoContextProvider>
    </ClienteContextProvider>
  </StrictMode>,
)
