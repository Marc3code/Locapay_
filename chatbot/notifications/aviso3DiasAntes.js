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
      contentSid: "HX7d6c0d03040f3be31e8fb8cae992898a",
      contentVariables: JSON.stringify({
        1: dataFormatada, 
      }),
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
