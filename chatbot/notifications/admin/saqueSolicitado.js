const {
  formatarNumeroWhatsappSemNonoDigito,
} = require("../../utils/formatNumber");

const { client, FROM_NUMBER } = require("./twilioClient");

const enviarNotificacaoSaqueSolicitado = (telefone) => {
  const numeroFormatado = formatarNumeroWhatsappSemNonoDigito(telefone);
  return client.messages
    .create({
      from: "whatsapp:" + FROM_NUMBER,
      to: "whatsapp:" + numeroFormatado,
      contentSid: "HXa53ab4900d7901a86d3d08b41d2aa25b",
    })
    .then((message) => {
      console.log("✅ Notificação de solicitação de saque enviada:", message.sid);
      return { ok: true, sid: message.sid };
    })
    .catch((err) => {
      console.error("❌ Erro ao enviar notificação:", err.message);
      return { ok: false, error: err.message };
    });
};

module.exports = { enviarNotificacaoSaqueSolicitado };
