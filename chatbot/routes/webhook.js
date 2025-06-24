const express = require("express");
const router = express.Router();
const webhookController = require("../controllers/webhookController");
const notificationController = require("../controllers/notificationsController");

// Rota raiz (opcional)
router.get("/", (req, res) => {
  res.send("Webhook do WhatsApp com Twilio está funcionando.");
});

// Rota de webhook
router.post("/webhook", webhookController.handleWebhook);

router.post("/pagamento_atrasado", notificationController.enviarNotificacaoPagamentoAtrasadoController);
module.exports = router;
