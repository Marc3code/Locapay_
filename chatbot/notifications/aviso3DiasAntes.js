const {
  formatarNumeroWhatsappSemNonoDigito,
} = require("../utils/formatNumber");
const { formatarData } = require("../utils/formatDate");

const { client, FROM_NUMBER } = require("./twilioClient");

const enviarNotificacao3DiasAntes = (data, telefone) => {
  const numeroFormatado = formatarNumeroWhatsappSemNonoDigito(telefone);
  const dataFormatada = formatarData(data);
  return client.messages
    .create({
      from: "whatsapp:" + FROM_NUMBER,
      to: "whatsapp:" + numeroFormatado,
      body: `📢 Lembrete: sua fatura de aluguel com vencimento em ${dataFormatada} irá vencer em 3 dias.\nPara pagar, é só digitar 1.`,
    })
    .then((message) => {
      console.log("✅ Notificação de cobrança 3 dias antes enviada:", message.sid);
      return { ok: true, sid: message.sid };
    })
    .catch((err) => {
      console.error("❌ Erro ao enviar notificação:", err.message);
      return { ok: false, error: err.message };
    });
};

module.exports = { enviarNotificacao3DiasAntes };
