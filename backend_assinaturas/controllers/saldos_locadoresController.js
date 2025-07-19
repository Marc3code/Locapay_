const saldoService = require("../services/saldos_locadoresService");

async function atualizarSaldo(req, res) {
  const { locador_id, valor } = req.body;

  if (locador_id === null || valor === null) {
    return res.status(400).json({
      sucesso: false,
      mensagem: "locador_id e valor são obrigatórios.",
    });
  }

  console.log("Atualizando saldo do locador", locador_id, "com valor", valorAdicionado);
  try {
    const resultado = await saldoService.atualizarSaldoLocador(
      locador_id,
      valor
    );
    return res.status(200).json(resultado);
  } catch (error) {
    console.error("Erro no controller ao atualizar saldo:", error);
    return res.status(500).json({
      sucesso: false,
      mensagem: "Erro interno ao atualizar saldo do locador.",
    });
  }
}

async function atualizarSaldoSaque(req, res) {
  const { locador_id, saldo_total, saldo_bloqueado } = req.body;

  if (locador_id == null || saldo_total == null || saldo_bloqueado == null) {
    return res.status(400).json({
      sucesso: false,
      mensagem: "locador_id, saldo total ou saldo bloqueado nao informados.",
    });
  }

  try {
    const resultado = await saldoService.atualizarSaldoLocadorSaque(
      locador_id,
      saldo_total,
      saldo_bloqueado
    );
    return res.status(200).json(resultado);
  } catch (error) {
    console.error("Erro no controller ao atualizar saldo pós saque:", error);
    return res.status(500).json({
      sucesso: false,
      mensagem: "Erro interno ao atualizar saldo do locador pós saque.",
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

  if (!locador_id) {
    return res.status(400).json({
      sucesso: false,
      mensagem: "locador_id é obrigatório.",
    });
  }

  try {
    const resultado = await saldoService.buscarSaldoLocador(locador_id);
    return res.status(200).json(resultado[0]);
  } catch (error) {
    console.error("Erro no controller ao buscar saldo:", error);
    return res.status(500).json({
      sucesso: false,
      mensagem: "Erro interno ao buscar saldo do locador.",
    });
  }
}

async function desbloquearSaldoLocador(req, res) {
  const { saque_id } = req.body;

  try {
    const resultado = await saldoService.desbloquearSaldoLocador(saque_id);
    return res.status(200).json(resultado);
  } catch (error) {
    console.error("Erro no controller ao desbloquear saldo:", error);
    return res.status(500).json({
      sucesso: false,
      mensagem: "Erro interno ao desbloquear saldo.",
    });
  }
}

module.exports = {
  atualizarSaldo,
  AdicionarSaldo,
  buscarSaldo,
  atualizarSaldoSaque,
  desbloquearSaldoLocador
};
