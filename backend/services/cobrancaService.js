const db = require("../database/dbconnect");
const asaasService = require("./asaasService");

const getCobrancasPendentes = async (locadorId) => {
  const [results] = await db.query(
    `
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
    JOIN imoveis im ON c.imovel_id = im.id
    WHERE c.status = 'ativo' AND im.locador_id = ?
  `,
    [locadorId]
  );
  return results;
};

const getCobrancasSeremFeitas = async () => {
  const [results] = await db.query(
    `SELECT 
  i.id AS inquilino_id,
  i.nome AS nome_inquilino,
  i.telefone AS telefone_inquilino,
  i.cpf_cnpj,
  i.id_asaas,
  i.locador_id,

  c.id AS contrato_id,
  c.valor_aluguel,
  c.data_vencimento,
  c.status AS contrato_status,

  im.id AS imovel_id,

  l.asaas_api_key -- <- Aqui a chave da subconta do locador
FROM contratos c
JOIN inquilinos i ON c.inquilino_id = i.id
JOIN imoveis im ON c.imovel_id = im.id
JOIN locadores l ON i.locador_id = l.id -- <- Junta com a tabela de locadores
WHERE c.status = 'ativo';
`
  );
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
  cpf_cnpj,
}) => {
  const pagamento = await asaasService.gerarPagamentoPix(
    id_asaas,
    valor,
    data_vencimento,
    cpf_cnpj
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

const getPendenciasInquilino = async (inquilino_id, locadorId) => {
  const [result] = await db.query(
    `
    SELECT p.link_pagamento, p.due_date 
    FROM pagamentos p
    JOIN contratos c ON p.contrato_id = c.id
    JOIN imoveis im ON c.imovel_id = im.id
    WHERE c.inquilino_id = ? 
      AND (p.status = 'pendente' OR p.status = 'atrasado')
      AND im.locador_id = ?
  `,
    [inquilino_id, locadorId]
  );
  return result;
};

module.exports = {
  getCobrancasPendentes,
  getDataVencimentoPorId,
  criarCobrancaPix,
  getPendenciasInquilino,
  getCobrancasSeremFeitas,
};
