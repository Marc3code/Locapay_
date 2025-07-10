const dadosService = require("../services/dadosBancariosService");

exports.atualizar = async (req, res) => {
  const locador_id = req.params.id;
  const dados = req.body;

  try {
    await dadosService.salvarDadosBancarios(locador_id, dados);
    res.json({ message: "Dados bancários salvos com sucesso." });
  } catch (err) {
    console.error("Erro ao salvar dados bancários:", err.message);
    res.status(500).json({ erro: "Erro ao salvar dados bancários." });
  }
};

exports.obter = async (req, res) => {
  const locador_id = req.params.id;

  try {
    const dados = await dadosService.buscarDadosBancarios(locador_id);

    if (!dados) {
      return res.status(404).json({ erro: "Dados não encontrados" });
    }

    res.json(dados);
  } catch (err) {
    console.error("Erro ao buscar dados bancários:", err.message);
    res.status(500).json({ erro: "Erro ao buscar dados bancários." });
  }
};
