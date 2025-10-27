import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './global.css';
import App from './App.jsx'
import AuthPage from './components/pages/Auth.jsx';
import Shop from './pages/Shop.jsx';
import CartFlowPage from './pages/CartFlowPage.jsx';
import PodcastPage from './pages/PodcastPage.jsx'; // Importar la nueva página del Podcast
import BlogPage from './pages/BlogPage.jsx'; // Importar la nueva página del Blog
import FAQPage from './pages/FAQPage.jsx'; // Import the FAQ page

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
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/faq" element={<FAQPage />} /> {/* Add FAQ route */}
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </CartProvider>
  </StrictMode>,
)
