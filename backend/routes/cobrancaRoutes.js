const express = require("express");
const router = express.Router();
const cobrancaController = require("../controllers/cobrancaController");
const auth = require("../middleware/authMiddleware");


// Atualizado para usar contratoId ao invés de inquilinoid
router.get("/getdatavencimento/:contratoId", cobrancaController.getDataVencimentoPorId);

router.get("/pendentes", auth, cobrancaController.getCobrancasPendentes);

router.post("/", cobrancaController.criarCobrancaPix);

module.exports = router;
