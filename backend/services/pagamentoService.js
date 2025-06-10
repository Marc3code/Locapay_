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



module.exports = {
  getTodosPagamentos,
  criarPagamentoPix,
  getLinkPagamentoPendente,
};
