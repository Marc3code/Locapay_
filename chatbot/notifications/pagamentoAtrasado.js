const {
  formatarNumeroWhatsappSemNonoDigito,
} = require("../utils/formatNumber");
const { formatarData } = require("../utils/formatDate");
const { client, FROM_NUMBER } = require("./twilioClient");

const enviarNotificacaoPagamentoAtrasado = (data, telefone) => {
  const numeroFormatado = formatarNumeroWhatsappSemNonoDigito(telefone);
  const dataFormatada = formatarData(data);
  return client.messages
    .create({
      from: "whatsapp:" + FROM_NUMBER,
      to: "whatsapp:" + numeroFormatado,
      body: `⚠️ Aviso importante: sua fatura de aluguel com vencimento em ${dataFormatada} encontra-se em atraso.\n\nPara evitar juros e outras penalidades, pedimos que efetue o pagamento o quanto antes. Para pagar agora, responda com 2.`,
    })
    .then((message) => {
      console.log("✅ Notificação de pagamento atrasado enviada:", message.sid);
      return { ok: true, sid: message.sid }; // <-- retorna ok e o id da mensagem se der certo
    })
    .catch((err) => {
      console.error("❌ Erro ao enviar notificação:", err.message);
      return { ok: false, error: err.message };
    });
};

module.exports = {
  enviarNotificacaoPagamentoAtrasado,
};
