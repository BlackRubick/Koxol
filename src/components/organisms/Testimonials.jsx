// Organism: Testimonios (cards flotantes en carrusel)
import React from 'react';
import TestimonialsCarousel from '../molecules/TestimonialsCarousel';
import './Testimonials.css';

const testimonials = [
  {
    name: 'María López',
    photo: 'https://randomuser.me/api/portraits/women/44.jpg',
    text: '¡Por fin un repelente que no huele feo y sí funciona! Mis hijos lo usan diario.',
    rating: 5
  },
  {
    name: 'Carlos Méndez',
    photo: 'https://randomuser.me/api/portraits/men/32.jpg',
    text: 'Me encanta que sea natural y no me irrita la piel. Lo recomiendo mucho.',
    rating: 5
  },
  {
    name: 'Ana Torres',
    photo: 'https://randomuser.me/api/portraits/women/65.jpg',
    text: 'Las velas y esencias son un must en mi casa. ¡Amo el aroma y la protección!',
    rating: 5
  },
  {
    name: 'Luis García',
    photo: 'https://randomuser.me/api/portraits/men/41.jpg',
    text: 'La membresía vale cada peso. El envío gratis y los descuentos son top.',
    rating: 5
  },
  {
    name: 'Fernanda Ruiz',
    photo: 'https://randomuser.me/api/portraits/women/68.jpg',
    text: 'Me siento segura usando K’oxol con mis hijos pequeños.',
    rating: 5
  },
  {
    name: 'Jorge Salinas',
    photo: 'https://randomuser.me/api/portraits/men/55.jpg',
    text: 'El aroma es delicioso y realmente funciona contra los mosquitos.',
    rating: 5
  },
  {
    name: 'Paola Jiménez',
    photo: 'https://randomuser.me/api/portraits/women/23.jpg',
    text: 'Las pulseras son súper prácticas y bonitas, las uso diario.',
    rating: 5
  },
  {
    name: 'Ricardo Pérez',
    photo: 'https://randomuser.me/api/portraits/men/77.jpg',
    text: 'Me gusta que sea ecológico y cuide el ambiente.',
    rating: 5
  },
  {
    name: 'Sofía Martínez',
    photo: 'https://randomuser.me/api/portraits/women/12.jpg',
    text: 'La crema es suave y no deja sensación pegajosa.',
    rating: 5
  },
  {
    name: 'Miguel Ángel',
    photo: 'https://randomuser.me/api/portraits/men/88.jpg',
    text: 'Ideal para llevar de viaje, lo recomiendo mucho.',
    rating: 5
  },
  {
    name: 'Valeria Castro',
    photo: 'https://randomuser.me/api/portraits/women/37.jpg',
    text: 'El mejor repelente natural que he probado.',
    rating: 5
  },
  {
    name: 'Andrés Gómez',
    photo: 'https://randomuser.me/api/portraits/men/19.jpg',
    text: 'Excelente atención y productos de calidad premium.',
    rating: 5
  }
];

const Testimonials = () => (
  <section className="koxol-testimonials" id="testimonios">
    <h2 className="koxol-testimonials__title">Testimonios</h2>
    <TestimonialsCarousel testimonials={testimonials} />
  </section>
);

export default Testimonials;
