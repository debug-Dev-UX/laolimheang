import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/index.css';
import './index.css';

// Disable page layout zooming while keeping image modal zoom simple & fluid
if (typeof window !== 'undefined') {
  // Prevent Ctrl+scroll or pinch zoom on the general page
  window.addEventListener(
    'wheel',
    (e) => {
      if (e.ctrlKey) {
        const isImageZoom = e.target && e.target.closest && e.target.closest('#image-zoom-viewport');
        if (!isImageZoom) {
          e.preventDefault();
        }
      }
    },
    { passive: false }
  );

  // Prevent keyboard browser zoom (Ctrl/Cmd + Plus, Minus, Zero) on webpage
  window.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && (e.key === '+' || e.key === '-' || e.key === '=')) {
      const isImageZoom = document.getElementById('image-zoom-viewport');
      if (!isImageZoom) {
        e.preventDefault();
      }
    }
  });

  // Prevent Safari / iOS multi-touch page scaling
  document.addEventListener('gesturestart', (e) => {
    const isImageZoom = e.target && e.target.closest && e.target.closest('#image-zoom-viewport');
    if (!isImageZoom) {
      e.preventDefault();
    }
  });
  document.addEventListener('gesturechange', (e) => {
    const isImageZoom = e.target && e.target.closest && e.target.closest('#image-zoom-viewport');
    if (!isImageZoom) {
      e.preventDefault();
    }
  });
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
