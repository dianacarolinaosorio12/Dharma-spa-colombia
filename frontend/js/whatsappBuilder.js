export const WHATSAPP_NUMBER = '573238566031';

const formatDate = (iso) => {
  if (!iso) return '[fecha]';
  const [y, m, d] = iso.split('-');
  return `${d}/${m}/${y}`;
};

const formatTime = (hhmm) => {
  if (!hhmm) return '[hora]';
  const [h, m] = hhmm.split(':').map(Number);
  const suffix = h >= 12 ? 'pm' : 'am';
  return `${h % 12 || 12}:${String(m).padStart(2, '0')} ${suffix}`;
};

export function buildMessage({ serviceTitle, duration, modality, neighborhood, date, time }) {
  const who = modality === 'pareja' ? 'en pareja' : 'individual';
  return (
    `Hola Dharma Spa, me gustaría solicitar información de precios y agendar la ` +
    `${serviceTitle || '[terapia]'} de ${duration} min (${who}) para el sector de ` +
    `${neighborhood || '[barrio]'} el día ${formatDate(date)} a las ${formatTime(time)}.`
  );
}

export const buildUrl = (message) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
