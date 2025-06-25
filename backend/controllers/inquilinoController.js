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
  const { id } = req.params;
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
  const { id } = req.params;
  const data_vencimento = req.body.data_vencimento;

  try {
    const resultado = await inquilinoService.atualizarDataVencimento(
      id,
      data_vencimento
    );

    if (resultado.affectedRows === 0) {
      return res.status(404).json({
        mensagem: "Inquilino não encontrado ou data já estava atualizada.",
        data_vencimento: data_vencimento,
      });
    }

    res.json({
      mensagem: "Data de vencimento atualizada com sucesso.",
      data_vencimento: data_vencimento,
    });
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

async function bsucarTelefonePorCustomerId(req, res) {
  const { customerId } = req.params;
  try {
    const telefone = await inquilinoService.buscarTelefonePorCustomerId(customerId);
    if (telefone) {
      res.json(telefone);
    } else {
      res.status(404).json({ erro: "Inquilino não encontrado" });
    }
  } catch (err) {
    console.error("Erro ao buscar telefone:", err);
    res.status(500).json({ erro: "Erro ao buscar telefone" });
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
  bsucarTelefonePorCustomerId
};
