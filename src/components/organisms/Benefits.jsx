import React from 'react';
import BenefitCard from '../molecules/BenefitCard';
import './Benefits.css';

const benefits = [
  {
    icon: 'eficaz',
    title: 'Eficaz por 8 horas',
    description: 'Protección contra mosquitos de hasta 8 horas por aplicación, certificada en calidad y eficacia.',
    extra: 'Las pulseras tienen mayor duración gracias a su liberación aromática prolongada. La duración real puede variar según sudoración, actividad y viento.',
    emoji: '⏱️',
    color: '#8BC34A'
  },
  {
    icon: 'sinquimicos',
    title: 'Sin químicos',
    description: 'Elaborados con ingredientes de origen vegetal. Sin DEET, sin colorantes ni fragancias sintéticas añadidas.',
    extra: 'Mantienen su eficacia prevista y cuidan la experiencia en piel y ambiente.',
    emoji: '🌿',
    color: '#66BB6A'
  },
  {
    icon: 'ninos',
    title: 'Apto para niños',
    description: 'Aptos para niños mayores de 3 años, formulados sin DEET y con ingredientes de origen vegetal.',
    extra: 'Úsalos bajo supervisión de un adulto: aplica primero en tus manos y luego en la piel del menor, evitando ojos, boca y heridas.',
    emoji: '👶',
    color: '#A1887F'
  }
];

const Benefits = () => (
  <section className="koxol-benefits" id="beneficios">
    <div className="koxol-benefits__background-shapes">
      <div className="shape shape-1"></div>
      <div className="shape shape-2"></div>
      <div className="shape shape-3"></div>
    </div>
    
    <div className="koxol-benefits__wrapper">
      <div className="koxol-benefits__header">
        <h2 className="koxol-benefits__title">¿Por qué elegir Koxol?</h2>
        <p className="koxol-benefits__subtitle">Protección natural y efectiva para toda tu familia</p>
      </div>
      
      <div className="koxol-benefits__container">
        {benefits.map((b, i) => (
          <BenefitCard 
            key={b.title} 
            icon={b.icon} 
            title={b.title} 
            description={b.description}
            extra={b.extra}
            emoji={b.emoji}
            color={b.color}
            index={i}
          />
        ))}
      </div>
      
      <div className="koxol-benefits__badge">
        <div className="badge-pulse"></div>
        <span className="badge-icon">✓</span>
        <p>Productos certificados en calidad y eficacia</p>
      </div>
    </div>
  </section>
);

export default Benefits;