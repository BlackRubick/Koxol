// Organism: Footer premium K'oxol
import React from 'react';
import './Footer.css';

const Footer = () => (
  <footer className="koxol-footer">
    <div className="koxol-footer__main">
      <div className="koxol-footer__brand">
        <span className="koxol-footer__logo">K’oxol</span>
        <p className="koxol-footer__slogan">Protección natural premium</p>
      </div>
      <div className="koxol-footer__links">
        <a href="https://www.facebook.com/share/17TdZzrp5P/?mibextid=wwXIfr" target="_blank" rel="noopener" aria-label="Facebook" className="social fb">Facebook</a>
        <a href="https://www.instagram.com/koxol_repelente?igsh=MW1wZjk5cG5wZWptZg==" target="_blank" rel="noopener" aria-label="Instagram" className="social ig">Instagram</a>
        <a href="https://www.tiktok.com/@koxolrepelestedemosquito?_t=ZS-90S4bBb117s&_r=1" target="_blank" rel="noopener" aria-label="TikTok" className="social tk">TikTok</a>
      </div>
      <div className="koxol-footer__contact">
        <p>Blvd. Belisario Domínguez Km. 1081, Tuxtla Gutiérrez, Chiapas</p>
        <p>Email: <a href="mailto:corporativo_equipo5@outlook.com">corporativo_equipo5@outlook.com</a></p>
        <p>Tel: <a href="tel:+529616674502">+52 961 667 4502</a></p>
      </div>
    </div>
    <div className="koxol-footer__bottom">
      <a href="/politica.html" className="footer-link" target="_blank" rel="noopener">Política de Privacidad</a>
      <a href="#" className="footer-link">Términos y Condiciones</a>
      <span>© {new Date().getFullYear()} K’oxol. Todos los derechos reservados.</span>
    </div>
  </footer>
);

export default Footer;
