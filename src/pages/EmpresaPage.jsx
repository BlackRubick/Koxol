import React, { useState } from 'react';

const EmpresaPage = () => {
  const [flippedCard, setFlippedCard] = useState(null);
  const [hoveredModel, setHoveredModel] = useState(null);
  const [showB2EPopup, setShowB2EPopup] = useState(false);
  const [reviewText, setReviewText] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [discountCode, setDiscountCode] = useState('');

  const models = [
    {
      id: 'b2b',
      title: 'B2B',
      icon: '🏢',
      subtitle: 'Empresas',
      description: 'Únete como socio empresarial',
    },
    {
      id: 'c2b',
      title: 'C2B',
      icon: '👤',
      subtitle: 'Clientes',
      description: 'Comparte tu experiencia y gana',
    },
    {
      id: 'b2e',
      title: 'B2E',
      icon: '👥',
      subtitle: 'Empleados',
      description: 'Beneficios exclusivos para nuestro equipo',
    },
    {
      id: 'b2i',
      title: 'B2I',
      icon: '🏛️',
      subtitle: 'Inversionistas',
      description: 'Invierte en K\'oxol',
    }
  ];

  const generateDiscountCode = () => {
    const code = 'KOXOL' + Math.random().toString(36).substring(2, 8).toUpperCase();
    setDiscountCode(code);
    return code;
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (reviewText.trim()) {
      const code = generateDiscountCode();
      setReviewSubmitted(true);
      setTimeout(() => {
        setReviewSubmitted(false);
        setReviewText('');
      }, 8000);
    }
  };

  const handleB2EAccess = (e) => {
    e.stopPropagation();
    setShowB2EPopup(true);
  };

  const handleCardClick = (modelId) => {
    setFlippedCard(flippedCard === modelId ? null : modelId);
  };

  const styles = {
    empresaPage: {
      padding: '3rem 2rem',
      background: '#f9f9f9',
      minHeight: '100vh',
      textAlign: 'center',
      position: 'relative',
      overflow: 'hidden',
    },
    backgroundPattern: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundImage: `
        radial-gradient(circle at 20% 30%, rgba(0, 123, 255, 0.03) 0%, transparent 50%),
        radial-gradient(circle at 80% 70%, rgba(0, 123, 255, 0.03) 0%, transparent 50%)
      `,
      animation: 'moveBackground 20s ease infinite',
      pointerEvents: 'none',
    },
    content: {
      position: 'relative',
      zIndex: 1,
    },
    titleWrapper: {
      marginBottom: '2rem',
      animation: 'fadeInDown 1s ease-out',
    },
    title: {
      fontSize: '2.5rem',
      fontWeight: 'bold',
      color: '#333',
      marginBottom: '0.5rem',
      textShadow: '2px 2px 4px rgba(0,0,0,0.1)',
    },
    titleUnderline: {
      width: '120px',
      height: '4px',
      background: 'linear-gradient(90deg, #007BFF, #0056b3)',
      margin: '0.3rem auto 0',
      borderRadius: '3px',
      animation: 'expandWidth 1.5s ease-out',
    },
    subtitle: {
      fontSize: '1.1rem',
      color: '#555',
      fontWeight: '400',
      marginTop: '0.5rem',
    },
    sections: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: '1.5rem',
      maxWidth: '1400px',
      margin: '0 auto',
      padding: '0 1rem',
    },
    cardContainer: {
      perspective: '1000px',
      height: '400px',
    },
    card: (model) => ({
      position: 'relative',
      width: '100%',
      height: '100%',
      transformStyle: 'preserve-3d',
      transition: 'transform 0.6s',
      transform: flippedCard === model.id ? 'rotateY(180deg)' : 'rotateY(0)',
      cursor: 'pointer',
    }),
    cardFace: {
      position: 'absolute',
      width: '100%',
      height: '100%',
      backfaceVisibility: 'hidden',
      background: '#fff',
      borderRadius: '15px',
      padding: '1.5rem',
      boxShadow: hoveredModel ? '0 15px 30px rgba(0, 123, 255, 0.25), 0 0 0 3px #007BFF' : '0 4px 6px rgba(0, 0, 0, 0.1)',
      border: '1px solid #ddd',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      transition: 'box-shadow 0.3s ease',
    },
    cardBack: {
      transform: 'rotateY(180deg)',
      overflow: 'auto',
      justifyContent: 'flex-start',
      padding: '1.2rem',
    },
    iconWrapper: (model) => ({
      fontSize: '2.5rem',
      marginBottom: '0.5rem',
      display: 'inline-block',
      animation: hoveredModel === model.id ? 'bounce 0.6s ease infinite' : 'none',
    }),
    sectionTitle: {
      fontSize: '1.5rem',
      color: '#007BFF',
      marginBottom: '0.3rem',
      fontWeight: 'bold',
    },
    sectionSubtitle: {
      fontSize: '0.85rem',
      color: '#999',
      marginBottom: '0.5rem',
      textTransform: 'uppercase',
      letterSpacing: '1px',
    },
    sectionDescription: {
      fontSize: '0.95rem',
      color: '#555',
      lineHeight: '1.4',
    },
    backContent: {
      width: '100%',
      textAlign: 'left',
    },
    backTitle: {
      fontSize: '1.2rem',
      color: '#333',
      marginBottom: '0.8rem',
      fontWeight: 'bold',
      textAlign: 'center',
    },
    backText: {
      fontSize: '0.9rem',
      color: '#555',
      lineHeight: '1.5',
      marginBottom: '0.8rem',
    },
    meetButton: {
      background: 'linear-gradient(135deg, #007BFF, #0056b3)',
      color: '#fff',
      padding: '0.7rem 1.2rem',
      border: 'none',
      borderRadius: '25px',
      fontSize: '0.9rem',
      fontWeight: 'bold',
      cursor: 'pointer',
      width: '100%',
      marginTop: '0.5rem',
      boxShadow: '0 4px 10px rgba(0, 123, 255, 0.3)',
      transition: 'transform 0.2s ease',
    },
    companyLogos: {
      display: 'flex',
      justifyContent: 'space-around',
      margin: '0.8rem 0',
    },
    companyLogo: {
      fontSize: '1.8rem',
    },
    meetLink: {
      color: '#007BFF',
      fontSize: '0.85rem',
      textDecoration: 'none',
      display: 'block',
      marginTop: '0.5rem',
      padding: '0.5rem',
      background: '#f0f8ff',
      borderRadius: '8px',
      textAlign: 'center',
    },
    textarea: {
      width: '100%',
      minHeight: '70px',
      padding: '0.7rem',
      borderRadius: '8px',
      border: '2px solid #ddd',
      fontSize: '0.85rem',
      fontFamily: 'inherit',
      marginBottom: '0.5rem',
      boxSizing: 'border-box',
      resize: 'none',
    },
    submitButton: {
      background: 'linear-gradient(135deg, #007BFF, #0056b3)',
      color: '#fff',
      padding: '0.7rem 1rem',
      border: 'none',
      borderRadius: '25px',
      fontSize: '0.85rem',
      fontWeight: 'bold',
      cursor: 'pointer',
      width: '100%',
      boxShadow: '0 4px 10px rgba(0, 123, 255, 0.3)',
    },
    discountBox: {
      background: '#fff',
      padding: '1rem',
      borderRadius: '8px',
      border: '2px dashed #007BFF',
      textAlign: 'center',
      marginTop: '0.5rem',
    },
    discountCode: {
      fontSize: '1.3rem',
      fontWeight: 'bold',
      color: '#007BFF',
      letterSpacing: '2px',
      margin: '0.3rem 0',
    },
    investList: {
      listStyle: 'none',
      padding: 0,
      margin: '0.8rem 0',
    },
    investItem: {
      background: '#f0f8ff',
      padding: '0.5rem',
      marginBottom: '0.3rem',
      borderRadius: '5px',
      fontSize: '0.85rem',
      color: '#555',
    },
    popup: {
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      background: '#fff',
      padding: '2rem',
      borderRadius: '20px',
      boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
      zIndex: 1000,
      maxWidth: '450px',
      width: '90%',
      animation: 'popupAppear 0.3s ease-out',
      border: '3px solid #007BFF',
      maxHeight: '80vh',
      overflowY: 'auto',
    },
    overlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.5)',
      zIndex: 999,
      animation: 'fadeIn 0.3s ease-out',
    },
    closeButton: {
      position: 'absolute',
      top: '1rem',
      right: '1rem',
      background: 'none',
      border: 'none',
      fontSize: '1.5rem',
      cursor: 'pointer',
      color: '#999',
      transition: 'color 0.3s ease',
    },
    discountCard: {
      background: '#f0f8ff',
      padding: '0.8rem',
      borderRadius: '10px',
      marginBottom: '0.8rem',
    },
    discountTitle: {
      color: '#007BFF',
      fontSize: '1rem',
      marginBottom: '0.3rem',
      fontWeight: 'bold',
    },
    discountDesc: {
      color: '#555',
      fontSize: '0.85rem',
      marginBottom: '0.3rem',
    },
    discountCodeText: {
      fontWeight: 'bold',
      color: '#007BFF',
      fontSize: '0.9rem',
    },
    clickHint: {
      fontSize: '0.8rem',
      color: '#999',
      marginTop: '1rem',
      fontStyle: 'italic',
    },
  };

  const keyframes = `
    @keyframes fadeInDown {
      from {
        opacity: 0;
        transform: translateY(-30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @keyframes expandWidth {
      from { width: 0; }
      to { width: 120px; }
    }

    @keyframes bounce {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-10px); }
    }

    @keyframes moveBackground {
      0%, 100% { transform: translate(0, 0); }
      50% { transform: translate(30px, 30px); }
    }

    @keyframes popupAppear {
      from {
        opacity: 0;
        transform: translate(-50%, -50%) scale(0.8);
      }
      to {
        opacity: 1;
        transform: translate(-50%, -50%) scale(1);
      }
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    @media (max-width: 1200px) {
      .sections { grid-template-columns: repeat(2, 1fr) !important; }
    }

    @media (max-width: 768px) {
      .sections { grid-template-columns: 1fr !important; }
    }
  `;

  const renderBackContent = (model) => {
    switch(model.id) {
      case 'b2b':
        return (
          <div style={styles.backContent} onClick={(e) => e.stopPropagation()}>
            <h3 style={styles.backTitle}>🤝 Socio Empresarial</h3>
            <p style={styles.backText}>
              Forma parte de nuestra red de socios empresariales.
            </p>
            <div style={styles.companyLogos}>
              <span style={styles.companyLogo}>🏭</span>
              <span style={styles.companyLogo}>🏪</span>
              <span style={styles.companyLogo}>🏢</span>
            </div>
            <button 
              style={styles.meetButton}
              onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
              onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
              onClick={(e) => {
                e.stopPropagation();
                window.open('https://meet.google.com/ysj-wwoq-xxq', '_blank');
              }}
            >
              📞 Contactanos
            </button>
            <a 
              href="https://meet.google.com/ysj-wwoq-xxq" 
              target="_blank" 
              rel="noopener noreferrer"
              style={styles.meetLink}
              onClick={(e) => e.stopPropagation()}
            >
              🔗 meet.google.com/ysj-wwoq-xxq
            </a>
          </div>
        );
      
      case 'c2b':
        return (
          <div style={styles.backContent} onClick={(e) => e.stopPropagation()}>
            <h3 style={styles.backTitle}>⭐ Tu Opinión Importa</h3>
            {!reviewSubmitted ? (
              <form onSubmit={handleReviewSubmit}>
                <textarea 
                  style={styles.textarea}
                  placeholder="Comparte tu experiencia con K'oxol..."
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                />
                <button 
                  type="submit"
                  style={styles.submitButton}
                  onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
                  onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                >
                  🎁 Enviar y Obtener Descuento
                </button>
              </form>
            ) : (
              <div style={styles.discountBox}>
                <p style={{fontSize: '0.9rem', color: '#333', marginBottom: '0.3rem'}}>
                  🎉 ¡Gracias por tu reseña!
                </p>
                <p style={{fontSize: '0.8rem', color: '#555', marginBottom: '0.3rem'}}>
                  Tu código de descuento:
                </p>
                <div style={styles.discountCode}>{discountCode}</div>
                <p style={{fontSize: '0.75rem', color: '#999', marginTop: '0.5rem'}}>
                  Úsalo en tu próxima compra
                </p>
              </div>
            )}
          </div>
        );
      
      case 'b2e':
        return (
          <div style={styles.backContent} onClick={(e) => e.stopPropagation()}>
            <h3 style={styles.backTitle}>👥 Para Nuestro Equipo</h3>
            <p style={styles.backText}>
              Accede a beneficios exclusivos y descuentos especiales.
            </p>
            <button 
              style={styles.meetButton}
              onClick={handleB2EAccess}
              onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
              onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
            >
              🎁 Ver Descuentos
            </button>
            <button 
              style={{...styles.meetButton, background: 'linear-gradient(135deg, #28a745, #218838)'}}
              onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
              onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
              onClick={(e) => {
                e.stopPropagation();
                window.open('https://meet.google.com/ysj-wwoq-xxq', '_blank');
              }}
            >
              📞 Reunión RH
            </button>
          </div>
        );
      
      case 'b2i':
        return (
          <div style={styles.backContent} onClick={(e) => e.stopPropagation()}>
            <h3 style={styles.backTitle}>💼 Invierte en K'oxol</h3>
            <p style={styles.backText}>
              Oportunidades de inversión:
            </p>
            <ul style={styles.investList}>
              <li style={styles.investItem}>📈 Expansión de mercado</li>
              <li style={styles.investItem}>🆕 Nuevos productos</li>
              <li style={styles.investItem}>💡 Tecnología</li>
              <li style={styles.investItem}>🚚 Logística</li>
            </ul>
            <button 
              style={styles.meetButton}
              onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
              onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
              onClick={(e) => {
                e.stopPropagation();
                window.open('https://meet.google.com/ysj-wwoq-xxq', '_blank');
              }}
            >
              🤝 Contactanos
            </button>
            <a 
              href="https://meet.google.com/ysj-wwoq-xxq" 
              target="_blank" 
              rel="noopener noreferrer"
              style={styles.meetLink}
              onClick={(e) => e.stopPropagation()}
            >
              🔗 meet.google.com/ysj-wwoq-xxq
            </a>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <>
      <style>{keyframes}</style>
      <div style={styles.empresaPage}>
        <div style={styles.backgroundPattern}></div>
        
        <div style={styles.content}>
          <div style={styles.titleWrapper}>
            <h1 style={styles.title}>🚀 Modelos de Negocio K'oxol</h1>
            <div style={styles.titleUnderline}></div>
            <p style={styles.subtitle}>Conectamos empresas, clientes, empleados e inversionistas</p>
          </div>
          
          <div style={styles.sections} className="sections">
            {models.map((model) => (
              <div 
                key={model.id} 
                style={styles.cardContainer}
                onMouseEnter={() => setHoveredModel(model.id)}
                onMouseLeave={() => setHoveredModel(null)}
              >
                <div 
                  style={styles.card(model)}
                  onClick={() => handleCardClick(model.id)}
                >
                  {/* Frente de la tarjeta */}
                  <div style={styles.cardFace}>
                    <div style={styles.iconWrapper(model)}>{model.icon}</div>
                    <p style={styles.sectionSubtitle}>{model.subtitle}</p>
                    <h2 style={styles.sectionTitle}>{model.title}</h2>
                    <p style={styles.sectionDescription}>{model.description}</p>
                    <p style={styles.clickHint}>👆 Click para ver más</p>
                  </div>
                  
                  {/* Reverso de la tarjeta */}
                  <div style={{...styles.cardFace, ...styles.cardBack}}>
                    {renderBackContent(model)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {showB2EPopup && (
          <>
            <div style={styles.overlay} onClick={() => setShowB2EPopup(false)}></div>
            <div style={styles.popup}>
              <button 
                style={styles.closeButton}
                onClick={() => setShowB2EPopup(false)}
                onMouseEnter={(e) => e.target.style.color = '#007BFF'}
                onMouseLeave={(e) => e.target.style.color = '#999'}
              >
                ×
              </button>
              <h2 style={{color: '#007BFF', marginBottom: '1rem', textAlign: 'center'}}>
                🎉 Descuentos Exclusivos
              </h2>
              <div style={styles.discountCard}>
                <h3 style={styles.discountTitle}>✨ 20% de Descuento</h3>
                <p style={styles.discountDesc}>En todos los productos tradicionales</p>
                <p style={styles.discountCodeText}>Código: EMPLEADO20</p>
              </div>
              <div style={styles.discountCard}>
                <h3 style={styles.discountTitle}>✨ 15% de Descuento</h3>
                <p style={styles.discountDesc}>En productos especiales y ediciones limitadas</p>
                <p style={styles.discountCodeText}>Código: TEAM15</p>
              </div>
              <div style={styles.discountCard}>
                <h3 style={styles.discountTitle}>✨ Envío Gratis</h3>
                <p style={styles.discountDesc}>En todas tus compras sin mínimo</p>
                <p style={styles.discountCodeText}>Código: ENVIOSTAFF</p>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default EmpresaPage;