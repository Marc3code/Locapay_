const imovelService = require("../services/imovelService");

async function listarTodos(req, res) {
  try {
    const imoveis = await imovelService.getTodosImoveis();
    res.json(imoveis);
  } catch (err) {
    console.error("Erro ao buscar imóveis:", err);
    res.status(500).json({ erro: "Erro ao buscar imóveis" });
  }
}

module.exports = {
  listarTodos,
};
