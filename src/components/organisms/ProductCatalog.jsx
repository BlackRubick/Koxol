// Organismo: Catálogo de Productos K'oxol (E-commerce)
import React, { useState } from 'react';
import './ProductCatalog.css';
import productsData from '../../data/products';
import ProductCarousel from '../molecules/ProductCarousel';
import { useAuth } from '../../contexts/AuthContext';

const ProductCatalog = ({ onAddToCart }) => {
  const [products] = useState(productsData);
  const { isLoggedIn } = useAuth();

  return (
    <section className="koxol-product-catalog" id="catalogo">
      <h2 className="koxol-product-catalog__title">Catálogo de Productos</h2>
      <ProductCarousel products={products.map(p => ({ id: p.id, name: p.name, desc: p.desc, price: p.price, image: p.image }))} onAddToCart={onAddToCart} />
      <div className="buy-now-container">
        <button
          className="buy-now-btn"
          onClick={() => {
            window.location.href = isLoggedIn ? '/shop' : '/auth';
          }}
        >
          Compra Ya
        </button>
      </div>
    </section>
  );
};

export default ProductCatalog;
