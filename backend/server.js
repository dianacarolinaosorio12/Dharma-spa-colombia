const express = require('express');
const cors = require('cors');

const servicesRoutes = require('./routes/servicesRoutes');
const bookingRoutes = require('./routes/bookingRoutes');

const app = express();
const PORT = process.env.PORT || 3000;
const ALLOWED_ORIGINS = (process.env.CORS_ORIGINS || '').split(',').filter(Boolean);

app.use(cors(ALLOWED_ORIGINS.length ? { origin: ALLOWED_ORIGINS } : {}));
app.use(express.json({ limit: '10kb' }));

app.use('/api/services', servicesRoutes);
app.use('/api/bookings', bookingRoutes);

// Comprobación de que el backend está vivo
app.get('/', (req, res) => res.json({ ok: true, service: 'Dharma Spa API' }));

// 404 para rutas /api desconocidas
app.use('/api', (req, res) => {
  res.status(404).json({ ok: false, error: 'Ruta no encontrada.' });
});

// Manejo de errores centralizado
app.use((err, req, res, next) => {
  const status = err.status || 500;
  if (status >= 500) console.error(err);
  res.status(status).json({
    ok: false,
    error: status >= 500 ? 'Error interno del servidor.' : err.message
  });
});

app.listen(PORT, () => console.log(`Dharma Spa en http://localhost:${PORT}`));
