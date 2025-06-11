const cobrancaService = require("../services/cobrancaService");


// ------------------ controllers GET ------------------
const getDataVencimentoPorId = async (req, res) => {
  const inquilinoid = req.params.inquilinoid;

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

const getCobrancasPendentes = async (req, res) => {
  try {
    const response = await cobrancaService.getCobrancasPendentes();

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

async function criarCobrancaPix(req, res) {
  const { id_asaas, valor, data_vencimento, inquilino_id } = req.body;

  try {
    const pagamento = await cobrancaService.criarCobrancaPix({
      id_asaas,
      valor,
      data_vencimento,
      inquilino_id,
    });

    res.json(pagamento);
  } catch (err) {
    console.error("Erro ao criar cobrança:", err);
    res.status(500).json({ erro: "Erro ao criar cobrança ou registrar no BD" });
  }
}

module.exports = {
  getDataVencimentoPorId,
  getCobrancasPendentes,
  criarCobrancaPix
};
