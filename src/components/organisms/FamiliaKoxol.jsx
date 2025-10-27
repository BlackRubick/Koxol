import './FamiliaKoxol.css';
import { useEffect, useState, useRef } from 'react';
import ThreeDModelViewer from './ThreeDModelViewer';

const isMobile = () => window.innerWidth <= 700;

const miembros = [
  {
    nombre: 'Duki',
    foto: '/diku.jpg',
    comentario: 'El spray K\'oxol de 250ml me salvó en el último festival, ¡ni un mosquito se me acercó! Protección de 8 horas garantizada.',
    producto: 'Spray Repelente 250ml',
  },
  {
    nombre: 'Luis Miguel',
    foto: '/luismiguel.jpeg',
    comentario: 'La crema K\'oxol de 180ml es perfecta para la piel sensible, hidrata y protege. La uso antes de cada show.',
    producto: 'Crema Repelente 180ml',
  },
  {
    nombre: 'Maluma',
    foto: '/maluma.jpg',
    comentario: 'La loción K\'oxol de 300ml es mi secreto para viajar sin picaduras. Textura ligera y muy efectiva.',
    producto: 'Loción Antimosquitos 300ml',
  },
  {
    nombre: 'Raw',
    foto: '/raw.jpeg',
    comentario: 'Las pulseras K\'oxol son súper prácticas para el backstage y giras. Liberación aromática prolongada todo el día.',
    producto: 'Pulseras Repelentes',
  },
  {
    nombre: 'Ricky',
    foto: '/ricky.jpg',
    comentario: 'Las velas K\'oxol me acompañan en cada cena al aire libre. Ambiente agradable y sin mosquitos.',
    producto: 'Velas de Citronela',
  },
];

function FamiliaKoxol() {
  const [flipped, setFlipped] = useState(Array(miembros.length).fill(false));
  const activeIdxRef = useRef(0);

  useEffect(() => {
    if (!isMobile()) return;
    setFlipped(Array(miembros.length).fill(false));
    activeIdxRef.current = 0;
    const interval = setInterval(() => {
      setFlipped(Array(miembros.length).fill(false).map((v, i) => i === activeIdxRef.current));
      setTimeout(() => {
        setFlipped(Array(miembros.length).fill(false));
        activeIdxRef.current = (activeIdxRef.current + 1) % miembros.length;
      }, 1800);
    }, 2200);
    return () => clearInterval(interval);
  }, []);

  const handleCardClick = idx => {
    if (!isMobile()) return;
    setFlipped(prev => prev.map((v, i) => i === idx ? !v : v));
    activeIdxRef.current = idx;
  };

  return (
    <section className="familia-koxol-section">
      <div className="familia-koxol-background">
        <div className="familia-shape familia-shape--1"></div>
        <div className="familia-shape familia-shape--2"></div>
        <div className="familia-shape familia-shape--3"></div>
      </div>

      <div className="familia-header">
        <div className="familia-badge">
          <span className="familia-badge__icon">👥</span>
          <span className="familia-badge__text">Embajadores K'oxol</span>
        </div>
        <h2 className="familia-title">
          Familia <span className="familia-title-highlight">K'oxol</span>
        </h2>

      </div>

      <div className="familia-list">
        {miembros.map((m, i) => (
          <div
            className={`familia-card-flip${flipped[i] ? ' flipped' : ''}`}
            key={m.nombre}
            onClick={() => handleCardClick(i)}
            style={{ animationDelay: `${i * 0.1}s` }}
          >
            <div className="familia-card-inner">
              <div className="familia-card-front">
                <div className="familia-card-glow"></div>
                {m.modelo3D ? (
                  <div style={{ width: '100%', height: '200px' }}>
                    <ThreeDModelViewer />
                  </div>
                ) : (
                  <div className="familia-img-wrapper">
                    <img src={m.foto} alt={m.nombre} className="familia-img" />
                    <div className="img-overlay"></div>
                  </div>
                )}
                <div className="familia-info">
                  <h3 className="familia-nombre">{m.nombre}</h3>
                </div>
                <div className="flip-hint">
                  <span className="flip-hint-icon">⤻</span>
                  <span className="flip-hint-text">Toca para ver más</span>
                </div>
              </div>
              <div className="familia-card-back">
                <div className="familia-back-content">
                  <div className="back-quote-icon">"</div>
                  <h3 className="back-nombre">{m.nombre}</h3>
                  {/* Mostrar comentario solo en vista normal */}
                  <p className="familia-comentario">{m.comentario}</p>
                  <div className="back-producto">
                    {m.producto}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>


    </section>
  );
}

export default FamiliaKoxol;