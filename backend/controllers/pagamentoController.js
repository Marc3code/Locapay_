const pagamentoService = require("../services/pagamentoService");

// ------------------ controllers GET ------------------
async function listarTodos(req, res) {
  try {
    const locadorId = req.userId;
    const pagamentos = await pagamentoService.getTodosPagamentos(locadorId);
    res.json(pagamentos);
  } catch (err) {
    console.error("Erro ao buscar pagamentos:", err);
    res.status(500).json({ erro: "Erro ao buscar pagamentos" });
  }
}

async function buscarLinkPagamento(req, res) {
  const { inquilino_id, locador_id } = req.params;
  const locadorId = req.userId;
  var link;
  try {
    if (locadorId) {
      link = await pagamentoService.getLinkPagamentoPendente(
        inquilino_id,
        locadorId
      );
    } else if (locador_id) {
      link = await pagamentoService.getLinkPagamentoPendente(
        inquilino_id,
        locador_id
      );
    }
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

async function buscarPagamentosAtrasados(req, res) {
  const { id } = req.params;
  const locadorId = req.userId;

  try {
    const pagamentos = await pagamentoService.buscarPagamentosAtrasados(
      id,
      locadorId
    );
    if (pagamentos.length > 0) {
      res.json(pagamentos);
    } else {
      res.status(404).json({
        success: false,
        message: "Nenhum pagamento atrasado encontrado",
      });
    }
  } catch (err) {
    console.error("Erro ao buscar pagamentos:", err);
    res.status(500).json({ success: false, error: "Erro interno no servidor" });
  }
}

async function buscarPagamentosPendentes(req, res) {
  const { id } = req.params;
  const locadorId = req.userId;

  try {
    const pagamentos = await pagamentoService.buscarPagamentosPendentes(
      id,
      locadorId
    );
    if (pagamentos.length > 0) {
      res.json(pagamentos);
    } else {
      res.status(404).json({
        success: false,
        message: "Nenhum pagamento pendente encontrado",
      });
    }
  } catch (err) {
    console.error("Erro ao buscar pagamentos:", err);
    res.status(500).json({ success: false, error: "Erro interno no servidor" });
  }
}

async function atualizarStatusPagamento(req, res) {
  const paymentId = req.body.paymentId; // camelCase
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
  buscarPagamentosAtrasados,
  buscarPagamentosPendentes,
};
