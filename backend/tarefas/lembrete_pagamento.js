const formatDate = require("../utils/formatDate");
const inquilinoService = require("../tarefas/services/inquilinoService");
const notificationService = require("../tarefas/services/notificationService");

async function lembretePagamento() {
  const hoje = new Date(); // Usar como objeto Date para cálculo
  console.log(
    "🗓️ Verificando se há lembretes a serem enviados - Data atual:",
    formatDate(hoje)
  );

  try {
    // 1. Busca TODOS os pagamentos
    console.log("⏳ Buscando pagamentos...");
    const todos_pagamentos = await inquilinoService.buscarPagamentos();
    const pagamentos_pendentes = todos_pagamentos.filter(
      (pagamento) => pagamento.status === "pendente"
    );
    console.log("🔍 Busca de pagamentos concluída");

    if (pagamentos_pendentes.length === 0) {
      console.log("⚠️ Nenhum lembrete para ser enviado hoje.");
      return;
    }

    console.log(
      `📦 Total de lembretes a serem enviados: ${pagamentos_pendentes.length}`
    );

    // 2. Para CADA inquilino, envia o lembrete
    for (const pagamento of pagamentos_pendentes) {
      console.log("==============================================");
      console.log(
        `🔄 Verificando se lembrete precisa ser enviado para o pagamento: ${pagamento.asaas_payment_id}`
      );

      const dataVencimento = new Date(pagamento.dueDate); // Objeto Date

      // Calcula a diferença em milissegundos
      const diffEmMs = dataVencimento - hoje;

      // Converte para dias inteiros
      const diffEmDias = Math.ceil(diffEmMs / (1000 * 60 * 60 * 24));

      if (diffEmDias === 3) {
        console.log(
          `📨 Enviando lembrete para o pagamento: ${pagamento.asaas_payment_id}`
        );
        try {
          const inquilino = await inquilinoService.buscarInquilinoPorId(
            pagamento.inquilino_id
          );
          const envio =
            await notificationService.enviarNotificacaoLembretePagamento(
              pagamento.dueDate,
              inquilino.telefone
            );

          if (!envio.ok) {
            console.log(
              `⚠️ Falha ao enviar lembrete para ${inquilino.nome}: ${envio.error}`
            );
            continue; // segue para o próximo pagamento
          }

          console.log(
            `✅ Lembrete enviado para ${inquilino.nome} | Pagamento: ${pagamento.asaas_payment_id}`
          );
        } catch (err) {
          console.error(
            `❌ Erro ao enviar lembrete para o pagamento ${pagamento.asaas_payment_id}:`,
            err.message
          );
        }
      } else {
        console.log(
          `⏳ Lembrete não precisa ser enviado hoje para o pagamento: ${pagamento.asaas_payment_id}`
        );
      }
    }
  } catch (err) {
    console.error("❌ Erro ao executar lembretePagamento:", err.message);
  }
}
