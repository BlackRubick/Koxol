// Molecule: Carrusel touch-friendly de productos
import React, { useRef, useEffect } from 'react';
import ProductCard from '../atoms/ProductCard';
import './ProductCarousel.css';

const ProductCarousel = ({ products, onView, onAddToCart }) => {
  const carouselRef = useRef(null);

  // Scroll suave con botones
  const scroll = (dir) => {
    if (carouselRef.current) {
      const width = carouselRef.current.offsetWidth;
      carouselRef.current.scrollBy({ left: dir * (width * 0.7), behavior: 'smooth' });
    }
  };

  // Autoplay: desplaza ligeramente cada X ms
  useEffect(() => {
    const el = carouselRef.current;
    if (!el) return;
    let paused = false;
    const interval = setInterval(() => {
      if (paused) return;
      // desplazar suavemente
      el.scrollBy({ left: el.offsetWidth * 0.5, behavior: 'smooth' });
      // si llega al final, volver al inicio
      if (el.scrollLeft + el.clientWidth >= el.scrollWidth - 10) {
        setTimeout(() => { el.scrollTo({ left: 0, behavior: 'smooth' }); }, 800);
      }
    }, 3500);

    const onEnter = () => { paused = true; };
    const onLeave = () => { paused = false; };
    el.addEventListener('mouseenter', onEnter);
    el.addEventListener('mouseleave', onLeave);

    return () => {
      clearInterval(interval);
      el.removeEventListener('mouseenter', onEnter);
      el.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  return (
    <div className="product-carousel">
      <div className="product-carousel__track" ref={carouselRef}>
        {products.map((p, i) => {
          const cardProps = { ...p };
          if (typeof onView === 'function') cardProps.onView = () => onView(p);
          if (typeof onAddToCart === 'function') cardProps.onAddToCart = () => onAddToCart(p);
          if (p.onAddToCart && typeof p.onAddToCart === 'function') cardProps.onAddToCart = () => p.onAddToCart(p);
          return <ProductCard key={p.id || p.name} {...cardProps} />;
        })}
      </div>
    </div>
  );
};

export default ProductCarousel;
