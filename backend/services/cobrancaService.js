const db = require("../database/dbconnect");
const asaasService = require("./asaasService");

const getCobrancasPendentes = async () => {
  const [results] = await db.query(`
    SELECT 
      c.id AS contrato_id,
      c.valor_aluguel,
      c.data_vencimento,
      i.id AS inquilino_id,
      i.nome AS nome_inquilino,
      i.telefone AS telefone_inquilino,
      i.id_asaas
    FROM contratos c
    JOIN inquilinos i ON c.inquilino_id = i.id
    WHERE c.status = 'ativo'
  `);
  return results;
};

const getDataVencimentoPorId = async (inquilinoid) => {
  const [result] = await db.query(
    `SELECT data_vencimento FROM contratos WHERE inquilino_id = ?`,
    [inquilinoid]
  );
  return result;
};

const criarCobrancaPix = async ({
  id_asaas,
  valor,
  data_vencimento,
  contrato_id,
}) => {
  const pagamento = await asaasService.gerarPagamentoPix(
    id_asaas,
    valor,
    data_vencimento
  );

  const query = `
    INSERT INTO pagamentos 
    (contrato_id, asaas_payment_id, due_date, payment_date, amount, link_pagamento) 
    VALUES (?, ?, ?, ?, ?, ?)`;

  const values = [
    contrato_id,
    pagamento.id,
    data_vencimento,
    null,
    valor,
    pagamento.invoiceUrl,
  ];

  await db.query(query, values);

  return pagamento;
};

const getPendenciasInquilino = async (inquilino_id) => {
  const [result] = await db.query(
    `
    SELECT p.link_pagamento, p.due_date 
    FROM pagamentos p
    JOIN contratos c ON p.contrato_id = c.id
    WHERE c.inquilino_id = ? AND (p.status = 'pendente' OR p.status = 'atrasado')
    `,
    [inquilino_id]
  );
  return result;  
};

module.exports = {
  getCobrancasPendentes,
  getDataVencimentoPorId,
  criarCobrancaPix,
  getPendenciasInquilino
};
