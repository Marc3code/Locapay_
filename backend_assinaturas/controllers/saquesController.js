const saqueService = require("../services/saquesService");

async function buscarSaques(req, res) {
  const { locador_id } = req.params;

  if (!locador_id) {
    return res.status(400).json({
      sucesso: false,
      mensagem: "locador_id é obrigatório.",
    });
  }

  try {
    const resultado = await saqueService.buscarSaques(locador_id);
    return res.status(200).json(resultado);
  } catch (error) {
    console.error("Erro no controller ao buscar saques:", error);
    return res.status(500).json({
      sucesso: false,
      mensagem: "Erro interno ao buscar saques do locador.",
    });
  }
}

async function atualizarStatusSaque(req, res) {
  const { saque_id, status } = req.body;

  try {
    const resultado = await saqueService.atualizarStatusSaque(saque_id, status);
    return res.status(200).json(resultado);
  } catch (error) {
    console.error("Erro no controller ao atualizar status do saque:", error);
    return res.status(500).json({
      sucesso: false,
      mensagem: "Erro interno ao atualizar status do saque do locador.",
    });
  }
}

async function registrarSaque(req, res) {
  const { locador_id, valor } = req.body;

  try {
    const resultado = await saqueService.registrarSaque(locador_id, valor);
    return res.status(200).json(resultado);
  } catch (error) {
    console.error("Erro no controller ao atualizar status do saque:", error);
    return res.status(500).json({
      sucesso: false,
      mensagem: "Erro interno ao atualizar status do saque do locador.",
    });
  }
}

async function adicionarTransferId(req, res) {
  const { saque_id, transfer_id } = req.body;

  try {
    const resultado = await saqueService.adicionarTransferId(saque_id, transfer_id);
    return res.status(200).json(resultado);
  } catch (error) {
    console.error("Erro no controller ao adicionar transfer id:", error);
    return res.status(500).json({
      sucesso: false,
      mensagem: "Erro interno ao adicionar transfer id.",
    });
  }
};



module.exports = {
  buscarSaques,
  atualizarStatusSaque,
  registrarSaque,
  adicionarTransferId
};
