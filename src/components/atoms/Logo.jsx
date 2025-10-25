// Atom: Logo de K'oxol
import React from 'react';
import './Logo.css';

const Logo = () => (
  <div className="koxol-logo">
    {/* Puedes reemplazar el SVG por el logo real de K'oxol cuando lo tengas */}
    <svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="22" cy="22" r="22" fill="#2D5016"/>
      <text x="50%" y="55%" textAnchor="middle" fill="#fff" fontSize="18" fontFamily="Inter, Arial" dy=".3em">K’</text>
    </svg>
  </div>
);

export default Logo;
