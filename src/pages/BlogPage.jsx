import React, { useState } from 'react';
import './BlogPage.css';
import Navbar from '../components/molecules/Navbar';

const BlogPage = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState(null);

  const articles = [
    {
      id: 1,
      category: 'Guía',
      date: '15 Octubre 2025',
      title: 'Cómo elegir un repelente natural seguro para niños',
      excerpt: 'Elegir un repelente natural para niños puede ser un desafío. Aquí te damos consejos prácticos para proteger a los más pequeños de manera segura y efectiva.',
      readTime: '5 min',
      emoji: '❓',
      content: `
        <h2>🌿 Cómo elegir un repelente natural seguro para niños</h2>
        <p>Elegir un repelente natural para niños puede ser un desafío. Aquí te damos consejos prácticos para proteger a los más pequeños de manera segura y efectiva.</p>
        
        <h3>Ingredientes naturales recomendados</h3>
        <ul>
          <li><strong>Citronela:</strong> Busca productos con ingredientes naturales como citronela o eucalipto.</li>
          <li><strong>Aceite de eucalipto limón:</strong> Proporciona protección efectiva y es seguro para niños mayores de 3 años.</li>
          <li><strong>Lavanda:</strong> Además de repeler insectos, tiene propiedades calmantes.</li>
        </ul>

        <h3>Consejos de aplicación</h3>
        <ul>
          <li>Evita aplicar repelente directamente en las manos de los niños para prevenir contacto con ojos y boca.</li>
          <li>Prueba primero en una pequeña área de la piel para descartar reacciones alérgicas.</li>
          <li>Aplica en áreas expuestas de la piel, evitando cortes o irritaciones.</li>
          <li>No apliques bajo la ropa ni en exceso.</li>
        </ul>

        <h3>¿Qué evitar?</h3>
        <p>Es importante evitar repelentes con DEET en concentraciones altas para niños pequeños. Siempre lee las etiquetas y sigue las instrucciones del fabricante.</p>

        <h3>Recomendaciones por edad</h3>
        <ul>
          <li><strong>Menores de 2 meses:</strong> No usar repelentes. Utiliza mosquiteros.</li>
          <li><strong>2 meses - 3 años:</strong> Productos con citronela en concentraciones bajas.</li>
          <li><strong>Mayores de 3 años:</strong> Pueden usar productos con eucalipto limón.</li>
        </ul>
      `
    },
    {
      id: 2,
      category: 'Beneficios',
      date: '12 Octubre 2025',
      title: 'Beneficios del aceite de citronela contra mosquitos',
      excerpt: 'El aceite de citronela es una opción popular y efectiva para mantener a los mosquitos alejados. Descubre por qué es una excelente alternativa natural.',
      readTime: '4 min',
      emoji: '✅',
      content: `
        <h2>🌿 Beneficios del aceite de citronela contra mosquitos</h2>
        <p>El aceite de citronela es una opción popular y efectiva para mantener a los mosquitos alejados. Descubre por qué es una excelente alternativa natural.</p>
        
        <h3>¿Qué es la citronela?</h3>
        <p>La citronela es un aceite esencial extraído de diferentes especies de plantas del género Cymbopogon. Su aroma característico es conocido por repeler mosquitos y otros insectos.</p>

        <h3>Ventajas principales</h3>
        <ul>
          <li><strong>Seguro para la mayoría de las personas:</strong> Es un ingrediente natural con bajo riesgo de efectos secundarios.</li>
          <li><strong>Amigable con el medio ambiente:</strong> No contamina ni daña el ecosistema.</li>
          <li><strong>Protección efectiva:</strong> Proporciona una protección efectiva cuando se aplica correctamente.</li>
          <li><strong>Aroma agradable:</strong> A diferencia de químicos sintéticos, tiene un olor fresco y natural.</li>
        </ul>

        <h3>Formatos disponibles</h3>
        <p>Se puede usar en diferentes formatos:</p>
        <ul>
          <li><strong>Velas:</strong> Ideales para patios y terrazas.</li>
          <li><strong>Lociones:</strong> Para aplicación directa en la piel.</li>
          <li><strong>Sprays:</strong> Prácticos para aplicar en ropa y espacios.</li>
          <li><strong>Difusores:</strong> Para ambientes cerrados.</li>
        </ul>

        <h3>Duración de la protección</h3>
        <p>La citronela generalmente ofrece protección por 1-2 horas. Es recomendable reaplicar según sea necesario, especialmente en áreas con alta población de mosquitos.</p>
      `
    },
    {
      id: 3,
      category: 'Salud',
      date: '8 Octubre 2025',
      title: 'Por qué evitar repelentes con DEET',
      excerpt: 'El DEET es un ingrediente común en muchos repelentes, pero puede tener efectos secundarios. Aquí te explicamos por qué optar por alternativas naturales.',
      readTime: '6 min',
      emoji: '✋🏼',
      content: `
        <h2>⚠️ Por qué evitar repelentes con DEET</h2>
        <p>El DEET es un ingrediente común en muchos repelentes, pero puede tener efectos secundarios. Aquí te explicamos por qué optar por alternativas naturales.</p>
        
        <h3>¿Qué es el DEET?</h3>
        <p>El DEET (N,N-Dietil-meta-toluamida) es un compuesto químico sintético desarrollado en la década de 1940 para uso militar. Aunque es efectivo, presenta varios riesgos para la salud.</p>

        <h3>Efectos secundarios comunes</h3>
        <ul>
          <li><strong>Irritación cutánea:</strong> El DEET puede causar irritación en la piel, especialmente en pieles sensibles.</li>
          <li><strong>Irritación ocular:</strong> El contacto con los ojos puede causar molestias significativas.</li>
          <li><strong>Reacciones alérgicas:</strong> Algunas personas desarrollan erupciones o urticaria.</li>
          <li><strong>Problemas neurológicos:</strong> En casos raros, el uso excesivo se ha asociado con convulsiones.</li>
        </ul>

        <h3>Impacto ambiental</h3>
        <p>Existen preocupaciones sobre el impacto del DEET en el medio ambiente:</p>
        <ul>
          <li>No se biodegrada fácilmente</li>
          <li>Puede contaminar fuentes de agua</li>
          <li>Afecta a organismos acuáticos</li>
          <li>Persiste en el ambiente por largos períodos</li>
        </ul>

        <h3>Alternativas naturales seguras</h3>
        <p>Alternativas como la citronela, eucalipto limón, y otros aceites esenciales ofrecen:</p>
        <ul>
          <li>Protección más suave y segura</li>
          <li>Menos riesgos de efectos secundarios</li>
          <li>Mejor impacto ambiental</li>
          <li>Aromas más agradables</li>
        </ul>

        <h3>Recomendaciones finales</h3>
        <p>Si debes usar DEET, usa concentraciones bajas (10-30%), aplica solo en ropa exterior, y lava la piel después de usarlo. Sin embargo, los repelentes naturales son la mejor opción para uso frecuente y familiar.</p>
      `
    },
    {
      id: 4,
      category: 'Consejos',
      date: '20 Octubre 2025',
      title: '5 Tips para mantener alejados a los mosquitos en casa',
      excerpt: 'Descubre cómo mantener tu hogar libre de mosquitos con estos sencillos y efectivos consejos.',
      readTime: '3 min',
      emoji: '🙌',
      content: `
        <h2>🏡 5 Tips para mantener alejados a los mosquitos en casa</h2>
        <p>Descubre cómo mantener tu hogar libre de mosquitos con estos sencillos y efectivos consejos.</p>
        <h3>1. Usa mosquiteros</h3>
        <p>Instala mosquiteros en ventanas y puertas para evitar que los mosquitos entren a tu hogar.</p>
        <h3>2. Elimina agua estancada</h3>
        <p>Los mosquitos se reproducen en agua estancada. Vacía recipientes y limpia áreas donde pueda acumularse agua.</p>
        <h3>3. Utiliza plantas repelentes</h3>
        <p>Plantas como la citronela, lavanda y albahaca pueden ayudar a mantener alejados a los mosquitos.</p>
        <h3>4. Mantén tu hogar limpio</h3>
        <p>Evita acumular basura y mantén los espacios ventilados y ordenados.</p>
        <h3>5. Usa repelentes naturales</h3>
        <p>Aplica repelentes naturales en áreas estratégicas de tu hogar para mayor protección.</p>
      `
    },
    {
      id: 5,
      category: 'Productos',
      date: '25 Octubre 2025',
      title: 'Los mejores repelentes naturales del mercado',
      excerpt: 'Te presentamos una lista de los repelentes naturales más efectivos y seguros disponibles actualmente.',
      readTime: '4 min',
      emoji: '🧴',
      content: `
        <h2>🌟 Los mejores repelentes naturales del mercado</h2>
        <p>Te presentamos una lista de los repelentes naturales más efectivos y seguros disponibles actualmente.</p>
        <h3>1. Spray de citronela</h3>
        <p>Ideal para uso diario, este spray ofrece protección efectiva y un aroma agradable.</p>
        <h3>2. Velas de eucalipto</h3>
        <p>Perfectas para cenas al aire libre, estas velas mantienen alejados a los mosquitos mientras decoran tu espacio.</p>
        <h3>3. Loción de lavanda</h3>
        <p>Además de repeler insectos, hidrata y calma la piel.</p>
        <h3>4. Difusores de aceites esenciales</h3>
        <p>Una opción práctica para proteger espacios cerrados como oficinas y dormitorios.</p>
      `
    },
    {
      id: 6,
      category: 'Innovación',
      date: '27 Octubre 2025',
      title: 'Nuevas tecnologías en repelentes naturales',
      excerpt: 'Explora las últimas innovaciones en repelentes naturales que están revolucionando el mercado.',
      readTime: '5 min',
      emoji: '🖥️',
      content: `
        <h2>🚀 Nuevas tecnologías en repelentes naturales</h2>
        <p>Explora las últimas innovaciones en repelentes naturales que están revolucionando el mercado.</p>
        <h3>1. Microencapsulación</h3>
        <p>Esta tecnología permite una liberación controlada de los ingredientes activos, prolongando su efectividad.</p>
        <h3>2. Nanotecnología</h3>
        <p>Los repelentes basados en nanotecnología ofrecen una aplicación más uniforme y una mayor adherencia a la piel.</p>
        <h3>3. Ingredientes bioactivos</h3>
        <p>Se están desarrollando nuevos ingredientes derivados de plantas con propiedades repelentes mejoradas.</p>
        <h3>4. Aplicaciones inteligentes</h3>
        <p>Dispositivos conectados que liberan repelentes de manera automática según las condiciones ambientales.</p>
        <h3>5. Sostenibilidad</h3>
        <p>Productos diseñados con materiales biodegradables y procesos de fabricación eco-amigables.</p>
      `
    }
  ];

  const openModal = (article) => {
    setSelectedArticle(article);
    setModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedArticle(null);
    document.body.style.overflow = 'unset';
  };

  return (
    <>
      <Navbar />
      
      {/* Hero Section */}
      <div className="blog-hero">
        <h1 className="blog-title" data-text="Blog">Blog</h1>
        <p className="blog-subtitle">
          Descubre consejos, guías y noticias sobre repelentes naturales y vida saludable
        </p>
        <div className="blog-stats">
          <div className="stat-item">
            <span className="stat-number">50+</span>
            <span className="stat-label">Artículos</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">10K+</span>
            <span className="stat-label">Lectores</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">5★</span>
            <span className="stat-label">Valoración</span>
          </div>
        </div>
      </div>

      <div className="blog-container">
        {/* Main Content */}
        <div className="blog-main">

          {/* Grid de Artículos */}
          <div className="blog-grid">
            {articles.map((article) => (
              <article key={article.id} className="blog-card">
                <div className="blog-card-image">
                  <span className="blog-card-category">{article.category}</span>
                  <span className="blog-card-emoji">{article.emoji}</span>
                </div>
                <div className="blog-card-content">
                  <div className="blog-card-date">{article.date}</div>
                  <h3>{article.title}</h3>
                  <p className="blog-card-excerpt">{article.excerpt}</p>
                  <div className="blog-card-meta">
                    <span className="read-time">{article.readTime}</span>
                    <button 
                      onClick={() => openModal(article)} 
                      className="read-more"
                    >
                      Leer más
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

      </div>

      {/* MODAL CHINGÓN */}
      {modalOpen && selectedArticle && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal}>
              ✕
            </button>
            
            <div className="modal-header">
              <span className="modal-category">{selectedArticle.category}</span>
              <div className="modal-meta">
                <span className="modal-date">{selectedArticle.date}</span>
                <span className="modal-separator">•</span>
                <span className="modal-read-time">{selectedArticle.readTime}</span>
              </div>
            </div>

            <div className="modal-content">
              <div 
                className="modal-article"
                dangerouslySetInnerHTML={{ __html: selectedArticle.content }}
              />
            </div>


          </div>
        </div>
      )}
    </>
  );
};

export default BlogPage;

