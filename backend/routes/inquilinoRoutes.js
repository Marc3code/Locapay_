const express = require("express");
const router = express.Router();
const controller = require("../controllers/inquilinoController");

// ------------------ ROTAS GET ------------------
router.get("/", controller.listarTodos);
router.get("/inquilino", controller.buscarPorId);
router.get("/getinquilino/:telefone", controller.buscarPorTelefone);
router.get("/inquilinos-com-imovel", controller.listarComImovel);


// ------------------ ROTAS PUT ------------------
router.put("/updt_data_vencimento", controller.atualizarDataVencimento);

module.exports = router;
