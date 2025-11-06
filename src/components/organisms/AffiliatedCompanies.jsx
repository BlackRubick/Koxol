import React from 'react';
import './AffiliatedCompanies.css';

const AffiliatedCompanies = () => {
  const companies = [
    { name: 'Walmart', logo: 'public/Walmart.png', style: { marginTop: '50px' } },
    { name: 'HEB', logo: '/heb.jpeg' },
    { name: 'Chedraui', logo: '/chedraui.jpeg' },
  ];

  return (
    <section className="affiliated-companies">
      <h2>Encuentra Nuestros Productos Aqui</h2>
      <div className="companies-list">
        {companies.map((company, index) => (
          <div key={index} className="company-card">
            <img 
              src={index === 0 ? '/wallmart.jpeg' : index === 1 ? '/heb.jpeg' : company.logo} 
              alt={`${company.name} logo`} 
              className="company-logo" 
              style={company.style || {}} 
            />
          </div>
        ))}
      </div>

      {/* Sección de afiliados con productos enviados */}
      <h3 style={{ marginTop: '2rem' }}>Afiliados y Productos</h3>
      <div className="affiliates-list">
        {/* Producto 1 - Alberca Intex */}
        <div className="affiliate-card">
          <img src="/afiliados1.jpg" alt="Alberca Intex" className="affiliate-image" />
          <div className="affiliate-info">
            <h4>Alberca Estructural Intex</h4>
            <p>Alberca estructural Intex Metal Frame 1.6 m de ancho — perfecta para tu familia.</p>
            <a className="affiliate-cta" href="https://www.mercadolibre.com.mx/p/MLM15306177?pdp_filters=item_id:MLM1306092072#origin=share&sid=share&wid=MLM1306092072&action=whatsapp" target="_blank" rel="noopener noreferrer">Ver en Mercado Libre</a>
          </div>
        </div>

        {/* Producto 2 - Disfraz inflable alien */}
        <div className="affiliate-card">
          <img src="/afiliados2.jpeg" alt="Disfraz inflable Alien" className="affiliate-image" />
          <div className="affiliate-info">
            <h4>Disfraz Inflable Alien</h4>
            <p>Disfraz Cosplay Inflable con LED, ideal para Halloween y eventos divertidos.</p>
            <a className="affiliate-cta" href="https://articulo.mercadolibre.com.mx/MLM-3852716282#origin=share&sid=share&action=whatsapp" target="_blank" rel="noopener noreferrer">Ver en Mercado Libre</a>
          </div>
        </div>

        {/* Producto 3 - Asador */}
        <div className="affiliate-card">
          <img src="/afiliados3.jpg" alt="Asador Coraza Acero Inoxidable" className="affiliate-image" />
          <div className="affiliate-info">
            <h4>Asador Gas Coraza Acero Inoxidable</h4>
            <p>Asador a gas de 3 quemadores, coraza de acero inoxidable. Nuevo en caja.</p>
            <a className="affiliate-cta" href="https://www.mercadolibre.com.mx/up/MLMU2969388648?pdp_filters=item_id:MLM2223140861#origin=share&sid=share&wid=MLM2223140861&action=whatsapp" target="_blank" rel="noopener noreferrer">Ver en Mercado Libre</a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AffiliatedCompanies;