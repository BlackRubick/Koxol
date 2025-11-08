import React from 'react';
import { FaShoppingCart } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import Fab from './Fab';

const CartFab = ({ style }) => {
  const navigate = useNavigate();
  const { cart } = useCart();
  const auth = useAuth();
  const count = (cart || []).reduce((acc, it) => acc + (Number(it.qty) || 0), 0);

  const handleClick = () => {
    if (!auth?.isLoggedIn) {
      // Redirect to auth if not logged in
      navigate('/auth');
      return;
    }
    navigate('/cart');
  };

  return (
    <>
      <style>{`
        .cart-fab-wrapper { position: fixed; right: 20px; bottom: 110px; z-index: 1200; }
        .cart-fab-badge {
          position: absolute;
          top: -6px;
          right: -6px;
          background: #ef4444;
          color: white;
          min-width: 20px;
          height: 20px;
          padding: 0 6px;
          font-size: 12px;
          font-weight: 800;
          border-radius: 999px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 6px 14px rgba(0,0,0,0.12);
        }
        @media (min-width: 768px) { .cart-fab-wrapper { display: none; } }
      `}</style>

      <div className="cart-fab-wrapper">
        <Fab className="cart-fab" size={60} onClick={handleClick} ariaLabel={`Abrir carrito (${count} productos)`}>
          <FaShoppingCart size={22} />
        </Fab>
        {count > 0 && <div className="cart-fab-badge" aria-hidden>{count}</div>}
      </div>
    </>
  );
};

export default CartFab;
