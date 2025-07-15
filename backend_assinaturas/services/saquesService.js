const db = require('../database/dbconnect')

exports.buscarSaques = async (locador_id) => {
  try {
    const query = "SELECT * FROM saques WHERE locador_id = ?";

    const [result] = await db.query(query, [locador_id]);

    return {
      result,
    };
  } catch (err) {
    console.error("Erro ao buscar saques:", err);
    return {
      sucesso: false,
      mensagem: "Erro ao buscar saques",
      erro: err,
    };
  }
};