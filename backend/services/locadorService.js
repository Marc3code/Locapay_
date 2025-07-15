const { json } = require("express");
const db = require("../database/dbconnect");

exports.criarLocador = async (locador) => {
  const [result] = await db.query(
    `
    INSERT INTO locadores (nome, senha_hash, cpf_cnpj, telefone)
    VALUES (?, ?, ?, ?)
  `,
    [locador.nome, locador.senha_hash, locador.cpf_cnpj, locador.telefone]
  );

  return result.insertId;
};

exports.buscarPorCpf_Cnpj = async (cpf_cnpj) => {
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

exports.buscarLocadorPorInquilino = async (inquilinoId) => {
  const query = `
    SELECT l.id AS locador_id, l.nome, l.telefone
    FROM contratos c
    JOIN imoveis i ON c.imovel_id = i.id
    JOIN locadores l ON i.locador_id = l.id
    WHERE c.inquilino_id = ?
    LIMIT 1
  `;

  const [rows] = await db.query(query, [inquilinoId]);

  if (rows.length === 0) {
    return null;
  }

  return rows[0];
};

exports.buscarSaldoLocador = async (locador_id) => {
  try {
    const response = await fetch(
      `${process.env.API_BASE_ASSINATURAS}/saldos_locadores/buscar/${locador_id}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${process.env.ASSINATURAS_API_KEY}`,
        },
      }
    );

    if (!response.ok) {
      console.warn("Erro na resposta da API de saldos:", response.status);
      return null;
    }

    const result = await response.json();
    return result;
  } catch (err) {
    console.error("Erro ao buscar saldo do locador:");
    console.log(err);
    return null;
  }
};

exports.buscarRegistroTransacoes = async (locador_id) => {
  try {
    const response = await fetch(
      `${process.env.API_BASE_ASSINATURAS}/transacoes_saldo/buscar/${locador_id}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${process.env.ASSINATURAS_API_KEY}`,
        },
      }
    );

    if (!response.ok) {
      console.warn("Erro na resposta da API de registros de transações:", response.status);
      return null;
    }

    const result = await response.json();
    return result;
  } catch (err) {
    console.error("Erro ao buscar registros de transações do locador:");
    console.log(err);
    return null;
  }
};

//alo
