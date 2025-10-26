import React from 'react';
import './B2IPage.css';

const B2IPage = () => {
  return (
    <section className="b2i-page">
      <div className="b2i-page__container">
        <h1 className="b2i-page__title">Para nuestros inversionistas</h1>
        <p className="b2i-page__description">
          Contáctanos para explorar oportunidades de inversión y colaboración.
        </p>
        <a
          href="https://meet.google.com/ysj-wwoq-xxq"
          target="_blank"
          rel="noopener noreferrer"
          className="b2i-page__meet-link"
        >
          Conéctate con nosotros en Meet
        </a>
      </div>
    </section>
  );
};

export default B2IPage;