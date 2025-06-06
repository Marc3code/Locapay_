const db = require("../database/dbconnect");

// ------------------ services GET ------------------
const getTodosImoveis = async () => {
  const [results] = await db.query("SELECT * FROM imoveis");
  return results;
};

// ------------------ services GET ------------------
const criarImovel = async ({ tipo, endereco, numero }) => {
  const [results] = await db.query(
    "INSERT INTO imoveis (tipo, endereco, numero) VALUES (?, ?, ?)",
    [tipo, endereco, numero]
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
