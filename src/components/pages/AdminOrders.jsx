import React, { useEffect, useState } from 'react';
import { Package, User, CreditCard, Truck, CheckCircle, Clock, Mail, Phone, MapPin } from 'lucide-react';
import { fetchOrders, updateOrder } from '../../api/orders';
import { confirmDialog, showError } from '../../utils/swal';
import { getJSON, setJSON } from '../../utils/storage';

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [codesByOrder, setCodesByOrder] = useState({});

  const API_BASE = import.meta.env.VITE_API_BASE || '/api';
  
  useEffect(() => {
    (async () => {
      // Preferir backend centralizado. Si falla, caer al fallback local (fetchOrders).
      try {
        const token = getJSON('authToken') || localStorage.getItem('authToken');
  const res = await fetch(`${API_BASE}/orders`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        });
        if (res.ok) {
          const body = await res.json();
          // backend responde { orders }
          setOrders(body.orders || body || []);
          return;
        }
        console.warn('Respuesta no OK desde backend orders:', res.status);
      } catch (err) {
        console.warn('No fue posible conectar al backend de pedidos, usando fallback local:', err && err.message);
      }

      // Fallback local (legacy) para entornos donde no hay backend disponible
      try {
        const parsed = await fetchOrders();
        setOrders(parsed || []);
      } catch (err) {
        console.error('Error cargando pedidos (fallback local):', err);
        setOrders([]);
      }
    })();
  }, []);

  // DEBUG: log de depuración para inspeccionar cada orden en la vista
  useEffect(() => {
    try {
      if (!orders) {
        console.log('AdminOrders - orders is null/undefined', orders);
        return;
      }
      if (!orders.length) {
        console.log('AdminOrders - no orders (length 0)');
        return;
      }
      console.log(`AdminOrders - ${orders.length} order(s) fetched`);
      orders.forEach((o, idx) => {
        console.log(`Order[${idx}] id=${o.id}`, o);
        console.log(` Order[${idx}] buyer object:`, o.buyer);
        // También loguear campos comunes por separado para que sean fáciles de leer
        console.log(`  buyer.nombre: ${o.buyer?.nombre || ''}`);
        console.log(`  buyer.name: ${o.buyer?.name || ''}`);
        console.log(`  buyer.email: ${o.buyer?.email || ''}`);
        console.log(`  buyer.phone / telefono / celular: ${o.buyer?.phone || o.buyer?.telefono || o.buyer?.celular || o.buyer?.cel || o.buyer?.phoneNumber || ''}`);
      });
    } catch (err) {
      console.error('AdminOrders - error logging orders', err);
    }
  }, [orders]);

  const saveOrders = async (newOrders) => {
    setOrders(newOrders);
    try {
      for (const o of newOrders) {
        await updateOrder(o.id, o);
      }
    } catch (err) {
      console.error('Error guardando pedidos (API):', err);
    }
  };

  // Procesar membresías cuando un pedido que contiene membresías es confirmado
  // Genera códigos de activación por membresía y los guarda junto al pedido
  const processMemberships = (order) => {
    try {
      const membershipsStore = getJSON('memberships', []) || [];
      const buyerEmail = order.buyer?.email || null;
      const now = new Date();

      order.membershipCodes = order.membershipCodes || [];

      (order.items || []).forEach(item => {
        if (!item || !item.isMembership) return;

        const billing = item.billing || 'monthly';
        const months = billing === 'yearly' ? 12 : 1;
        const startedAt = now.toISOString();
        const expiresAt = new Date(now.getTime() + months * 30 * 24 * 60 * 60 * 1000).toISOString();

        // Inferir descuento por nombre de plan (fallbacks)
        let discountPercent = 0;
        const nameLower = (item.name || '').toLowerCase();
        if (nameLower.includes('básico') || nameLower.includes('basico')) discountPercent = 0.10;
        if (nameLower.includes('natural')) discountPercent = 0.20;
        if (nameLower.includes('pro')) discountPercent = 0.30;

        // Generar código de activación con formato: KX-ACT-<planKey>-<M|Y>-<RAND>
        const planKey = (item.name || 'plan').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        const rand = Math.random().toString(36).substring(2, 7).toUpperCase();
        const code = `KX-ACT-${planKey}-${billing === 'yearly' ? 'Y' : 'M'}-${rand}`;

        const membershipRecord = {
          id: `memb-${order.id}-${item.id || Math.random().toString(36).slice(2,8)}`,
          orderId: order.id,
          activationCode: code,
          userEmail: buyerEmail,
          name: item.name,
          billing,
          startedAt,
          expiresAt,
          discountPercent,
          grantedAt: new Date().toISOString()
        };

        membershipsStore.push(membershipRecord);
        order.membershipCodes.push(code);

        // Si hay un usuario guardado en localStorage que coincide con el email, añadir la membresía al userData
        try {
          const storedUser = getJSON('userData', null);
          if (storedUser && storedUser.email && buyerEmail && storedUser.email.trim().toLowerCase() === buyerEmail.trim().toLowerCase()) {
            const userMemberships = storedUser.memberships || [];
            userMemberships.push(membershipRecord);
            storedUser.memberships = userMemberships;
            setJSON('userData', storedUser);
          }
        } catch (err) {
          console.error('Error actualizando userData con membresía:', err);
        }
      });

      setJSON('memberships', membershipsStore);
      console.log('Membresías procesadas para pedido', order.id);
    } catch (err) {
      console.error('Error procesando membresías:', err);
    }
  };

  const handleConfirm = async (id) => {
    // Intentar confirmar en backend y recibir códigos generados
    const token = getJSON('authToken') || localStorage.getItem('authToken');
    try {
  const res = await fetch(`${API_BASE}/orders/${id}/confirm`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        }
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Error confirming order: ${res.status} ${text}`);
      }
      const body = await res.json();
      // backend devuelve { ok: true, order, generatedCodes }
      const updatedOrder = body.order || {};
      const codes = body.generatedCodes || updatedOrder.membershipCodes || [];

      setOrders(prev => prev.map(o => o.id === id ? { ...o, ...(updatedOrder || {}), status: 'confirmed', confirmedAt: updatedOrder.confirmedAt || new Date().toISOString(), membershipCodes: codes } : o));
      if (codes && codes.length) setCodesByOrder(prev => ({ ...prev, [id]: codes }));
      return;
    } catch (err) {
      console.warn('No se pudo confirmar en backend, aplicando fallback local:', err && err.message);
    }

    // Fallback local: actualizar estado y crear membresías en localStorage
    const newOrders = orders.map(o => {
      if (o.id === id) {
        const updated = { ...o, status: 'confirmed', confirmedAt: new Date().toISOString() };
        try { processMemberships(updated); updated.membershipFulfilled = true; } catch (e) { console.error(e); }
        return updated;
      }
      return o;
    });
    await saveOrders(newOrders);
  };

  const handleCarrierChange = async (id, carrier) => {
    const newOrders = orders.map(o => o.id === id ? { ...o, shippingCarrier: carrier } : o);
    await saveOrders(newOrders);
  };

  // Enviar mensaje por WhatsApp Web al comprador
  // Intenta obtener el teléfono del comprador de varios campos posibles
  const getBuyerPhone = (order) => {
    const b = order?.buyer || order?.buyerData || {};
    const candidates = [b.phone, b.telefono, b.celular, b.cel, b.phoneNumber, b.mobile, b.phone_number, order?.buyerPhone, order?.buyer?.phone, order?.buyerData?.phone];
    for (const c of candidates) {
      if (!c) continue;
      const cleaned = String(c).replace(/\D/g, '');
      if (cleaned) return cleaned;
    }
    return null;
  };

  const sendWhatsApp = (order) => {
    try {
      const raw = getBuyerPhone(order);
      if (!raw) {
        return showError('Teléfono no disponible', 'No hay número de teléfono disponible para este pedido');
      }

      let wa = String(raw).replace(/^0+/, ''); // remove leading zeros
      // If number already starts with country code (e.g., 52 for Mexico), keep it
      if (!wa.startsWith('52') && wa.length === 10) {
        wa = '52' + wa; // assume Mexico if 10 digits
      }

      const name = order.buyer?.nombre || order.buyer?.name || 'cliente';
      const msg = `Hola ${name}, tu pedido ${order.id} ha sido confirmado. Pronto te informaremos sobre el envío. ¡Gracias por elegir K'oxol!`;
      const url = `https://wa.me/${wa}?text=${encodeURIComponent(msg)}`;
      window.open(url, '_blank');
    } catch (err) {
      console.error('Error preparando WhatsApp:', err);
      showError('Error', 'No se pudo abrir WhatsApp. Revisa la consola.');
    }
  };
  return (
    <div className="admin-root" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
      <style>{`
        .admin-root { min-height: 100vh; background: linear-gradient(180deg,#f3f6fa 0%, #eef2f6 100%); color: #0f172a; }
        .admin-header { background: linear-gradient(90deg,#0f766e,#10b981); padding: 28px 0; box-shadow: 0 8px 40px rgba(2,6,23,0.08); }
        .admin-container { max-width: 1200px; margin: 0 auto; padding: 24px; }
        .header-row { display:flex; align-items:center; justify-content:space-between; gap:16px; }
  .brand { display:flex; align-items:center; gap:14px; }
  /* Increase logo container so the icon has breathing room */
  .brand .logo { width:80px; height:80px; border-radius:16px; background:rgba(255,255,255,0.12); display:flex; align-items:center; justify-content:center; }
  /* Ensure SVG inside the container scales nicely */
  .brand .logo svg { width:56px; height:56px; }
        .brand h1 { margin:0; font-size:22px; color:#fff; font-weight:700; }
        .brand p { margin:0; font-size:13px; color:rgba(255,255,255,0.9); }
        .admin-toolbar { display:flex; gap:12px; align-items:center; }
        .admin-card { background:#fff; padding:12px 16px; border-radius:10px; box-shadow:0 6px 18px rgba(2,6,23,0.06); display:flex; gap:12px; align-items:center; }
        .search-input { padding:10px 12px; border-radius:10px; border:1px solid #e6eef6; width:320px; }

        .main { max-width:1200px; margin: 20px auto; padding: 16px; }
        .stats { display:flex; gap:14px; margin-bottom:18px; }
        .stat { background:#fff; padding:16px; border-radius:12px; flex:1; box-shadow:0 6px 18px rgba(2,6,23,0.04); }
        .stat h3 { margin:0; font-size:18px; }
        .panel { background:#fff; border-radius:12px; padding:12px; box-shadow:0 6px 20px rgba(2,6,23,0.04); }

        table.orders { width:100%; border-collapse:collapse; }
        table.orders thead th { text-align:left; padding:12px; font-size:13px; color:#64748b; border-bottom:1px solid #eef2f6; }
        table.orders tbody td { padding:12px; vertical-align:middle; border-bottom:1px solid #f3f6fa; }
        .badge { display:inline-block; padding:6px 10px; border-radius:999px; font-size:12px; font-weight:700; }
        .badge.pending { background:#fff7ed; color:#b45309; border:1px solid #ffedd5; }
        .badge.confirmed { background:#ecfdf5; color:#065f46; border:1px solid #dcfce7; }
        .action-btn { padding:8px 12px; border-radius:8px; border:none; cursor:pointer; font-weight:700; }
        .action-confirm { background:#10b981; color:#fff; }
        .action-secondary { background:#eef2f6; color:#0f172a; }

        .empty-state { text-align:center; padding:60px 20px; }
        .empty-state .icon { width:82px; height:82px; display:inline-flex; align-items:center; justify-content:center; border-radius:14px; background:linear-gradient(180deg,#f8fafc,#ffffff); box-shadow:0 10px 30px rgba(2,6,23,0.06); margin-bottom:12px; }

        @media (max-width: 800px) {
          .header-row { flex-direction:column; align-items:flex-start; }
          .search-input { width:100%; }
          table.orders thead { display:none; }
          table.orders tbody td { display:block; padding:10px 8px; }
        }
      `}</style>

      <header className="admin-header">
        <div className="admin-container header-row">
          <div className="brand">
              <div className="logo"><Package size={56} color="#fff" /></div>
            <div>
              <h1>Panel de Administración</h1>
              <p>Gestión de pedidos y envíos</p>
            </div>
          </div>

          <div className="admin-toolbar">
            <input className="search-input" placeholder="Buscar pedidos, cliente, email o id..." onChange={(e) => { /* TODO: filter */ }} />
            <div className="admin-card">
              <User size={20} color="#065f46" />
              <div style={{ marginLeft:8 }}>
                <div style={{ fontSize:12, color:'#64748b' }}>Administrador</div>
                <div style={{ fontWeight:700 }}>admin@hotmail.com</div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="main admin-container">
        <div className="stats">
          <div className="stat">
            <div style={{ fontSize:12, color:'#94a3b8' }}>Pedidos totales</div>
            <h3>{orders.length}</h3>
            <div style={{ fontSize:12, color:'#64748b' }}>Pedidos registrados </div>
          </div>
          <div className="stat">
            <div style={{ fontSize:12, color:'#94a3b8' }}>Pendientes</div>
            <h3>{orders.filter(o=> (o.status||'pending') !== 'confirmed').length}</h3>
            <div style={{ fontSize:12, color:'#64748b' }}>Por confirmar</div>
          </div>
          <div className="stat">
            <div style={{ fontSize:12, color:'#94a3b8' }}>Confirmados</div>
            <h3>{orders.filter(o=> (o.status||'pending') === 'confirmed').length}</h3>
            <div style={{ fontSize:12, color:'#64748b' }}>Pedidos confirmados</div>
          </div>
        </div>

        <div className="panel">
          {orders.length === 0 ? (
            <div className="empty-state">
              <div className="icon"><Package size={40} color="#94a3b8" /></div>
              <h3 style={{ margin:0, fontSize:20 }}>No hay pedidos</h3>
              <p style={{ color:'#64748b' }}>Los nuevos pedidos aparecerán aquí cuando alguien confirme una compra.</p>
            </div>
          ) : (
            <div style={{ overflowX:'auto' }}>
              <table className="orders">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Fecha</th>
                    <th>Comprador</th>
                    <th>Productos</th>
                    <th>Total</th>
                    <th>Paquetería</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map(order => {
                    const buyerObj = order.buyer || order.buyerData || { name: order.buyerName, email: order.buyerEmail };
                    const buyerName = buyerObj?.nombre || buyerObj?.name || order.buyerName || '';
                    const buyerEmail = buyerObj?.email || order.buyerEmail || '';
                    return (
                      <tr key={order.id}>
                      <td style={{ fontFamily:'monospace', fontSize:13 }}>{order.id}</td>
                      <td>{new Date(order.createdAt).toLocaleString('es-MX')}</td>
                      <td>
                        <div style={{ fontWeight:700 }}>{buyerName}</div>
                        <div style={{ fontSize:12, color:'#64748b' }}>{buyerEmail}</div>
                      </td>
                      <td style={{ maxWidth:220 }}>
                        {order.items?.map((it,i)=> (
                          <div key={i} style={{ fontSize:13 }}>{it.name} x{it.qty}</div>
                        ))}
                      </td>
                      <td style={{ fontWeight:800, color:'#0f172a' }}>${(order.total||0).toFixed(2)} MXN</td>
                      <td>
                        <select value={order.shippingCarrier||''} onChange={(e)=>handleCarrierChange(order.id, e.target.value)} style={{ padding:6, borderRadius:8 }}>
                          <option value="">--</option>
                          <option value="FedEx">FedEx</option>
                          <option value="DHL">DHL</option>
                        </select>
                      </td>
                      <td>
                        <span className={`badge ${(order.status==='confirmed') ? 'confirmed' : 'pending'}`}>{(order.status==='confirmed') ? 'Confirmado' : 'Pendiente'}</span>
                      </td>
                      <td>
                        {order.status !== 'confirmed' && (
                          <button className="action-btn action-confirm" onClick={async ()=>{
                              const ok = await confirmDialog('Confirmar pedido', '¿Deseas confirmar este pedido? Esto generará códigos de membresía si aplica.');
                              if (ok) handleConfirm(order.id);
                            }}>
                            Confirmar
                          </button>
                        )}
                        <button className="action-btn action-secondary" style={{ marginLeft:8 }} onClick={()=>navigator.clipboard?.writeText(order.id)}>
                          Copiar ID
                        </button>

                        {order.status === 'confirmed' && (getBuyerPhone(order) || order.buyer?.phone || order.buyerData?.phone) && (
                          <button
                            className="action-btn"
                            style={{ marginLeft:8, background: '#25D366', color: '#fff', fontWeight:700 }}
                            onClick={() => sendWhatsApp(order)}
                          >
                            💬 WhatsApp
                          </button>
                        )}

                        {/* Mostrar códigos generados (si los hay) */}
                        {((codesByOrder && codesByOrder[order.id] && codesByOrder[order.id].length) || (order.membershipCodes && order.membershipCodes.length)) && (
                          <div style={{ marginTop:8, display:'flex', gap:8, alignItems:'center' }}>
                            <div style={{ fontSize:12, color:'#0f172a', fontWeight:700 }}>Códigos:</div>
                            <div style={{ fontSize:13, background:'#f8fafc', padding:'8px 10px', borderRadius:8, maxWidth:260, overflowX:'auto' }}>
                              {(codesByOrder[order.id] || order.membershipCodes || []).join(' • ')}
                            </div>
                            <button className="action-btn action-secondary" onClick={() => {
                              const txt = (codesByOrder[order.id] || order.membershipCodes || []).join('\n');
                              navigator.clipboard?.writeText(txt);
                            }}>Copiar códigos</button>
                          </div>
                        )}
                      </td>
                    </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function calculateTotal(items = []) {
  return items.reduce((acc, it) => acc + (it.price || 0) * it.qty, 0).toFixed(2);
}