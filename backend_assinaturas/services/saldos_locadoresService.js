const db = require("../database/dbconnect");

exports.atualizarSaldoLocador = async (locadorId, valorAdicionado) => {
  try {
    const [result] = await db.query(
      `
      UPDATE saldos_locadores 
      SET saldo_total = saldo_total + ? 
      WHERE locador_id = ?;
    `,
      [valorAdicionado, locadorId]
    );

    if (result.affectedRows === 0) {
      return {
        sucesso: false,
        mensagem: "Locador não encontrado ou saldo não atualizado.",
      };
    }

    return {
      sucesso: true,
      mensagem: `Saldo atualizado com sucesso.`,
    };
  } catch (err) {
    console.error("Erro ao atualizar saldo do locador:", err);
    return {
      sucesso: false,
      mensagem: "Erro no banco de dados ao atualizar saldo.",
      erro: err,
    };
  }
};

