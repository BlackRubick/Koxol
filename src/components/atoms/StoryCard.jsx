// Atom: Card elegante para misión, visión o valor
import React from 'react';
import './StoryCard.css';

const StoryCard = ({ title, icon, phrase, text }) => (
  <div className="story-card">
    <div className="story-card__icon">{icon}</div>
    <h4 className="story-card__title">{title}</h4>
    <div className="story-card__phrase">{phrase}</div>
    <p className="story-card__text">{text}</p>
  </div>
);

export default StoryCard;
