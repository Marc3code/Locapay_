const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const locadorService = require("../services/locadorService");
require("dotenv").config();

exports.registrar = async (req, res) => {
  const { nome, email, senha, cpf_cnpj, telefone, plano_id } = req.body;
  const senha_hash = await bcrypt.hash(senha, 10);

  const id = await locadorService.criarLocador({
    nome,
    email,
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
        body: JSON.stringify({ id, plano_id }),
      }
    );

    if (!respostaAssinatura.ok) {
      const erro = await respostaAssinatura.text();
      console.warn("Assinatura não registrada, mas locador foi criado:", erro);
      return res.status(201).json({
        id,
        aviso:
          "Locador registrado, mas ocorreu um erro ao registrar a assinatura.",
      });
    }

    res.status(201).json({ id });
  } catch (err) {
    console.error("Erro no registro:", err);
    res.status(500).json({ erro: "Erro no registro do locador." });
  }
};

exports.login = async (req, res) => {
  const { email, senha } = req.body;

  const locador = await locadorService.buscarPorEmail(email);
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
