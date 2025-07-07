const db = require("../database/dbconnect");

// ------------------ services GET ------------------
const getTodosImoveis = async (locadorId) => {
  const [results] = await db.query(
    "SELECT * FROM imoveis WHERE locador_id = ?",
    [locadorId]
  );
  return results;
};

// ------------------ services GET ------------------
const criarImovel = async ({ tipo, endereco, numero, locador_id }) => {
  const [results] = await db.query(
    "INSERT INTO imoveis (tipo, endereco, numero, locador_id) VALUES (?, ?, ?, ?)",
    [tipo, endereco, numero, locador_id]
  );
  return {
    id: results.insertId,
    tipo,
    endereco,
    numero,
  };
};

module.exports = {
  getTodosImoveis,
  criarImovel,
};
