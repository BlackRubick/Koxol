// Molecule: Card de membresía premium
import React from 'react';
import Button from '../atoms/Button';
import './MembershipCard.css';

const MembershipCard = ({ name, price, priceYear, yearly, benefits, accent, featured, selected, onSelect }) => (
  <div
    className={`membership-card${featured ? ' featured' : ''}${selected ? ' selected' : ''}`}
    style={{
      ...(selected ? {borderColor: '#2D5016', boxShadow: '0 0 0 2px #2D5016'} : accent ? {borderColor: accent} : {}),
      cursor: 'pointer',
    }}
    onClick={onSelect}
    tabIndex={0}
    role="button"
    aria-pressed={selected}
  >
    <h3 className="membership-card__name">{name}</h3>
    <div className="membership-card__price">
      <span className="membership-card__amount">${yearly ? priceYear : price} <span className="membership-card__period">{yearly ? 'MXN/año' : 'MXN/mes'}</span></span>
    </div>
    <ul className="membership-card__benefits">
      {benefits.map(b => <li key={b}>{b}</li>)}
    </ul>
  <Button variant={selected ? 'primary' : 'secondary'}>Elegir</Button>
  </div>
);

export default MembershipCard;
