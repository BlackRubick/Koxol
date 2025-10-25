import React, { useState } from "react";
import "./CheckoutModal.css";

const CheckoutModal = ({ open, cart, onClose, onConfirm }) => {
  const [form, setForm] = useState({
    nombre: "",
    email: "",
    direccion: "",
    telefono: "",
  });

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    onConfirm(form);
  };

  if (!open) return null;

  const total = cart.reduce((acc, item) => acc + (item.price || 0) * item.qty, 0);

  return (
    <div className="checkout-modal" onClick={onClose}>
      <div className="checkout-modal__content" onClick={e => e.stopPropagation()}>
        <h2>Finalizar compra</h2>
        <form onSubmit={handleSubmit} className="checkout-form">
          <input
            type="text"
            name="nombre"
            placeholder="Nombre completo"
            value={form.nombre}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Correo electrónico"
            value={form.email}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="direccion"
            placeholder="Dirección de envío"
            value={form.direccion}
            onChange={handleChange}
            required
          />
          <input
            type="tel"
            name="telefono"
            placeholder="Teléfono"
            value={form.telefono}
            onChange={handleChange}
            required
          />
          <div className="checkout-summary">
            <h4>Resumen</h4>
            <ul>
              {cart.map(item => (
                <li key={item.id || item.name}>
                  {item.name} x{item.qty} <span>${(item.price || 0) * item.qty} MXN</span>
                </li>
              ))}
            </ul>
            <div className="checkout-total">
              Total: <b>${total} MXN</b>
            </div>
          </div>
          <button type="submit" className="checkout-btn">Confirmar pedido</button>
        </form>
        <button className="close-btn" onClick={onClose}>Cerrar</button>
      </div>
    </div>
  );
};

export default CheckoutModal;
