import { getJSON, setJSON } from '../utils/storage';

// Orders API abstraction.
// By default uses localStorage via utils/storage. To switch to a real backend,
// change `useBackend` to true and set `API_BASE` to your server URL (or use import.meta.env).

const API_BASE = import.meta?.env?.VITE_API_BASE || null;
const useBackend = !!API_BASE;

export async function fetchOrders() {
  if (useBackend) {
    const res = await fetch(`${API_BASE}/orders`);
    if (!res.ok) throw new Error('Failed to fetch orders');
    return res.json();
  }

  return getJSON('orders', []) || [];
}

export async function createOrder(order) {
  if (useBackend) {
    const res = await fetch(`${API_BASE}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(order)
    });
    if (!res.ok) throw new Error('Failed to create order');
    return res.json();
  }

  const existing = getJSON('orders', []) || [];
  existing.unshift(order);
  setJSON('orders', existing);
  return order;
}

export async function updateOrder(id, patch) {
  if (useBackend) {
    const res = await fetch(`${API_BASE}/orders/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(patch)
    });
    if (!res.ok) throw new Error('Failed to update order');
    return res.json();
  }

  const existing = getJSON('orders', []) || [];
  const updated = existing.map(o => o.id === id ? { ...o, ...patch } : o);
  setJSON('orders', updated);
  return updated.find(o => o.id === id);
}

export default { fetchOrders, createOrder, updateOrder };
