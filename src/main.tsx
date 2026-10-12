import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, HashRouter } from 'react-router-dom';
import App from './App';
import { I18nProvider } from './i18n';
import { ThemeProvider } from './hooks/useTheme';
import { CartProvider } from './hooks/useCart';
import './styles/index.css';

// VITE_ROUTER=hash is used for static previews that cannot rewrite URLs.
const Router = import.meta.env.VITE_ROUTER === 'hash' ? HashRouter : BrowserRouter;

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Router>
      <I18nProvider><ThemeProvider><CartProvider><App /></CartProvider></ThemeProvider></I18nProvider>
    </Router>
  </StrictMode>,
);
