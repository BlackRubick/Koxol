import React from 'react';
import Navbar from '../components/molecules/Navbar';
import './PodcastPage.css';

let currentAudio = null;

const PodcastPage = () => {
  const playAudio = (sectionId) => {
    const audioMap = {
      'origen-citronela': '/1origen.mp3',
      'mitos-realidades': '/2mitos.mpeg',
      'mosquitos-salud': '/3mosquitosysalud.mpeg',
      'spray-crema-pulsera': '/4comoelegir.mpeg',
      'tips': '/5tips.mpeg',
    };

    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
    }

    currentAudio = new Audio(audioMap[sectionId]);
    currentAudio.play();
  };

  return (
    <div className="podcast-page">
      <Navbar />
      <section className="podcast-video">
        <iframe
          className="podcast-video__player"
          src="https://www.youtube.com/embed/j6LunB9d2Bo?autoplay=1&rel=0&mute=1"
          title="Podcast Video"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
        <div className="podcast-video__text">
          <h1>Bienvenido al Podcast de K'oxol</h1>
          <p>Explora temas sobre Origen de la Citronela , Mitos y realidades y más.</p>
        </div>
      </section>
      <section className="podcast-section" id="origen-citronela">
        <h2>Origen de la Citronela</h2>
        <p>Descubre la historia y el origen de esta planta maravillosa.</p>
        <button className="audio-button" onClick={() => playAudio('origen-citronela')}>Reproducir Audio</button>
      </section>
      <section className="podcast-section" id="mitos-realidades">
        <h2>Mitos y Realidades de la Citronela</h2>
        <p>Desmentimos los mitos y confirmamos las realidades sobre la citronela.</p>
        <button className="audio-button" onClick={() => playAudio('mitos-realidades')}>Reproducir Audio</button>
      </section>
      <section className="podcast-section" id="mosquitos-salud">
        <h2>Mosquitos y Salud</h2>
        <p>Aprende cómo la citronela puede ayudarte a proteger tu salud.</p>
        <button className="audio-button" onClick={() => playAudio('mosquitos-salud')}>Reproducir Audio</button>
      </section>
      <section className="podcast-section" id="spray-crema-pulsera">
        <h2>¿Cómo Elegir entre Spray, Crema o Pulsera?</h2>
        <p>Conoce las diferencias y cuál es la mejor opción para ti.</p>
        <button className="audio-button" onClick={() => playAudio('spray-crema-pulsera')}>Reproducir Audio</button>
      </section>
      <section className="podcast-section" id="tips">
        <h2>TIPS</h2>
        <p>Consejos prácticos para aprovechar al máximo la citronela.</p>
        <button className="audio-button" onClick={() => playAudio('tips')}>Reproducir Audio</button>
      </section>
    </div>
  );
};

export default PodcastPage;