import React from 'react';
import './AffiliatedCompanies.css';

const AffiliatedCompanies = () => {
  const companies = [
    { name: 'Walmart', logo: '/Walmart.png', style: { marginTop: '50px' } },
    { name: 'HEB', logo: '/heb.png' },
    { name: 'Chedraui', logo: '/chedraui.jpeg' },
  ];

  return (
    <section className="affiliated-companies">
      <h2>Encuentra Nuestros Productos Aqui</h2>
      <div className="companies-list">
        {companies.map((company, index) => (
          <div key={index} className="company-card">
            <img src={company.logo} alt={`${company.name} logo`} className="company-logo" style={company.style || {}} />
          </div>
        ))}
      </div>
    </section>
  );
};

export default AffiliatedCompanies;