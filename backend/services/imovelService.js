const db = require("../database/dbconnect");

const getTodosImoveis = async () => {
  const [results] = await db.query("SELECT * FROM imoveis");
  return results;
}

module.exports = {
  getTodosImoveis
};
