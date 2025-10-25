// Organism: Hero Section premium estilo Apple para K'oxol
import React from 'react';
import Button from '../atoms/Button';
import Tilt from 'react-parallax-tilt';
import './Hero.css';

const Hero = () => (
  <section className="koxol-hero">
    <div className="koxol-hero__ambient-orb koxol-hero__ambient-orb--1"></div>
    <div className="koxol-hero__ambient-orb koxol-hero__ambient-orb--2"></div>
    
    <div className="koxol-hero__container">
      <div className="koxol-hero__content">
        <div className="koxol-hero__badge">
          <span className="koxol-hero__badge-icon">🌿</span>
          <span className="koxol-hero__badge-text">100% Natural</span>
        </div>
        
        <h1 className="koxol-hero__title">
          K'oxol – 
          <span className="koxol-hero__title-highlight"> Mosquitos?</span>
          <br />
          <span className="koxol-hero__title-accent">¡Ni uno más!</span>
        </h1>
        
        <p className="koxol-hero__subtitle">
          Protección natural para ti, tu familia y el entorno
        </p>
        
        <div className="koxol-hero__cta">
          <Button variant="primary" style={{fontSize: '1.1rem', padding: '1rem 2.5rem'}}>
            Descubre la protección natural
          </Button>
          <div className="koxol-hero__stats">
            <div className="koxol-hero__stat">
              <span className="koxol-hero__stat-number">8h</span>
              <span className="koxol-hero__stat-label">Protección</span>
            </div>
            <div className="koxol-hero__stat-divider"></div>
            <div className="koxol-hero__stat">
              <span className="koxol-hero__stat-number">0%</span>
              <span className="koxol-hero__stat-label">Químicos</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="koxol-hero__media">
        <div className="koxol-hero__image-frame">
          <Tilt 
            glareEnable={true} 
            glareMaxOpacity={0.2} 
            scale={1.05} 
            tiltMaxAngleX={12} 
            tiltMaxAngleY={12} 
            transitionSpeed={1500}
            className="koxol-hero__tilt"
          >
            <div className="koxol-hero__image-wrapper">
              <img 
                src="/hero.jpeg" 
                alt="Repelente natural K'oxol" 
                className="koxol-hero__img" 
              />
              <div className="koxol-hero__image-shine"></div>
            </div>
          </Tilt>
        </div>
        


      </div>
    </div>
    
    <div className="koxol-hero__bg-glass" />
  </section>
);

export default Hero;