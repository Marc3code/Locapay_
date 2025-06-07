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
const atualizarDataVencimento = async (req, res) => {
  const { data_vencimento, id } = req.body;

  const query = `UPDATE inquilinos_imoveis SET data_vencimento = ? WHERE id = ?`;
  const values = [data_vencimento, id];

  try {
    const [result] = await db.query(query, values);

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ erro: "Nenhum registro encontrado com este ID." });
    }

    return res.status(200).json({
      mensagem: "Data de vencimento atualizada com sucesso!",
      id,
      data_vencimento,
    });
  } catch (err) {
    console.error("Erro ao atualizar data de vencimento:", err);
    return res.status(500).json({ erro: "Erro interno no servidor." });
  }
};

// ------------------ ROTAS POST ------------------
const criarInquilino = async ({ name, phone, cpfCnpj }) => {
  const [results] = await db.query(
    "INSERT INTO inquilinos (nome, telefone, cpfCnpj) VALUES (?, ?, ?)",
    [name, phone, cpfCnpj]
  );

  const id_asaas = await asaas.criarClienteAsaas({ name, phone, cpfCnpj });

  await db.query("UPDATE inquilinos SET id_asaas = ? WHERE id = ?", [
    id_asaas,
    results.insertId,
  ]);

  return {
    id: results.insertId,
    name,
    phone,
    cpfCnpj,
    id_asaas,
  };
};

const vincularInquilinoImovel = async ({
  inquilino_id,
  imovel_id,
  valor_aluguel,
  data_vencimento,
  data_inicio,
  data_fim,
  status,
  complemento,
}) => {
  const [results] = await db.query(
    `INSERT INTO inquilinos_imoveis 
     (inquilino_id, imovel_id, valor_aluguel, data_vencimento, data_inicio, data_fim, status, complemento) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      inquilino_id,
      imovel_id,
      valor_aluguel,
      data_vencimento,
      data_inicio || null,
      data_fim || null,
      status || "ativo",
      complemento || null,
    ]
  );

  return {
    id: results.insertId,
    inquilino_id,
    imovel_id,
    valor_aluguel,
    data_vencimento,
    data_inicio,
    data_fim,
    status,
    complemento,
  };
};

module.exports = {
  getTodosInquilinos,
  getInquilinoPorId,
  getInquilinoPorTelefone,
  getInquilinosComImovel,

  atualizarDataVencimento,

  criarInquilino,

  vincularInquilinoImovel,
};
