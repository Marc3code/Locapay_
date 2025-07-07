const imovelService = require("../services/imovelService");

// ------------------ controllers GET ------------------
async function listarTodos(req, res) {
  try {
    const locadorId = req.userId;
    const imoveis = await imovelService.getTodosImoveis(locadorId);
    res.json(imoveis);
  } catch (err) {
    console.error("Erro ao buscar imóveis:", err);
    res.status(500).json({ erro: "Erro ao buscar imóveis" });
  }
}

// ------------------ controllers POST ------------------

async function criarImovel(req, res) {
  const { tipo, endereco, numero } = req.body;
  const locadorId = req.userId;

  try {
    const novoImovel = await imovelService.criarImovel({
      tipo,
      endereco,
      numero,
      locador_id: locadorId,
    });
    res.status(201).json(novoImovel);
  } catch (err) {
    console.error("Erro ao adicionar imóvel:", err);
    res.status(500).json({ erro: "Erro ao adicionar imóvel" });
  }
}

module.exports = {
  listarTodos,
  criarImovel,
};
