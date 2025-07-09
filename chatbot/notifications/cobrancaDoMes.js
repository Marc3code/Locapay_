const {
  formatarNumeroWhatsappSemNonoDigito,
} = require("../utils/formatNumber");

const enviarNotificacaoCobrancaDoMes = (data, telefone) => {
  const numeroFormatado = formatarNumeroWhatsappSemNonoDigito(telefone);
  const dataFormatada = formatarData(data);
  return client.messages
    .create({
      from: "whatsapp:" + FROM_NUMBER,
      to: "whatsapp:" + numeroFormatado,
      body: `📅 Sua fatura de aluguel com vencimento em ${dataFormatada} foi gerada e já está disponível para pagamento.\nPara efetuar o pagamento, basta digitar 1.`,
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
