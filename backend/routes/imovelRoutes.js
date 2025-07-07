const express = require("express");
const router = express.Router();
const imovelController = require("../controllers/imovelController");
const auth = require("../middleware/authMiddleware");

router.get("/", auth, imovelController.listarTodos);
router.post("/", auth, imovelController.criarImovel);

module.exports = router;
