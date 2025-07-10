const db = require("../database/dbconnect");

exports.criarLocador = async (locador) => {
  const [result] = await db.query(
    `
    INSERT INTO locadores (nome, senha_hash, cpf_cnpj, telefone)
    VALUES (?, ?, ?, ?, ?)
  `,
    [
      locador.nome,
      locador.senha_hash,
      locador.cpf_cnpj,
      locador.telefone,
    ]
  );

  return result.insertId;
};

exports.buscarPorEmail = async (cpf_cnpj) => {
  const [rows] = await db.query(`SELECT * FROM locadores WHERE cpf_cnpj = ?`, [
    cpf_cnpj,
  ]);
  return rows[0];
};

exports.buscarDadosGerais = async (id) => {
  const [rows] = await db.query(
    `SELECT
      l.nome,
      l.telefone,
      l.cpf_cnpj,
      l.data_cadastro,
      d.banco_codigo,
      d.banco_nome,
      d.agencia,
      d.conta,
      d.conta_digito,
      d.tipo_conta,
      d.chave_pix,
      d.data_ultima_atualizacao
    FROM
      locadores l
    LEFT JOIN
      dados_bancarios_locadores d ON l.id = d.locador_id
    WHERE
      l.id = ?;`,
    [id]
  );
  return rows[0];
};
