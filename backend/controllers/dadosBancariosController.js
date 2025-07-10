const dadosBancariosService = require('../services/dadosBancariosService');

exports.salvar = async (req, res) => {
  const { id } = req.userId;
  const dados = req.body;

  try {
    const resposta = await dadosBancariosService.enviarDados(id, dados);
    return res.status(resposta.status).json(await resposta.json());
  } catch (err) {
    console.error("Erro ao salvar dados bancários remotamente:", err.message);
    return res.status(500).json({ erro: "Erro ao salvar dados bancários" });
  }
};

exports.buscar = async (req, res) => {
  const { id } = req.userId;

  try {
    const resposta = await dadosBancariosService.obterDados(id);
    if (!resposta.ok) {
      return res.status(resposta.status).json(await resposta.json());
    }
    const dados = await resposta.json();
    return res.json(dados);
  } catch (err) {
    console.error("Erro ao buscar dados bancários remotamente:", err.message);
    return res.status(500).json({ erro: "Erro ao buscar dados bancários" });
  }
};
