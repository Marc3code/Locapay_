const db = require("../database/dbconnect");

async function BuscarAssinatura(locador_id) {
  const query = `
    SELECT 
      a.id AS assinatura_id,
      a.status,
      a.data_inicio,
      a.data_fim,
      p.nome AS nome_plano,
      p.preco
    FROM assinaturas a
    JOIN planos p ON a.plano_id = p.id
    WHERE a.locador_id = ?
  `;

  try {
    const [rows] = await db.query(query, [locador_id]);
    return rows.length ? rows[0] : null;
  } catch (error) {
    console.error("Erro ao buscar assinatura:", error);
    throw new Error("Erro ao buscar assinatura");
  }
}

async function adicionarAssinatura(locador_id, plano_id) {
  const query = `
    INSERT INTO assinaturas (locador_id, plano_id)
    VALUES (?, ?)
  `;

  try {
    const [result] = await db.query(query, [
      locador_id,
      plano_id,
    ]);

    return {
      sucesso: true,
      mensagem: "Assinatura adicionada com sucesso",
      id_assinatura: result.insertId,
    };
  } catch (error) {
    console.error("Erro ao adicionar assinatura:", error);
    throw new Error("Erro ao adicionar assinatura");
  }
}

async function atualizarDatasInicioFim(locador_id, data_inicio, data_fim){
   const query = `
    UPDATE assinaturas SET data_inicio = ? and SET data_fim = ? WHERE locador_id = ?
  `;

  try {
    const [result] = await db.query(query, [data_inicio, data_fim, locador_id]);

    if (result.affectedRows === 0) {
      return {
        sucesso: false,
        mensagem: "Assinatura não encontrada",
      };
    }

    return { sucesso: true, mensagem: "Datas de assinatura atualizadas com sucesso" };
  } catch (error) {
    console.error("Erro ao atualizar datas da assinatura:", error);
    throw new Error("Erro ao atualizar datas da assinatura");
  }
}

async function atualizarAssinatura(locador_id, novoPlano_id) {
  const query = `
    UPDATE assinaturas SET plano_id = ? WHERE locador_id = ?
  `;

  try {
    const [result] = await db.query(query, [novoPlano_id, locador_id]);

    if (result.affectedRows === 0) {
      return {
        sucesso: false,
        mensagem: "Assinatura não encontrada ou plano já era o mesmo",
      };
    }

    return { sucesso: true, mensagem: "Plano atualizado com sucesso" };
  } catch (error) {
    console.error("Erro ao atualizar assinatura:", error);
    throw new Error("Erro ao atualizar assinatura");
  }
}

async function atualizarStatusAssinatura(locador_id, status) {
  const query = `
    UPDATE assinaturas SET status = ? WHERE locador_id = ?
  `;

  try {
    const [result] = await db.query(query, [status, locador_id]);

    if (result.affectedRows === 0) {
      return {
        sucesso: false,
        mensagem: "Assinatura não encontrada ou status já era o mesmo",
      };
    }

    return { sucesso: true, mensagem: "Status atualizado com sucesso" };
  } catch (error) {
    console.error("Erro ao atualizar status da assinatura:", error);
    throw new Error("Erro ao atualizar status da assinatura");
  }
}

module.exports = {
  BuscarAssinatura,
  adicionarAssinatura,
  atualizarDatasInicioFim,
  atualizarAssinatura,
  atualizarStatusAssinatura,
};
