// Molecule: Navbar sticky premium con blur effect
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUserCircle } from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../atoms/Button';
import CartIcon from '../atoms/CartIcon';
import './Navbar.css';

const Navbar = ({ cartCount = 0 }) => {
  const navRef = useRef(null);
  const navigate = useNavigate();
  const { isLoggedIn, userData, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (navRef.current) {
        if (window.scrollY > 20) {
          navRef.current.classList.add('scrolled');
        } else {
          navRef.current.classList.remove('scrolled');
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Mover el traductor entre desktop y móvil según el tamaño de pantalla
  useEffect(() => {
    const moveTranslator = () => {
      const translator = document.getElementById('google_translate_element');
      const desktopWrapper = document.querySelector('.navbar-translate-desktop-wrapper');
      const mobileWrapper = document.querySelector('.navbar-translate-mobile-wrapper');
      
      if (!translator || !desktopWrapper || !mobileWrapper) return;
      
      if (window.innerWidth <= 900) {
        // Mover a móvil
        if (!mobileWrapper.contains(translator)) {
          mobileWrapper.appendChild(translator);
        }
      } else {
        // Mover a desktop
        if (!desktopWrapper.contains(translator)) {
          desktopWrapper.appendChild(translator);
        }
      }
    };
    
    // Ejecutar al montar y cuando cambie el tamaño
    moveTranslator();
    window.addEventListener('resize', moveTranslator);
    
    // También ejecutar después de un pequeño delay para asegurar que Google Translate esté listo
    const timeout = setTimeout(moveTranslator, 500);
    
    return () => {
      window.removeEventListener('resize', moveTranslator);
      clearTimeout(timeout);
    };
  }, []);

  const handleCartClick = () => {
    navigate('/shop');
  };

  const handleLinkClick = () => {
    setMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  return (
    <nav className="koxol-navbar" ref={navRef}>
      <div className="koxol-navbar__container">
        <div className="koxol-navbar__content">
          {/* Logo */}
          <div className="koxol-navbar__brand" onClick={() => navigate('/')}>
            <span className="koxol-navbar__text-logo">K'oxol</span>
          </div>

          {/* Enlaces Desktop */}
          <ul className="koxol-navbar__links koxol-navbar__links--desktop">
            <li><a href="/#beneficios" className="koxol-navbar__link" onClick={() => navigate('/#beneficios')}>Beneficios</a></li>
            <li><a href="/#catalogo" className="koxol-navbar__link" onClick={() => navigate('/#catalogo')}>Catálogo</a></li>
            <li><a href="/#historia" className="koxol-navbar__link" onClick={() => navigate('/#historia')}>Historia</a></li>
            <li><a href="/#membresias" className="koxol-navbar__link" onClick={() => navigate('/#membresias')}>Membresías</a></li>
            <li><a href="/#testimonios" className="koxol-navbar__link" onClick={() => navigate('/#testimonios')}>Testimonios</a></li>
            <li><a href="/#familia" className="koxol-navbar__link" onClick={() => navigate('/#familia')}>Familia</a></li>
            <li><a href="/#servicio" className="koxol-navbar__link" onClick={() => navigate('/#servicio')}>Soporte</a></li>
            <li><a href="/podcast" className="koxol-navbar__link">Podcast</a></li>
            <li><a href="/#support" className="koxol-navbar__link" onClick={() => navigate('/#support')}>Publicidad</a></li>
            <li><a href="/#empresa" className="koxol-navbar__link" onClick={() => navigate('/#empresa')}>Empresa</a></li>
            <li><a href="/blog" className="koxol-navbar__link">Blog</a></li>
            <li><a href="/#metrics" className="koxol-navbar__link">Métricas</a></li>
            
            {/* Traductor Desktop - se oculta en móvil */}
            <li className="navbar-translate-desktop-wrapper">
              <div id="google_translate_element"></div>
            </li>
          </ul>

          {/* Acciones Desktop */}
          <div className="koxol-navbar__actions koxol-navbar__actions--desktop">
            {isLoggedIn && userData ? (
              <>
                <div className="koxol-navbar__profile">
                  <FaUserCircle />
                  <span style={{ fontWeight: '500', color: '#33691E' }}>
                    {userData.name.split(' ')[0]}
                  </span>
                  <div className="koxol-navbar__profile-dropdown">
                    <p><strong>Nombre:</strong> {userData.name}</p>
                    <p><strong>Email:</strong> {userData.email}</p>
                    <button onClick={handleLogout}>Cerrar sesión</button>
                  </div>
                </div>

                <div onClick={handleCartClick} className="koxol-navbar__cart">
                  <CartIcon count={cartCount} />
                </div>
              </>
            ) : (
              <Button variant="secondary" onClick={() => navigate('/auth')}>
                Iniciar sesión
              </Button>
            )}
          </div>

          {/* Botón "Compra ahora" */}
          <div className="koxol-navbar__actions">
            <button className="koxol-navbar__button" onClick={() => navigate('/auth')}>Compra ahora</button>
          </div>

          {/* Burger Menu */}
          <button 
            className="koxol-navbar__burger" 
            aria-label="Menú" 
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <span className={`burger-bar ${menuOpen ? 'open' : ''}`}></span>
          </button>
        </div>

        {/* Menú Móvil */}
        <div className={`koxol-navbar__mobile-menu ${menuOpen ? 'open' : ''}`}>
          <ul className="koxol-navbar__mobile-links">
            <li><a href="/#beneficios" className="koxol-navbar__mobile-link" onClick={handleLinkClick}>Beneficios</a></li>
            <li><a href="/#catalogo" className="koxol-navbar__mobile-link" onClick={handleLinkClick}>Catálogo</a></li>
            <li><a href="/#historia" className="koxol-navbar__mobile-link" onClick={handleLinkClick}>Historia</a></li>
            <li><a href="/#membresias" className="koxol-navbar__mobile-link" onClick={handleLinkClick}>Membresías</a></li>
            <li><a href="/#testimonios" className="koxol-navbar__mobile-link" onClick={handleLinkClick}>Testimonios</a></li>
            <li><a href="/#familia" className="koxol-navbar__mobile-link" onClick={handleLinkClick}>Familia</a></li>
            <li><a href="/#servicio" className="koxol-navbar__mobile-link" onClick={handleLinkClick}>Soporte</a></li>
            <li><a href="/podcast" className="koxol-navbar__mobile-link" onClick={handleLinkClick}>Podcast</a></li>
            <li><a href="/#support" className="koxol-navbar__mobile-link" onClick={handleLinkClick}>Publicidad</a></li>
            <li><a href="/#empresa" className="koxol-navbar__mobile-link" onClick={handleLinkClick}>Empresa</a></li>
            <li><a href="/blog" className="koxol-navbar__mobile-link" onClick={handleLinkClick}>Blog</a></li>
            <li><a href="/#metrics" className="koxol-navbar__mobile-link" onClick={handleLinkClick}>Métricas</a></li>
            
            {/* Traductor Móvil - se mueve aquí en móvil */}
            <li className="navbar-translate-mobile-wrapper"></li>
          </ul>
          
          <div className="koxol-navbar__mobile-actions">
            {isLoggedIn ? (
              <div onClick={() => { handleCartClick(); setMenuOpen(false); }} className="koxol-navbar__cart">
                <CartIcon count={cartCount} />
              </div>
            ) : (
              <Button variant="secondary" onClick={() => { navigate('/auth'); setMenuOpen(false); }}>
                Iniciar sesión
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Overlay */}
      {menuOpen && (
        <div 
          className="koxol-navbar__overlay" 
          onClick={() => setMenuOpen(false)}
        />
      )}
    </nav>
  );
};

export default Navbar;