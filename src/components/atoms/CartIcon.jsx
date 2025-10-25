// Átomo: Icono de carrito de compras
import { FaShoppingCart } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const CartIcon = ({ count = 0 }) => {
  const navigate = useNavigate();

  const handleNavigateToCart = () => {
    navigate('/cart'); // Cambia '/cart' por la ruta correcta si es diferente
  };

  return (
    <div className="cart-icon" onClick={handleNavigateToCart} style={{ position: 'relative', cursor: 'pointer' }}>
      <FaShoppingCart size={26} />
      {count > 0 && (
        <span className="cart-icon__badge">{count}</span>
      )}
    </div>
  );
};

export default CartIcon;
