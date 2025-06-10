const db = require("../database/dbconnect");

async function processarEvento(event, paymentId) {
  if (!event || !paymentId) {
    console.warn("Evento ou ID do pagamento ausente.");
    return;
  }

  if (event === "PAYMENT_RECEIVED") {
    await atualizarStatusPagamento(paymentId, "pago");

  } else if (event === "PAYMENT_OVERDUE") {
    await atualizarStatusPagamento(paymentId, "atrasado");

  } else if (event === "PAYMENT_CREATED") {
    console.log("Evento PAYMENT_CREATED recebido.");
  } else {
    console.log(`Evento ${event} não tratado.`);
  }
}

async function atualizarStatusPagamento(paymentId, status) {
  const query = `UPDATE pagamentos SET status = ? WHERE asaas_payment_id = ?`;

  try {
    await db.query(query, [status, paymentId]);
    console.log(`Status do pagamento (${paymentId}) atualizado para '${status}'`);
  } catch (err) {
    console.error("Erro ao atualizar status do pagamento:", err);
    throw err;
  }
}

module.exports = {
  processarEvento,
};
