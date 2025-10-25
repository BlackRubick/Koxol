// Organismo: Servicio al Cliente K'oxol
import React from 'react';
import './CustomerService.css';
import { FaWhatsapp, FaEnvelope, FaQuestionCircle } from 'react-icons/fa';

const CustomerService = () => (
  <section className="koxol-customer-service" id="servicio">
    <h2 className="koxol-customer-service__title">¿Necesitas ayuda? <span>Servicio al Cliente</span></h2>
    <p className="koxol-customer-service__desc">
      Nuestro equipo está listo para apoyarte antes, durante y después de tu compra. Elige el canal que prefieras y recibe atención personalizada:
    </p>
    <div className="koxol-customer-service__channels">
      <div className="customer-channel">
        <FaWhatsapp className="customer-channel__icon whatsapp" />
        <h3>WhatsApp</h3>
        <p>Atención rápida y directa. Escríbenos al <a href="https://wa.me/529616674502" target="_blank" rel="noopener">+52 961 667 4502</a></p>
      </div>
      <div className="customer-channel">
        <FaEnvelope className="customer-channel__icon email" />
        <h3>Email</h3>
        <p>Respuestas detalladas y seguimiento. <a href="mailto:corporativo_equipo5@outlook.com">corporativo_equipo5@outlook.com</a></p>
      </div>
      <div className="customer-channel">
        <FaQuestionCircle className="customer-channel__icon faq" />
        <h3>FAQ</h3>
        <p>Consulta las <a href="#faq">preguntas frecuentes</a> para resolver tus dudas al instante.</p>
      </div>
    </div>
    <div className="koxol-customer-service__contact-info">
      <p><strong>Dirección:</strong> Blvd. Belisario Domínguez Km. 1081, Tuxtla Gutiérrez, Chiapas</p>
      <p><strong>Email:</strong> <a href="mailto:corporativo_equipo5@outlook.com">corporativo_equipo5@outlook.com</a></p>
      <p><strong>Tel:</strong> <a href="tel:+529616674502">+52 961 667 4502</a></p>
    </div>
    <div className="koxol-customer-service__cta">
      <a href="https://wa.me/529616674502" target="_blank" rel="noopener" className="customer-service__button">Contactar por WhatsApp</a>
      <a href="mailto:corporativo_equipo5@outlook.com" className="customer-service__button alt">Enviar Email</a>
    </div>
  </section>
);

export default CustomerService;
