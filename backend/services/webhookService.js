const db = require("../database/dbconnect");

const API_BACKEND = "https://backend-production-78eb.up.railway.app";

async function processarEvento(event, paymentId) {
  if (!event || !paymentId) {
    console.warn("Evento ou ID do pagamento ausente.");
    return;
  }
  console.log("paymentId fora do if", paymentId);
  if (event === "PAYMENT_RECEIVED") {
    console.log("evento PAYMENT_RECEIVED recebido");
    const status = "pago";
    console.log("paymentId dentro do if, fora do try", paymentId);
    try {
      console.log("paymentId dentro do if, dentro do try", paymentId);
      const atualizaStatus = await fetch(
        `${API_BACKEND}/pagamentos/updt_statusPagamento`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status, paymentId }),
        }
      );

      if (atualizaStatus.ok) {
        console.log(
          `Status do pagamento ${paymentId} atualizado para ${status}.`
        );
        return {
          success: true,
          message: `Status do pagamento ${paymentId} atualizado para ${status}.`,
        };
      } else {
        console.warn(`Falha ao atualizar status: ${atualizaStatus.statusText}`);
        return {
          message: "Falha ao atualizar status do pagamento.",
          statusCode: atualizaStatus.status,
        };
      }
    } catch (err) {
      console.error("Erro ao atualizar status do pagamento:", err);
      return {
        message: "Erro ao atualizar status do pagamento para pago.",
        error: err.message,
      };
    }
  } else if (event === "PAYMENT_OVERDUE") {
    console.log("evento PAYMENT_OVERDUE recebido");
    await atualizarStatusPagamento(paymentId, "atrasado");
    //fazer endpoint lá na rota de pagamentos ao inves de tratar aqui
  } else if (event === "PAYMENT_CREATED") {
    console.log("Evento PAYMENT_CREATED recebido.");
  } else {
    console.log(`Evento ${event} não tratado.`);
  }
}

module.exports = {
  processarEvento,
};
