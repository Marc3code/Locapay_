const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const locadorService = require("../services/locadorService");
require("dotenv").config();

exports.registrar = async (req, res) => {
  const { nome, senha, cpf_cnpj, telefone, plano } = req.body;
  const senha_hash = await bcrypt.hash(senha, 10);

  const locadorId = await locadorService.criarLocador({
    nome,
    senha_hash,
    cpf_cnpj,
    telefone,
  });

  try {
    const respostaAssinatura = await fetch(
      "https://backendassinaturas-production.up.railway.app/assinaturas",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.ASSINATURAS_API_KEY}`,
        },
        body: JSON.stringify({ locador_id: locadorId, plano_id: plano }),
      }
    );

    if (!respostaAssinatura.ok) {
      const erro = await respostaAssinatura.text();
      console.warn("Assinatura não registrada, mas locador foi criado:", erro);
      return res.status(201).json({
        locadorId,
        aviso:
          "Locador registrado, mas ocorreu um erro ao registrar a assinatura.",
      });
    }

    res.status(201).json({ locadorId });
  } catch (err) {
    console.error("Erro no registro:", err);
    res.status(500).json({ erro: "Erro no registro do locador." });
  }
};

exports.login = async (req, res) => {
  const { cpf_cnpj, senha } = req.body;

  const locador = await locadorService.buscarPorCpf_Cnpj(cpf_cnpj);
  if (!locador) return res.status(400).json({ erro: "E-mail não encontrado" });

  const valid = await bcrypt.compare(senha, locador.senha_hash);
  if (!valid) return res.status(401).json({ erro: "Senha incorreta" });

  const token = jwt.sign({ id: locador.id }, "seu_segredo_jwt", {
    expiresIn: "1d",
  });
  res.json({ token });
};

exports.buscarDadosGerais = async (req, res) => {
  const id = req.userId;

  const locador = await locadorService.buscarDadosGerais(id);
  if (!locador)
    return res
      .status(400)
      .json({ erro: "Locador nao encontrado não encontrado" });

  res.json(locador);
};

exports.buscarLocadorPorInquilino = async (req, res) => {
  const { inquilino_id } = req.params;

  try {
    const locador = await locadorService.buscarLocadorPorInquilino(
      inquilino_id
    );

    if (!locador) {
      return res
        .status(404)
        .json({ erro: "Locador não encontrado para esse inquilino." });
    }

    return res.json(locador);
  } catch (error) {
    console.error("Erro ao buscar locador por inquilino:", error);
    return res.status(500).json({ erro: "Erro interno do servidor." });
  }
};

exports.buscarSaldoLocador = async (req, res) => {
  const  locador_id  = req.userId;

  try {
    const saldo = await locadorService.buscarSaldoLocador(locador_id);

    if (!saldo ) {
      return res.status(404).json({ erro: "Erro ao buscar saldo do locador" });
    }

    return res.json(saldo);
  } catch (error) {
    console.error("Erro ao buscar saldo do locador:", error);
    return res.status(500).json({ erro: "Erro interno do servidor." });
  }
};

exports.buscarRegistroTransacoes = async (req, res) => {
  const  locador_id  = req.userId;

  try {
    const response = await locadorService.buscarRegistroTransacoes(locador_id);

    if (!response ) {
      return res.status(404).json({ erro: "Erro ao buscar registro de transacoes do locador" });
    }

    return res.json(response.result);
  } catch (error) {
    console.error("Erro ao buscar registro de transacoes do locador:", error);
    return res.status(500).json({ erro: "Erro interno do servidor." });
  }
};

exports.buscarRegistroSaques = async (req, res) => {
  const  locador_id  = req.userId;

  try {
    const response = await locadorService.buscarRegistroSaques(locador_id);

    if (!response ) {
      return res.status(404).json({ erro: "Erro ao buscar registro de transacoes do locador" });
    }

    return res.json(response.result);
  } catch (error) {
    console.error("Erro ao buscar registro de transacoes do locador:", error);
    return res.status(500).json({ erro: "Erro interno do servidor." });
  }
};
