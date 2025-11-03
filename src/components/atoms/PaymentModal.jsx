import React, { useState, useEffect } from 'react';

const PaymentModalCSS = `
.pm-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  animation: pm-fade 300ms ease;
}

.pm-card {
  width: 520px;
  max-width: calc(100% - 40px);
  background: linear-gradient(145deg, #ffffff 0%, #f0fff7 100%);
  border-radius: 20px;
  box-shadow: 0 25px 80px rgba(23, 108, 58, 0.25), 0 0 0 1px rgba(23, 108, 58, 0.08);
  overflow: hidden;
  transform-origin: center;
  animation: pm-pop 400ms cubic-bezier(0.34, 1.56, 0.64, 1);
}

.pm-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px 28px;
  background: linear-gradient(135deg, #176c3a 0%, #1a8447 100%);
  position: relative;
  overflow: hidden;
}

.pm-header::before {
  content: '';
  position: absolute;
  top: -50%;
  right: -10%;
  width: 200px;
  height: 200px;
  background: radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 70%);
  animation: pm-glow 3s ease-in-out infinite;
}

.pm-title {
  font-size: 22px;
  font-weight: 800;
  color: #ffffff;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 10px;
  position: relative;
  z-index: 1;
}

.pm-title::before {
  content: '💳';
  font-size: 24px;
  animation: pm-bounce 2s ease-in-out infinite;
}

.pm-close {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  font-size: 20px;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 200ms ease;
  position: relative;
  z-index: 1;
}

.pm-close:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: rotate(90deg);
}

.pm-content {
  padding: 28px;
}

.pm-body {
  animation: pm-slide-in 400ms ease 100ms backwards;
}

.pm-intro {
  color: #2d5a3d;
  margin-bottom: 20px;
  font-weight: 600;
  font-size: 15px;
  line-height: 1.5;
}

.pm-help {
  color: #5a7d68;
  margin-top: 16px;
  font-size: 14px;
  line-height: 1.5;
  padding: 12px;
  background: rgba(23, 108, 58, 0.05);
  border-radius: 8px;
  border-left: 3px solid #176c3a;
}

.pm-account-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: linear-gradient(135deg, #f0fff7 0%, #ffffff 100%);
  border: 2px solid rgba(23, 108, 58, 0.15);
  padding: 20px;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(23, 108, 58, 0.08);
  transition: all 300ms ease;
  animation: pm-pulse 2s ease-in-out infinite;
}

.pm-account-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(23, 108, 58, 0.15);
  border-color: rgba(23, 108, 58, 0.3);
}

.pm-bank {
  font-weight: 800;
  color: #176c3a;
  font-size: 16px;
  letter-spacing: 0.5px;
  text-transform: uppercase;
}

.pm-account {
  font-size: 20px;
  font-weight: 700;
  color: #0b3f22;
  margin-top: 8px;
  letter-spacing: 1px;
  font-family: 'Courier New', monospace;
}

.pm-copy-btn {
  background: linear-gradient(135deg, #176c3a 0%, #1a8447 100%);
  color: white;
  padding: 12px 20px;
  border-radius: 12px;
  border: none;
  cursor: pointer;
  font-weight: 700;
  font-size: 14px;
  transition: all 200ms ease;
  box-shadow: 0 4px 12px rgba(23, 108, 58, 0.3);
  position: relative;
  overflow: hidden;
}

.pm-copy-btn::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  transform: translate(-50%, -50%);
  transition: width 400ms ease, height 400ms ease;
}

.pm-copy-btn:hover::before {
  width: 300px;
  height: 300px;
}

.pm-copy-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(23, 108, 58, 0.4);
}

.pm-copy-btn:active {
  transform: translateY(0);
}

.pm-copy-btn span {
  position: relative;
  z-index: 1;
}

.pm-summary {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 24px;
  padding: 18px 20px;
  border-radius: 14px;
  background: linear-gradient(135deg, #f0fff7 0%, #ffffff 100%);
  border: 2px solid rgba(23, 108, 58, 0.15);
  box-shadow: 0 4px 12px rgba(23, 108, 58, 0.08);
  animation: pm-slide-in 400ms ease 200ms backwards;
}

.pm-summary-label {
  color: #2d5a3d;
  font-weight: 700;
  font-size: 15px;
}

.pm-summary-value {
  font-weight: 900;
  color: #176c3a;
  font-size: 26px;
  text-shadow: 0 2px 4px rgba(23, 108, 58, 0.1);
  animation: pm-scale 1s ease-in-out infinite;
}

.pm-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 24px;
  animation: pm-slide-in 400ms ease 300ms backwards;
}

.pm-secondary {
  background: white;
  border: 2px solid rgba(23, 108, 58, 0.2);
  padding: 12px 24px;
  border-radius: 12px;
  cursor: pointer;
  font-weight: 700;
  color: #176c3a;
  transition: all 200ms ease;
}

.pm-secondary:hover {
  background: rgba(23, 108, 58, 0.05);
  border-color: rgba(23, 108, 58, 0.4);
  transform: translateY(-2px);
}

.pm-confirm {
  background: linear-gradient(135deg, #176c3a 0%, #1a8447 100%);
  color: white;
  padding: 12px 28px;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  font-weight: 800;
  font-size: 15px;
  transition: all 200ms ease;
  box-shadow: 0 4px 12px rgba(23, 108, 58, 0.3);
  position: relative;
  overflow: hidden;
}

.pm-confirm::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  transform: translate(-50%, -50%);
  transition: width 400ms ease, height 400ms ease;
}

.pm-confirm:hover::before {
  width: 300px;
  height: 300px;
}

.pm-confirm:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(23, 108, 58, 0.4);
}

.pm-confirm:active {
  transform: translateY(0);
}

.pm-confirm span {
  position: relative;
  z-index: 1;
}

@keyframes pm-pop {
  0% {
    transform: translateY(30px) scale(0.9);
    opacity: 0;
  }
  60% {
    transform: translateY(-5px) scale(1.02);
  }
  100% {
    transform: translateY(0) scale(1);
    opacity: 1;
  }
}

@keyframes pm-fade {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes pm-slide-in {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes pm-bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-5px);
  }
}

@keyframes pm-glow {
  0%, 100% {
    opacity: 0.3;
    transform: translate(0, 0);
  }
  50% {
    opacity: 0.6;
    transform: translate(-20px, 10px);
  }
}

@keyframes pm-pulse {
  0%, 100% {
    box-shadow: 0 4px 12px rgba(23, 108, 58, 0.08);
  }
  50% {
    box-shadow: 0 4px 20px rgba(23, 108, 58, 0.15);
  }
}

@keyframes pm-scale {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}
`;

const PaymentModal = ({ open, onClose, method, amount, cart = [], shippingData = {}, onConfirm }) => {
  const [copied, setCopied] = useState(false);
  const [card, setCard] = useState({ number: '', name: '', expiry: '', cvc: '' });
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [confirmed, setConfirmed] = useState(false);


  const accountNumber = '4152 3140 6924 0011';
  const bankName = 'BBVA';

  // PayPal integration removed — PayPal option disabled in CartFlow

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      console.error('No se pudo copiar:', err);
    }
  };

  // don't render anything until open is true, but call hooks above consistently
  if (!open) return null;

  const renderBody = () => {
    if (method === 'SPEI' || method === 'OXXO') {
      return (
        <div className="pm-body">
          {!confirmed ? (
            <>
              <p className="pm-intro">Usa los datos de la cuenta abajo para completar tu pago.</p>

              <div className="pm-account-card">
                <div className="pm-account-left">
                  <div className="pm-bank">{bankName}</div>
                  <div className="pm-account">{accountNumber}</div>
                </div>
                <div className="pm-account-right">
                  <button
                    className="pm-copy-btn"
                    onClick={() => copyToClipboard(accountNumber)}
                    aria-label="Copiar número de cuenta"
                  >
                    <span>{copied ? '✓ Copiado' : '📋 Copiar'}</span>
                  </button>
                </div>
              </div>

              <p className="pm-help">💡 Después de hacer la transferencia, vuelve aquí y confirma para completar tu orden.</p>
            </>
          ) : (
            <div style={{ textAlign: 'center', padding: '18px' }}>
              <div style={{ fontSize: 44 }}>⏳</div>
              <h4 style={{ color: '#116a35', marginTop: 8 }}>Esperaremos tu pago</h4>
              <p style={{ color: '#2f6b49' }}>Hemos registrado tu instrucción. Una vez que recibamos y verifiquemos el pago (estimado 1–3 horas) te notificaremos sobre tu pedido.</p>
            </div>
          )}
        </div>
      );
    }

    if (method === 'Tarjeta de crédito/débito') {
      return (
        <div className="pm-body">
          {!success ? (
            <>
              <p className="pm-intro">Ingresa los datos de tu tarjeta para realizar un pago.</p>

              <div className="card-form">
                <label className="label">Número de tarjeta</label>
                <input
                  className="input"
                  placeholder="4111 1111 1111 1111"
                  value={card.number}
                  onChange={(e) => setCard(prev => ({ ...prev, number: e.target.value }))}
                  maxLength={19}
                />

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 120px', gap: '12px' }}>
                  <div>
                    <label className="label">Nombre en la tarjeta</label>
                    <input
                      className="input"
                      placeholder="JUAN PEREZ"
                      value={card.name}
                      onChange={(e) => setCard(prev => ({ ...prev, name: e.target.value }))}
                    />
                  </div>

                  <div>
                    <label className="label">Expira (MM/AA)</label>
                    <input
                      className="input"
                      placeholder="12/26"
                      value={card.expiry}
                      onChange={(e) => setCard(prev => ({ ...prev, expiry: e.target.value }))}
                      maxLength={5}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '12px' }}>
                  <div>
                    <label className="label">CVC</label>
                    <input
                      className="input"
                      placeholder="123"
                      value={card.cvc}
                      onChange={(e) => setCard(prev => ({ ...prev, cvc: e.target.value }))}
                      maxLength={4}
                    />
                  </div>
                  <div>
                    <label className="label">Monto</label>
                    <input className="input" value={`$ ${amount.toFixed(2)}`} readOnly />
                  </div>
                </div>
              </div>

            </>
          ) : (
            <div style={{ textAlign: 'center', padding: '18px' }}>
              <div style={{ fontSize: 44 }}>✅</div>
              <h4 style={{ color: '#116a35', marginTop: 8 }}>Pago exitoso</h4>
              <p style={{ color: '#2f6b49' }}>Tu pago con tarjeta fue procesado correctamente.</p>
            </div>
          )}
        </div>
      );
    }

    if (method === 'Mercado Pago') {
      return (
        <div className="pm-body">
          <p className="pm-intro">Pagarás con Mercado Pago. Al pulsar el botón se abrirá la pasarela de Mercado Pago en una nueva pestaña (sandbox).</p>
          <div style={{ marginTop: 12 }}>
            <button
              className="pm-confirm"
              onClick={async () => {
                try {
                  setProcessing(true);
                  // Build items from cart
                  const itemsToSend = (cart && cart.length > 0)
                    ? cart.map(i => ({ title: i.name || 'Producto', unit_price: Number(parseFloat(i.price) || 0), quantity: Number(i.qty || 1) }))
                    : [{ title: "Compra K'oxol", unit_price: Number(amount.toFixed(2)), quantity: 1 }];

                  const payload = { items: itemsToSend };
                  // add payer info if available
                  if (shippingData && shippingData.fullName) {
                    payload.payer = {
                      name: shippingData.fullName,
                      phone: { number: shippingData.phone || '' },
                      address: { zip_code: shippingData.zipCode || '' }
                    };
                  }

                  const res = await fetch('/api/create_preference', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                  });

                  const data = await res.json();
                  setProcessing(false);
                  if (res.ok && (data.init_point || data.sandbox_init_point)) {
                    const url = data.init_point || data.sandbox_init_point;
                    window.open(url, '_blank');
                    setConfirmed(true);
                    setSuccess(true);
                    // notify parent that the order was created (pending payment)
                    onConfirm('Mercado Pago');
                  } else {
                    console.error('MP create preference error', data);
                    alert('No se pudo iniciar Mercado Pago. Revisa la consola.');
                  }
                } catch (err) {
                  setProcessing(false);
                  console.error('Error iniciando Mercado Pago', err);
                  alert('Error iniciando Mercado Pago. Intenta de nuevo.');
                }
              }}
              disabled={processing || confirmed}
            >
              <span>{processing ? 'Redirigiendo...' : 'Pagar con Mercado Pago'}</span>
            </button>
          </div>
        </div>
      );
    }

    if (method === 'PayPal') {
      return (
        <div className="pm-body">
          <p className="pm-intro">Pagarás con PayPal. Usa el botón de PayPal para completar el pago seguro.</p>
          <div id="paypal-button-container" style={{ marginTop: 14 }} />
        </div>
      );
    }

    return (
      <div className="pm-body">
        <p className="pm-intro">Método seleccionado: {method}</p>
      </div>
    );
  };

  return (
    <>
      <style>{PaymentModalCSS}</style>
      <div className="pm-overlay" role="dialog" aria-modal="true">
        <div className="pm-card">
          <header className="pm-header">
            <h3 className="pm-title">{method}</h3>
            <button className="pm-close" onClick={onClose} aria-label="Cerrar modal">✕</button>
          </header>

          <div className="pm-content">
            {renderBody()}

            <div className="pm-summary">
              <span className="pm-summary-label">Total a pagar</span>
              <span className="pm-summary-value">${amount.toFixed(2)}</span>
            </div>

            <div className="pm-actions">
              <button className="pm-secondary" onClick={onClose} disabled={processing}>Cancelar</button>
              {!confirmed && !success && method !== 'PayPal' && (
                <button
                  className="pm-confirm"
                  onClick={async () => {
                  // If tarjeta -> simulate processing, show success, then call onConfirm
                  if (method === 'Tarjeta de crédito/débito') {
                    // minimal validation
                    const num = card.number.replace(/\s+/g, '');
                    if (num.length < 12 || !/^[0-9]+$/.test(num)) {
                      alert('Ingresa un número de tarjeta válido (sólo números)');
                      return;
                    }
                    if (!/^\d{2}\/\d{2}$/.test(card.expiry)) {
                      alert('Formato de vencimiento inválido. Usa MM/AA');
                      return;
                    }
                    if (card.cvc.length < 3) {
                      alert('Ingresa un CVC válido');
                      return;
                    }

                    setProcessing(true);
                    // simulate network processing
                    setTimeout(() => {
                      setProcessing(false);
                      setSuccess(true);
                      setConfirmed(true);
                      // notify parent (order recorded) but KEEP modal open so user can see success
                      setTimeout(() => onConfirm(method), 700);
                    }, 1600);
                    return;
                  }

                  // For other methods (SPEI, OXXO, Mercado Pago, PayPal), confirm immediately
                  setConfirmed(true);
                  onConfirm(method);
                }}
                disabled={processing}
                >
                  <span>{processing ? 'Procesando...' : 'Confirmar pago'}</span>
                </button>
              )}

              {(confirmed || success) && (
                <button className="pm-confirm" onClick={onClose}>Entendido</button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PaymentModal;