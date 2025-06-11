const express = require("express");
const router = express.Router();
const cobrancaController = require("../controllers/cobrancaController");

router.get("/getdatavencimento/:inquilinoid", cobrancaController.getDataVencimentoPorId);
router.get("/pendentes", cobrancaController.getCobrancasPendentes)
router.post("/", cobrancaController.criarCobrancaPix);
module.exports = router;
