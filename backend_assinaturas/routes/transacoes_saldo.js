const express = require('express');
const auth = require('../middlewares/authMiddleware');
const transacoes_saldosCtrl = require('../controllers/transacoes_saldosController')

const router = express.Router();

// Dados bancários (autenticado)
router.post('/adicionar', auth, transacoes_saldosCtrl.registrarTransacao);
router.get('/buscar', auth, transacoes_saldosCtrl.buscarTransacoes)

module.exports = router;
