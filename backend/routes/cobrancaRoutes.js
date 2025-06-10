const express = require("express");
const router = express.Router();
const cobrancaController = require("../controllers/cobrancaController");

router.get("/getdatavencimento/:inquilinoid", cobrancaController.getDataVencimentoPorId);
router.get("/ativas", cobrancaController.getCobrancasAtivas)
router.post("/", cobrancaController.criarCobrancaPix);
module.exports = router;
