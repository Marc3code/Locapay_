const express = require("express");
const router = express.Router();
const webhookController = require("../controllers/webhookController");

// Rota raiz (opcional)
router.get("/", (req, res) => {
  res.send("Webhook do WhatsApp com Twilio está funcionando.");
});

// Rota de webhook
router.post("/webhook", webhookController.handleWebhook);

module.exports = router;
