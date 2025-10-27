import React from 'react';
import TestimonialsCarousel from '../molecules/TestimonialsCarousel';
import './Testimonials.css';

const testimonials = [
  {
    name: 'Fernando Ruiz Méndez',
    photo: 'https://randomuser.me/api/portraits/men/32.jpg',
    text: 'Probé el spray repelente de 250 ml en un evento al aire libre y me funcionó excelente. Cumple con estándares de eficacia de hasta 8 horas: estuve toda la tarde sin picaduras y noté claramente que sí aleja a los mosquitos. El aroma es fresco y no deja sensación pegajosa.',
    rating: 5,
    product: '🧴 Spray 250ml'
  },
  {
    name: 'Itzel Ramírez Castañeda',
    photo: 'https://randomuser.me/api/portraits/women/44.jpg',
    text: 'La crema repelente de 180 ml me encantó porque hidrata y protege. En mi experiencia, mantuvo su eficacia hasta por 8 horas, justo como se espera en un buen repelente, y realmente mantiene a los mosquitos lejos. La textura es ligera y se absorbe rápido.',
    rating: 5,
    product: '💆 Crema 180ml'
  },
  {
    name: 'Carlos Villalobos Pérez',
    photo: 'https://randomuser.me/api/portraits/men/41.jpg',
    text: 'Con la loción antimosquitos de 300 ml me fue muy bien durante una jornada larga en terraza. Noté una protección constante de hasta 8 horas y sí ahuyenta a los moscos de forma notoria. Fácil de reaplicar si hace mucho calor, pero casi no lo necesité.',
    rating: 5,
    product: '🧴 Loción 300ml'
  },
  {
    name: 'Valeria Gómez Pineda',
    photo: 'https://randomuser.me/api/portraits/women/65.jpg',
    text: 'Me decidí por K\'oxol porque buscaba algo sin químicos sintéticos. Revisé la etiqueta y efectivamente es sin DEET y sin perfumes artificiales. Huele natural a citronela y me funcionó perfecto en la tarde, sin irritación.',
    rating: 5,
    product: '🌿 Sin Químicos'
  },
  {
    name: 'Héctor Morales Córdova',
    photo: 'https://randomuser.me/api/portraits/men/55.jpg',
    text: 'Tengo la piel sensible y estos productos me cayeron muy bien. Se nota que no usan químicos sintéticos agresivos; la lista de ingredientes es corta y de origen vegetal. Protegen y el aroma no marea.',
    rating: 5,
    product: '✅ Piel Sensible'
  },
  {
    name: 'Nadia Torres Zúñiga',
    photo: 'https://randomuser.me/api/portraits/women/23.jpg',
    text: 'En casa preferimos opciones más naturales. La esencia y el spray no traen químicos sintéticos y eso nos encanta. El olor es limpio, de citronela real, y ayuda a mantener a los mosquitos lejos sin perfumes artificiales.',
    rating: 5,
    product: '🏡 Para el Hogar'
  },
  {
    name: 'Alejandra Núñez Robles',
    photo: 'https://randomuser.me/api/portraits/women/68.jpg',
    text: 'Elegimos la crema para mi hijo de 5 años y fue perfecta: no le irritó y el aroma es suave. Me da tranquilidad que sea sin DEET y apta para mayores de 3 años.',
    rating: 5,
    product: '👶 Apto para Niños'
  },
  {
    name: 'Diego Herrera Castell',
    photo: 'https://randomuser.me/api/portraits/men/77.jpg',
    text: 'Con el spray seguimos la indicación de aplicar yo primero en mis manos y luego en la piel del niño. Cero molestias y menos mosquitos en el parque. Ideal para pequeños.',
    rating: 5,
    product: '👨‍👩‍👧 Familia'
  },
  {
    name: 'Jimena Salgado Varela',
    photo: 'https://randomuser.me/api/portraits/women/37.jpg',
    text: 'La loción nos funcionó muy bien en la escuela y en paseos. Al ser sin DEET, mi niña de 6 años no tuvo picazón y se mantuvo protegida. Fácil de usar y amigable con su piel.',
    rating: 5,
    product: '🎒 Escuela y Paseos'
  }
];

const Testimonials = () => (
  <section className="koxol-testimonials" id="testimonios">
    <div className="koxol-testimonials__background">
      <div className="testimonial-shape testimonial-shape--1"></div>
      <div className="testimonial-shape testimonial-shape--2"></div>
      <div className="testimonial-shape testimonial-shape--3"></div>
    </div>
    
    <div className="koxol-testimonials__header">
      <div className="testimonials-badge">
        <span className="testimonials-badge__icon">💬</span>
        <span className="testimonials-badge__text">Testimonios Reales</span>
      </div>
      <h2 className="koxol-testimonials__title">
        Lo que dicen nuestros <span className="title-highlight">clientes</span>
      </h2>
      <p className="koxol-testimonials__subtitle">
        Más de 1,000 familias confían en K'oxol para su protección natural
      </p>
    </div>
    
    <TestimonialsCarousel testimonials={testimonials.slice(0, window.innerWidth > 480 ? testimonials.length : 3)} />
    
    <div className="koxol-testimonials__stats">
      <div className="stat-item" style={{ animationDelay: '0s' }}>
        <div className="stat-number" style={{ color: 'black' }}>4.9</div>
        <div className="stat-label" style={{ color: 'black' }}>⭐ Calificación</div>
      </div>
      <div className="stat-item" style={{ animationDelay: '0.2s' }}>
        <div className="stat-number" style={{ color: 'black' }}>1,200+</div>
        <div className="stat-label" style={{ color: 'black' }}>📝 Reseñas</div>
      </div>
      <div className="stat-item" style={{ animationDelay: '0.4s' }}>
        <div className="stat-number" style={{ color: 'black' }}>98%</div>
        <div className="stat-label" style={{ color: 'black' }}>💚 Satisfacción</div>
      </div>
    </div>
  </section>
);

export default Testimonials;