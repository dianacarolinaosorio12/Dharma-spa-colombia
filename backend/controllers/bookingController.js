const fs = require('fs');
const path = require('path');

const services = JSON.parse(
  fs.readFileSync(path.join(__dirname, '..', 'data', 'services.json'), 'utf8')
);
const preBookings = []; // en memoria; se reinicia al reiniciar el servidor

const clean = (v, max = 120) => String(v ?? '').trim().slice(0, max);
const badRequest = (msg) => Object.assign(new Error(msg), { status: 400 });

exports.preBook = (req, res, next) => {
  try {
    const { serviceId, duration, modality, name, neighborhood, date, time } = req.body || {};

    const service = services.find((s) => s.id === serviceId);
    if (!service) throw badRequest('La terapia seleccionada no existe.');
    if (![60, 90].includes(Number(duration))) throw badRequest('La duración debe ser 60 o 90 minutos.');
    if (!['individual', 'pareja'].includes(modality)) throw badRequest('Elige modalidad individual o en pareja.');
    if (!clean(name) || !clean(neighborhood)) throw badRequest('Escribe tu nombre y tu barrio o localidad.');

    const entry = {
      id: preBookings.length + 1,
      serviceId: service.id,
      service: service.title,
      duration: Number(duration),
      modality,
      name: clean(name),
      neighborhood: clean(neighborhood),
      date: clean(date, 10),
      time: clean(time, 5),
      createdAt: new Date().toISOString()
    };
    preBookings.push(entry);
    res.status(201).json({ ok: true, id: entry.id });
  } catch (err) {
    next(err);
  }
};

exports.listPreBookings = (req, res) => {
  const byService = preBookings.reduce((acc, b) => {
    acc[b.service] = (acc[b.service] || 0) + 1;
    return acc;
  }, {});
  res.json({ ok: true, total: preBookings.length, byService, preBookings });
};
