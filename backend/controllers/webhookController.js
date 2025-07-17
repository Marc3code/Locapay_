const webhookService = require("../services/webhookService");

async function receberEvento(req, res) {
  res.status(200).send("ok");

  try {
    const event = req.body.event;
    const payment = req.body.payment;
    const transfer = req.body.transfer
    await webhookService.processarEvento(event, payment, transfer);
  } catch (err) {
    console.error("Erro no webhook:", err);
  }
}

module.exports = {
  receberEvento,
};
