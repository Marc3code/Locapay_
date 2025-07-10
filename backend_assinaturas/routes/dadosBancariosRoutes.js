const express = require('express');
const auth = require('../middlewares/authMiddleware');
const dadosCtrl = require('../controllers/dadosBancariosController');

const router = express.Router();

// Dados bancários (autenticado)
router.get('/dados-bancarios/:id', auth, dadosCtrl.obter);
router.post('/dados-bancarios/:id', auth, dadosCtrl.atualizar);

module.exports = router;
