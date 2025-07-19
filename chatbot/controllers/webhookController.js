const inquilinosService = require("../services/inquilino/inquilinoServices");
const { formatarData } = require("../utils/formatDate");
const { formatarNumeroWhatsapp } = require("../utils/formatNumber");

exports.handleWebhook = async (req, res) => {
  const from = req.body.From;
  const text = req.body.Body.trim().toLowerCase();

  console.log("Mensagem recebida de:", from);
  console.log("Conteúdo:", text);

  const numeroFormatado = formatarNumeroWhatsapp(from);
  const inquilino = await inquilinosService.getInquilinoPorTelefone(numeroFormatado);

  if (!inquilino || !inquilino.id) {
    return sendResponse(
      res,
      "❌ Não foi possível identificar seu número. Por favor, entre em contato com o suporte para assistência."
    );
  }

  let resposta = "";

  if (
    ["menu", "oi", "ola", "olá", "boa tarde", "boa noite", "bom dia"].includes(text)
  ) {
    resposta =
      `Olá, ${inquilino.nome}.\n\n` +
      `👔 *Menu de Atendimento*\n` +
      `Por favor, selecione uma das opções abaixo para prosseguir:\n\n` +
      `1️⃣ - Receber o link para pagamento do aluguel referente ao mês atual\n\n` +
      `2️⃣ - Consultar a situação atual dos seus pagamentos\n\n` +
      `Digite o número correspondente à opção desejada.`;
  } else if (text === "1") {
    const link = await inquilinosService.buscarLinkPagamento(inquilino.id, inquilino.locador_id);
    if (!link || !link.paymentLink) {
      resposta =
        "❌ Não foi possível localizar o link de pagamento para o mês atual. Por favor, tente novamente mais tarde ou entre em contato com o suporte.";
    } else {
      resposta =
        `💳 *Link para Pagamento*\n\n` +
        `Segue o link para o pagamento do aluguel referente ao mês atual:\n` +
        `${link.paymentLink}\n\n` +
        `Por favor, utilize este link para efetuar o pagamento.`;
    }
  } else if (text === "2") {
    const pagamentosAtrasados = await inquilinosService.buscarPagamentosAtrasados(inquilino.id);
    const pagamentosPendentes = await inquilinosService.buscarPagamentosPendentes(inquilino.id);

    const qtdAtrasados = pagamentosAtrasados.length;
    const qtdPendentes = pagamentosPendentes.length;

    resposta = `🔎 *Situação Atual dos Pagamentos*\n\n`;

    if (qtdAtrasados > 0) {
      resposta += `• Você possui ${qtdAtrasados} pagamento${qtdAtrasados > 1 ? "s" : ""} atrasado${qtdAtrasados > 1 ? "s" : ""}:\n\n`;

      pagamentosAtrasados.forEach((p, index) => {
        const venc = new Date(p.due_date).toLocaleDateString("pt-BR");
        const valor = parseFloat(p.amount).toFixed(2).replace(".", ",");
        resposta +=
          `🔸 *${index + 1}º pagamento:*\n` +
          `📅 Vencimento: ${venc}\n` +
          `💰 Valor: R$ ${valor}\n` +
          `🔗 Link para pagamento: ${p.link_pagamento}\n\n`;
      });
    } else {
      resposta += `• Não há pagamentos em atraso.\n\n`;
    }

    if (qtdPendentes === 1) {
      const p = pagamentosPendentes[0];
      const venc = new Date(p.due_date).toLocaleDateString("pt-BR");
      const valor = parseFloat(p.amount).toFixed(2).replace(".", ",");

      resposta +=
        `• Você possui 1 pagamento pendente:\n` +
        `📅 Vencimento: ${venc}\n` +
        `💰 Valor: R$ ${valor}\n` +
        `🔗 Link para pagamento: ${p.link_pagamento}\n`;
    } else {
      resposta += `• Não há pagamentos pendentes no momento.`;
    }
  } else {
    resposta =
      "❌ Desculpe, não entendi sua solicitação.\n" +
      "Digite *menu* para visualizar as opções disponíveis.";
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
