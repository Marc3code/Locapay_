const express = require("express");
const router = express.Router();
const notificationController = require("../controllers/notificationsController");

// Rota raiz (opcional)
router.get("/", (req, res) => {
  res.send("Webhook para envio de notificações funcionando.");
});

// Rota de webhook
router.post("/cobrancaDoMes", notificationController.enviarNotificacaoCobrancadoMesController);

module.exports = router;
