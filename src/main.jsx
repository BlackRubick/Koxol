import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './global.css';
import App from './App.jsx'
import AuthPage from './components/pages/Auth.jsx';
import Shop from './pages/Shop.jsx';
import CartFlowPage from './pages/CartFlowPage.jsx';
import PodcastPage from './pages/PodcastPage.jsx'; // Importar la nueva página del Podcast
import B2BPage from './pages/B2BPage.jsx';
import C2BPage from './pages/C2BPage.jsx';
import B2EPage from './pages/B2EPage.jsx';
import B2IPage from './pages/B2IPage.jsx';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import './i18n'; // Importar configuración de i18n

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <CartProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<App />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/shop/*" element={<Shop />} />
            <Route path="/cart" element={<CartFlowPage />} />
            <Route path="/podcast" element={<PodcastPage />} /> 
            <Route path="/b2b" element={<B2BPage />} />
            <Route path="/c2b" element={<C2BPage />} />
            <Route path="/b2e" element={<B2EPage />} />
            <Route path="/b2i" element={<B2IPage />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </CartProvider>
  </StrictMode>,
)
