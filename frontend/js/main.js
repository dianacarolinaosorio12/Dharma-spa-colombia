import { fetchServices, preBook } from './api.js';
import { buildMessage, buildUrl } from './whatsappBuilder.js';

const $ = (sel) => document.querySelector(sel);
let services = [];

/* ---------- Menú móvil ---------- */
const toggle = $('.nav-toggle');
const nav = $('#nav');
toggle.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  toggle.setAttribute('aria-expanded', String(open));
});
nav.addEventListener('click', (e) => {
  if (e.target.closest('a')) { nav.classList.remove('open'); toggle.setAttribute('aria-expanded', 'false'); }
});

/* ---------- Servicios ---------- */
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

function renderServices() {
  $('#servicesGrid').innerHTML = services.map((s) => `
    <article class="card">
      <svg class="card-mark" aria-hidden="true"><use href="#dharma"/></svg>
      <h3>${esc(s.title)}</h3>
      <p>${esc(s.short)}</p>
      <ul>${s.benefits.map((b) => `<li>${esc(b)}</li>`).join('')}</ul>
      <button class="btn btn-outline" data-service="${esc(s.id)}">Reservar / Consultar</button>
    </article>`).join('');

  $('#fService').innerHTML = services.map((s) => `<option value="${esc(s.id)}">${esc(s.title)}</option>`).join('');
}

async function loadServices() {
  const grid = $('#servicesGrid');
  grid.innerHTML = '<p class="status">Cargando terapias…</p>';
  try {
    services = await fetchServices();
    renderServices();
  } catch {
    grid.innerHTML = '<p class="status">No pudimos cargar las terapias. <button class="link" id="retry">Intentar de nuevo</button></p>';
    $('#retry').addEventListener('click', loadServices);
  }
}

/* ---------- Modal ---------- */
const modal = $('#bookingModal');
const form = $('#bookingForm');
const errorBox = $('#formError');

const readForm = () => {
  const service = services.find((s) => s.id === $('#fService').value);
  return {
    serviceId: service?.id,
    serviceTitle: service?.title,
    duration: Number(form.duration.value),
    modality: form.modality.value,
    name: $('#fName').value.trim(),
    neighborhood: $('#fNeighborhood').value.trim(),
    date: $('#fDate').value,
    time: $('#fTime').value
  };
};

const updatePreview = () => { $('#preview').textContent = buildMessage(readForm()); };

function openBooking(serviceId) {
  if (!services.length) { loadServices(); }
  if (serviceId) $('#fService').value = serviceId;
  errorBox.hidden = true;
  $('#fDate').min = new Date().toISOString().split('T')[0];
  updatePreview();
  modal.showModal();
}

document.addEventListener('click', (e) => {
  const svc = e.target.closest('[data-service]');
  if (svc) return openBooking(svc.dataset.service);
  if (e.target.closest('[data-open-booking]')) { nav.classList.remove('open'); return openBooking(); }
});
modal.querySelector('[data-close]').addEventListener('click', () => modal.close());
modal.addEventListener('click', (e) => { if (e.target === modal) modal.close(); }); // clic en el fondo
form.addEventListener('input', updatePreview);

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const data = readForm();
  if (!data.serviceId || !data.name || !data.neighborhood || !data.date || !data.time) {
    errorBox.textContent = 'Completa tu nombre, barrio, fecha y hora para continuar.';
    errorBox.hidden = false;
    return;
  }
  errorBox.hidden = true;

  // Registro para métricas: si falla, no bloquea el envío a WhatsApp.
  preBook(data).catch(() => {});

  // Abrir WhatsApp de forma síncrona evita el bloqueo de ventanas emergentes.
  window.open(buildUrl(buildMessage(data)), '_blank', 'noopener');
  modal.close();
});

loadServices();
