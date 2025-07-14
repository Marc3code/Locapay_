const dadosBancariosService = require("../services/dadosBancariosService");

exports.salvar = async (req, res) => {
  const id = req.userId;
  const dados = req.body;

  try {
    const resposta = await dadosBancariosService.enviarDados(id, dados);

    let respostaSaldoLocador = null;

    try {
      const resposta2 = await fetch(
        `${process.env.API_BASE_ASSINATURAS}/saldos_locadores/adicionar`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.ASSINATURAS_API_KEY}`,
          },
          body: JSON.stringify({ locador_id: id }),
        }
      );

      if (resposta2.ok) {
        respostaSaldoLocador = await resposta2.json();
      } else {
        console.log(`Erro ao criar linha de saldo para o locador: ${id}`);
        respostaSaldoLocador = {
          error: `Erro ao criar linha de saldo para o locador: ${id}`,
        };
      }
    } catch (err) {
      console.error(err);
      respostaSaldoLocador = {
        error: "Erro ao comunicar com saldo do locador",
        details: err.message,
      };
    }

    const dadosResposta = await resposta.json();

    return res.status(resposta.status).json({
      dadosBancarios: dadosResposta,
      saldoLocador: respostaSaldoLocador,
    });
  } catch (err) {
    console.error("Erro ao salvar dados bancários remotamente:", err.message);
    return res.status(500).json({ erro: "Erro ao salvar dados bancários" });
  }
};

exports.buscar = async (req, res) => {
  const id = req.userId;

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
