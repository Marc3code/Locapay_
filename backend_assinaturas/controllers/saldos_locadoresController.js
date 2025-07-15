const saldoService = require("../services/saldos_locadoresService");

async function atualizarSaldo(req, res) {
  const { locador_id, valor } = req.body;

  if (!locador_id || !valor) {
    return res.status(400).json({
      sucesso: false,
      mensagem: "locador_id e valor são obrigatórios.",
    });
  }

  try {
    const resultado = await saldoService.atualizarSaldoLocador(locador_id, valor);
    return res.status(200).json(resultado);
  } catch (error) {
    console.error("Erro no controller ao atualizar saldo:", error);
    return res.status(500).json({
      sucesso: false,
      mensagem: "Erro interno ao atualizar saldo do locador.",
    });
  }
}

async function AdicionarSaldo(req, res) {
  const { locador_id } = req.body;

  if (!locador_id) {
    return res.status(400).json({
      sucesso: false,
      mensagem: "locador_id é obrigatório.",
    });
  }

  try {
    const resultado = await saldoService.adicionarSaldoLocador(locador_id);
    return res.status(200).json(resultado);
  } catch (error) {
    console.error("Erro no controller ao criar linha de saldo:", error);
    return res.status(500).json({
      sucesso: false,
      mensagem: "Erro interno ao criar linha de saldo do locador.",
    });
  }
}

async function buscarSaldo(req, res) {
  const { locador_id } = req.params;

  if (!locador_id ) {
    return res.status(400).json({
      sucesso: false,
      mensagem: "locador_id é obrigatório.",
    });
  }

  try {
    const resultado = await saldoService.buscarSaldoLocador(locador_id);
    return res.status(200).json(resultado);
  } catch (error) {
    console.error("Erro no controller ao buscar saldo:", error);
    return res.status(500).json({
      sucesso: false,
      mensagem: "Erro interno ao buscar saldo do locador.",
    });
  }
}

module.exports = {
  atualizarSaldo,
  AdicionarSaldo,
  buscarSaldo
};
