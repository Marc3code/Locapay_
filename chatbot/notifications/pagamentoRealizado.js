const {
  formatarNumeroWhatsappSemNonoDigito,
} = require("../utils/formatNumber");
const { formatarData } = require("../utils/formatDate");
const { client, FROM_NUMBER } = require("./twilioClient");

const enviarNotificacaoPagamentoRealizado = (data, telefone) => {
  const numeroFormatado = formatarNumeroWhatsappSemNonoDigito(telefone);
  const dataFormatada = formatarData(data);
  return client.messages
    .create({
      from: "whatsapp:" + FROM_NUMBER,
      to: "whatsapp:" + numeroFormatado,
      body: `✅ Pagamento recebido! Confirmamos o recebimento da sua fatura com vencimento em ${dataFormatada}.\n\nO comprovante está disponível no mesmo link utilizado para o pagamento. Obrigado!`,
    })
    .then((message) => {
      console.log("✅ Notificação de pagamento realizado enviada:", message.sid);
      return { ok: true, sid: message.sid }; // <-- retorna ok e o id da mensagem se der certo
    })
    .catch((err) => {
      console.error("❌ Erro ao enviar notificação:", err.message);
      return { ok: false, error: err.message };
    });
};

module.exports = {
  enviarNotificacaoPagamentoRealizado,
};
