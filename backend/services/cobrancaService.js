const db = require("../database/dbconnect");

async function getCobrancasAtivas() {
  const [results] = await db.query(`
    SELECT ii.*, i.id_asaas 
    FROM inquilinos_imoveis ii 
    INNER JOIN inquilinos i ON ii.inquilino_id = i.id 
    WHERE ii.status = 'ativo'
  `);
  return results;
}

async function getDataVencimentoPorId(inquilinoid) {
  const [result] = await db.query(
    "SELECT data_vencimento FROM inquilinos_imoveis WHERE id = ?",
    [inquilinoid]
  );
  return result;
}

module.exports = {
  getCobrancasAtivas,
  getDataVencimentoPorId
};
