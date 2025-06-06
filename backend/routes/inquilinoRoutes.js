const express = require("express");
const router = express.Router();
const inquilinoController = require("../controllers/inquilinoController");

// ------------------ ROTAS GET ------------------
router.get("/", inquilinoController.listarTodos);
router.get("/inquilino", inquilinoController.buscarPorId);
router.get("/getinquilino/:telefone", inquilinoController.buscarPorTelefone);
router.get("/inquilinos-com-imovel", inquilinoController.listarComImovel);

// ------------------ ROTAS PUT ------------------
router.put(
  "/updt_data_vencimento/:id",
  inquilinoController.atualizarDataVencimento
);

// ------------------ ROTAS POST ------------------
router.post("/", inquilinoController.criarInquilino);
router.post("/inquilino-imovel", inquilinoController.vincularInquilinoImovel)

module.exports = router;
