const db = require("../database/dbconnect");

async function getTodosPagamentos(locadorId) {
  const [results] = await db.query(
    `SELECT p.* 
     FROM pagamentos p
     JOIN contratos c ON p.contrato_id = c.id
     JOIN imoveis im ON c.imovel_id = im.id
     WHERE im.locador_id = ?`,
    [locadorId]
  );
  return results;
}

async function getLinkPagamentoPendente(inquilino_id, locadorId) {
  const [results] = await db.query(
    `SELECT p.link_pagamento 
     FROM pagamentos p
     JOIN contratos c ON p.contrato_id = c.id
     JOIN imoveis im ON c.imovel_id = im.id
     WHERE c.inquilino_id = ? AND p.status = 'pendente' AND im.locador_id = ?
     LIMIT 1`,
    [inquilino_id, locadorId]
  );
  return results.length > 0 ? results[0].link_pagamento : null;
}

async function buscarPagamentosAtrasados(inquilino_id, locadorId) {
  const [results] = await db.query(
    `SELECT p.*
     FROM pagamentos p
     JOIN contratos c ON p.contrato_id = c.id
     JOIN imoveis im ON c.imovel_id = im.id
     WHERE c.inquilino_id = ? AND p.status = 'atrasado' AND im.locador_id = ?
     ORDER BY p.due_date ASC`,
    [inquilino_id, locadorId]
  );
  return results;
}

async function buscarPagamentosPendentes(inquilino_id, locadorId) {
  const [results] = await db.query(
    `SELECT p.*
     FROM pagamentos p
     JOIN contratos c ON p.contrato_id = c.id
     JOIN imoveis im ON c.imovel_id = im.id
     WHERE c.inquilino_id = ? AND p.status = 'pendente' AND im.locador_id = ?
     ORDER BY p.due_date ASC`,
    [inquilino_id, locadorId]
  );
  return results;
}

async function atualizarStatusPagamento(paymentId, status) {
  const query = `UPDATE pagamentos SET status = ? WHERE asaas_payment_id = ?`;

  try {
    const [result] = await db.query(query, [status, paymentId]);

    if (result.affectedRows === 0) {
      console.warn(`Pagamento não encontrado: ${paymentId}`);
      return { success: false, message: "Pagamento não encontrado" };
    }

    console.log(`Status do pagamento (${paymentId}) atualizado para '${status}'`);
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
  buscarPagamentosAtrasados,
  buscarPagamentosPendentes,
};
