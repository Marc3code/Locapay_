const express = require('express');
const auth = require('../middlewares/authMiddleware');
const saquesCtrl = require('../controllers/saquesController')

const router = express.Router();

router.get('/buscar/:locador_id', auth, saquesCtrl.buscarSaques);

module.exports = router;
