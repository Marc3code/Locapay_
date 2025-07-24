const formatDate = require("../utils/formatDate");
const gerarProximaData = require("../utils/gerarProximaDataVencimento");
const cobrancaService = require("./services/cobrancaService");

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
        `🔄 Processando inquilino: ${inquilino.nome_inquilino} (ID: ${inquilino.inquilino_id})`
      );

      try {
        // 3. Prepara dados da cobrança
        const dataVencimento = formatDate(inquilino.data_vencimento);

        // 4. Gera a cobrança no sistema de pagamentos

        console.log(inquilino);
        const cobrancaGerada = await cobrancaService.gerarCobranca({
          contrato_id: inquilino.contrato_id,
          id_asaas: inquilino.id_asaas,
          inquilino_id: inquilino.inquilino_id,
          valor: inquilino.valor_aluguel,
          data_vencimento: dataVencimento,
          locador_api_key: inquilino.asaas_api_key // api key do locador vinculado a esse inquilino

        });

        // 5. Atualiza próxima data de vencimento
        const novaDataVencimento = gerarProximaData(inquilino.data_vencimento);

        console.log("Data que será atualizada no BD:", novaDataVencimento);
        await cobrancaService.atualizarDataVencimento(
          inquilino.inquilino_id,
          novaDataVencimento
        );

        console.log(
          `✅ Cobrança gerada e vencimento atualizado para: ${novaDataVencimento}`
        );
      } catch (error) {
        console.error(
          `❌ Falha no inquilino ${inquilino.nome_inquilino}:`,
          error.message
        );
        continue;
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
