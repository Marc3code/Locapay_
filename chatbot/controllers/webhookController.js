const inquilinosService = require("../services/inquilinoServices");
const { formatarData } = require("../utils/formatDate");
const { formatarNumeroWhatsapp } = require("../utils/formatNumber");

exports.handleWebhook = async (req, res) => {
  const from = req.body.From;
  const text = req.body.Body.trim().toLowerCase();

  console.log("Mensagem recebida de:", from);
  console.log("Conteúdo:", text);

  const numeroFormatado = formatarNumeroWhatsapp(from);
  const inquilino = await inquilinosService.getInquilinoPorTelefone(
    numeroFormatado
  );

  if (!inquilino || !inquilino.id) {
    return sendResponse(
      res,
      "❌ Não consegui identificar você. Por favor, entre em contato com o suporte."
    );
  }

  let resposta = "";

  if (
    ["menu", "oi", "ola", "olá", "boa tarde", "boa noite", "bom dia"].includes(
      text
    )
  ) {
    resposta = `Olá, ${inquilino.nome}! 👋 Como posso te ajudar?\n\nEscolha uma opção:\n1️⃣ Pagar aluguel\n2️⃣ Verificar pendências\n`;
  } else if (text === "1") {
    const link = await inquilinosService.buscarLinkPagamento(inquilino.id);
    resposta = `💳 Link para pagamento do aluguel:\n${link.paymentLink}`;
  } else if (text === "2") {
    const pagamentosAtrasados =
      await inquilinosService.buscarPagamentosAtrasados(inquilino.id);
    const pagamentosPendentes =
      await inquilinosService.buscarPagamentosPendentes(inquilino.id);

    const qtdAtrasados = pagamentosAtrasados.length;
    const qtdPendentes = pagamentosPendentes.length;

    resposta = `🔎 *Situação de pagamentos:*\n\n`;

    if (qtdAtrasados > 0) {
      resposta += `• ${qtdAtrasados} pagamento${
        qtdAtrasados > 1 ? "s" : ""
      } atrasado${qtdAtrasados > 1 ? "s" : ""}:\n\n`;

      pagamentosAtrasados.forEach((p, index) => {
        const venc = new Date(p.due_date).toLocaleDateString("pt-BR");
        const valor = parseFloat(p.amount).toFixed(2).replace(".", ",");
        resposta += `🔸 *${index + 1}º pagamento:*\n`;
        resposta += `📅 Vencimento: ${venc}\n`;
        resposta += `💰 Valor: R$ ${valor}\n`;
        resposta += `🔗 Link: ${p.link_pagamento}\n\n`;
      });
    } else {
      resposta += `• Nenhum pagamento atrasado.\n`;
    }

    if (qtdPendentes === 1) {
      const p = pagamentosPendentes[0];
      const venc = new Date(p.due_date).toLocaleDateString("pt-BR");
      const valor = parseFloat(p.amount).toFixed(2).replace(".", ",");
      resposta += `• 1 pagamento pendente:\n`;
      resposta += `📅 Vencimento: ${venc}\n`;
      resposta += `💰 Valor: R$ ${valor}\n`;
      resposta += `🔗 Link: ${p.link_pagamento}`;
    } else {
      resposta += `• Nenhum pagamento pendente.`;
    }
  } else {
    resposta =
      "❌ Não entendi o que você quis dizer.\nDigite *menu* para ver as opções.";
  }

  return sendResponse(res, resposta);
};

function sendResponse(res, mensagem) {
  res.set("Content-Type", "text/xml");
  res.send(`
    <Response>
      <Message>${mensagem}</Message>
    </Response>
  `);
  console.log("Resposta enviada:", mensagem);
}
