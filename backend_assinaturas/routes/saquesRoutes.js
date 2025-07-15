const express = require('express');
const auth = require('../middlewares/authMiddleware');
const saquesCtrl = require('../controllers/saquesController')

const router = express.Router();

router.get('/buscar/:locador_id', auth, saquesCtrl.buscarSaques);
router.put('/atualizar-status', auth, saquesCtrl.atualizarStatusSaque);
router.post('/adicionar-registro', auth, saquesCtrl.registrarSaque)

module.exports = router;
