import React from 'react';
import { useNavigate } from 'react-router-dom';
import './EmpresaPage.css';

const EmpresaPage = () => {
  const navigate = useNavigate();

  return (
    <div className="empresa-page">
      <h1 className="empresa-page__title">Modelos de Empresa</h1>
      <div className="empresa-page__sections">
        <div className="empresa-page__section" onClick={() => navigate('/b2b')}>
          <h2>B2B</h2>
          <p>Modelo de negocio entre empresas.</p>
        </div>
        <div className="empresa-page__section" onClick={() => navigate('/c2b')}>
          <h2>C2B</h2>
          <p>Modelo de negocio de consumidor a empresa.</p>
        </div>
        <div className="empresa-page__section" onClick={() => navigate('/b2e')}>
          <h2>B2E</h2>
          <p>Modelo de negocio entre empresa y empleados.</p>
        </div>
        <div className="empresa-page__section" onClick={() => navigate('/b2i')}>
          <h2>B2I</h2>
          <p>Modelo de negocio entre empresa e instituciones.</p>
        </div>
      </div>
    </div>
  );
};

export default EmpresaPage;