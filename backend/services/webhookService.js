const notificationService = require("../tarefas/services/notificationService");
const formatarTelefone = require("../utils/formatarTelefone");
require("dotenv").config();

const API_BACKEND = "https://backend-isolado-production.up.railway.app";

async function processarEvento(event, payment, transfer) {
  if (!event) {
    console.warn("Evento ausente.");
    return { error: "Evento ausente." };
  }

  if (payment) {
    await processarEventosPagamento(event, payment);
  } else if (transfer) {
    await processarEventosTransferencia(event, transfer);
  } else {
    console.log(`Evento ${event} não tratado.`);
    return { message: `Evento ${event} não é suportado.` };
  }
}

async function processarEventosPagamento(event, payment) {
  const inquilinoData = await buscarInquilinoData(payment.customer);
  const locadorData = await buscarLocadorPorInquilino(inquilinoData.id);
  const telefoneInquilino = formatarTelefone(inquilinoData.telefone);

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

    console.log(
      "Status de pagamento atualizado:",
      atualizaStatus.success ? "sucesso" : "falha"
    );
    console.log(
      "Registro de transação:",
      registraTransacao.success ? "sucesso" : "falha"
    );
    console.log(
      "Atualização do saldo do locador:",
      atualizaSaldoLocador.success ? "sucesso" : "falha"
    );

    notificationService.enviarNotificacaoPagamentoRealizado(
      payment.dueDate,
      telefoneInquilino
    );

    console.log("Evento PAYMENT_RECEIVED processado com sucesso.");
  } else if (event === "PAYMENT_OVERDUE") {
    console.log("Evento PAYMENT_OVERDUE recebido");

    const atualiza = await atualizarStatusPagamento("atrasado", payment.id);
    console.log(
      "Status de pagamento atualizado para atrasado:",
      atualiza.success ? "sucesso" : "falha"
    );

    notificationService.enviarNotificacaoPagamentoAtrasado(
      payment.dueDate,
      telefoneInquilino
    );

    console.log("Evento PAYMENT_OVERDUE processado com sucesso.");
  } else if (event === "PAYMENT_CREATED") {
    console.log("Evento PAYMENT_CREATED recebido");

    await notificationService.enviarNotificacaoCobrancaDoMes(
      payment.dueDate,
      telefoneInquilino
    );

    console.log("Evento PAYMENT_CREATED processado com sucesso.");
    return { message: "Pagamento criado, sem ação necessária." };
  }
}

async function processarEventosTransferencia(event, transfer) {
  const descricao = transfer.description; // Ex: "Saque via Pix - id: 123"
  const match = descricao?.match(/id:\s?(\d+)/);
  let saqueId;

  if (match) {
    saqueId = parseInt(match[1]);
  } else {
    console.warn(
      "Não foi possível extrair o saque_id da descrição:",
      descricao
    );
    console.log(
      `O evento ${event} não foi processado corretamente.\nPayload do evento:`,
      transfer
    );
    return; // Encerra a função se não conseguir extrair o ID
  }

  if (event === "TRANSFER_CREATED") {
    console.log("Evento TRANSFER_CREATED recebido");
    await adicionarTransferId(saqueId, transfer.id);
    console.log(
      `Transferência criada processada com sucesso. saqueId: ${saqueId}, transferId: ${transfer.id}`
    );
  } else if (event === "TRANSFER_DONE") {
    console.log("Evento TRANSFER_DONE recebido");
    await atualizarStatusSaque(saqueId, "pago");
    await desbloquearSaldoLocador(saqueId);
    console.log(
      `Transferência concluída com sucesso. saqueId: ${saqueId} marcado como pago.\n saldo bloqueado removido.`
    );
  } else {
    console.log(`Evento ${event} não reconhecido. Nenhuma ação executada.`);
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

async function registrarTransacao(
  locadorId,
  nome_inquilino,
  valor,
  pagamentoId
) {
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

async function adicionarTransferId(saqueId, transferId) {
  try {
    const response = await fetch(
      `${process.env.API_BASE_ASSINATURAS}/saques/add-transfer-id`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.ASSINATURAS_API_KEY}`,
        },
        body: JSON.stringify({
          saque_id: saqueId,
          transfer_id: transferId,
        }),
      }
    );

    if (!response.ok) {
      console.warn("Erro ao adicionar transfer id.");
      return { success: false };
    }

    await response.json();
    return { success: true };
  } catch (err) {
    console.error("Erro ao aadicionar transfer id:", err.message);
    return { success: false, error: err.message };
  }
}

async function atualizarStatusSaque(saque_id, status) {
  try {
    const response = await fetch(
      `${process.env.API_BASE_ASSINATURAS}/saques/atualizar-status`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.ASSINATURAS_API_KEY}`,
        },
        body: JSON.stringify({ saque_id, status }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.warn(
        "Erro ao atualizar status do saque:",
        response.status,
        errorText
      );
      return { sucesso: false, erro: errorText };
    }

    return { sucesso: true };
  } catch (err) {
    console.error("Erro ao atualizar status do saque:", err.message);
    return { sucesso: false, erro: err.message };
  }
}

async function desbloquearSaldoLocador(saque_id) {
  try {
    const response = await fetch(
      `${process.env.API_BASE_ASSINATURAS}/saques/desbloquear-saldo`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.ASSINATURAS_API_KEY}`,
        },
        body: JSON.stringify({ saque_id }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.warn("Erro ao desbloquear saldo:", response.status, errorText);
      return { sucesso: false, erro: errorText };
    }

    return { sucesso: true };
  } catch (err) {
    console.error("Erro ao desbloquear saldo:", err.message);
    return { sucesso: false, erro: err.message };
  }
}

module.exports = {
  processarEvento,
};
