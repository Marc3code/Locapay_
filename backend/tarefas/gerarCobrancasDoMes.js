const fetch = require("node-fetch");
const enviarNotificacaoCobrancaDoMes = require("../../chatbot/notifications/cobrancaDoMes");
const gerarProximaData = require("../utils/gerarProximaData");
const formatarTelefone = require("../utils/formatarTelefone");
const formatDate = require("../utils/formatDate");

const API_base = "https://backend-production-78eb.up.railway.app";

async function gerarCobrancasDoMes() {
  const hoje = formatDate(new Date());
  console.log("🗓️ Gerando cobranças do mês - Data atual:", hoje);

  try {
    const cobrancas = await fetch(`${API_base}/cobrancas`)
      .then((res) => res.json())
      .catch((err) => {
        console.error("❌ Erro ao buscar cobranças:", err);
        return [];
      });

    if (!cobrancas?.length) {
      console.log("⚠️ Nenhuma cobrança encontrada.");
      return;
    }

    console.log(`📦 Total de cobranças encontradas: ${cobrancas.length}`);

    for (const cobranca of cobrancas) {
      console.log("==============================================");
      console.log(`🔄 Processando cobrança ID: ${cobranca.id}`);

      try {
        const dataVencimento = formatDate(cobranca.data_vencimento);

        const inquilinoRes = await fetch(
          `${API_base}/inquilino?id=${cobranca.inquilino_id}`
        );
        const inquilinoData = await inquilinoRes.json();

        if (!inquilinoData?.[0]) {
          console.warn(
            `⚠️ Inquilino com ID ${cobranca.inquilino_id} não encontrado.`
          );
          continue;
        }

        const inquilino = inquilinoData[0];
        const telefone = formatarTelefone(inquilino.telefone);

        const pagamento = await fetch(`${API_base}/pagamentos`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id_asaas: cobranca.id_asaas,
            inquilino_id: cobranca.inquilino_id,
            valor: cobranca.valor_aluguel,
            data_vencimento: dataVencimento,
          }),
        })
          .then((res) => res.json())
          .catch((err) => {
            console.error("❌ Erro ao gerar pagamento:", err);
            return null;
          });

        if (!pagamento) continue;

        await enviarNotificacaoCobrancaDoMes(dataVencimento, telefone);

        const novaData = gerarProximaData(cobranca.data_vencimento);
        await fetch(`${API_base}/updt_data_vencimento/`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ data_vencimento: novaData, id: cobranca.id }),
        })
          .then((res) => res.json())
          .then((data) => console.log("✅ Vencimento atualizado:", data))
          .catch((err) =>
            console.error("❌ Erro ao atualizar vencimento:", err)
          );
      } catch (err) {
        console.error(`❌ Erro ao processar cobrança ID ${cobranca.id}:`, err);
        continue;
      }
    }
  } catch (err) {
    console.error("🔥 Erro geral na tarefa:", err);
  }
}

module.exports = gerarCobrancasDoMes;
