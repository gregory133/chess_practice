import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './style/Index.scss'

createRoot(document.getElementById('root')!).render(
  <App />
)
