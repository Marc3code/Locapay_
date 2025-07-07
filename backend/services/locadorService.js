const db = require('../database/dbconnect');

exports.criarLocador = async (locador) => {
  const [result] = await db.query(`
    INSERT INTO locadores (nome, email, senha_hash, cpf_cnpj, telefone)
    VALUES (?, ?, ?, ?, ?)
  `, [locador.nome, locador.email, locador.senha_hash, locador.cpf_cnpj, locador.telefone]);

  return result.insertId;
};

exports.buscarPorEmail = async (email) => {
  const [rows] = await db.query(`SELECT * FROM locadores WHERE email = ?`, [email]);
  return rows[0];
};
