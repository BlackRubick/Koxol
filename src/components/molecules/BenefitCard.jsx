// Molecule: Card de beneficio clave
import React from 'react';
import BenefitIcon from '../atoms/BenefitIcon';
import './BenefitCard.css';

const BenefitCard = ({ icon, title, description }) => (
  <div className="benefit-card">
    <BenefitIcon type={icon} />
    <h3 className="benefit-card__title">{title}</h3>
    <p className="benefit-card__desc">{description}</p>
  </div>
);

export default BenefitCard;
