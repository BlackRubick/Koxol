import React from 'react';
import './ShareModal.css';
import { setJSON } from '../../utils/storage';

function randomCode() {
  return Math.random().toString(36).substring(2, 7).toUpperCase();
}

export default function ShareModal({ open, onClose }) {
  if (!open) return null;

  const handleShare = () => {
    // Generar cupón 5%
    const code = `KOXOL-SHARE-${randomCode()}`;
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString(); // 7 días
    const coupon = {
      code,
      discountPercent: 5,
      label: 'Cupón por compartir',
      expiresAt,
      used: false,
      createdAt: new Date().toISOString()
    };

    try {
      setJSON('shareCoupon', coupon);
    } catch (err) {
      console.error('No se pudo guardar el cupón:', err);
    }

    // Construir mensaje de WhatsApp
    const pageUrl = typeof window !== 'undefined' ? window.location.href : 'https://koxol.example';
    const message = `¡Hola! Te comparto esta página: ${pageUrl}\n\nHe obtenido un 5% de descuento en Koxol por compartir este link. Usa el código ${code} al comprar. ¡Échale un vistazo!`;
    const waLink = `https://wa.me/?text=${encodeURIComponent(message)}`;

    // Abrir WhatsApp Web / App
    window.open(waLink, '_blank');

    // Cerrar modal después de abrir
    if (onClose) onClose();
  };

  return (
    <div className="share-modal-backdrop" role="dialog" aria-modal="true">
      <div className="share-modal">
        <h3>Comparte con un amigo y obtiene 5% de descuento</h3>
        <p>
          Envía el enlace de esta página por WhatsApp y recibirás un cupón del 5% que se guardará en tu navegador.
          Puedes usarlo en el carrito al finalizar tu compra.
        </p>
        <div className="share-actions">
          <button className="btn btn-secondary" onClick={onClose}>Cerrar</button>
          <button className="btn btn-primary" onClick={handleShare}>Compartir por WhatsApp</button>
        </div>
      </div>
    </div>
  );
}
