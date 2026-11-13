const router = require('express').Router();
const { preBook, listPreBookings } = require('../controllers/bookingController');

router.post('/pre-book', preBook);
router.get('/pre-book', listPreBookings); // métricas internas; protégela antes de producción

module.exports = router;
