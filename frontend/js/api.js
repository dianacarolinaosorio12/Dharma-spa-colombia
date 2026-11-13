// Base vacía = mismo origen (el backend sirve el frontend).
// Si el frontend vive en otro dominio, define window.DHARMA_API_BASE antes de cargar main.js.
const API_BASE = window.DHARMA_API_BASE || '';

async function request(path, options) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'No pudimos completar la solicitud.');
  return data;
}

export const fetchServices = () => request('/api/services').then((d) => d.services);

export const preBook = (payload) =>
  request('/api/bookings/pre-book', { method: 'POST', body: JSON.stringify(payload) });
