// Organismo: Carrito de Compras (modal)
import React from 'react';
import './CartModal.css';

const CartModal = ({ open, cart, onClose, onRemove, onQtyChange, onCheckout }) => {
  if (!open) return null;
  const total = cart.reduce((acc, item) => acc + item.price * item.qty, 0);
  return (
    <div className="cart-modal__backdrop" onClick={onClose}>
      <div className="cart-modal" onClick={e => e.stopPropagation()} style={{ borderRadius: '12px', boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)', padding: '2em', maxWidth: '800px', margin: '0 auto' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#176c3a', marginBottom: '1.5em' }}>Tu Carrito</h2>
        {cart.length === 0 ? (
          <p className="cart-modal__empty" style={{ textAlign: 'center', color: '#999', margin: '2em 0' }}>El carrito está vacío.</p>
        ) : (
          <ul className="cart-modal__list" style={{ listStyle: 'none', padding: '0', margin: '0 0 1.5em 0' }}>
            {cart.map(item => (
              <li key={item.id} className="cart-modal__item" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1em', borderBottom: '1px solid #f0f0f0' }}>
                <img src={item.image} alt={item.name} style={{ width: '60px', height: '60px', borderRadius: '8px' }} />
                <div className="cart-modal__info" style={{ flex: '1', marginLeft: '1em' }}>
                  <span className="cart-modal__name" style={{ fontSize: '16px', fontWeight: '600', color: '#333' }}>{item.name}</span>
                  <span className="cart-modal__price" style={{ fontSize: '14px', color: '#176c3a', fontWeight: '700' }}>${item.price} MXN</span>
                  <div className="cart-modal__qty" style={{ display: 'flex', alignItems: 'center', gap: '0.5em' }}>
                    <button onClick={() => onQtyChange(item, item.qty - 1)} disabled={item.qty === 1} style={{ background: '#f0f0f0', border: 'none', borderRadius: '50%', width: '26px', height: '26px', fontSize: '1.1rem', fontWeight: '700', color: '#176c3a', cursor: 'pointer' }}>-</button>
                    <span>{item.qty}</span>
                    <button onClick={() => onQtyChange(item, item.qty + 1)} style={{ background: '#f0f0f0', border: 'none', borderRadius: '50%', width: '26px', height: '26px', fontSize: '1.1rem', fontWeight: '700', color: '#176c3a', cursor: 'pointer' }}>+</button>
                  </div>
                </div>
                <button className="cart-modal__remove" onClick={() => onRemove(item)} style={{ background: 'none', border: 'none', color: '#e74c3c', fontSize: '1.5rem', cursor: 'pointer', marginLeft: '0.5em' }}>&times;</button>
              </li>
            ))}
          </ul>
        )}
        <div className="cart-modal__footer" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1em' }}>
          <span style={{ fontSize: '18px', fontWeight: '700', color: '#176c3a' }}>Total: <strong>${total} MXN</strong></span>
          <button className="cart-modal__close" onClick={onClose} style={{ background: '#f0f0f0', color: '#333', padding: '0.8em 1.5em', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '16px', fontWeight: '600' }}>Cerrar</button>
          <button className="cart-modal__checkout" disabled={cart.length === 0} onClick={onCheckout} style={{ background: '#176c3a', color: '#ffffff', padding: '0.8em 1.5em', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '16px', fontWeight: '600' }}>Finalizar compra</button>
        </div>
      </div>
    </div>
  );
};

export default CartModal;
