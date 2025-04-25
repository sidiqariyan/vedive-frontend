// First import the polyfills
import { Buffer } from 'buffer';
import process from 'process';

// Then set up globals
window.Buffer = Buffer;
window.process = process;
window.global = window;

// Then import the rest of your modules
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';

// Import HelmetProvider from react-helmet-async
import { HelmetProvider } from 'react-helmet-async';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* Wrap your entire app in HelmetProvider */}
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </StrictMode>
);