# Dharma Spa Colombia

Sitio web full-stack (Node.js + Express y HTML/CSS/JS vanilla) para masajes y terapias a domicilio en Bogotá.

## Ejecutar

```bash
cd backend
npm install
npm start
```

El backend queda en http://localhost:3000 (solo API).

El frontend es independiente. En otra terminal:

```bash
cd frontend
npx serve -l 5500
```

Abre http://localhost:5500. (También sirve la extensión Live Server de VS Code: clic derecho en `index.html` > Open with Live Server.)

La dirección del backend se define en `frontend/js/config.js`.

## API

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/services` | Las 8 terapias (título, descripción, beneficios, duraciones) |
| POST | `/api/bookings/pre-book` | Registra en memoria la intención de reserva (para métricas) |
| GET | `/api/bookings/pre-book` | Resumen de pre-reservas. Protégelo antes de publicar |

Cuerpo de `POST /api/bookings/pre-book`:
`{ serviceId, duration (60|90), modality ("individual"|"pareja"), name, neighborhood, date, time }`

## Personalizar

- **Servicios:** edita `backend/data/services.json`.
- **Número de WhatsApp:** `frontend/js/whatsappBuilder.js` (`WHATSAPP_NUMBER`) y los enlaces `wa.me` de `index.html`.
- **Publicar por separado:** pon la URL del backend en `frontend/js/config.js` y, en el backend, define la variable `CORS_ORIGINS` con la URL del frontend (por ejemplo `https://dharmaspa.netlify.app`).
- Las pre-reservas viven en memoria y se pierden al reiniciar. Para guardarlas de forma permanente, cambia el almacenamiento en `bookingController.js` por una base de datos.
