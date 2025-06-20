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
    resposta = "🔍 Verificando pendências...";
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
