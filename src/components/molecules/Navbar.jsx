// Molecule: Navbar sticky premium con blur effect
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUserCircle } from 'react-icons/fa';
import Button from '../atoms/Button';
import CartIcon from '../atoms/CartIcon';
import './Navbar.css';

const Navbar = ({ cartCount = 0, isLoggedIn, onLoginClick }) => {
  const navRef = useRef(null);
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [userData, setUserData] = useState(null);

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

  useEffect(() => {
    const storedUserData = localStorage.getItem('userData');
    const isLoggedIn = localStorage.getItem('koxol_isLoggedIn');
    console.log('Datos de usuario en localStorage:', storedUserData); // Depuración
    console.log('Estado de sesión en localStorage:', isLoggedIn); // Depuración
    if (storedUserData) {
      setUserData(JSON.parse(storedUserData));
    } else {
      console.log('No se encontraron datos de usuario en localStorage');
    }
  }, []);

  const handleCartClick = () => {
    navigate('/cart'); 
  };

  const handleLinkClick = () => {
    setMenuOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('userData');
    setUserData(null);
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
          </ul>

          {/* Acciones Desktop */}
          <div className="koxol-navbar__actions koxol-navbar__actions--desktop">
            {userData && (
              <div className="koxol-navbar__profile">
                <FaUserCircle size={24} />
                <div className="koxol-navbar__profile-dropdown">
                  <p>Nombre: {userData.name}</p>
                  <p>Email: {userData.email}</p>
                  <button onClick={handleLogout}>Cerrar sesión</button>
                </div>
              </div>
            )}
            {!isLoggedIn ? (
              <Button variant="secondary" onClick={onLoginClick}>Iniciar sesión</Button>
            ) : (
              <div onClick={handleCartClick} className="koxol-navbar__cart">
                <CartIcon count={cartCount} />
              </div>
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

            <li className="koxol-navbar__dropdown">
              <ul className="koxol-navbar__dropdown-menu">
                
                {/* Removed B2B, C2B, B2E, and B2I links */}
              </ul>
            </li>
          </ul>
          
          <div className="koxol-navbar__mobile-actions">
            {!isLoggedIn ? (
              <Button variant="secondary" onClick={() => { onLoginClick(); setMenuOpen(false); }}>
                Iniciar sesión
              </Button>
            ) : (
              <div onClick={() => { handleCartClick(); setMenuOpen(false); }} className="koxol-navbar__cart">
                <CartIcon count={cartCount} />
              </div>
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