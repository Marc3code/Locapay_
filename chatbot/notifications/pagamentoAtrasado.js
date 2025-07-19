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
      contentSid: "HX3f0dc1be41625a8b0250566e09577972",
      contentVariables: JSON.stringify({
        data: dataFormatada, 
      }),
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
