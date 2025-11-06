import { getJSON, setJSON } from '../utils/storage';

// Orders API abstraction.
// Prefer the backend API at VITE_API_BASE (or default to same-origin '/api').
// Endpoints on the backend are mounted under /api, so use /api/orders.

const API_BASE = import.meta?.env?.VITE_API_BASE || '/api';
const useBackend = true; // force backend usage; falls back to localStorage only if requests fail

export async function fetchOrders() {
  try {
    const res = await fetch(`${API_BASE}/api/orders`);
    if (!res.ok) throw new Error('Failed to fetch orders');
    const json = await res.json();
    // backend returns { orders }
    return json.orders || json || [];
  } catch (err) {
    console.warn('fetchOrders backend failed, falling back to localStorage:', err && err.message);
    return getJSON('orders', []) || [];
  }
}

export async function createOrder(order) {
  try {
    const res = await fetch(`${API_BASE}/api/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(order)
    });
    if (!res.ok) {
      const txt = await res.text().catch(() => '');
      throw new Error(`Failed to create order: ${res.status} ${txt}`);
    }
    const json = await res.json();
    // backend returns { order }
    return json.order || json || order;
  } catch (err) {
    console.warn('createOrder backend failed, falling back to localStorage:', err && err.message);
    const existing = getJSON('orders', []) || [];
    existing.unshift(order);
    setJSON('orders', existing);
    return order;
  }
}

export async function updateOrder(id, patch) {
  try {
    const res = await fetch(`${API_BASE}/api/orders/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(patch)
    });
    if (!res.ok) {
      const txt = await res.text().catch(() => '');
      throw new Error(`Failed to update order: ${res.status} ${txt}`);
    }
    return res.json();
  } catch (err) {
    console.warn('updateOrder backend failed, falling back to localStorage:', err && err.message);
    const existing = getJSON('orders', []) || [];
    const updated = existing.map(o => o.id === id ? { ...o, ...patch } : o);
    setJSON('orders', updated);
    return updated.find(o => o.id === id);
  }
}

export default { fetchOrders, createOrder, updateOrder };
