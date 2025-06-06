const express = require("express");
const router = express.Router();
const imovelController = require("../controllers/imovelController");

router.get("/", imovelController.listarTodos);
router.post("/", imovelController.criarImovel);

module.exports = router;
