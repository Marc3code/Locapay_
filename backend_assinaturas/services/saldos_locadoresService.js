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

exports.atualizarSaldoLocadorSaque = async (
  locador_id,
  saldo_total,
  saldo_bloqueado
) => {
  try {
    const [result] = await db.query(
      `
      UPDATE saldos_locadores 
      SET saldo_total = ?, saldo_bloqueado = ?
      WHERE locador_id = ?;
    `,
      [saldo_total, saldo_bloqueado, locador_id]
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

exports.adicionarSaldoLocador = async (locadorId) => {
  try {
    const [result] = await db.query(
      `
      INSERT INTO saldos_locadores (locador_id, saldo_total, saldo_bloqueado) values (?, 0.00, 0.00)
    `,
      [locadorId]
    );

    if (result.affectedRows === 0) {
      return {
        sucesso: false,
        mensagem: "Locador não encontrado.",
      };
    }

    return {
      sucesso: true,
      mensagem: `Linha de saldo criada com sucesso.`,
    };
  } catch (err) {
    console.error("Erro ao criar linha de saldo do locador:", err);
    return {
      sucesso: false,
      mensagem: "Erro no banco de dados ao criar linha de saldo do locador.",
      erro: err,
    };
  }
};

exports.buscarSaldoLocador = async (locadorId) => {
  try {
    const [result] = await db.query(
      `
      SELECT * FROM saldos_locadores where locador_id = ?
    `,
      [locadorId]
    );

    return result;
  } catch (err) {
    console.error("Erro ao buscar saldo do locador:", err);
    return {
      sucesso: false,
      mensagem: "Erro no banco de dados ao buscar saldo.",
      erro: err,
    };
  }
};

exports.desbloquearSaldoLocador = async (saque_id) => {
  try {
    // Buscar o locador_id com base no saque_id
    const [saqueResult] = await db.query(
      "SELECT locador_id FROM saques WHERE id = ?",
      [saque_id]
    );

    if (saqueResult.length === 0) {
      return {
        mensagem: "Saque não encontrado",
        erro: true,
      };
    }

    const locador_id = saqueResult[0].locador_id;

    // Atualizar o saldo_bloqueado para 0
    const [updateResult] = await db.query(
      "UPDATE saldos_locadores SET saldo_bloqueado = 0.00 WHERE locador_id = ?",
      [locador_id]
    );

    return {
      mensagem: "Saldo bloqueado desbloqueado com sucesso",
      linhasAfetadas: updateResult.affectedRows,
      erro: false,
    };
  } catch (err) {
    console.error("Erro ao desbloquear saldo do locador:", err);
    return {
      mensagem: "Erro ao desbloquear saldo do locador",
      erro: err,
    };
  }
};
