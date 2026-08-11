import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

// Global media retry logic for broken images and videos
window.addEventListener(
  'error',
  (e) => {
    const target = e.target as HTMLElement;
    if (target && (target.tagName === 'IMG' || target.tagName === 'VIDEO' || target.tagName === 'SOURCE')) {
      const media = (target.tagName === 'SOURCE' ? target.parentElement : target) as HTMLImageElement | HTMLVideoElement | null;
      const failedElement = target as HTMLImageElement | HTMLSourceElement;
      
      if (!media || !failedElement.src || failedElement.src.startsWith('data:')) return;

      const maxRetries = 3;
      const currentRetries = parseInt(media.dataset.retries || '0', 10);

      if (currentRetries < maxRetries) {
        media.dataset.retries = (currentRetries + 1).toString();
        
        // Exponential backoff: 1s, 2s, 4s
        const backoffDelay = 1000 * Math.pow(2, currentRetries);
        
        setTimeout(() => {
          try {
            const url = new URL(failedElement.src, window.location.origin);
            url.searchParams.set('retry', Date.now().toString());
            failedElement.src = url.toString();
            
            // Explicitly load video element if it or its source failed
            if (media.tagName === 'VIDEO') {
              (media as HTMLVideoElement).load();
            }
          } catch (err) {
            console.error('Failed to parse media URL for retry', err);
          }
        }, backoffDelay);
      }
    }
  },
  true // Use capture phase to intercept resource loading errors
);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
