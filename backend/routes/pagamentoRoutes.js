const express = require("express");
const router = express.Router();
const controller = require("../controllers/pagamentoController");

router.get("/", controller.listarTodos);
router.get("/link_pagamento/:inquilino_id", controller.buscarLinkPagamento);

module.exports = router;
