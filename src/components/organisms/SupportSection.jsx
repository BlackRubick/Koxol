import React, { useState } from 'react';

const SupportSection = () => {
  const [showHelp, setShowHelp] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  const toggleHelp = () => {
    setShowHelp((prev) => !prev);
  };

  const styles = {
    supportSection: {
      padding: '5rem 2rem',
      background: 'linear-gradient(135deg, #f0f4c3 0%, #e8f5e9 50%, #c5e1a5 100%)',
      textAlign: 'center',
      position: 'relative',
      overflow: 'hidden',
    },
    floatingCircle: {
      position: 'absolute',
      borderRadius: '50%',
      background: 'rgba(139, 195, 74, 0.1)',
      animation: 'float 20s infinite ease-in-out',
    },
    circle1: {
      width: '300px',
      height: '300px',
      top: '-100px',
      left: '-100px',
      animationDelay: '0s',
    },
    circle2: {
      width: '200px',
      height: '200px',
      bottom: '-50px',
      right: '-50px',
      animationDelay: '5s',
    },
    circle3: {
      width: '150px',
      height: '150px',
      top: '50%',
      right: '10%',
      animationDelay: '10s',
    },
    container: {
      maxWidth: '900px',
      margin: '0 auto',
      position: 'relative',
      zIndex: 1,
    },
    titleWrapper: {
      marginBottom: '2rem',
      animation: 'fadeInDown 1s ease-out',
    },
    title: {
      fontSize: '3rem',
      fontWeight: 'bold',
      color: '#3e2723',
      marginBottom: '0.5rem',
      textShadow: '2px 2px 4px rgba(0,0,0,0.1)',
      animation: 'pulse 2s infinite ease-in-out',
    },
    titleUnderline: {
      width: '100px',
      height: '4px',
      background: 'linear-gradient(90deg, #8bc34a, #7cb342)',
      margin: '0 auto',
      borderRadius: '2px',
      animation: 'expandWidth 1.5s ease-out',
    },
    description: {
      fontSize: '1.3rem',
      color: '#5d4037',
      marginBottom: '2.5rem',
      lineHeight: '1.8',
      animation: 'fadeIn 1.5s ease-out',
    },
    buttonWrapper: {
      position: 'relative',
      display: 'inline-block',
    },
    button: {
      background: isHovering 
        ? 'linear-gradient(135deg, #9ccc65, #8bc34a)' 
        : 'linear-gradient(135deg, #8bc34a, #7cb342)',
      color: 'white',
      padding: '1rem 2.5rem',
      border: 'none',
      borderRadius: '50px',
      fontSize: '1.1rem',
      fontWeight: 'bold',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      boxShadow: isHovering 
        ? '0 8px 20px rgba(139, 195, 74, 0.4)' 
        : '0 4px 15px rgba(139, 195, 74, 0.3)',
      transform: isHovering ? 'translateY(-3px) scale(1.05)' : 'translateY(0) scale(1)',
      animation: 'bounceIn 1s ease-out',
      position: 'relative',
      overflow: 'hidden',
    },
    buttonRipple: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      width: isHovering ? '300px' : '0',
      height: isHovering ? '300px' : '0',
      background: 'rgba(255, 255, 255, 0.3)',
      borderRadius: '50%',
      transform: 'translate(-50%, -50%)',
      transition: 'width 0.6s, height 0.6s',
      pointerEvents: 'none',
    },
    helpWindow: {
      marginTop: '2rem',
      padding: '2rem',
      background: 'rgba(255, 255, 255, 0.95)',
      border: '2px solid #8bc34a',
      borderRadius: '20px',
      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.15)',
      animation: showHelp ? 'slideDown 0.5s ease-out' : 'none',
      backdropFilter: 'blur(10px)',
      position: 'relative',
      overflow: 'hidden',
    },
    helpWindowGlow: {
      position: 'absolute',
      top: '-50%',
      left: '-50%',
      width: '200%',
      height: '200%',
      background: 'radial-gradient(circle, rgba(139, 195, 74, 0.1) 0%, transparent 70%)',
      animation: 'rotate 10s linear infinite',
    },
    helpContent: {
      position: 'relative',
      zIndex: 1,
    },
    helpIcon: {
      fontSize: '3rem',
      marginBottom: '1rem',
      animation: 'bounce 1s infinite',
    },
    helpText: {
      fontSize: '1.1rem',
      color: '#3e2723',
      marginBottom: '1.5rem',
      fontWeight: '500',
    },
    meetLinkWrapper: {
      background: 'linear-gradient(135deg, #f0f4c3, #e8f5e9)',
      padding: '1rem',
      borderRadius: '15px',
      display: 'inline-block',
      transition: 'transform 0.3s ease',
    },
    meetLink: {
      fontSize: '1.1rem',
      color: '#7cb342',
      textDecoration: 'none',
      fontWeight: 'bold',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      transition: 'color 0.3s ease',
    },
    linkIcon: {
      fontSize: '1.5rem',
      animation: 'wiggle 1s infinite',
    },
  };

  const keyframes = `
    @keyframes float {
      0%, 100% { transform: translate(0, 0) scale(1); }
      33% { transform: translate(30px, -30px) scale(1.1); }
      66% { transform: translate(-20px, 20px) scale(0.9); }
    }

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

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    @keyframes pulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.02); }
    }

    @keyframes expandWidth {
      from { width: 0; }
      to { width: 100px; }
    }

    @keyframes bounceIn {
      0% {
        opacity: 0;
        transform: scale(0.3);
      }
      50% {
        opacity: 1;
        transform: scale(1.05);
      }
      70% { transform: scale(0.9); }
      100% { transform: scale(1); }
    }

    @keyframes slideDown {
      from {
        opacity: 0;
        transform: translateY(-20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @keyframes bounce {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-10px); }
    }

    @keyframes wiggle {
      0%, 100% { transform: rotate(0deg); }
      25% { transform: rotate(-10deg); }
      75% { transform: rotate(10deg); }
    }

    @keyframes rotate {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
  `;

  return (
    <>
      <style>{keyframes}</style>
      <section style={styles.supportSection}>
        {/* Círculos flotantes de fondo */}
        <div style={{...styles.floatingCircle, ...styles.circle1}}></div>
        <div style={{...styles.floatingCircle, ...styles.circle2}}></div>
        <div style={{...styles.floatingCircle, ...styles.circle3}}></div>

        <div style={styles.container}>
          <div style={styles.titleWrapper}>
            <h2 style={styles.title}>✨ Impulsa la Publicidad de K'oxol</h2>
            <div style={styles.titleUnderline}></div>
          </div>
          
          <p style={styles.description}>
            ¿Quieres ayudarnos a dar a conocer nuestra marca?<br />
            Conéctate con uno de nuestros operadores y hagamos crecer juntos a K'oxol
          </p>
          
          <div style={styles.buttonWrapper}>
            <button 
              style={styles.button}
              onClick={toggleHelp}
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
            >
              <div style={styles.buttonRipple}></div>
              {showHelp ? '🔗 Enlace Activo' : '🚀 Ayuda con la Publicidad'}
            </button>
          </div>

          {showHelp && (
            <div style={styles.helpWindow}>
              <div style={styles.helpWindowGlow}></div>
              <div style={styles.helpContent}>
                <div style={styles.helpIcon}>💬</div>
                <p style={styles.helpText}>
                  ¡Estamos listos para atenderte! Conéctate a Meet y habla con un operador
                </p>
                <div 
                  style={styles.meetLinkWrapper}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                  <a
                    href="https://meet.google.com/ysj-wwoq-xxq"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={styles.meetLink}
                    onMouseEnter={(e) => e.currentTarget.style.color = '#689f38'}
                    onMouseLeave={(e) => e.currentTarget.style.color = '#7cb342'}
                  >
                    <span style={styles.linkIcon}>🎥</span>
                    Unirse a la reunión ahora
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default SupportSection;