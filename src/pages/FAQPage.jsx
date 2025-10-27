import React from 'react';
import Navbar from '../components/molecules/Navbar';
import Footer from '../components/organisms/Footer';
import './FAQPage.css';

const FAQPage = () => {
  return (
    <>
      <Navbar />
        <div className="faq-page">
        <h1>Preguntas Frecuentes sobre K’oxol</h1>
        <ol>
          <li>🌿 <strong>¿Qué es K’oxol?</strong><br />
          K’oxol es un repelente natural elaborado con ingredientes botánicos, diseñado para protegerte de mosquitos sin dañar tu piel ni el medio ambiente.</li>
          <li>🧴 <strong>¿Cómo se usa el repelente?</strong><br />
          Agita bien antes de usar. Aplica directamente sobre la piel expuesta y ropa. Reaplica cada 4 horas o después de sudar o nadar.</li>
          <li>👶 <strong>¿Es seguro para niños?</strong><br />
          Sí, K’oxol está formulado con ingredientes suaves y naturales. Recomendado para mayores de 2 años. Para bebés menores, consulta con tu pediatra.</li>
          <li>🐶 <strong>¿Puedo usarlo en mascotas?</strong><br />
          No está diseñado para uso directo en animales. Puedes aplicarlo en tu ropa o entorno si estás cerca de ellos.</li>
          <li>📦 <strong>¿Hacen envíos a todo México?</strong><br />
          Sí, enviamos a todo el país. El tiempo de entrega varía según tu ubicación. En zonas urbanas, suele tardar de 3 a 5 días hábiles.</li>
          <li>💳 <strong>¿Qué formas de pago aceptan?</strong><br />
          Aceptamos tarjetas de crédito, débito, transferencias bancarias y pagos en efectivo a través de OXXO.</li>
          <li>📅 <strong>¿Cuánto dura el producto una vez abierto?</strong><br />
          Recomendamos usarlo dentro de los 12 meses posteriores a su apertura para mantener su efectividad.</li>
          <li>🧪 <strong>¿Está certificado por alguna autoridad?</strong><br />
          Sí, K’oxol cumple con las normas mexicanas de productos cosméticos y repelentes naturales. Contamos con registro sanitario vigente.</li>
          <li>🛍️ <strong>¿Dónde puedo comprarlo físicamente?</strong><br />
          Puedes adquirirlo en nuestra tienda en Tuxtla Gutiérrez y en puntos de venta seleccionados. Consulta el mapa de distribuidores en nuestra página.</li>
          <li>📞 <strong>¿Tienen atención al cliente?</strong><br />
          Claro. Puedes contactarnos por WhatsApp, correo electrónico o redes sociales. Respondemos en menos de 24 horas.</li>
        </ol>
      </div>
      <Footer />
    </>
  );
};

export default FAQPage;