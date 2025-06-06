const pagamentoService = require("../services/pagamentoService");


// ------------------ controllers GET ------------------
async function listarTodos(req, res) {
  try {
    const pagamentos = await pagamentoService.getTodosPagamentos();
    res.json(pagamentos);
  } catch (err) {
    console.error("Erro ao buscar pagamentos:", err);
    res.status(500).json({ erro: "Erro ao buscar pagamentos" });
  }
}

async function buscarLinkPagamento(req, res) {
  const { inquilino_id } = req.params;
  try {
    const link = await pagamentoService.getLinkPagamentoPendente(inquilino_id);
    if (link) {
      res.json({ success: true, paymentLink: link });
    } else {
      res.status(404).json({ success: false, message: "Nenhum pagamento pendente encontrado" });
    }
  } catch (err) {
    console.error("Erro ao buscar link de pagamento:", err);
    res.status(500).json({ success: false, error: "Erro interno no servidor" });
  }
}

module.exports = {
  listarTodos,
  buscarLinkPagamento,
};
