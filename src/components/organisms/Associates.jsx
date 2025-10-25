// Organism: Programa de Asociados (cards interactivas)
import React from 'react';
import AssociateCard from '../atoms/AssociateCard';
import './Associates.css';

const associates = [
  {
    icon: <svg width="44" height="44" viewBox="0 0 44 44" fill="none"><circle cx="22" cy="22" r="22" fill="#7FB069"/><path d="M14 30c0-4 4-7 8-7s8 3 8 7" stroke="#fff" strokeWidth="2.5"/><circle cx="22" cy="18" r="5" fill="#fff"/></svg>,
    title: 'Distribuidores',
    desc: 'Únete a nuestra red y lleva K’oxol a más personas.'
  },
  {
    icon: <svg width="44" height="44" viewBox="0 0 44 44" fill="none"><circle cx="22" cy="22" r="22" fill="#D4A574"/><path d="M16 28l6-12 6 12" stroke="#fff" strokeWidth="2.5"/><circle cx="22" cy="32" r="2" fill="#fff"/></svg>,
    title: 'Creadores de Contenido',
    desc: 'Colabora y comparte el mensaje natural de K’oxol.'
  },
  {
    icon: <svg width="44" height="44" viewBox="0 0 44 44" fill="none"><circle cx="22" cy="22" r="22" fill="#2D5016"/><path d="M22 14v16" stroke="#fff" strokeWidth="2.5"/><path d="M14 22h16" stroke="#fff" strokeWidth="2.5"/></svg>,
    title: 'Embajadores',
    desc: 'Sé la cara de K’oxol en tu comunidad.'
  },
  {
    icon: <svg width="44" height="44" viewBox="0 0 44 44" fill="none"><circle cx="22" cy="22" r="22" fill="#7FB069"/><rect x="16" y="16" width="12" height="12" rx="6" fill="#fff"/></svg>,
    title: 'Colaboraciones',
    desc: 'Trabaja con nosotros en proyectos de impacto.'
  }
];

const Associates = () => (
  <section className="koxol-associates" id="asociados">
    <h2 className="koxol-associates__title">Programa de Asociados</h2>
    <div className="koxol-associates__cards">
      {associates.map(a => (
        <AssociateCard key={a.title} {...a} />
      ))}
    </div>
  </section>
);

export default Associates;
