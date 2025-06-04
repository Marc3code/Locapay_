const cobrancaService = require("../services/cobrancaService");

const getDataVencimentoPorId = async (req, res) => {
  const { inquilinoid } = req.params.inquilinoid;

  if (!inquilinoid) {
    return res
      .status(400)
      .json({ erro: "Parâmetro 'inquilinoid' é obrigatório." });
  }

  try {
    const resultado = await cobrancaService.getDataVencimentoPorId(inquilinoid);

    if (!resultado || resultado.length === 0) {
      return res
        .status(404)
        .json({ erro: "Data de vencimento não encontrada." });
    }

    res.json(resultado[0]);
  } catch (err) {
    console.error("Erro ao buscar data de vencimento:", err);
    res.status(500).json({ erro: "Erro ao buscar data de vencimento." });
  }
};

const getCobrancasAtivas = async (req, res) => {
  try {
    const response = await cobrancaService.getCobrancasAtivas();

    if (!response) {
      return res
        .status(404)
        .json({ erro: "Data de vencimento não encontrada." });
    }
  } catch (err) {
    console.error("Erro ao buscar cobranças ativas:", err);
    res.status(500).json({ erro: "Erro ao buscar cobranças ativas." });
  }
};

module.exports = {
  getDataVencimentoPorId,
  getCobrancasAtivas
};
