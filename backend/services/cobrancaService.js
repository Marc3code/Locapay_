const db = require("../database/dbconnect");

const getCobrancasPendentes = async () => {
  const [results] = await db.query(`
    select * from pagamentos where status = "pendente"
  `);
  return results;
} 

const getDataVencimentoPorId = async (inquilinoid) => {
  const [result] = await db.query(
    "SELECT data_vencimento FROM inquilinos_imoveis WHERE inquilino_id = ?",
    [inquilinoid]
  );
  return result;
}

const asaasService = require("./asaasService");
const criarCobrancaPix = async ({
  id_asaas,
  valor,
  data_vencimento,
  inquilino_id,
}) => {
  const pagamento = await asaasService.gerarPagamentoPix(
    id_asaas,
    valor,
    data_vencimento
  );

  const query = `
    INSERT INTO pagamentos 
    (inquilino_id, asaas_payment_id, due_date, payment_date, amount, link_pagamento) 
    VALUES (?, ?, ?, ?, ?, ?)`;

  const values = [
    inquilino_id,
    pagamento.id,
    data_vencimento,
    null,
    valor,
    pagamento.invoiceUrl,
  ];

  await db.query(query, values);

  return pagamento;
};

module.exports = {
  getCobrancasPendentes,
  getDataVencimentoPorId,
  criarCobrancaPix
};
