// Organism: Nuestra Historia (timeline + cards)
import React from 'react';
import TimelineItem from '../molecules/TimelineItem';
import StoryCard from '../atoms/StoryCard';
import { FaLeaf, FaSeedling, FaHandsHelping, FaBullseye } from 'react-icons/fa';
import './History.css';

const timeline = [
  { year: '2018', title: 'Nace la idea', text: 'Inspirados por la naturaleza y la salud, comenzamos a crear un repelente realmente natural.' },
  { year: '2019', title: 'Primeros lotes', text: 'Desarrollamos y probamos las primeras fórmulas con familias locales.' },
  { year: '2021', title: 'K’oxol se expande', text: 'Lanzamos nuevos productos y llegamos a más hogares en México.' },
  { year: '2024', title: 'Compromiso sostenible', text: 'Implementamos envases reciclables y alianzas con comunidades.' }
];

const cards = [
  {
    title: 'Misión',
    icon: <FaLeaf color="#2D5016" size={32} />,
    phrase: 'Proteger de forma natural',
    text: 'Nuestro objetivo es ofrecer productos eficaces, elaborados con ingredientes naturales, que cuiden tu salud y el ecosistema.'
  },
  {
    title: 'Visión',
    icon: <FaSeedling color="#7FB069" size={32} />,
    phrase: 'Ser referente en bienestar natural',
    text: 'Aspiramos a que K’oxol sea reconocida a nivel regional (o nacional) como la marca de confianza cuando pienses en soluciones naturales.'
  },
  {
    title: 'Valores',
    icon: <FaHandsHelping color="#D4A574" size={32} />,
    phrase: 'Sostenibilidad, ética, transparencia, comunidad',
    text: 'Creemos en trabajar con respeto al medio ambiente, relaciones honestas y el fortalecimiento de nuestra comunidad local.'
  },
  {
    title: 'Objetivos',
    icon: <FaBullseye color="#FF5733" size={32} />,
    phrase: 'Metas claras y alcanzables',
    text: 'Nos enfocamos en establecer objetivos que impulsen nuestro crecimiento sostenible y fortalezcan nuestra comunidad.'
  }
];

const History = () => (
  <section className="koxol-history" id="historia" style={{ visibility: 'visible', opacity: 1 }}>
    <h2 className="koxol-history__title">Nuestra Historia</h2>
    <div className="koxol-history__timeline">
      {timeline.map((item, i) => (
        <TimelineItem key={item.year} {...item} align={i % 2 === 0 ? 'left' : 'right'} />
      ))}
    </div>
    <div className="koxol-history__cards">
      {cards.map(card => (
        <StoryCard key={card.title} {...card} />
      ))}
    </div>
  </section>
);

export default History;
