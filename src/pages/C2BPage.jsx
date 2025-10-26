import React, { useState } from 'react';
import './C2BPage.css';

const C2BPage = () => {
  const [discountCode, setDiscountCode] = useState('');

  const handleGenerateCode = () => {
    setDiscountCode('DESCUENTO20');
  };

  return (
    <section className="c2b-page">
      <div className="c2b-page__container">
        <h1 className="c2b-page__title">Crea reseñas y videos recomendando nuestros productos</h1>
        <p className="c2b-page__description">
          Comparte tu experiencia con nuestros productos y recibe un premio especial.
        </p>
        <button className="c2b-page__button" onClick={handleGenerateCode}>
          Generar Código de Descuento
        </button>
        {discountCode && (
          <div className="c2b-page__discount">
            <p>Tu código de descuento:</p>
            <strong>{discountCode}</strong>
          </div>
        )}
      </div>
    </section>
  );
};

export default C2BPage;