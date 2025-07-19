const db = require("../database/dbconnect");

exports.salvarDadosBancarios = async (locadorId, dados) => {
  // Buscar dados anteriores
  const [rows] = await db.query(
    "SELECT * FROM dados_bancarios_locadores WHERE locador_id = ?",
    [locadorId]
  );

  const dadosAntigos = rows[0] || {};

  const banco_codigo = dados.banco_codigo ?? dadosAntigos.banco_codigo ?? null;
  const banco_nome = dados.banco_nome ?? dadosAntigos.banco_nome ?? null;
  const agencia = dados.agencia ?? dadosAntigos.agencia ?? null;
  const conta = dados.conta ?? dadosAntigos.conta ?? null;
  const conta_digito = dados.conta_digito ?? dadosAntigos.conta_digito ?? null;
  const tipo_conta = dados.tipo_conta ?? dadosAntigos.tipo_conta ?? null;
  const tipo_chave_pix = dados.tipo_chave_pix ?? dadosAntigos.tipo_chave_pix ?? null;
  const chave_pix = dados.chave_pix ?? dadosAntigos.chave_pix ?? null;

  await db.query(
    `
    INSERT INTO dados_bancarios_locadores (
      locador_id, banco_codigo, banco_nome, agencia, conta, conta_digito, tipo_conta, chave_pix, tipo_chave_pix
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE
      banco_codigo = VALUES(banco_codigo),
      banco_nome = VALUES(banco_nome),
      agencia = VALUES(agencia),
      conta = VALUES(conta),
      conta_digito = VALUES(conta_digito),
      tipo_conta = VALUES(tipo_conta),
      chave_pix = VALUES(chave_pix),
      tipo_chave_pix = VALUES(tipo_chave_pix)
      data_ultima_atualizacao = NOW()
  `,
    [
      locadorId,
      banco_codigo,
      banco_nome,
      agencia,
      conta,
      conta_digito,
      tipo_conta,
      chave_pix,
      tipo_chave_pix
    ]
  );
};

exports.buscarDadosBancarios = async (locadorId) => {
  const [rows] = await db.query(
    `SELECT * FROM dados_bancarios_locadores WHERE locador_id = ?`,
    [locadorId]
  );
  return rows[0];
};
