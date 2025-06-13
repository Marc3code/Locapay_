const formatDate = require("../utils/formatDate");
const formatarTelefone = require("../utils/formatarTelefone");
const gerarProximaData = require("../utils/gerarProximaDataVencimento");

const cobrancaService = require("./services/cobrancaService");
const notificationService = require("./services/notificationService");

async function gerarCobrancasDoMes() {
  const hoje = formatDate(new Date());
  console.log("🗓️ Gerando cobranças do mês - Data atual:", hoje);

  try {
    const inquilinos = await cobrancaService.buscarCobrancas();
    
    if (!cobrancas?.length) {
      console.log("⚠️ Nenhuma cobrança encontrada.");
      return;
    }

    console.log(`📦 Total de cobranças encontradas: ${cobrancas.length}`);

    for (const cobranca of inquilinos) {
      console.log("==============================================");
      console.log(`🔄 Processando cobrança do inquilino ID: ${cobranca.nome_inquilino}`);

      try {
        const dataVencimento = formatDate(cobranca.data_vencimento);
    

        const telefone = formatarTelefone(cobranca.telefone_inquilino);

        const cobranca = await cobrancaService.gerarCobranca({
          id_asaas: cobranca.id_asaas,
          inquilino_id: cobranca.inquilino_id,
          valor: cobranca.valor_aluguel,
          data_vencimento: dataVencimento,
        });

        await notificationService.enviarNotificacaoCobrancaDoMes(
          { ...cobranca, dataVencimento },
          telefone
        );

        const novaData = gerarProximaData(cobranca.data_vencimento);
        await cobrancaService.atualizarDataVencimento(cobranca.inquilino_id, novaData);
        console.log("✅ Vencimento atualizado para:", novaData);
      } catch (error) {
        console.error(`❌ Erro ao processar cobrança do inquilino ${cobranca.inquilino_nome}:`, error.message);
        continue;
      }
    }
  } catch (error) {
    console.error("🔥 Erro geral na tarefa:", error.message);
    throw error;
  }
}

gerarCobrancasDoMes();

module.exports = gerarCobrancasDoMes;