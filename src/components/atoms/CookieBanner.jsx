import React, { useState } from 'react';
import './CookieBanner.css';

export default function CookieBanner() {
  const [visible, setVisible] = useState(true);

  const handleAccept = () => {
    setVisible(false);
  };
  const handleReject = () => {
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="cookie-banner">
      <div className="cookie-banner__content">
        <span className="cookie-banner__text">
          Utilizamos cookies para mejorar tu experiencia y analizar el uso del sitio. Puedes aceptar o rechazar el uso de cookies no esenciales.
        </span>
        <div className="cookie-banner__actions">
          <button className="cookie-banner__btn accept" onClick={handleAccept}>Aceptar</button>
          <button className="cookie-banner__btn reject" onClick={handleReject}>Rechazar</button>
        </div>
      </div>
    </div>
  );
}
