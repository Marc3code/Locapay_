const db = require("../database/dbconnect");

async function getTodosPagamentos() {
  const [results] = await db.query("SELECT * FROM pagamentos");
  return results;
}

async function getLinkPagamentoPendente(inquilino_id) {
  const [results] = await db.query(
    "SELECT link_pagamento FROM pagamentos WHERE inquilino_id = ? AND status = 'pendente' LIMIT 1",
    [inquilino_id]
  );
  return results.length > 0 ? results[0].link_pagamento : null;
}

async function atualizarStatusPagamento(paymentId, status) {
  const query = `UPDATE pagamentos SET status = ? WHERE asaas_payment_id = ?`;

  try {
    const [result] = await db.query(query, [status, paymentId]);

    if (result.affectedRows === 0) {
      console.warn(`Pagamento não encontrado: ${paymentId}`);
      return { success: false, message: "Pagamento não encontrado" };
    }

    console.log(
      `Status do pagamento (${paymentId}) atualizado para '${status}'`
    );
    return { success: true, affectedRows: result.affectedRows };
  } catch (err) {
    console.error("Erro ao atualizar status do pagamento:", err);
    throw err;
  }
}

module.exports = {
  getTodosPagamentos,
  getLinkPagamentoPendente,
  atualizarStatusPagamento,
};
