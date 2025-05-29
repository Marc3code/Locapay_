const db = require("../config/db");

async function getTodosImoveis() {
  const [results] = await db.query("SELECT * FROM imoveis");
  return results;
}

module.exports = {
  getTodosImoveis
};
