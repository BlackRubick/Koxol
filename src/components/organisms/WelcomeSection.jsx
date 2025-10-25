// Organismo: Sección de Bienvenida
import React from 'react';
import './WelcomeSection.css';

const WelcomeSection = () => {
  return (
    <section className="welcome-section">
      <div className="welcome-section__content">
        <img
          src="/logo.jpg"
          alt="Logo de K’oxol"
          className="welcome-section__logo"
        />
        <h2 className="welcome-section__title">Bienvenido al Mundo de K’oxol</h2>
        <p className="welcome-section__intro">
          Bienvenido al Mundo de K’oxol, el espacio donde convertimos la ciencia
          cotidiana en decisiones fáciles: cremas, lociones, sprays, velas y
          pulseras con base citronela + alcohol para disfrutar exterior sin
          drama. Aquí aprenderás a elegir formatos, usarlos bien y combinarlos
          según tu plan del día.
        </p>
      </div>
    </section>
  );
};

export default WelcomeSection;