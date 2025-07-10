const assinaturaService = require("../services/assinaturasService");

async function buscarAssinatura(req, res) {
  const { locador_id } = req.params;

  try {
    const assinatura = await assinaturaService.BuscarAssinatura(locador_id);

    if (!assinatura) {
      return res.status(404).json({
        sucesso: false,
        mensagem: "Assinatura não encontrada para este locador",
      });
    }

    return res.status(200).json({ sucesso: true, assinatura });
  } catch (error) {
    console.error("Erro no controller buscarAssinatura:", error.message);
    return res.status(500).json({
      sucesso: false,
      mensagem: "Erro ao buscar assinatura",
    });
  }
}

async function adicionarAssinatura(req, res) {
  const { locador_id, plano_id} = req.body;

  try {
    const resultado = await assinaturaService.adicionarAssinatura(
      locador_id,
      plano_id,
      data_inicio,
      data_fim
    );

    return res.status(201).json(resultado);
  } catch (error) {
    console.error("Erro no controller adicionarAssinatura:", error.message);
    return res.status(500).json({
      sucesso: false,
      mensagem: "Erro ao adicionar assinatura",
    });
  }
}

async function atualizarDatasInicioFim() {
    const { locador_id } = req.params;
  const { data_inicio, data_fim } = req.body;

  try {
    const resultado = await assinaturaService.atualizarStatusAssinatura(
      locador_id,
      data_inicio,
      data_fim
    );

    return res.status(200).json(resultado);
  } catch (error) {
    console.error("Erro no controller atualizarStatusAssinatura:", error.message);
    return res.status(500).json({
      sucesso: false,
      mensagem: "Erro ao atualizar status da assinatura",
    });
  }
}

async function atualizarAssinatura(req, res) {
  const { locador_id } = req.params;
  const { novoPlano_id } = req.body;

  try {
    const resultado = await assinaturaService.atualizarAssinatura(
      locador_id,
      novoPlano_id
    );

    return res.status(200).json(resultado);
  } catch (error) {
    console.error("Erro no controller atualizarAssinatura:", error.message);
    return res.status(500).json({
      sucesso: false,
      mensagem: "Erro ao atualizar assinatura",
    });
  }
}

async function atualizarStatusAssinatura(req, res) {
  const { locador_id } = req.params;
  const { status } = req.body;

  try {
    const resultado = await assinaturaService.atualizarStatusAssinatura(
      locador_id,
      status
    );

    return res.status(200).json(resultado);
  } catch (error) {
    console.error("Erro no controller atualizarStatusAssinatura:", error.message);
    return res.status(500).json({
      sucesso: false,
      mensagem: "Erro ao atualizar status da assinatura",
    });
  }
}

module.exports = {
  buscarAssinatura,
  adicionarAssinatura,
  atualizarDatasInicioFim,
  atualizarAssinatura,
  atualizarStatusAssinatura,
};
