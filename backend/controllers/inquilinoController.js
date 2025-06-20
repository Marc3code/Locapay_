const inquilinoService = require("../services/inquilinoService");

// ------------------ controllers GET ------------------
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

// ------------------ controllers PUT ------------------

const atualizarDataVencimento = async (req, res) => {
  const  id  = req.params.id;
  const data_vencimento = req.body.data_vencimento;

  try {
    const novaData = await inquilinoService.atualizarDataVencimento(
      data_vencimento,
      id
    );

    res.json(novaData);
  } catch (err) {
    console.error("Erro ao atualizar data de vencimento:", err);
    res.status(500).json({ erro: "Erro ao atualizar data de vencimento" });
  }
};

// ------------------ ROTAS POST ------------------
async function criarInquilino(req, res) {
  const { name, phone, cpfCnpj } = req.body;
  try {
    const novoInquilino = await inquilinoService.criarInquilino({
      name,
      phone,
      cpfCnpj,
    });
    res.status(201).json(novoInquilino);
  } catch (err) {
    console.error("Erro ao adicionar inquilino:", err);
    res.status(500).json({ erro: "Erro ao adicionar inquilino" });
  }
}

async function vincularInquilinoImovel(req, res) {
  try {
    const dados = req.body;
    const vinculo = await inquilinoService.vincularInquilinoImovel(dados);
    res.status(201).json(vinculo);
  } catch (err) {
    console.error("Erro ao vincular inquilino a imóvel:", err);
    res.status(500).json({ erro: "Erro ao vincular inquilino a imóvel" });
  }
}

module.exports = {
  listarTodos,
  buscarPorId,
  buscarPorTelefone,
  listarComImovel,
  criarInquilino,
  atualizarDataVencimento,
  vincularInquilinoImovel,
};
