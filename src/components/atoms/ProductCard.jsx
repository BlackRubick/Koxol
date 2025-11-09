// Atom: Card visual para producto

import React from 'react';
import Button from './Button';
import './ProductCard.css';

// Props extendidas: originalPrice, discount, rating, sales, shipping
const ProductCard = ({
  id,
  price,
  image,
  name,
  desc,
  onView,
  onAddToCart,
  originalPrice,
  discount,
  rating,
  sales,
  shipping,
  onClick // Added onClick prop
}) => (
  <div className="product-card" onClick={() => onClick && onClick(id)}> {/* Trigger onClick with product id */}
    <div className="product-card__img-wrap">
      <img src={image} alt={name} className="product-card__img" />
      {discount ? (
        <span className="product-card__discount">-{discount}%</span>
      ) : null}
    </div>
  <div className="product-card__info">
      <h4 className="product-card__name">{name}</h4>
      {(rating || sales) ? (
        <div className="product-card__rating">
          {rating ? <span className="product-card__stars">★ {rating}</span> : null}
          {sales ? <span className="product-card__sales"> | {sales} vendidos</span> : null}
        </div>
      ) : <div style={{ height: '1.2em' }}></div>}
      {originalPrice ? (
        <span className="product-card__original-price">${originalPrice}</span>
      ) : <span style={{ height: '1em', display: 'block' }}></span>}
      <div className="product-card__price-row">
        <span className="product-card__price">${price} MXN</span>
      </div>
      {shipping ? (
        <span className="product-card__shipping">{shipping}</span>
      ) : <span style={{ height: '1em', display: 'block' }}></span>}
      <p className="product-card__desc">{desc}</p>
    </div>

  </div>
);

export default ProductCard;
