// Atom: Card flotante de testimonio
import React from 'react';
import './TestimonialCard.css';

const TestimonialCard = ({ name, photo, text, rating }) => (
  <div className="testimonial-card">
    <img src={photo} alt={name} className="testimonial-card__photo" />
    <div className="testimonial-card__stars">
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} className={i < rating ? 'star filled' : 'star'}>★</span>
      ))}
    </div>
    <p className="testimonial-card__text">“{text}”</p>
    <span className="testimonial-card__name">{name}</span>
  </div>
);

export default TestimonialCard;
