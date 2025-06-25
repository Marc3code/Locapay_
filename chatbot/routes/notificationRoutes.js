const express = require("express");
const router = express.Router();
const notificationController = require("../controllers/notificationsController");

// Rota raiz (opcional)
router.get("/", (req, res) => {
  res.send("Webhook para envio de notificações funcionando.");
});

// Rota para notificação de geração de cobrança do mes
router.post(
  "/cobranca_do_mes",
  notificationController.enviarNotificacaoCobrancadoMesController
);

//rota para notificação de pagamento realizado
router.post(
  "/cobranca_3d",
  notificationController.enviarNotificacao3DiasAntesController
);

//rota para notificação de pagamento atrasado
router.post(
  "/pagamento_atrasado",
  notificationController.enviarNotificacaoPagamentoAtrasadoController
);

//rota para notificação de pagamento realizado
router.post(
  "/pagamento_realizado",
  notificationController.enviarNotificacaoPagamentoRealizadoController
);

module.exports = router;
