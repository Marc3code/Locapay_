const notificationService = require("../tarefas/services/notificationService");
const formatarTelefone = require("../utils/formatarTelefone");
const API_BACKEND = "https://backend-isolado-production.up.railway.app";

async function processarEvento(event, payment) {
  const inquilinoData = await buscarInquilinoData(payment.customer);
  console.log(inquilinoData);
  const telefoneInquilino = formatarTelefone(inquilinoData.telefone);
  if (!event || !payment.id) {
    console.warn("Evento ou ID do pagamento ausente.");
    return { error: "Evento ou ID do pagamento ausente." };
  }

  if (event === "PAYMENT_RECEIVED") {
    console.log("evento PAYMENT_RECEIVED recebido");
    const atualiza = await atualizarStatusPagamento("pago", payment.id);
    console.log(atualiza);
    notificationService.enviarNotificacaoPagamentoRealizado(payment.dueDate, telefoneInquilino);
  }

  
  else if (event === "PAYMENT_OVERDUE") {
    console.log("evento PAYMENT_OVERDUE recebido");
    const atualiza = await atualizarStatusPagamento("atrasado", payment.id);
    console.log(atualiza);
    notificationService.enviarNotificacaoPagamentoAtrasado(
      payment.dueDate,
      telefoneInquilino
    );
  } else if (event === "PAYMENT_CREATED") {
    console.log("Evento PAYMENT_CREATED recebido.");

    
    await notificationService.enviarNotificacaoCobrancaDoMes(
      payment.dueDate,
      telefoneInquilino
    );
    return { message: "Pagamento criado, sem ação necessária." };
   
  } else {
    console.log(`Evento ${event} não tratado.`);
    return { message: `Evento ${event} não é suportado.` };
  }
}

// Função para atualizar status de pagamentos
async function atualizarStatusPagamento(status, paymentId) {
  try {
    const response = await fetch(
      `${API_BACKEND}/pagamentos/updt_statusPagamento`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, paymentId }),
      }
    );

    if (response.ok) {
      return {
        success: true,
        message: `Status atualizado para ${status}`,
      };
    }

    console.warn(`Falha ao atualizar status: ${response.statusText}`);
    return {
      error: "Falha na atualização",
      statusCode: response.status,
    };
  } catch (err) {
    console.error(`Erro ao atualizar status para ${status}:`, err);
    return {
      error: "Erro na comunicação com o servidor",
      details: err.message,
    };
  }
}

//fuuncao para buscar dados do inquilino
async function buscarInquilinoData(customerId) {
  try {
    const response = await fetch(
      `https://backend-isolado-production.up.railway.app/inquilinos/getphone/${customerId}`
    );
    if (!response.ok)
      throw new Error(`Erro ao buscar dados do inquilino: ${response.status}`);
    return await response.json();
  } catch (err) {
    console.error(`Erro ao buscar inquilino: ${customerId}:`, err);
    return {
      error: "Erro na comunicação com o servidor",
      details: err.message,
    };
  }
}

module.exports = {
  processarEvento,
};
