const router = require('express').Router();
const { getServices } = require('../controllers/servicesController');

router.get('/', getServices);

module.exports = router;
