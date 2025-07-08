const express = require("express");
const router = express.Router();
const inquilinoController = require("../controllers/inquilinoController");
const auth = require("../middleware/authMiddleware");


// ------------------ ROTAS GET ------------------
router.get("/", auth, inquilinoController.listarTodos);
router.get("/inquilino/:id", inquilinoController.buscarPorId);
router.get("/getinquilino/:telefone", inquilinoController.buscarPorTelefone);
router.get("/inquilinos-com-imovel", auth, inquilinoController.listarComImovel);
router.get("/getphone/:customerId", inquilinoController.bsucarTelefonePorCustomerId);

// ------------------ ROTAS PUT ------------------
router.put(
  "/updt_data_vencimento/:id",
  inquilinoController.atualizarDataVencimento
);

// ------------------ ROTAS POST ------------------
router.post("/", auth, inquilinoController.criarInquilino);
router.post("/inquilino-imovel", inquilinoController.vincularInquilinoImovel)

module.exports = router;
