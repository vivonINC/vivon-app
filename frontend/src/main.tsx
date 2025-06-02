import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import './assets/index.css';

const root = document.getElementById('root');
const body = document.querySelector('body');
if (root) {
  body?.classList.add('bg-stone-900');
  root.classList.add('bg-stone-900');
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
