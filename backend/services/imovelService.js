const db = require("../databse/dbconnect");

async function getTodosImoveis() {
  const [results] = await db.query("SELECT * FROM imoveis");
  return results;
}

module.exports = {
  getTodosImoveis
};
