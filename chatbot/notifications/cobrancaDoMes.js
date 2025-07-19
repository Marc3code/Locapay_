const {
  formatarNumeroWhatsappSemNonoDigito,
} = require("../utils/formatNumber");
const { formatarData } = require("../utils/formatDate");

const { client, FROM_NUMBER } = require("./twilioClient");

const enviarNotificacaoCobrancaDoMes = (data, telefone) => {
  const numeroFormatado = formatarNumeroWhatsappSemNonoDigito(telefone);
  const dataFormatada = formatarData(data);
  return client.messages
    .create({
      from: "whatsapp:" + FROM_NUMBER,
      to: "whatsapp:" + numeroFormatado,
      contentSid: "HX03c7a4a5c7c94d1b19dd891fc1164dd7",
      contentVariables: JSON.stringify({
        data: dataFormatada, 
      }),
    })
    .then((message) => {
      console.log("✅ Notificação de cobrança do mês enviada:", message.sid);
      return { ok: true, sid: message.sid };
    })
    .catch((err) => {
      console.error("❌ Erro ao enviar notificação:", err.message);
      return { ok: false, error: err.message };
    });
};

module.exports = { enviarNotificacaoCobrancaDoMes };
