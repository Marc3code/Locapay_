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
      res.status(404).json({
        success: false,
        message: "Nenhum pagamento pendente encontrado",
      });
    }
  } catch (err) {
    console.error("Erro ao buscar link de pagamento:", err);
    res.status(500).json({ success: false, error: "Erro interno no servidor" });
  }
}

async function atualizarStatusPagamento(req, res) {
  const paymentId = req.body.paymentId; // Corrigido para camelCase
  const status = req.body.status;

  if (!paymentId || !status) {
    return res.status(400).json({
      message: "Dados incompletos. Forneça paymentId e status.",
    });
  }

  try {
    const result = await pagamentoService.atualizarStatusPagamento(
      paymentId,
      status
    );

    if (result && result.success) {
      return res.json({
        success: true,
        message: `Status atualizado para '${status}'`,
        paymentId,
      });
    }

    return res.status(404).json({
      success: false,
      message: "Pagamento não encontrado",
      paymentId,
    });
  } catch (err) {
    console.error("Erro no controlador:", err);
    return res.status(500).json({
      message: "Erro interno ao atualizar status",
      error: err.message,
      paymentId,
    });
  }
}

module.exports = {
  listarTodos,
  buscarLinkPagamento,
  atualizarStatusPagamento,
};
