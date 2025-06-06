const imovelService = require("../services/imovelService");

// ------------------ controllers GET ------------------
async function listarTodos(req, res) {
  try {
    const imoveis = await imovelService.getTodosImoveis();
    res.json(imoveis);
  } catch (err) {
    console.error("Erro ao buscar imóveis:", err);
    res.status(500).json({ erro: "Erro ao buscar imóveis" });
  }
}

// ------------------ controllers POST ------------------

async function criarImovel(req, res) {
  const { tipo, endereco, numero } = req.body;
  try {
    const novoImovel = await imovelService.criarImovel({
      tipo,
      endereco,
      numero,
    });
    res.status(201).json(novoImovel);
  } catch (err) {
    console.error("Erro ao adicionar imóvel:", err);
    res.status(500).json({ erro: "Erro ao adicionar imóvel" });
  }
}

module.exports = {
  listarTodos,
  criarImovel
};
