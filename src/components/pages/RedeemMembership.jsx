import React, { useState } from 'react';
import { getJSON, setJSON } from '../../utils/storage';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function RedeemMembership() {
  const [code, setCode] = useState('');
  const [message, setMessage] = useState(null);
  const auth = useAuth();
  const navigate = useNavigate();

  const handleRedeem = (e) => {
    e.preventDefault();
    const c = (code || '').trim();
    if (!c) { setMessage({ type: 'error', text: 'Ingresa un código válido.' }); return; }

    // Parse code: KX-ACT-<planKey>-<M|Y>-<RAND>
    const m = c.match(/^KX-ACT-([a-z0-9\-]+)-([MY])-([A-Z0-9]{4,6})$/i);
    if (!m) { setMessage({ type: 'error', text: 'Formato de código inválido.' }); return; }

    const planKey = m[1];
    const billing = m[2] === 'Y' ? 'yearly' : 'monthly';

    const now = new Date();
    const months = billing === 'yearly' ? 12 : 1;
    const startedAt = now.toISOString();
    const expiresAt = new Date(now.getTime() + months * 30 * 24 * 60 * 60 * 1000).toISOString();

    // Build a membership object and save it locally for this user
    const membership = {
      id: `redeem-${planKey}-${Date.now().toString(36)}`,
      code: c,
      planKey,
      billing,
      startedAt,
      expiresAt,
      grantedAt: new Date().toISOString()
    };

    try {
      // Save to memberships list visible in this browser
      const store = getJSON('memberships', []) || [];
      store.push(membership);
      setJSON('memberships', store);

      // If user is logged in, attach to their userData
      const storedUser = getJSON('userData', null);
      if (storedUser && storedUser.email && auth?.isLoggedIn) {
        storedUser.memberships = storedUser.memberships || [];
        storedUser.memberships.push(membership);
        setJSON('userData', storedUser);
      }

      setMessage({ type: 'success', text: 'Membresía activada correctamente en este navegador.' });
      setCode('');
      // Optionally navigate to profile or shop
      setTimeout(() => navigate('/shop'), 1200);
    } catch (err) {
      console.error(err);
      setMessage({ type: 'error', text: 'Error al activar la membresía.' });
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Canjear código de membresía</h2>
      <p>Pega aquí el código que te proporcionó el administrador para activar tu membresía.</p>
      <form onSubmit={handleRedeem} style={{ display: 'flex', gap: 8, marginTop: 12 }}>
        <input value={code} onChange={e => setCode(e.target.value)} placeholder="KX-ACT-..." style={{ padding: '8px 10px', flex: 1 }} />
        <button type="submit" style={{ padding: '8px 12px' }}>Activar</button>
      </form>
      {message && (
        <div style={{ marginTop: 12, color: message.type === 'error' ? 'crimson' : 'green' }}>{message.text}</div>
      )}
    </div>
  );
}
