const { formatarNumeroWhatsappSemNonoDigito } = require("../utils/formatNumber");
const { formatarData } = require("../utils/formatDate");
const { client, FROM_NUMBER } = require("./twilioClient");

const enviarNotificacaoCobrancaDoMes = (data, telefone) => {
  const numeroFormatado = formatarNumeroWhatsappSemNonoDigito(telefone);
  const dataFormatada = formatarData(data)
  return client.messages
    .create({
      from: "whatsapp:" + FROM_NUMBER,
      to: "whatsapp:" + numeroFormatado,
      body: `Sua fatura do aluguel com vencimento no dia ${data} foi gerada e já está disponível para pagamento. Para pagar agora é só digitar 1.`,
    })
    .then((message) => {
      console.log("✅ Notificação de cobrança enviada:", message.sid);
      return { ok: true, sid: message.sid }; // <-- retorna ok e o id da mensagem se der certo
    })
    .catch((err) => {
      console.error("❌ Erro ao enviar notificação:", err.message);
      return { ok: false, error: err.message }; // <-- retorna erro
    });
};

enviarNotificacaoCobrancaDoMes("2025-06-06", "5584996132907")
module.exports = { enviarNotificacaoCobrancaDoMes };
