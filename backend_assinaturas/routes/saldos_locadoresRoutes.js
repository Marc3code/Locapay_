const express = require('express');
const auth = require('../middlewares/authMiddleware');
const saldosCtrl = require('../controllers/saldos_locadoresController')

const router = express.Router();


router.put('/atualizar', auth, saldosCtrl.atualizarSaldo);
router.post('/adicionar', auth, saldosCtrl.AdicionarSaldo);
router.get('/buscar/:locador_id', auth, saldosCtrl.buscarSaldo);

module.exports = router;
