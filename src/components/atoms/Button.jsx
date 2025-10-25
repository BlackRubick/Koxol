// Atoms: Botón premium reutilizable
import React from 'react';
import './Button.css';

const Button = ({ children, onClick, variant = 'primary', ...props }) => (
  <button className={`koxol-btn koxol-btn--${variant}`} onClick={onClick} {...props}>
    {children}
  </button>
);

export default Button;
