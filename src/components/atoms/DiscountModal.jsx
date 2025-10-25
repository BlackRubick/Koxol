import './DiscountModal.css';

export default function DiscountModal({ open, onClose, onRegister }) {
  if (!open) return null;
  return (
    <div className="discount-modal-backdrop animate-fade-in">
      <div className="discount-modal glass animate-pop-in">
        <button className="close-btn" onClick={onClose} aria-label="Cerrar modal">×</button>
        <div className="discount-icon">
          <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
            <circle cx="30" cy="30" r="30" fill="var(--color-secondary)" />
            <text x="30" y="34" textAnchor="middle" fill="#fff" fontSize="20" fontWeight="bold" alignmentBaseline="middle" dominantBaseline="middle">20%</text>
          </svg>
        </div>
        <h2>¡Descuento exclusivo!</h2>
        <p>Regístrate y obtén un <b>20% de descuento</b> en tu primera compra.<br/>¡Aprovecha esta oportunidad premium!</p>
        <button className="register-btn" onClick={onRegister}>Registrarme</button>
      </div>
    </div>
  );
}
