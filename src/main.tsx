import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

<<<<<<< HEAD
=======
// Simple Service Worker registration for PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(err => {
      console.log('SW registration failed: ', err);
    });
  });
}

>>>>>>> jules-1751083910730374172-8e0c37a0
createRoot(document.getElementById('root')!).render(<App />);
