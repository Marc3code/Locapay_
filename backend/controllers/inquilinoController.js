const inquilinoService = require("../services/inquilinoService");

// ------------------ controllers GET ------------------
async function listarTodos(req, res) {
  try {
    const locadorId = req.userId;
    const inquilinos = await inquilinoService.getTodosInquilinos(locadorId);
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
    const locadorId = req.userId;
    const resultados = await inquilinoService.getInquilinosComImovel(locadorId);
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
  const name = req.body.name;
  const phone = req.body.phone;
  const cpfCnpj = req.body.cpfCnpj;
  const locadorId = req.userId;

  try {
    const response = await fetch(
      `${process.env.API_BASE}/user/buscar-info-subconta/${locadorId}`
    );
    const locadorSC = await response.json();

    if (!locadorSC.asaas_api_key) {
      return res.status(400).json({ erro: "Chave da subconta não encontrada" });
    }

    const novoInquilino = await inquilinoService.criarInquilino(
      name,
      phone,
      cpfCnpj,
      locadorId,
      locadorSC.asaas_api_key
    );

    res.status(201).json(novoInquilino);
  } catch (err) {
    console.error("Erro ao adicionar inquilino:", err);
    res.status(500).json({ erro: "Erro ao adicionar inquilino" });
  }
}

async function vincularInquilinoImovel(req, res) {
  try {
    const dados = req.body;
    const vinculo = await inquilinoService.vincularContrato(dados);
    res.status(201).json(vinculo);
  } catch (err) {
    console.error("Erro ao vincular inquilino a imóvel:", err);
    res.status(500).json({ erro: "Erro ao vincular inquilino a imóvel" });
  }
}

async function bsucarTelefonePorCustomerId(req, res) {
  const { customerId } = req.params;
  try {
    const telefone = await inquilinoService.buscarTelefonePorCustomerId(
      customerId
    );
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
  bsucarTelefonePorCustomerId,
};
