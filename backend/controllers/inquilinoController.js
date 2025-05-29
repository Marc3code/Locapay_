const inquilinoService = require("../services/inquilinoService");

async function listarTodos(req, res) {
  try {
    const inquilinos = await inquilinoService.getTodosInquilinos();
    res.json(inquilinos);
  } catch (err) {
    console.error("Erro ao buscar inquilinos:", err);
    res.status(500).json({ erro: "Erro ao buscar inquilinos" });
  }
}

async function buscarPorId(req, res) {
  const { id } = req.query;
  try {
    const inquilino = await inquilinoService.getInquilinoPorId(id);
    res.json(inquilino);
  } catch (err) {
    console.error("Erro ao buscar inquilino:", err);
    res.status(500).json({ erro: "Erro ao buscar inquilino" });
  }
}

async function buscarPorTelefone(req, res) {
  const { telefone } = req.params;
  try {
    const inquilino = await inquilinoService.getInquilinoPorTelefone(telefone);
    if (inquilino) {
      res.json(inquilino);
    } else {
      res.status(404).json({ erro: "Inquilino não encontrado" });
    }
  } catch (err) {
    console.error("Erro ao buscar inquilino:", err);
    res.status(500).json({ erro: "Erro ao buscar inquilino" });
  }
}

async function listarComImovel(req, res) {
  try {
    const resultados = await inquilinoService.getInquilinosComImovel();
    res.json(resultados);
  } catch (err) {
    console.error("Erro ao buscar inquilinos com imóvel:", err);
    res.status(500).json({ erro: "Erro ao buscar inquilinos com imóvel" });
  }
}

module.exports = {
  listarTodos,
  buscarPorId,
  buscarPorTelefone,
  listarComImovel,
};
