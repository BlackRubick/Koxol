// Atom: Ícono animado para beneficio clave
import React from 'react';
import './BenefitIcon.css';

const icons = {
  natural: (
    <svg width="44" height="44" viewBox="0 0 44 44" fill="none"><circle cx="22" cy="22" r="22" fill="#7FB069"/><path d="M22 32c-6-4-8-8-8-12 0-4 3-7 8-7s8 3 8 7c0 4-2 8-8 12z" fill="#fff"/></svg>
  ),
  eficaz: (
    <svg width="44" height="44" viewBox="0 0 44 44" fill="none"><circle cx="22" cy="22" r="22" fill="#D4A574"/><path d="M22 13v10l7 4" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"/></svg>
  ),
  sinquimicos: (
    <svg width="44" height="44" viewBox="0 0 44 44" fill="none"><circle cx="22" cy="22" r="22" fill="#2D5016"/><rect x="14" y="20" width="16" height="8" rx="4" fill="#fff"/><line x1="16" y1="22" x2="28" y2="26" stroke="#D4A574" strokeWidth="2.5"/></svg>
  ),
  ninos: (
    <svg width="44" height="44" viewBox="0 0 44 44" fill="none"><circle cx="22" cy="22" r="22" fill="#7FB069"/><circle cx="22" cy="20" r="6" fill="#fff"/><rect x="16" y="28" width="12" height="4" rx="2" fill="#D4A574"/></svg>
  )
};

const BenefitIcon = ({ type }) => (
  <span className={`benefit-icon benefit-icon--${type}`}>
    {icons[type]}
  </span>
);

export default BenefitIcon;
