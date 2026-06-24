import React, {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import ReactDOM from 'react-dom';
import App from './App.tsx';
import './index.css';

if (import.meta.env.DEV) {
  import('@axe-core/react').then(({ default: axe }) => {
    axe(React, ReactDOM, 1000);
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
