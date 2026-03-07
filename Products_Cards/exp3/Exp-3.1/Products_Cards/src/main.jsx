import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import ProductCards from './ProductCards.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ProductCards />
  </StrictMode>,
)
