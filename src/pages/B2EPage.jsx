import React from 'react';
import './B2EPage.css';

const B2EPage = () => {
  return (
    <section className="b2e-page">
      <div className="b2e-page__container">
        <h1 className="b2e-page__title">Para nuestros empleados</h1>
        <p className="b2e-page__description">
          Accede a descuentos exclusivos y beneficios especiales.
        </p>
        <a
          href="https://meet.google.com/ysj-wwoq-xxq"
          target="_blank"
          rel="noopener noreferrer"
          className="b2e-page__meet-link"
        >
          Conéctate con nosotros en Meet
        </a>
      </div>
    </section>
  );
};

export default B2EPage;