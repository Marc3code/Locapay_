const express = require("express");
const router = express.Router();
const controller = require("../controllers/inquilinoController");

router.get("/", controller.getInquilinos);
router.get("/inquilino", controller.getInquilinoById);
router.get("/getinquilino/:telefone", controller.getInquilinoByTelefone);
router.get("/getdatavencimento/:inquilinoid", controller.getDataVencimento);
router.get("/inquilinos-com-imovel", controller.getInquilinosComImovel);

module.exports = router;
