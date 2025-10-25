// Molecule: Timeline/parallax para historia
import React from 'react';
import './TimelineItem.css';

const TimelineItem = ({ year, title, text, align = 'left' }) => (
  <div className={`timeline-item timeline-item--${align}`}>
    <div className="timeline-item__dot" />
    <div className="timeline-item__content">
      <span className="timeline-item__year">{year}</span>
      <h4 className="timeline-item__title">{title}</h4>
      <p className="timeline-item__text">{text}</p>
    </div>
  </div>
);

export default TimelineItem;
