const { client, FROM_NUMBER } = require("./twilioClient");

const enviarNotificacaoCobrancaDoMes = (data, telefone) => {
  return client.messages
    .create({
      from: FROM_NUMBER,
      to: "whatsapp:" + telefone,
      body: `Sua fatura do aluguel com vencimento no dia ${data} foi gerada e já está disponível para pagamento. Para pagar agora é só digitar 1.`,
    })
    .then((message) => {
      console.log("✅ Notificação de cobrança enviada:", message.sid);
    })
    .catch((err) => {
      console.error("❌ Erro ao enviar notificação:", err.message);
    });
};

module.exports = enviarNotificacaoCobrancaDoMes;
