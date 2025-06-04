const express = require("express");
const router = express.Router();
const controller = require("../controllers/pagamentoController");

router.get("/", controller.getPagamentos);
router.get("/link_pagamento/:inquilino_id", controller.getLinkPagamento);

module.exports = router;
