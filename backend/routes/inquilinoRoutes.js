const express = require("express");
const router = express.Router();
const controller = require("../controllers/inquilinoController");

router.get("/", controller.listarTodos);
router.get("/inquilino", controller.buscarPorId);
router.get("/getinquilino/:telefone", controller.buscarPorTelefone);
router.get("/inquilinos-com-imovel", controller.listarComImovel);

module.exports = router;
