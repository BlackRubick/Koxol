import React from 'react';
import './B2BPage.css';

const B2BPage = () => {
  return (
    <section className="b2b-page">
      <div className="b2b-page__container">
        <h1 className="b2b-page__title">Únete a ser nuestro socio empresarial</h1>
        <p className="b2b-page__description">
          Conviértete en parte de nuestra red empresarial y colabora con nosotros para llevar nuestros productos a más personas.
        </p>
        <a
          href="https://meet.google.com/ysj-wwoq-xxq"
          target="_blank"
          rel="noopener noreferrer"
          className="b2b-page__meet-link"
        >
          Conéctate con nosotros en Meet
        </a>
        <div className="b2b-page__images">
          <img src="/images/company1.jpg" alt="Empresa 1" className="b2b-page__image" />
          <img src="/images/company2.jpg" alt="Empresa 2" className="b2b-page__image" />
        </div>
      </div>
    </section>
  );
};

export default B2BPage;