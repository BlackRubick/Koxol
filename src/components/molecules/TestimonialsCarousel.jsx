// Molecule: Carrusel de testimonios
import React, { useRef, useEffect, useState } from 'react';
import TestimonialCard from '../atoms/TestimonialCard';
import './TestimonialsCarousel.css';

const CARDS_PER_VIEW = 4;

const TestimonialsCarousel = ({ testimonials }) => {
  const [index, setIndex] = useState(0);
  const total = testimonials.length;
  const maxIndex = Math.max(0, total - CARDS_PER_VIEW);
  const trackRef = useRef(null);

  // Auto-scroll cada 4s
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex(i => (i + CARDS_PER_VIEW > maxIndex ? 0 : i + CARDS_PER_VIEW));
    }, 4000);
    return () => clearInterval(interval);
  }, [maxIndex]);

  // Animación de desplazamiento horizontal
  useEffect(() => {
    if (trackRef.current) {
      trackRef.current.style.transition = 'transform 0.7s cubic-bezier(.4,0,.2,1)';
      trackRef.current.style.transform = `translateX(-${(index / total) * 100}%)`;
    }
  }, [index, total]);

  return (
    <div className="testimonials-carousel">
      <div className="testimonials-carousel__track-wrapper">
        <div className="testimonials-carousel__track" ref={trackRef} style={{width: `${(total / CARDS_PER_VIEW) * 100}%`}}>
          {testimonials.map((t, i) => (
            <div className="testimonial-slide" key={t.name + i} style={{width: `${100 / total}%`}}>
              <TestimonialCard {...t} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TestimonialsCarousel;
