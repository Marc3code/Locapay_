const dayjs = require("dayjs");
const cron = require("node-cron");
const notifications = require("../chatbot/notifications.js");
const API_base = "https://backend-production-78eb.up.railway.app";

function gerarProximaData(dataAtual) {
  const proxima = dayjs(dataAtual).add(1, "month").format("YYYY-MM-DD");
  console.log(`➡️ Próxima data gerada a partir de ${dataAtual}: ${proxima}`);
  return proxima;
}

async function gerarCobrancasDoDia() {
  const hoje = dayjs().format("YYYY-MM-DD");
  console.log("🕐 Rodando tarefa para gerar cobranças em:", hoje);

  try {
    console.log("🔍 Buscando cobranças a serem feitas...");
    const cobrancas = await fetch(`${API_base}/cobrancas`)
      .then((res) => {
        console.log("✅ Resposta recebida do servidor.");
        return res.json();
      })
      .catch((err) => {
        console.error("❌ Erro ao buscar cobranças:", err);
        return [];
      });

    if (!cobrancas || cobrancas.length === 0) {
      console.log("⚠️ Nenhuma cobrança encontrada para hoje.");
      return;
    }

    console.log(`📦 Total de cobranças encontradas: ${cobrancas.length}`);

    for (const cobranca of cobrancas) {
      console.log("==============================================");
      console.log(`🔄 Processando cobrança ID: ${cobranca.id}`);

      let pagamento = null;

      try {
        const dataVencimentoFormatada = dayjs(cobranca.data_vencimento).format("YYYY-MM-DD");
        console.log(`🔍 Vencimento formatado: ${dataVencimentoFormatada}`);

        const resInquilino = await fetch(`${API_base}/inquilino?id=${cobranca.inquilino_id}`);
        const inquilinoData = await resInquilino.json();

        if (!inquilinoData || !inquilinoData[0]) {
          console.warn(`⚠️ Inquilino com ID ${cobranca.inquilino_id} não encontrado.`);
          continue;
        }

        const inquilino = inquilinoData[0];
        console.log("👤 Inquilino encontrado:", inquilino.nome || inquilino);

        const tel_Formatado = inquilino.telefone.replace(/^(\+55\d{2})9/, "$1");

        console.log("💸 Gerando pagamento para:", cobranca.id_asaas);
        console.log("   - Valor:", cobranca.valor_aluguel);
        console.log("   - Data de vencimento:", dataVencimentoFormatada);

        pagamento = await fetch(`${API_base}/pagamentos`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id_asaas: cobranca.id_asaas,
            inquilino_id: cobranca.inquilino_id,
            valor: cobranca.valor_aluguel,
            data_vencimento: dataVencimentoFormatada,
          }),
        })
          .then((res) => res.json())
          .then((data) => {
            console.log("✅ Pagamento gerado com sucesso:", data);

            notifications.enviarNotificacaoCobrancaDoDia(
              dataVencimentoFormatada,
              tel_Formatado
            );

            return data;
          })
          .catch((err) => {
            console.error("❌ Erro ao gerar pagamento:", err);
            return null;
          });

      } catch (err) {
        console.error(`❌ Erro ao processar cobrança ID ${cobranca.id}:`, err);
        continue;
      }

      if (pagamento) {
        console.log("✅ Boleto gerado com sucesso:", pagamento);

        const novaDataVencimento = gerarProximaData(cobranca.data_vencimento);

        console.log(
          `📤 Atualizando vencimento da cobrança ${cobranca.id} para ${novaDataVencimento}`
        );

        await fetch(`${API_base}/cobrancas/${cobranca.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ data_vencimento: novaDataVencimento }),
        })
          .then((res) => res.json())
          .then((data) =>
            console.log("✅ Data de vencimento atualizada:", data)
          )
          .catch((err) => console.error("❌ Erro ao atualizar data:", err));
      } else {
        console.error("❌ Erro ao gerar boleto para cobrança ID:", cobranca.id);
      }
    }
  } catch (err) {
    console.error("🔥 Erro geral na tarefa agendada:", err);
  }
}

// Executa imediatamente ao rodar o script
gerarCobrancasDoDia();

// Executa todos os dias às 01:00 da manhã
cron.schedule("0 1 * * *", gerarCobrancasDoDia);
