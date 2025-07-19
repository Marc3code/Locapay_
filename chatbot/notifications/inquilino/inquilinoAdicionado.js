const {
  formatarNumeroWhatsappSemNonoDigito,
} = require("../../utils/formatNumber");

const { client, FROM_NUMBER } = require("../twilioClient");

const enviarNotificacaoBoasVindas = (telefone) => {
  const numeroFormatado = formatarNumeroWhatsappSemNonoDigito(telefone);

  return client.messages
    .create({
      from: "whatsapp:" + FROM_NUMBER,
      to: "whatsapp:" + numeroFormatado,
      contentSid: "HX1aa7a2b13f5aeacf70355803619f56ab"
    })
    .then((message) => {
      console.log("✅ Mensagem de boas-vindas enviada:", message.sid);
      return { ok: true, sid: message.sid };
    })
    .catch((err) => {
      console.error("❌ Erro ao enviar mensagem de boas-vindas:", err.message);
      return { ok: false, error: err.message };
    });
};

module.exports = { enviarNotificacaoBoasVindas };
