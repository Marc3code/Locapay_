const express = require('express');
const auth = require('../middleware/authMiddleware');
const dadosCtrl = require('../controllers/dadosBancariosController');

const router = express.Router();

// Dados bancários (autenticado)
router.get('/dados-bancarios', auth, dadosCtrl.obter);
router.post('/dados-bancarios', auth, dadosCtrl.atualizar);

module.exports = router;
