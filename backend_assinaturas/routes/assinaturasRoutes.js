const express = require("express");
const router = express.Router();
const assinaturaController = require("../controllers/assinaturasController");
const auth = require('../middlewares/authMiddleware');

// Buscar assinatura de um locador
router.get("/:locador_id", assinaturaController.buscarAssinatura);

// Adicionar nova assinatura
router.post("/", assinaturaController.adicionarAssinatura);

router.put("/atualizar-datas", assinaturaController.atualizarDatasInicioFim)

// Atualizar plano da assinatura
router.put("/:locador_id", assinaturaController.atualizarAssinatura);

// Atualizar status (ativa/desativada)
router.put("/status/:locador_id", assinaturaController.atualizarStatusAssinatura);

module.exports = router;
