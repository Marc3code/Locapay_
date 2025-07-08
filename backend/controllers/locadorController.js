const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const locadorService = require('../services/locadorService');

exports.registrar = async (req, res) => {
  const { nome, email, senha, cpf_cnpj, telefone } = req.body;
  const senha_hash = await bcrypt.hash(senha, 10);

  const id = await locadorService.criarLocador({ nome, email, senha_hash, cpf_cnpj, telefone });
  res.status(201).json({ id });
};

exports.login = async (req, res) => {
  const { email, senha } = req.body;

  const locador = await locadorService.buscarPorEmail(email);
  if (!locador) return res.status(400).json({ erro: 'E-mail não encontrado' });

  const valid = await bcrypt.compare(senha, locador.senha_hash);
  if (!valid) return res.status(401).json({ erro: 'Senha incorreta' });

  const token = jwt.sign({ id: locador.id }, 'seu_segredo_jwt', { expiresIn: '1d' });
  res.json({ token });
};

exports.buscarDadosGerais = async (req, res) => {
  const id  = req.userId;

  const locador = await locadorService.buscarDadosGerais(id);
  if (!locador) return res.status(400).json({ erro: 'Locador nao encontrado não encontrado' });

  res.json(locador)
};
