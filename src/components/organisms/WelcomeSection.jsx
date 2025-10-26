import React, { useEffect, useRef } from 'react';
import './WelcomeSection.css';

const WelcomeSection = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (sectionRef.current) {
        const scrolled = window.scrollY;
        const parallaxElements = sectionRef.current.querySelectorAll('.parallax-element');
        parallaxElements.forEach((el, index) => {
          const speed = (index + 1) * 0.2;
          el.style.transform = `translateY(${scrolled * speed}px)`;
        });
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section className="welcome-section" ref={sectionRef}>
      {/* Elementos decorativos animados */}
      <div className="welcome-section__decorations">
        <div className="decoration-circle decoration-circle--1 parallax-element"></div>
        <div className="decoration-circle decoration-circle--2 parallax-element"></div>
        <div className="decoration-circle decoration-circle--3 parallax-element"></div>
        <div className="decoration-leaf decoration-leaf--1">🌿</div>
        <div className="decoration-leaf decoration-leaf--2">🍃</div>
        <div className="decoration-leaf decoration-leaf--3">🌱</div>
        <div className="decoration-leaf decoration-leaf--4">🦟</div>
        <div className="decoration-leaf decoration-leaf--5">✨</div>
      </div>

      {/* Ondas de fondo animadas */}
      <div className="wave-container">
        <svg className="wave wave-1" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"></path>
        </svg>
        <svg className="wave wave-2" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"></path>
        </svg>
      </div>

      <div className="welcome-section__content">
        {/* Logo con efectos especiales */}
        <div className="welcome-section__logo-container">
          <div className="logo-glow"></div>
          <div className="logo-ring logo-ring--1"></div>
          <div className="logo-ring logo-ring--2"></div>
          <img
            src="/logo.jpg"
            alt="Logo de K'oxol"
            className="welcome-section__logo"
          />
        </div>

        {/* Título con efecto de brillo */}
        <div className="welcome-section__title-wrapper">
          <h2 className="welcome-section__title">
            <span className="title-word" style={{ animationDelay: '0s' }}>Bienvenido</span>
            <span className="title-word" style={{ animationDelay: '0.2s' }}>al</span>
            <span className="title-word" style={{ animationDelay: '0.4s' }}>Mundo</span>
            <span className="title-word" style={{ animationDelay: '0.6s' }}>de</span>
            <span className="title-word title-word--highlight" style={{ animationDelay: '0.8s' }}>K'oxol</span>
          </h2>
          <div className="title-underline"></div>
        </div>

        {/* Texto introductorio con efecto de aparición */}
        <div className="welcome-section__intro-wrapper">
          <div className="intro-icon">🌿</div>
          <p className="welcome-section__intro">
            El espacio donde convertimos la <strong>ciencia cotidiana</strong> en decisiones fáciles: 
            cremas, lociones, sprays, velas y pulseras con base <span className="highlight-text">citronela + alcohol</span> para 
            disfrutar el exterior sin drama.
          </p>
          <p className="welcome-section__intro-secondary">
            Aquí aprenderás a elegir formatos, usarlos bien y combinarlos según tu plan del día.
          </p>
        </div>

        {/* Características destacadas */}
        <div className="welcome-section__features">
          <div className="feature-badge" style={{ animationDelay: '1s' }}>
            <span className="feature-icon">🛡️</span>
            <span className="feature-text">Protección Natural</span>
          </div>
          <div className="feature-badge" style={{ animationDelay: '1.2s' }}>
            <span className="feature-icon">⏱️</span>
            <span className="feature-text">8 Horas</span>
          </div>
          <div className="feature-badge" style={{ animationDelay: '1.4s' }}>
            <span className="feature-icon">👨‍👩‍👧‍👦</span>
            <span className="feature-text">Para Toda la Familia</span>
          </div>
        </div>

      </div>

    </section>
  );
};

export default WelcomeSection;