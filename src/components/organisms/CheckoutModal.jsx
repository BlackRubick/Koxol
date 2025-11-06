import React, { useState } from "react";
import "./CheckoutModal.css";

const CheckoutModal = ({ open, cart, onClose, onConfirm }) => {
  const [form, setForm] = useState({
    nombre: "",
    email: "",
    direccion: "",
    telefono: "",
  });
  const [errors, setErrors] = useState({});

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    // Validate required fields before sending to parent
    const nextErrors = {};
    if (!form.nombre || String(form.nombre).trim().length < 2) nextErrors.nombre = 'Ingresa tu nombre completo';
    const email = String(form.email || '').trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) nextErrors.email = 'Ingresa un correo electrónico';
    else if (!emailRegex.test(email)) nextErrors.email = 'Correo inválido';

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      // focus the first invalid field for better UX
      const firstKey = Object.keys(nextErrors)[0];
      const el = document.querySelector(`input[name="${firstKey}"]`);
      if (el && typeof el.focus === 'function') el.focus();
      return;
    }

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
          {errors.nombre && <div style={{ color: '#b91c1c', fontSize: 13, marginTop: 6 }}>{errors.nombre}</div>}
          <input
            type="email"
            name="email"
            placeholder="Correo electrónico"
            value={form.email}
            onChange={handleChange}
            required
          />
          {errors.email && <div style={{ color: '#b91c1c', fontSize: 13, marginTop: 6 }}>{errors.email}</div>}
          <input
            type="text"
            name="direccion"
            placeholder="Dirección de envío"
            value={form.direccion}
            onChange={handleChange}
            required
          />
          {errors.direccion && <div style={{ color: '#b91c1c', fontSize: 13, marginTop: 6 }}>{errors.direccion}</div>}
          <input
            type="tel"
            name="telefono"
            placeholder="Teléfono"
            value={form.telefono}
            onChange={handleChange}
            required
          />
          {errors.telefono && <div style={{ color: '#b91c1c', fontSize: 13, marginTop: 6 }}>{errors.telefono}</div>}
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
