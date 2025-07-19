const db = require("../database/dbconnect");

exports.buscarSaques = async (locador_id) => {
  try {
    const query = "SELECT * FROM saques WHERE locador_id = ? ORDER BY id DESC";

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

exports.registrarSaque = async (locador_id, valor) => {
  try {
    const query = "INSERT INTO saques (locador_id, valor) VALUES (?, ?)";

    const [result] = await db.query(query, [locador_id, valor]);

    return {
      id: result.insertId,
    };
  } catch (err) {
    console.error("Erro ao registrar saque:", err);
    return {
      mensagem: "Erro ao registrar saque",
      erro: err,
    };
  }
};

exports.atualizarStatusSaque = async (saque_id, status) => {
  try {
    const query = "UPDATE saques SET status = ? WHERE id = ?";

    const [result] = await db.query(query, [status, saque_id]);

    return {
      linhasAfetadas: result.affectedRows,
    };
  } catch (err) {
    console.error("Erro ao atualizar status do saque:", err);
    return {
      mensagem: "Erro ao atualizar status do saque",
      erro: err,
    };
  }
};

exports.adicionarTransferId = async (saque_id, transfer_id) => {
  try {
    const query = "UPDATE saques SET transfer_id = ? WHERE id = ?";

    const [result] = await db.query(query, [transfer_id, saque_id]);

    return {
      linhasAfetadas: result.affectedRows,
    };
  } catch (err) {
    console.error("Erro ao adicionar transfer id:", err);
    return {
      mensagem: "Erro ao atualizar adicionar transfer id",
      erro: err,
    };
  }
}






