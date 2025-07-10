const dadosService = require("../services/dadosBancariosService");

exports.atualizar = async (req, res) => {
  const { locador_id } = req.params.id;
  const dados = req.body;

  await dadosService.salvarDadosBancarios(locador_id, dados);
  res.json({ message: "Dados bancários salvos com sucesso." });
};

exports.obter = async (req, res) => {
  const { locador_id } = req.params.id;
  const dados = await dadosService.buscarDadosBancarios(locador_id);

  if (!dados) return res.status(404).json({ erro: "Dados não encontrados" });

  res.json(dados);
};
