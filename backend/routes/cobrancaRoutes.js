const express = require("express");
const router = express.Router();
const cobrancaController = require("../controllers/cobrancaController");

router.get("/getdatavencimento/:inquilinoid", cobrancaController.getDataVencimentoPorId);


module.exports = router;
