import React, { useEffect, useState } from 'react';
import { Package, User, CreditCard, Truck, CheckCircle, Clock, Mail, Phone, MapPin } from 'lucide-react';
import { fetchOrders, updateOrder } from '../../api/orders';

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  
  useEffect(() => {
    (async () => {
      try {
        const parsed = await fetchOrders();
        setOrders(parsed || []);
      } catch (err) {
        console.error('Error cargando pedidos (API):', err);
        setOrders([]);
      }
    })();
  }, []);

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

  const handleConfirm = async (id) => {
    const newOrders = orders.map(o => o.id === id ? { ...o, status: 'confirmed', confirmedAt: new Date().toISOString() } : o);
    await saveOrders(newOrders);
  };

  const handleCarrierChange = async (id, carrier) => {
    const newOrders = orders.map(o => o.id === id ? { ...o, shippingCarrier: carrier } : o);
    await saveOrders(newOrders);
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
            <div style={{ fontSize:12, color:'#64748b' }}>Pedidos registrados en localStorage</div>
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
                    <th>Método</th>
                    <th>Paquetería</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map(order => (
                    <tr key={order.id}>
                      <td style={{ fontFamily:'monospace', fontSize:13 }}>{order.id}</td>
                      <td>{new Date(order.createdAt).toLocaleString('es-MX')}</td>
                      <td>
                        <div style={{ fontWeight:700 }}>{order.buyer?.nombre}</div>
                        <div style={{ fontSize:12, color:'#64748b' }}>{order.buyer?.email}</div>
                      </td>
                      <td style={{ maxWidth:220 }}>
                        {order.items?.map((it,i)=> (
                          <div key={i} style={{ fontSize:13 }}>{it.name} x{it.qty}</div>
                        ))}
                      </td>
                      <td style={{ fontWeight:800, color:'#0f172a' }}>${(order.total||0).toFixed(2)} MXN</td>
                      <td>{order.paymentMethod || 'No especificado'}</td>
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
                          <button className="action-btn action-confirm" onClick={()=>handleConfirm(order.id)}>
                            Confirmar
                          </button>
                        )}
                        <button className="action-btn action-secondary" style={{ marginLeft:8 }} onClick={()=>navigator.clipboard?.writeText(order.id)}>
                          Copiar ID
                        </button>
                      </td>
                    </tr>
                  ))}
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