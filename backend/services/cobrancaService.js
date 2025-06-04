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
    "SELECT data_vencimento FROM inquilinos_imoveis WHERE id = ?",
    [inquilinoid]
  );
  return result;
}

module.exports = {
  getCobrancasAtivas,
  getDataVencimentoPorId
};
