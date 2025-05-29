const express = require("express");
const router = express.Router();
const controller = require("../controllers/pagamentoController");

router.get("/", controller.getPagamentos);
router.get("/link_pagamento/:inquilino_id", controller.getLinkPagamento);
router.get("/cobrancas", controller.getCobrancas);

module.exports = router;
