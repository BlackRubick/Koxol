// Atom: Toggle mensual/anual animado
import React from 'react';
import './BillingToggle.css';

const BillingToggle = ({ yearly, onToggle }) => (
  <div className="billing-toggle" onClick={onToggle} role="button" tabIndex={0}>
    <span className={!yearly ? 'active' : ''}>Mensual</span>
    <div className={`toggle-switch${yearly ? ' yearly' : ''}`}></div>
    <span className={yearly ? 'active' : ''}>Anual</span>
  </div>
);

export default BillingToggle;
