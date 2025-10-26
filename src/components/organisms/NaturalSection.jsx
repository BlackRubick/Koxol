// NaturalSection.jsx
import React, { useState, useEffect } from 'react';
import './NaturalSection.css';

const NaturalSection = () => {
  const [activeComment, setActiveComment] = useState(0);
  const [activeImage, setActiveImage] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  const comments = [
    {
      text: "Compré el spray repelente de 250 ml y me encantó. Huele fresco, no deja sensación pegajosa y desde la primera aplicación noté muchísimos menos moscos en el patio. Súper práctico para llevar en la mochila.",
      author: "Mariana López Castillo",
      rating: 5
    },
    {
      text: "La pulsera antimosquitos me funcionó excelente para salir a correr al atardecer. Es cómoda, no estorba y sí se siente la reducción de picaduras. En días con muchos moscos la combino con un par de atomizaciones de spray y queda de 10.",
      author: "Rodrigo Ávila Ledesma",
      rating: 5
    },
    {
      text: "Usamos la esencia para difusor en la recepción del negocio y fue un cambio total: ambiente con aroma limpio y menos zancudos. Rinde bastante y a los clientes les agrada el olor de citronela.",
      author: "Paola Gutiérrez Salas",
      rating: 5
    }
  ];

  const images = [
    '/public/natural1.jpg',
    '/public/natural2.jpg',
    '/public/natural3.jpg',
    '/public/natural5.jpg',
  ];

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setActiveComment((prev) => (prev + 1) % comments.length);
      setActiveImage((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const features = [
    { icon: "🌿", text: "100% Natural" },
    { icon: "✨", text: "Citronela Pura" },
    { icon: "🛡️", text: "Sin Tóxicos" },
    { icon: "❤️", text: "Seguro para Familia" }
  ];

  return (
    <section className="natural-section">
      <div className="natural-section__bg-decoration natural-section__bg-decoration--top"></div>
      <div className="natural-section__bg-decoration natural-section__bg-decoration--bottom"></div>
      
      <div className="natural-section__container">
        <div className="natural-section__grid">
          
          {/* Contenido de texto */}
          <div className={`natural-section__content ${isVisible ? 'natural-section__content--visible' : ''}`}>
            
            <div className="natural-section__header">
              <span className="natural-section__badge">
                🌿 Productos Naturales
              </span>
              <h2 className="natural-section__title">
                Natural
                <span className="natural-section__title-accent">& Efectivo</span>
              </h2>
            </div>

            <p className="natural-section__description">
              En <strong className="natural-section__brand">K'oxol</strong> nos encargamos de que todos nuestros productos estén hechos con ingredientes 100% naturales. Nos preocupamos por tu bienestar y el de tu familia, por eso utilizamos citronela y aceites esenciales, completamente libres de tóxicos.
            </p>

            {/* Características con iconos */}
            <div className="natural-section__features">
              {features.map((feature, index) => (
                <div 
                  key={index}
                  className="natural-section__feature-card"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="natural-section__feature-icon">
                    {feature.icon}
                  </div>
                  <span className="natural-section__feature-text">{feature.text}</span>
                </div>
              ))}
            </div>

            {/* Carrusel de comentarios */}
            <div className="natural-section__testimonials">
              <div className="natural-section__testimonials-quote">"</div>
              
              {comments.map((comment, index) => (
                <div
                  key={index}
                  className={`natural-section__testimonial ${
                    activeComment === index 
                      ? 'natural-section__testimonial--active' 
                      : ''
                  }`}
                >
                  <p className="natural-section__testimonial-text">
                    {comment.text}
                  </p>
                  <div className="natural-section__testimonial-footer">
                    <cite className="natural-section__testimonial-author">
                      — {comment.author}
                    </cite>
                    <div className="natural-section__testimonial-rating">
                      {[...Array(comment.rating)].map((_, i) => (
                        <span key={i}>★</span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}

              {/* Indicadores de puntos */}
              <div className="natural-section__indicators">
                {comments.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveComment(index)}
                    className={`natural-section__indicator ${
                      activeComment === index 
                        ? 'natural-section__indicator--active' 
                        : ''
                    }`}
                    aria-label={`Ir al comentario ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Carrusel de imágenes */}
          <div className={`natural-section__image-wrapper ${isVisible ? 'natural-section__image-wrapper--visible' : ''}`}>
            <div className="natural-section__image-container">
              <div className="natural-section__image-frame">
                <img 
                  src={images[activeImage]} 
                  alt="Imagen natural" 
                  className="natural-section__image"
                />
                <div className="natural-section__image-overlay"></div>
              </div>

              <div className="natural-section__image-badge">
                ✨ Protección Natural Garantizada
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default NaturalSection;