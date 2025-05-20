const dayjs = require("dayjs");
const cron = require("node-cron");
const notifications = require("../chatbot/notifications.js");

function gerarProximaData(dataAtual) {
  const proxima = dayjs(dataAtual).add(1, "month").format("YYYY-MM-DD");
  console.log(`➡️ Próxima data gerada a partir de ${dataAtual}: ${proxima}`);
  return proxima;
}

async function gerarCobrancasDoDia() {
  const hoje = dayjs().format("YYYY-MM-DD");
  console.log("🕐 Rodando tarefa para gerar cobranças em:", hoje);

  try {
    console.log("🔍 Buscando cobranças cobrancas a serem feitas")
    const cobrancas = await fetch(
      `http://localhost:3001/cobrancas`
    )
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
      console.log(`🔄 Processando cobrança ID: ${cobranca.id}`);

      const dataVencimentoFormatada = dayjs(cobranca.data_vencimento).format(
        "YYYY-MM-DD"
      );
      console.log(
        `🔍 Verificando cobrança ID ${cobranca.id} - vencimento formatado: ${dataVencimentoFormatada}`
      );

      console.log("💸 Gerando cobrança para:", cobranca.id_asaas);
      console.log("   - Valor:", cobranca.valor_aluguel);
      console.log("   - Data de vencimento:", dataVencimentoFormatada);

      const resInquilino = await fetch(
        `http://localhost:3001/inquilino?id=${cobranca.inquilino_id}`
      );

      const inquilino = (await resInquilino.json())[0];

      console.log(inquilino);

      tel_Formatado = inquilino.telefone.replace(/^(\+55\d{2})9/, "$1");

      const pagamento = await fetch(`http://localhost:3001/pagamentos`, {
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

      if (pagamento) {
        console.log("✅ Boleto gerado com sucesso:", pagamento);

        const novaDataVencimento = gerarProximaData(cobranca.data_vencimento);

        console.log(
          `📤 Atualizando vencimento da cobrança ${cobranca.id} para ${novaDataVencimento}`
        );

        await fetch(`http://localhost:3001/cobrancas/${cobranca.id}`, {
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


// Executa todos os dias às 01:00 da manhã
cron.schedule("0 1 * * *", gerarCobrancasDoDia);
