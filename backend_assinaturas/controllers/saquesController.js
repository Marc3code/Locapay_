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

module.exports = {
  buscarSaques,
};
