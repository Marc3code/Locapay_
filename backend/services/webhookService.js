const { json } = require("express");
const db = require("../database/dbconnect");

const API_BACKEND = "//https://backend-production-78eb.up.railway.app";

async function processarEvento(event, paymentId) {
  if (!event || !paymentId) {
    console.warn("Evento ou ID do pagamento ausente.");
    return;
  }

  if (event === "PAYMENT_RECEIVED") {
    const status = "pago";

    try {
      const atualizaStatus = await fetch(
        `${API_BACKEND}/pagamentos/updt_statusPagamento`,
        {
          method: "PUT",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({ status, paymentId }),
        }
      );
      
        if (atualizaStatus){
          return json({message: `status do pagamento: ${paymentId} atualizado para ${status}` });
        };
    } catch (err) {
      return json({
        message: "erro ao atualizar status do pagamento para pago",
      });
    }
    
  } else if (event === "PAYMENT_OVERDUE") {
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
