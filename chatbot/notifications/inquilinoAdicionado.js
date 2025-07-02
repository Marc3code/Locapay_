const {
  formatarNumeroWhatsappSemNonoDigito,
} = require("../utils/formatNumber");

const { client, FROM_NUMBER } = require("./twilioClient");

const enviarNotificacaoBoasVindas = (telefone) => {
  const numeroFormatado = formatarNumeroWhatsappSemNonoDigito(telefone);

  const mensagem = `Olá! 👋 Seja bem-vindo(a) ao nosso sistema de gestão de aluguéis.

Este é o seu assistente virtual, que irá ajudá-lo(a) com informações sobre seus pagamentos e outras solicitações.

📌 Como utilizar este serviço:

1️⃣ Para obter o link de pagamento do aluguel do mês atual (se estiver pendente), basta responder com o número *1*\n\n.
2️⃣ Para verificar a situação de seus pagamentos, incluindo:
   • Pagamento Pendente: o aluguel do mês atual que ainda não foi pago até a data de vencimento.
   • Pagamentos Atrasados: quaisquer alugueis anteriores que não foram pagos até a data de vencimento.
   Responda com o número *2*.\n\n
3️⃣ Para receber ajuda ou este menu novamente, digite *menu*.\n\n

⚠️ Importante: Envie apenas o número da opção desejada, por exemplo, "1" ou "2".

Estamos à disposição para facilitar sua experiência. Caso precise de suporte adicional, entre em contato conosco.

Obrigado por escolher nossos serviços!`;

  return client.messages
    .create({
      from: "whatsapp:" + FROM_NUMBER,
      to: "whatsapp:" + numeroFormatado,
      body: mensagem,
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
