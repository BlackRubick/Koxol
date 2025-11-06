// Organismo: Fidelización / Lealtad K'oxol
import React from 'react';
import './Loyalty.css';
import { FaGift, FaStar, FaLeaf } from 'react-icons/fa';

const loyaltyBenefits = [
  {
    icon: <FaGift className="loyalty-benefit__icon" />,
    title: 'Puntos por cada compra',
    desc: 'Acumula puntos cada vez que compras productos K’oxol y canjéalos por descuentos, productos exclusivos o envíos gratis.'
  },
  {
    icon: <FaStar className="loyalty-benefit__icon" />,
    title: 'Niveles de lealtad',
    desc: 'Entre más compras, más beneficios desbloqueas: acceso anticipado a lanzamientos, regalos de aniversario y sorpresas especiales.'
  },
  {
    icon: <FaLeaf className="loyalty-benefit__icon" />,
    title: 'Invita y gana',
    desc: 'Comparte tu experiencia K’oxol con amigos y recibe recompensas cuando ellos realicen su primera compra.'
  }
];

const Loyalty = () => (
  <section className="koxol-loyalty" id="fidelizacion">
    <h2 className="koxol-loyalty__title">Programa de Fidelización <span>K’oxol</span></h2>
    <p className="koxol-loyalty__desc">
      Queremos agradecer tu preferencia. Únete a nuestro programa de lealtad y disfruta de beneficios exclusivos diseñados para ti:
    </p>
    <div className="koxol-loyalty__benefits">
      {loyaltyBenefits.map(b => (
        <div className="loyalty-benefit" key={b.title}>
          {b.icon}
          <h3>{b.title}</h3>
          <p>{b.desc}</p>
        </div>
      ))}
    </div>
    <div className="koxol-loyalty__cta">
      <a href="https://meet.google.com/ysj-wwoq-xxq" target="_blank" rel="noopener noreferrer" className="loyalty__button">Únete gratis</a>
    </div>
  </section>
);

export default Loyalty;
