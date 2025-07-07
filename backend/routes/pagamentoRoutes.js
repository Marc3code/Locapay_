const express = require("express");
const router = express.Router();
const controller = require("../controllers/pagamentoController");
const authMiddleware = require("../middleware/authMiddleware");

router.use(authMiddleware); 

router.get("/", controller.listarTodos);
router.get("/link_pagamento/:inquilino_id", controller.buscarLinkPagamento);
router.put("/updt_statusPagamento", controller.atualizarStatusPagamento);
router.get("/atrasados/:id", controller.buscarPagamentosAtrasados);
router.get("/pendentes/:id", controller.buscarPagamentosPendentes);

module.exports = router;
