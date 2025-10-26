import React from 'react';
import './BenefitCard.css';

const BenefitCard = ({ icon, title, description, extra, emoji, color, index }) => (
  <div 
    className="benefit-card" 
    style={{ animationDelay: `${index * 0.2}s` }}
  >
    <div className="benefit-card__glow" style={{ background: `radial-gradient(circle, ${color}33, transparent)` }}></div>
    <div className="benefit-card__icon-wrapper" style={{ backgroundColor: `${color}20`, borderColor: color }}>
      <div className="benefit-card__emoji">{emoji}</div>
      <div className="benefit-card__icon-bg" style={{ backgroundColor: color }}></div>
    </div>
    <h3 className="benefit-card__title" style={{ color: color }}>{title}</h3>
    <p className="benefit-card__description">{description}</p>
    {extra && (
      <div className="benefit-card__extra-wrapper">
        <div className="benefit-card__divider" style={{ backgroundColor: color }}></div>
        <p className="benefit-card__extra">{extra}</p>
      </div>
    )}
    <div className="benefit-card__corner benefit-card__corner--tl" style={{ borderColor: color }}></div>
    <div className="benefit-card__corner benefit-card__corner--br" style={{ borderColor: color }}></div>
  </div>
);

export default BenefitCard;