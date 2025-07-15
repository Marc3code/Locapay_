const db = require("../database/dbconnect");

exports.registrarTransacao = async (
  locador_id,
  tipo,
  valor,
  origem_pagamento_id,
  descricao
) => {
  try {
    const query = `
      INSERT INTO transacoes_saldo 
        (locador_id, tipo, valor, origem_pagamento_id, descricao)
      VALUES (?, ?, ?, ?, ?)
    `;

    const params = [locador_id, tipo, valor, origem_pagamento_id, descricao];

    const [result] = await db.query(query, params);

    return {
      sucesso: true,
      mensagem: "Transação registrada com sucesso",
      transacao_id: result.insertId,
    };
  } catch (err) {
    console.error("Erro ao registrar transação:", err);
    return {
      sucesso: false,
      mensagem: "Erro ao registrar transação",
      erro: err,
    };
  }
};

exports.buscarTransacoes = async (locador_id) => {
  try {
    const query = "SELECT * FROM transacoes_saldo WHERE locador_id = ?";

    const [result] = await db.query(query, [locador_id]);

    return {
      sucesso: true,
      result,
    };
  } catch (err) {
    console.error("Erro ao buscar transações:", err);
    return {
      sucesso: false,
      mensagem: "Erro ao buscar transações",
      erro: err,
    };
  }
};
