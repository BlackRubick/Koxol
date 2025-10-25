// Atom: Card interactiva para asociado
import React from 'react';
import './AssociateCard.css';

const AssociateCard = ({ icon, title, desc }) => (
  <div className="associate-card">
    <div className="associate-card__icon">{icon}</div>
    <h4 className="associate-card__title">{title}</h4>
    <p className="associate-card__desc">{desc}</p>
  </div>
);

export default AssociateCard;
