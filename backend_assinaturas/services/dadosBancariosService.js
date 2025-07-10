const db = require('../database/dbconnect');

exports.salvarDadosBancarios = async (locadorId, dados) => {
  await db.query(`
    INSERT INTO dados_bancarios_locadores (
      locador_id, banco_codigo, banco_nome, agencia, conta, conta_digito, tipo_conta, chave_pix
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE
      banco_codigo = VALUES(banco_codigo),
      banco_nome = VALUES(banco_nome),
      agencia = VALUES(agencia),
      conta = VALUES(conta),
      conta_digito = VALUES(conta_digito),
      tipo_conta = VALUES(tipo_conta),
      chave_pix = VALUES(chave_pix),
      data_ultima_atualizacao = NOW()
  `, [locadorId, dados.banco_codigo, dados.banco_nome, dados.agencia, dados.conta, dados.conta_digito, dados.tipo_conta, dados.chave_pix]);
};

exports.buscarDadosBancarios = async (locadorId) => {
  const [rows] = await db.query(`SELECT * FROM dados_bancarios_locadores WHERE locador_id = ?`, [locadorId]);
  return rows[0];
};
