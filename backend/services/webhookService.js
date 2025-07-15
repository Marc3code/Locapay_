const notificationService = require("../tarefas/services/notificationService");
const formatarTelefone = require("../utils/formatarTelefone");
const API_BACKEND = "https://backend-isolado-production.up.railway.app";
require("dotenv").config();

async function processarEvento(event, payment) {
  const inquilinoData = await buscarInquilinoData(payment.customer);
  const locadorData = await buscarLocadorPorInquilino(inquilinoData.id);
  const telefoneInquilino = formatarTelefone(inquilinoData.telefone);

  if (!event || !payment.id) {
    console.warn("Evento ou ID do pagamento ausente.");
    return { error: "Evento ou ID do pagamento ausente." };
  }

  if (event === "PAYMENT_RECEIVED") {
    console.log("Evento PAYMENT_RECEIVED recebido");
    const atualizaStatus = await atualizarStatusPagamento("pago", payment.id);
    const valorPagamento = payment.value - 1.99;

    const registraTransacao = await registrarTransacao(
      locadorData.locador_id,
      inquilinoData.nome,
      valorPagamento,
      payment.id
    );

    const atualizaSaldoLocador = await atualizarSaldoLocador(
      locadorData.id,
      valorPagamento
    );

    console.log("Status de pagamento atualizado:", atualizaStatus.success ? "sucesso" : "falha");
    console.log("Registro de transação:", registraTransacao.success ? "sucesso" : "falha");
    console.log("Atualização do saldo do locador:", atualizaSaldoLocador.success ? "sucesso" : "falha");

    notificationService.enviarNotificacaoPagamentoRealizado(
      payment.dueDate,
      telefoneInquilino
    );

  } else if (event === "PAYMENT_OVERDUE") {
    console.log("Evento PAYMENT_OVERDUE recebido");
    const atualiza = await atualizarStatusPagamento("atrasado", payment.id);
    console.log("Status de pagamento atualizado para atrasado:", atualiza.success ? "sucesso" : "falha");

    notificationService.enviarNotificacaoPagamentoAtrasado(
      payment.dueDate,
      telefoneInquilino
    );

  } else if (event === "PAYMENT_CREATED") {
    console.log("Evento PAYMENT_CREATED recebido");

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
      return { success: true };
    }

    console.warn(`Falha ao atualizar status: ${response.statusText}`);
    return { success: false, error: response.statusText };
  } catch (err) {
    console.error(`Erro ao atualizar status:`, err.message);
    return { success: false, error: err.message };
  }
}

// Função para buscar dados do inquilino
async function buscarInquilinoData(customerId) {
  try {
    const response = await fetch(
      `https://backend-isolado-production.up.railway.app/inquilinos/get-inquilino/por-customer-id/${customerId}`
    );
    if (!response.ok) throw new Error(`Erro ao buscar dados do inquilino`);

    return await response.json();
  } catch (err) {
    console.error(`Erro ao buscar inquilino:`, err.message);
    return { error: err.message };
  }
}

async function buscarLocadorPorInquilino(inquilinoId) {
  try {
    const response = await fetch(
      `https://backend-isolado-production.up.railway.app/user/locador/por-inquilino/${inquilinoId}`
    );
    if (!response.ok) throw new Error(`Erro ao buscar dados do locador`);

    return await response.json();
  } catch (err) {
    console.error(`Erro ao buscar locador:`, err.message);
    return { error: err.message };
  }
}

async function registrarTransacao(locadorId, nome_inquilino, valor, pagamentoId) {
   const descricao = `Pagamento do inquilino ${nome_inquilino}`;

  try {
    const response = await fetch(
      `${process.env.API_BASE_ASSINATURAS}/transacoes_saldo/adicionar`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.ASSINATURAS_API_KEY}`,
        },
        body: JSON.stringify({
          locador_id: locadorId,
          tipo: "entrada",
          descricao,
          valor,
          origem_pagamento_id: pagamentoId,
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.warn("Erro ao registrar transação:", response.status, errorText);
      return { success: false, error: errorText };
    }

    await response.json();
    return { success: true };
  } catch (err) {
    console.error("Erro ao registrar transação:", err.message);
    return { success: false, error: err.message };
  }
}

async function atualizarSaldoLocador(locadorId, valorAdicionado) {
  try {
    const response = await fetch(
      `${process.env.API_BASE_ASSINATURAS}/saldos_locadores/atualizar`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.ASSINATURAS_API_KEY}`,
        },
        body: JSON.stringify({
          locador_id: locadorId,
          valor: valorAdicionado,
        }),
      }
    );

    if (!response.ok) {
      console.warn("Erro ao atualizar saldo do locador.");
      return { success: false };
    }

    await response.json();
    return { success: true };
  } catch (err) {
    console.error("Erro ao atualizar saldo do locador:", err.message);
    return { success: false, error: err.message };
  }
}

module.exports = {
  processarEvento,
};
