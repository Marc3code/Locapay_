const webhookService = require("../services/webhookService");

async function receberEvento(req, res) {
  res.status(200).send("ok");

  try {
    const event = req.body.event;
    const payment = req.body.payment;
    await webhookService.processarEvento(event, payment);
  } catch (err) {
    console.error("Erro no webhook:", err);
  }
}

module.exports = {
  receberEvento,
};
