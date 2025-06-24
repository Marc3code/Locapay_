const {
  formatarNumeroWhatsappSemNonoDigito
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
      body: `⚠️ Aviso: sua fatura do aluguel com vencimento em ${dataFormatada} está em atraso.\n\nEvite juros e outras cobranças. Para pagar agora, basta responder com 1.`,
    })
    .then((message) => {
      console.log("✅ Notificação de cobrança enviada:", message.sid);
      return { ok: true, sid: message.sid }; // <-- retorna ok e o id da mensagem se der certo
    })
    .catch((err) => {
      console.error("❌ Erro ao enviar notificação:", err.message);
      return { ok: false, error: err.message };
    });
};

module.exports = {
  enviarNotificacaoPagamentoAtrasado
};
