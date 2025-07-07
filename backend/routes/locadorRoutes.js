const express = require('express');
const auth = require('../middleware/authMiddleware');
const locadorCtrl = require('../controllers/locadorController');

const router = express.Router();

// Registro e login
router.post('/locadores', locadorCtrl.registrar);
router.post('/login', locadorCtrl.login);


module.exports = router;
