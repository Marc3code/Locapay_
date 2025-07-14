const dadosBancariosService = require("../services/dadosBancariosService");

//precisa ajustar o retorno em caso de possível duplicidade, mas ta funcionando
exports.salvar = async (req, res) => {
  const id = req.userId;
  const dados = req.body;

  try {
    const resposta = await dadosBancariosService.enviarDados(id, dados);
    const dadosResposta = await resposta.json();

    let respostaSaldoLocador = null;

    // Se já existem dados bancários, retorna com mensagem apropriada
    if (
      !resposta.ok &&
      (dadosResposta?.erro?.code === "ER_DUP_ENTRY" ||
        dadosResposta?.mensagem?.toLowerCase().includes("já existem"))
    ) {
      return res.status(409).json({
        dadosBancarios: {
          sucesso: false,
          mensagem: "Já existem dados bancários cadastrados para este locador.",
        },
        saldoLocador: null,
      });
    }

    // Só tenta criar o saldo se os dados bancários foram salvos com sucesso
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
        const textoErro = await resposta2.text();
        if (textoErro.includes("Duplicate entry")) {
          respostaSaldoLocador = {
            sucesso: false,
            mensagem: "Saldo do locador já existe.",
          };
        } else {
          respostaSaldoLocador = {
            sucesso: false,
            mensagem: "Erro ao criar saldo para o locador.",
            erro: textoErro,
          };
        }
      }
    } catch (err) {
      respostaSaldoLocador = {
        sucesso: false,
        mensagem: "Erro ao comunicar com o serviço de saldo do locador.",
        erro: err.message,
      };
    }

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
