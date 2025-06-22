const API_BACKEND = "https://backend-isolado-production.up.railway.app";

async function processarEvento(event, paymentId) {
  if (!event || !paymentId) {
    console.warn("Evento ou ID do pagamento ausente.");
    return { error: "Evento ou ID do pagamento ausente." };
  }

  if (event === "PAYMENT_RECEIVED") {
    console.log("evento PAYMENT_RECEIVED recebido");
    return await atualizarStatusPagamento("pago", paymentId);
    //enviar notifiicacao para o inquilino
  } 
  
  // Tratamento completo para pagamentos atrasados
  else if (event === "PAYMENT_OVERDUE") {
    console.log("evento PAYMENT_OVERDUE recebido");
    return await atualizarStatusPagamento("atrasado", paymentId);
    //enviar notificacao para o inquilino
  } 
  
  else if (event === "PAYMENT_CREATED") {
    console.log("Evento PAYMENT_CREATED recebido.");
    return { message: "Pagamento criado, sem ação necessária." };
    //enviar notificacao para o inquilino
  } 
  
  else {
    console.log(`Evento ${event} não tratado.`);
    return { message: `Evento ${event} não é suportado.` };
  }
}

// Função unificada para atualizar status
async function atualizarStatusPagamento(status, paymentId) {
  try {
    const response = await fetch(
      `${API_BACKEND}/pagamentos/updt_statusPagamento`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, paymentId })
      }
    );

    if (response.ok) {
      console.log(`Status do pagamento ${paymentId} atualizado para ${status}.`); // remover esse log depois, ta feito deploy sem esse comentario
      return {
        success: true,
        message: `Status atualizado para ${status}`
      };
    }

    console.warn(`Falha ao atualizar status: ${response.statusText}`);
    return {
      error: "Falha na atualização",
      statusCode: response.status
    };
  } catch (err) {
    console.error(`Erro ao atualizar status para ${status}:`, err);
    return {
      error: "Erro na comunicação com o servidor",
      details: err.message
    };
  }
}

module.exports = {
  processarEvento
};