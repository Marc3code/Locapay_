const dadosService = require('../services/dadosBancariosService');

exports.atualizar = async (req, res) => {
  const locadorId = req.userId;
  const dados = req.body;

  await dadosService.salvarDadosBancarios(locadorId, dados);
  res.json({ message: 'Dados bancários salvos com sucesso.' });
};

exports.obter = async (req, res) => {
  const locadorId = req.userId;
  const dados = await dadosService.buscarDadosBancarios(locadorId);

  if (!dados) return res.status(404).json({ erro: 'Dados não encontrados' });

  res.json(dados);
};
