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
      template: {
        name: "pagamento_realizado",
        language: { code: "pt_BR" },
        components: [
          {
            type: "body",
            parameters: [
              { type: "text", text: dataFormatada },
            ],
          },
        ],
      },
    })
    .then((message) => {
      console.log(
        "✅ Notificação de pagamento realizado enviada:",
        message.sid
      );
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
