const {
  formatarNumeroWhatsappSemNonoDigito
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
      body: `Sua fatura do aluguel com vencimento no dia ${dataFormatada} irá vencer daqui a 3 dias`,
    })
    .then((message) => {
      console.log("✅ Notificação de cobrança do mês enviada:", message.sid);
      return { ok: true, sid: message.sid }; // <-- retorna ok e o id da mensagem se der certo
    })
    .catch((err) => {
      console.error("❌ Erro ao enviar notificação:", err.message);
      return { ok: false, error: err.message };
    });
};



module.exports = { enviarNotificacao3DiasAntes };
