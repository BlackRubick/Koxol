import './CouponModal.css';
import { useEffect } from 'react';
import { createPortal } from 'react-dom';

function CouponModalContent({ coupon, onClose }) {
  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(coupon.code);
    } catch (err) {
      console.error('Error copiando código:', err);
    }
  };

  const expiresDate = coupon.expiresAt ? new Date(coupon.expiresAt).toLocaleDateString() : '—';

  return (
    <div className="coupon-backdrop">
      <div className="coupon-modal glass">
        <button className="coupon-close" onClick={onClose} aria-label="Cerrar">×</button>
        <div className="coupon-header">
          <h2>¡Bienvenido a Koxol!</h2>
          <p className="coupon-sub">Gracias por registrarte. Aquí tienes tu cupón de bienvenida:</p>
        </div>

        <div className="coupon-body">
          <div className="coupon-code">{coupon.code}</div>
          <div className="coupon-details">
            <strong>{Math.round((coupon.discount || 0) * 100)}% de descuento</strong>
            <span>• Expira: {expiresDate}</span>
          </div>

          <p className="coupon-instruction">Usa este código en el checkout para obtener tu descuento. ¡Disfruta!</p>

          <div className="coupon-actions">
            <button className="coupon-copy" onClick={copyCode}>Copiar código</button>
            <button className="coupon-close-btn" onClick={onClose}>Ir a la tienda</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CouponModal({ open, coupon, onClose }) {
  useEffect(() => {
    if (open) {
      // Pedir al App que cierre el DiscountModal si está abierto
      window.dispatchEvent(new CustomEvent('request-close-discount'));
    }
  }, [open]);

  if (!open || !coupon) return null;

  // Renderizar en portal al <body> para evitar clipping dentro del formulario
  return createPortal(
    <CouponModalContent coupon={coupon} onClose={onClose} />,
    document.body
  );
}
