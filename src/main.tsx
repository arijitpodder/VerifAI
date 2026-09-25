import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// Purge stale application cache across releases on GitHub Pages
if (typeof window !== 'undefined') {
  const CURRENT_RELEASE = '4.8.4';
  try {
    const prevRelease = localStorage.getItem('verifai_release_version');
    if (prevRelease !== CURRENT_RELEASE) {
      localStorage.setItem('verifai_release_version', CURRENT_RELEASE);
      if ('caches' in window) {
        caches.keys().then((names) => {
          names.forEach((name) => caches.delete(name));
        });
      }
    }
  } catch {}
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
