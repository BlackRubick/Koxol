import { useState, useRef, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Navbar from './components/molecules/Navbar';
import Hero from './components/organisms/Hero';
import Benefits from './components/organisms/Benefits';
import History from './components/organisms/History';
import Memberships from './components/organisms/Memberships';
import Testimonials from './components/organisms/Testimonials';
import FamiliaKoxol from './components/organisms/FamiliaKoxol';
import Footer from './components/organisms/Footer';
import ChatbotButton from './components/atoms/ChatbotButton';
import ChatMessenger from './components/atoms/ChatMessenger';
import DiscountModal from './components/atoms/DiscountModal';
import CookieBanner from './components/atoms/CookieBanner';
import { useNavigate } from 'react-router-dom';
import CustomerService from './components/organisms/CustomerService';
import Loyalty from './components/organisms/Loyalty';
import ProductCatalog from './components/organisms/ProductCatalog';
import CheckoutModal from './components/organisms/CheckoutModal';
import { useAuth } from './contexts/AuthContext';
import { useCart } from './contexts/CartContext';
import { FaVolumeUp, FaVolumeMute } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import WelcomeSection from './components/organisms/WelcomeSection';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import AffiliatedCompanies from './components/organisms/AffiliatedCompanies';
import NaturalSection from './components/organisms/NaturalSection';
import SupportSection from './components/organisms/SupportSection';
import EmpresaPage from './pages/EmpresaPage';
import BlogPage from './pages/BlogPage';
import MetricsPage from './pages/MetricsPage';
import MetricsSection from './components/organisms/MetricsSection';
import { Route, Routes } from 'react-router-dom';
import { getJSON, setJSON } from './utils/storage';

function App() {
  const { t, i18n } = useTranslation();
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [showDiscountModal, setShowDiscountModal] = useState(true);
  const [chatOpen, setChatOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.3);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const audioRef = useRef(null);
  const navigate = useNavigate();

  const auth = useAuth();
  const { cart, addToCart, removeFromCart, changeQty, clearCart, checkoutOpen, setCheckoutOpen } = useCart();

  // Intenta reproducir el audio después del primer render
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      audioRef.current.play().catch(error => {
        console.log('Autoplay bloqueado. El usuario debe interactuar primero.');
        setIsMuted(true);
      });
    }
  }, []);

  useEffect(() => {
    if (auth?.isLoggedIn) {
      setShowDiscountModal(false); // Ocultar el modal si el usuario ya inició sesión
    }
  }, [auth?.isLoggedIn]);

  const handleAddToCart = (product) => {
    if (!auth?.isLoggedIn) return navigate('/auth');
    addToCart(product);
  };

  const handleCheckout = () => setCheckoutOpen(true);

  const handleConfirmOrder = async (form) => {
    // Construir objeto de pedido y guardarlo en localStorage para que lo vea el admin
    const total = cart.reduce((acc, item) => acc + (item.price || 0) * item.qty, 0);
    const order = {
      id: Date.now().toString(),
      items: cart,
      buyer: form,
      paymentMethod: form.paymentMethod || 'No especificado',
      status: 'pending',
      shippingCarrier: null,
      createdAt: new Date().toISOString(),
      total
    };

    try {
      // Use orders API abstraction to persist order (fallback to localStorage)
      const { createOrder } = await import('./api/orders');
      await createOrder(order);
    } catch (err) {
      console.error('Error guardando pedido (API):', err);
    }

    setOrderSuccess(true);
    setCheckoutOpen(false);
    clearCart();
    setTimeout(() => setOrderSuccess(false), 4000);
  };

  const handleRegisterClick = () => {
    setShowDiscountModal(false);
    navigate('/auth');
  };

  const handleLoginClick = () => {
    navigate('/auth');
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
      if (isMuted && audioRef.current.paused) {
        audioRef.current.play().catch(err => console.log('Error al reproducir:', err));
      }
    }
  };

  const handleVolumeChange = (event) => {
    const newVolume = parseFloat(event.target.value);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
    setVolume(newVolume);

    // Ocultar el slider después de ajustar el volumen
    setTimeout(() => setShowVolumeSlider(false), 2000);
  };

  const toggleLanguage = () => {
    const newLanguage = i18n.language === 'es' ? 'en' : 'es';
    i18n.changeLanguage(newLanguage);
  };

  return (
    <>
      <DiscountModal open={showDiscountModal} onClose={() => setShowDiscountModal(false)} onRegister={handleRegisterClick} />
      <Navbar
        cartCount={cart.reduce((acc, item) => acc + item.qty, 0)}
        isLoggedIn={auth?.isLoggedIn}
        onLoginClick={handleLoginClick}
      />
      <CheckoutModal open={checkoutOpen} cart={cart} onClose={() => setCheckoutOpen(false)} onConfirm={handleConfirmOrder} />
      {orderSuccess && (
        <div className="order-success-toast">
          ¡Gracias por tu compra! Pronto recibirás un correo de confirmación.
        </div>
      )}
      
      <AnimatedSection
        animation={{ initial: { opacity: 0, y: 50 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.6 } }}
      >
        <Hero />
        <WelcomeSection />
      </AnimatedSection>
      <AnimatedSection
        animation={{ initial: { opacity: 0, y: 50 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.6 } }}
      >
        <NaturalSection />
      </AnimatedSection>
      <AnimatedSection
        animation={{ initial: { opacity: 0, x: -50 }, animate: { opacity: 1, x: 0 }, transition: { duration: 0.7 } }}
      >
        <Benefits />
      </AnimatedSection>
      <AnimatedSection
        animation={{ initial: { scale: 0.8, opacity: 0 }, animate: { scale: 1, opacity: 1 }, transition: { duration: 0.8 } }}
      >
        <ProductCatalog onAddToCart={handleAddToCart} />
      </AnimatedSection>
      <AnimatedSection
        animation={window.innerWidth > 480 ? { initial: { opacity: 0, x: -50 }, animate: { opacity: 1, x: 0 }, transition: { duration: 0.7 } } : { initial: {}, animate: {}, transition: {}}}
      >
        <History />
      </AnimatedSection>
      <AnimatedSection
        animation={{ initial: { opacity: 0, y: -50 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.6 } }}
      >
        <Memberships />
      </AnimatedSection>
      <AnimatedSection
        animation={{ initial: { opacity: 0, x: 50 }, animate: { opacity: 1, x: 0 }, transition: { duration: 0.7 } }}
      >
        <Testimonials />
      </AnimatedSection>
      <AnimatedSection
        animation={{ initial: { scale: 0.5, opacity: 0 }, animate: { scale: 1, opacity: 1 }, transition: { duration: 0.8 } }}
      >
        <section id="familia">
          <FamiliaKoxol />
        </section>
      </AnimatedSection>
      <AnimatedSection
        animation={{ initial: { opacity: 0, y: 100 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.9 } }}
      >
        <CustomerService />
      </AnimatedSection>
      <AnimatedSection
        animation={{ initial: { opacity: 0, x: -100 }, animate: { opacity: 1, x: 0 }, transition: { duration: 0.6 } }}
      >
        <Loyalty />
      </AnimatedSection>
      <AnimatedSection
        animation={{ initial: { opacity: 0, y: 50 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.6 } }}
      >
        <AffiliatedCompanies />
      </AnimatedSection>
      <AnimatedSection
        animation={{ initial: { opacity: 0, y: 50 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.6 } }}
      >
        <section id="support">
          <SupportSection />
        </section>
      </AnimatedSection>
      <AnimatedSection
        animation={{ initial: { opacity: 0, y: 50 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.6 } }}
      >
        <section id="empresa">
          <EmpresaPage />
        </section>
      </AnimatedSection>
      <AnimatedSection
        animation={{ initial: { opacity: 0, y: 50 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.6 } }}
      >
        <section id="metrics">
          <MetricsSection />
        </section>
      </AnimatedSection>
      <Footer />
      <ChatbotButton onClick={() => setChatOpen(o => !o)} />
      <ChatMessenger open={chatOpen} onClose={() => setChatOpen(false)} />
      <CookieBanner />
      
      {/* Audio element */}
      <audio
        ref={audioRef}
        src="/musica-relajante.mp3"
        loop
      />
      
      {/* Botón de volumen estilo chatbot - lado izquierdo */}
      <div 
        onMouseEnter={() => setShowVolumeSlider(true)}
        onMouseLeave={() => setShowVolumeSlider(false)}
        style={{ 
          position: 'fixed', 
          bottom: '40px', // Ajustado para alinearlo con el botón del chatbot
          left: '20px', 
          zIndex: 1000,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '10px'
        }}
      >
        {/* Slider de volumen (aparece al hacer hover) */}
        {showVolumeSlider && (
          <div style={{
            padding: '0',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '10px',
            marginBottom: '10px'
          }}>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={handleVolumeChange}
              style={{ 
                width: '100px',
                cursor: 'pointer',
                transform: 'rotate(-90deg)',
                transformOrigin: 'center'
              }}
              title="Ajustar volumen"
              aria-label="Control de volumen"
            />
            <span style={{ fontSize: '12px', color: '#666', marginTop: '30px' }}>
              {Math.round(volume * 100)}%
            </span>
          </div>
        )}
        
        {/* Botón circular de volumen */}
        <button 
          onClick={toggleMute}
          style={{ 
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            background: isMuted ? '#ccc' : '#4CAF50',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
            transition: 'all 0.3s ease',
            color: 'white'
          }}
          title={isMuted ? 'Activar sonido' : 'Silenciar'}
          aria-label={isMuted ? 'Activar sonido' : 'Silenciar'}
        >
          {isMuted ? <FaVolumeMute size={28} /> : <FaVolumeUp size={28} />}
        </button>
      </div>

      {/* Botón para cambiar de idioma */}
      <button onClick={toggleLanguage} style={{ position: 'fixed', top: '10px', right: '10px' }}>
        {i18n.language === 'es' ? 'Switch to English' : 'Cambiar a Español'}
      </button>

      <Routes>
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/metrics" element={<MetricsPage />} />
      </Routes>
    </>
  );
}

function AnimatedSection({ children, animation }) {
  const [ref, inView] = useInView({ triggerOnce: false, threshold: 0.2 });

  return (
    <motion.div
      ref={ref}
      initial={animation.initial}
      animate={inView ? animation.animate : animation.initial}
      transition={animation.transition}
      style={{ 
        position: 'relative',
        zIndex: 'auto',
        isolation: 'isolate',
        width: '100%'
      }}
    >
      {children}
    </motion.div>
  );
}

export default App