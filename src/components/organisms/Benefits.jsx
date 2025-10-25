import React from 'react';
import BenefitCard from '../molecules/BenefitCard';
import './Benefits.css';

const benefits = [
  {
    icon: 'natural',
    title: 'Natural',
    description: 'Hecho con citronela y aceites esenciales, sin tóxicos.'
  },
  {
    icon: 'eficaz',
    title: 'Eficaz por 8 horas',
    description: 'Protección comprobada durante toda tu jornada.'
  },
  {
    icon: 'sinquimicos',
    title: 'Sin químicos',
    description: 'Seguro para tu piel y el ambiente, sin ingredientes dañinos.'
  },
  {
    icon: 'ninos',
    title: 'Apto para niños',
    description: 'Fórmula suave y confiable para toda la familia.'
  }
];

const Benefits = () => (
  <section className="koxol-benefits" id="beneficios">
    <div className="koxol-benefits__wrapper">
      <h2 className="koxol-benefits__title">Beneficios</h2>
      <div className="koxol-benefits__container">
        {benefits.map((b, i) => (
          <BenefitCard key={b.title} icon={b.icon} title={b.title} description={b.description} />
        ))}
      </div>
    </div>
  </section>
);

export default Benefits;