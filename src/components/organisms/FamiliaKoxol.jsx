import './FamiliaKoxol.css';
import { useEffect, useState, useRef } from 'react';
import ThreeDModelViewer from './ThreeDModelViewer';

const isMobile = () => window.innerWidth <= 700;

const miembros = [
  {
    nombre: 'Duki',
    foto: '/diku.jpg',
    comentario: 'El spray K’oxol me salvó en el último festival, ¡ni un mosquito se me acercó!',
    producto: 'Spray Repelente',
  },
  {
    nombre: 'Luis Miguel',
    foto: '/luismiguel.jpeg',
    comentario: 'La crema K’oxol es perfecta para la piel sensible, la uso antes de cada show.',
    producto: 'Crema Repelente',
  },
  {
    nombre: 'Maluma',
    foto: '/maluma.jpg',
    comentario: 'El roll-on K’oxol es mi secreto para viajar sin picaduras, ¡lo recomiendo!',
    producto: 'Roll-on Repelente',
  },
  {
    nombre: 'Raw',
    foto: '/raw.jpeg',
    comentario: 'Las toallitas K’oxol son súper prácticas para el backstage y giras.',
    producto: 'Toallitas Repelentes',
  },
  {
    nombre: 'Ricky',
    foto: '/ricky.jpg',
    comentario: 'El gel K’oxol me acompaña en cada aventura al aire libre, ¡funciona genial!',
    producto: 'Gel Repelente',
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

  // Al tocar la card en móvil, mostrar reverso manualmente
  const handleCardClick = idx => {
    if (!isMobile()) return;
    setFlipped(prev => prev.map((v, i) => i === idx ? !v : v));
    activeIdxRef.current = idx;
  };

  return (
    <section className="familia-koxol-section">
      <h2 className="familia-title">Familia K'oxol</h2>
      <div className="familia-list">
        {miembros.map((m, i) => (
          <div
            className={`familia-card-flip${flipped[i] ? ' flipped' : ''}`}
            key={m.nombre}
            onClick={() => handleCardClick(i)}
          >
            <div className="familia-card-inner">
              <div className="familia-card-front">
                {m.modelo3D ? (
                  <div style={{ width: '100%', height: '200px' }}>
                    <ThreeDModelViewer />
                  </div>
                ) : (
                  <img src={m.foto} alt={m.nombre} className="familia-img" />
                )}
                <div className="familia-info">
                  <h3>{m.nombre}</h3>
                  <p className="familia-comentario">{m.producto}</p>
                </div>
              </div>
              <div className="familia-card-back">
                <div className="familia-back-content">
                  <h3>{m.nombre}</h3>
                  <p className="familia-comentario">{m.comentario}</p>
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
