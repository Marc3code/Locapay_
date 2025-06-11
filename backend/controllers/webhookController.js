const webhookService = require("../services/webhookService");

async function receberEvento(req, res) {
  res.status(200).send("ok");

  try {
    const event = req.body.event;
    const paymentId = req.body.payment.id;

    console.log(paymentId);

    await webhookService.processarEvento(event, paymentId);
  } catch (err) {
    console.error("Erro no webhook:", err);
  }
}

module.exports = {
  receberEvento,
};
