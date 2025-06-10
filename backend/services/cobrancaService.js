const db = require("../database/dbconnect");

const getCobrancasAtivas = async () => {
  const [results] = await db.query(`
    SELECT ii.*, i.id_asaas 
    FROM inquilinos_imoveis ii 
    INNER JOIN inquilinos i ON ii.inquilino_id = i.id 
    WHERE ii.status = 'ativo'
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
  getCobrancasAtivas,
  getDataVencimentoPorId,
  criarCobrancaPix
};
