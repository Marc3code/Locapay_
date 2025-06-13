const formatDate = require("../utils/formatDate");
const formatarTelefone = require("../utils/formatarTelefone");
const gerarProximaData = require("../utils/gerarProximaDataVencimento");
const cobrancaService = require("./services/cobrancaService");
const notificationService = require("./services/notificationService");

async function gerarCobrancasDoMes() {
  const hoje = formatDate(new Date());
  console.log("🗓️ Gerando cobranças do mês - Data atual:", hoje);

  try {
    // 1. Busca TODOS os inquilinos com dados completos (incluindo info de cobrança)
    console.log("⏳ Buscando inquilinos...");
    const inquilinos = await cobrancaService.buscarCobrancas();
    console.log("🔍 Busca de inquilinos concluída"); 

    if (inquilinos.length === 0) {
      console.log("⚠️ Nenhum inquilino com cobrança pendente encontrado.");
      return;
    }

    console.log(`📦 Total de inquilinos a processar: ${inquilinos.length}`);

    // 2. Para CADA inquilino, gera a cobrança
    for (const inquilino of inquilinos) {
      console.log("==============================================");
      console.log(
        `🔄 Processando inquilino: ${inquilino.nome} (ID: ${inquilino.id})`
      );

      try {
        // 3. Prepara dados da cobrança
        const dataVencimento = formatDate(inquilino.data_vencimento);
        const telefoneFormatado = formatarTelefone(inquilino.telefone_inquilino);

        // 4. Gera a cobrança no sistema de pagamentos
        const cobrancaGerada = await cobrancaService.gerarCobranca({
          id_asaas: inquilino.id_asaas,
          inquilino_id: inquilino.inquilino_id,
          valor: inquilino.valor_aluguel,
          data_vencimento: dataVencimento,
        });

        // 5. Envia notificação
        await notificationService.enviarNotificacaoCobrancaDoMes(
          {
            nome: inquilino.nome,
            valor: inquilino.valor_aluguel,
            data_vencimento: dataVencimento,
          },
          telefoneFormatado
        );

        // 6. Atualiza próxima data de vencimento
        const novaDataVencimento = gerarProximaData(inquilino.data_vencimento);
        await cobrancaService.atualizarDataVencimento(
          inquilino.id,
          novaDataVencimento
        );

        console.log(
          `✅ Cobrança gerada e vencimento atualizado para: ${novaDataVencimento}`
        );
      } catch (error) {
        console.error(
          `❌ Falha no inquilino ${inquilino.nome}:`,
          error.message
        );
        continue; // Pula para o próximo inquilino
      }
    }
  } catch (error) {
    console.error("🔥 Erro geral no processamento:", error.message);
    throw error;
  } finally {
    console.log("🏁 Processamento concluído");
  }
}

gerarCobrancasDoMes();

module.exports = gerarCobrancasDoMes;
