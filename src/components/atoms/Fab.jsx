import React from 'react';
import './Fab.css';

const Fab = ({ className = '', size = 64, onClick, children, ariaLabel }) => {
  // Inline width/height ensure the element cannot be resized by global rules
  const style = {
    '--fab-size': `${size}px`,
    width: `${size}px`,
    height: `${size}px`,
    minWidth: `${size}px`,
    minHeight: `${size}px`,
    padding: 0,
    boxSizing: 'border-box'
  };

  return (
    <button
      className={`koxol-fab ${className}`}
      onClick={onClick}
      aria-label={ariaLabel}
      style={style}
    >
      {children}
    </button>
  );
};

export default Fab;
