const db = require("../database/dbconnect");

// ------------------ SERVICES GET ------------------

async function getTodosInquilinos() {
  const [results] = await db.query("SELECT * FROM inquilinos");
  return results;
}

async function getInquilinoPorId(id) {
  const [results] = await db.query("SELECT * FROM inquilinos WHERE id = ?", [
    id,
  ]);
  return results;
}

async function getInquilinoPorTelefone(telefone) {
  const [results] = await db.query(
    "SELECT * FROM inquilinos WHERE telefone = ?",
    [telefone]
  );
  return results.length > 0 ? results[0] : null;
}

async function getInquilinosComImovel() {
  const [results] = await db.query(`
    SELECT 
      i.id AS inquilino_id, 
      i.nome, 
      i.telefone, 
      i.cpfCnpj,
      i.id_asaas,
      ii.id AS relacao_id,
      ii.valor_aluguel, 
      ii.data_vencimento,
      ii.data_inicio,
      ii.data_fim,
      ii.status,
      im.id AS imovel_id,
      im.tipo AS tipo_imovel, 
      im.endereco, 
      im.numero,
      im.complemento
    FROM inquilinos i
    JOIN inquilinos_imoveis ii ON i.id = ii.inquilino_id
    JOIN imoveis im ON ii.imovel_id = im.id
  `);
  return results;
}

// ------------------ SERVICES POST ------------------
const atualizarDataVencimento = async (data_vencimento, id) => {
  const query = `UPDATE inquilinos_imoveis SET data_vencimento = ? WHERE id = ?`;
  const values = [data_vencimento, id];

  try {
    const [results] = await db.query(query, values);

    if (results.affectedRows === 0) {
      return res
        .status(404)
        .json({ erro: "Nenhum registro encontrado com este ID." });
    }

    res.json({
      mensagem: "Data de vencimento atualizada com sucesso!",
      id,
      data_vencimento,
    });
  } catch (err) {
    console.error("Erro ao atualizar data de vencimento:", err);
    res.status(500).json({ erro: "Falha ao atualizar data de vencimento" });
  }
};

module.exports = {
  getTodosInquilinos,
  getInquilinoPorId,
  getInquilinoPorTelefone,
  getInquilinosComImovel,

  atualizarDataVencimento,
};
