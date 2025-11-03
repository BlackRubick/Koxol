// Organismo: Catálogo de Productos K'oxol (E-commerce)
import React, { useState } from 'react';
import './ProductCatalog.css';
import productsData from '../../data/products';
import ProductCarousel from '../molecules/ProductCarousel';
import Modal from '../atoms/Modal';
import { useAuth } from '../../contexts/AuthContext';

const ProductCatalog = ({ onAddToCart }) => {
  const [products] = useState(productsData);
  const { isLoggedIn } = useAuth();
  const [selectedProduct, setSelectedProduct] = useState(null);

  const handleViewProduct = (product) => {
    setSelectedProduct(product);
  };

  const handleCloseModal = () => setSelectedProduct(null);

  return (
    <>
      <section className="koxol-product-catalog" id="catalogo">
      <h2 className="koxol-product-catalog__title">Catálogo de Productos</h2>
  {/* Pass full product objects so Modal can access images and other fields */}
  <ProductCarousel products={products} onView={handleViewProduct} onAddToCart={onAddToCart} />
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
      {selectedProduct && (
        <Modal product={selectedProduct} onClose={handleCloseModal} />
      )}
    </>
  );
};

export default ProductCatalog;
