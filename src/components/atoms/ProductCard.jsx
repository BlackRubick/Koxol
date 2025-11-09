// Atom: Card visual para producto

import React, { useState } from 'react';
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
}) => {
  const isEssence = String(name || '').toLowerCase().includes('esencia') || String(name || '').toLowerCase().includes('esencias') || id === 7;
  // default sizes/prices for essences
  const essenceSizes = [
    { label: '125 ml', value: 125, price: 35 },
    { label: '250 ml', value: 250, price: 70 }
  ];
  const [selectedSize, setSelectedSize] = useState(essenceSizes[0]);

  const displayedPrice = isEssence ? selectedSize.price : price;

  const handleAdd = (e) => {
    e.stopPropagation();
    if (typeof onAddToCart === 'function') {
      const item = {
        id: isEssence ? `${id}-${selectedSize.value}` : id,
        name: isEssence ? `${name} ${selectedSize.label}` : name,
        price: displayedPrice,
        qty: 1,
        image,
        isMembership: false
      };
      onAddToCart(item);
    }
  };

  return (
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
        <span className="product-card__price">${displayedPrice} MXN</span>
      </div>
      {isEssence && (
        <div style={{ marginTop: 8 }}>
          <label style={{ fontSize: 12, color: '#64748b', marginRight: 8 }}>Tamaño:</label>
          <select value={selectedSize.value} onChange={(e) => {
            const v = parseInt(e.target.value, 10);
            const s = essenceSizes.find(x => x.value === v) || essenceSizes[0];
            setSelectedSize(s);
          }} style={{ padding: 6, borderRadius: 8 }} onClick={(e)=>e.stopPropagation()}>
            {essenceSizes.map(s => <option key={s.value} value={s.value}>{s.label} - ${s.price}</option>)}
          </select>
        </div>
      )}
      {shipping ? (
        <span className="product-card__shipping">{shipping}</span>
      ) : <span style={{ height: '1em', display: 'block' }}></span>}
      <p className="product-card__desc">{desc}</p>
      <div style={{ marginTop: 12 }}>
        <Button onClick={handleAdd} className="product-card__add">Agregar</Button>
      </div>
    </div>

  </div>
  );
};

export default ProductCard;
