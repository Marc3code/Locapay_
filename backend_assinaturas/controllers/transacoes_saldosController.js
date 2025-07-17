const transacoes_saldoService = require("../services/transacoes_saldoService");

async function registrarTransacao(req, res) {
  const { locador_id, tipo, valor, origem_pagamento_id, descricao } = req.body;

  if (!locador_id || !valor || !tipo) {
    return res.status(400).json({
      sucesso: false,
      mensagem: "locador_id e valor são obrigatórios.",
    });
  }

  try {
    const resultado = await transacoes_saldoService.registrarTransacao(
      locador_id,
      tipo,
      valor,
      origem_pagamento_id || null,
      descricao
    );

    return res.status(200).json(resultado);
  } catch (error) {
    console.error("Erro no controller ao registrar transação:", error);
    return res.status(500).json({
      sucesso: false,
      mensagem: "Erro interno ao registrar transação.",
    });
  }
}

async function buscarTransacoes(req, res) {
  const  locador_id  = req.params.locador_id;

  if (!locador_id) {
    return res.status(400).json({
      sucesso: false,
      mensagem: "locador_id é obrigatório.",
    });
  }

  try {
    const resultado = await transacoes_saldoService.buscarTransacoes(locador_id);
    return res.status(200).json(resultado);
  } catch (error) {
    console.error("Erro no controller ao buscar transações:", error);
    return res.status(500).json({
      sucesso: false,
      mensagem: "Erro interno ao buscar transações.",
    });
  }
}

module.exports = {
  registrarTransacao,
  buscarTransacoes,
};
