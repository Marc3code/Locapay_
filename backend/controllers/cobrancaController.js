const cobrancaService = require("../services/cobrancaService");

// ------------------ controllers GET ------------------
const getDataVencimentoPorId = async (req, res) => {
  const contratoId = req.params.contratoId;

  if (!contratoId) {
    return res
      .status(400)
      .json({ erro: "Parâmetro 'contratoId' é obrigatório." });
  }

  try {
    const resultado = await cobrancaService.getDataVencimentoPorId(contratoId);

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
    const locadorId = req.userId;
    const response = await cobrancaService.getCobrancasPendentes(locadorId);

    if (!response || response.length === 0) {
      return res.status(404).json({ erro: "Cobranças não encontradas." });
    }

    return res.status(200).json(response);
  } catch (err) {
    console.error("Erro ao buscar cobranças ativas:", err);
    res.status(500).json({ erro: "Erro ao buscar cobranças ativas." });
  }
};

const getCobrancasSeremFeitas = async (req, res) => {
  try {
    const response = await cobrancaService.getCobrancasSeremFeitas();

    if (!response || response.length === 0) {
      return res.status(200).json({ erro: "Não há contratos." });
    }

    return res.status(200).json(response);
  } catch (err) {
    console.error("Erro ao buscar cobranças ativas:", err);
    res.status(500).json({ erro: "Erro ao buscar cobranças ativas." });
  }
};


const getPendenciasInquilino = async (req, res) => {
  const { id: inquilinoId } = req.params;
  const locadorId = req.userId;

  try {
    const response = await cobrancaService.getPendenciasInquilino(inquilinoId, locadorId);

    if (!response || response.length === 0) {
      return res.status(404).json({ erro: "Pendências não encontradas." });
    }

    return res.status(200).json(response);
  } catch (err) {
    console.error("Erro ao buscar pendências:", err);
    res.status(500).json({ erro: "Erro ao buscar pendências." });
  }
};


async function criarCobrancaPix(req, res) {
  const { id_asaas, valor, data_vencimento, contrato_id, locador_api_key } = req.body;

  try {
    const pagamento = await cobrancaService.criarCobrancaPix({
      id_asaas,
      valor,
      data_vencimento,
      contrato_id,
      locador_api_key
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
  criarCobrancaPix,
  getPendenciasInquilino,
  getCobrancasSeremFeitas
};
