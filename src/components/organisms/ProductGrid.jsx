import React from 'react';
import productsData from '../../data/products';
import ProductCard from '../atoms/ProductCard';
import './ProductGrid.css';

export default function ProductGrid({ onAddToCart }) {
  return (
    <section className="koxol-product-grid" id="catalogo">
      <h2 className="koxol-product-grid__title">Catálogo de Productos</h2>
      <div className="koxol-product-grid__list">
        {productsData.map(product => (
          <ProductCard key={product.id} {...product} onAddToCart={onAddToCart} />
        ))}
      </div>
    </section>
  );
}
