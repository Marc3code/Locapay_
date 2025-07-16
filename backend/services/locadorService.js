const db = require("../database/dbconnect");
const { transferirPix } = require("./asaasService");

exports.criarLocador = async (locador) => {
  const [result] = await db.query(
    `
    INSERT INTO locadores (nome, senha_hash, cpf_cnpj, telefone)
    VALUES (?, ?, ?, ?)
  `,
    [locador.nome, locador.senha_hash, locador.cpf_cnpj, locador.telefone]
  );

  return result.insertId;
};

exports.buscarPorCpf_Cnpj = async (cpf_cnpj) => {
  const [rows] = await db.query(`SELECT * FROM locadores WHERE cpf_cnpj = ?`, [
    cpf_cnpj,
  ]);
  return rows[0];
};

exports.buscarDadosGerais = async (id) => {
  const [rows] = await db.query(
    `SELECT
      l.nome,
      l.telefone,
      l.cpf_cnpj,
      l.data_cadastro,
      d.banco_codigo,
      d.banco_nome,
      d.agencia,
      d.conta,
      d.conta_digito,
      d.tipo_conta,
      d.chave_pix,
      d.data_ultima_atualizacao
    FROM
      locadores l
    LEFT JOIN
      dados_bancarios_locadores d ON l.id = d.locador_id
    WHERE
      l.id = ?;`,
    [id]
  );
  return rows[0];
};

exports.buscarLocadorPorInquilino = async (inquilinoId) => {
  const query = `
    SELECT l.id AS locador_id, l.nome, l.telefone
    FROM contratos c
    JOIN imoveis i ON c.imovel_id = i.id
    JOIN locadores l ON i.locador_id = l.id
    WHERE c.inquilino_id = ?
    LIMIT 1
  `;

  const [rows] = await db.query(query, [inquilinoId]);

  if (rows.length === 0) {
    return null;
  }

  return rows[0];
};

exports.buscarSaldoLocador = async (locador_id) => {
  try {
    const response = await fetch(
      `${process.env.API_BASE_ASSINATURAS}/saldos_locadores/buscar/${locador_id}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${process.env.ASSINATURAS_API_KEY}`,
        },
      }
    );

    if (!response.ok) {
      console.warn("Erro na resposta da API de saldos:", response.status);
      return null;
    }

    const result = await response.json();
    return result;
  } catch (err) {
    console.error("Erro ao buscar saldo do locador:");
    console.log(err);
    return null;
  }
};

exports.buscarRegistroTransacoes = async (locador_id) => {
  try {
    const response = await fetch(
      `${process.env.API_BASE_ASSINATURAS}/transacoes_saldo/buscar/${locador_id}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${process.env.ASSINATURAS_API_KEY}`,
        },
      }
    );

    if (!response.ok) {
      console.warn(
        "Erro na resposta da API de registros de transações:",
        response.status
      );
      return null;
    }

    const result = await response.json();
    return result;
  } catch (err) {
    console.error("Erro ao buscar registros de transações do locador:");
    console.log(err);
    return null;
  }
};

exports.buscarRegistroSaques = async (locador_id) => {
  try {
    const response = await fetch(
      `${process.env.API_BASE_ASSINATURAS}/saques/buscar/${locador_id}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${process.env.ASSINATURAS_API_KEY}`,
        },
      }
    );

    if (!response.ok) {
      console.warn(
        "Erro na resposta da API de registros de saques:",
        response.status
      );
      return null;
    }

    const result = await response.json();
    return result;
  } catch (err) {
    console.error("Erro ao buscar registros de saques do locador:");
    console.log(err);
    return null;
  }
};

exports.buscarRecipientId = async (locador_id) => {
  const query =
    "SELECT recipient_account_id FROM dados_bancarios_locadores WHERE locador_id = ?";
  try {
    const [rows] = await db.query(query, [locador_id]);
    if (rows.length === 0) return null;
    return rows[0].recipient_account_id;
  } catch (err) {
    console.error("Erro ao buscar recipient_account_id:", err);
    console.log("Erro ao buscar recipient_account_id");
  }
};

exports.cadastrarContaDestinoPix = async (
  nome_locador,
  cpf_cnpj,
  chave_pix
) => {
  try {
    const resultado = await criarContaDestinoPix({
      nome_locador,
      cpf_cnpj,
      chave_pix,
    });

    return {
      sucesso: true,
      recipientAccountId: resultado,
    };
  } catch (err) {
    console.error("Erro ao criar conta destino Pix:", err.message);
    return {
      sucesso: false,
      erro: err.message,
    };
  }
};

exports.realizarSaque = async (valor, chave_pix, tipoChavePix) => {
  try {
    const resultado = await transferirPix({
      valor,
      chave_pix,
      tipoChavePix,
    });

    return {
      sucesso: true,
      dados: resultado,
    };
  } catch (err) {
    console.error("Erro ao realizar transferência Pix:", err.message);
    return {
      sucesso: false,
      erro: err.message,
    };
  }
};

exports.registrarSaque = async (locador_id, valor) => {
  try {
    const response = await fetch(
      `${process.env.API_BASE_ASSINATURAS}/saques/adicionar-registro`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.ASSINATURAS_API_KEY}`,
        },
        body: JSON.stringify({ locador_id, valor }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.warn("Erro ao registrar saque:", response.status, errorText);
      return { sucesso: false, erro: errorText };
    }

    const data = await response.json();
    return { sucesso: true, id: data.id };
  } catch (err) {
    console.error("Erro ao registrar saque:", err.message);
    return { sucesso: false, erro: err.message };
  }
};

exports.atualizarStatusSaque = async (saque_id, status) => {
  try {
    const response = await fetch(
      `${process.env.API_BASE_ASSINATURAS}/saques/atualizar-status`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.ASSINATURAS_API_KEY}`,
        },
        body: JSON.stringify({ saque_id, status }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.warn(
        "Erro ao atualizar status do saque:",
        response.status,
        errorText
      );
      return { sucesso: false, erro: errorText };
    }

    return { sucesso: true };
  } catch (err) {
    console.error("Erro ao atualizar status do saque:", err.message);
    return { sucesso: false, erro: err.message };
  }
};

exports.registrarTransacao = async (locadorId, valor) => {
  const descricao = `Saque via Pix`;

  try {
    const response = await fetch(
      `${process.env.API_BASE_ASSINATURAS}/transacoes_saldo/adicionar`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.ASSINATURAS_API_KEY}`,
        },
        body: JSON.stringify({
          locador_id: locadorId,
          tipo: "saída",
          descricao,
          valor,
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.warn(
        "Erro ao registrar transação de saque:",
        response.status,
        errorText
      );
      return { success: false, error: errorText };
    }

    await response.json();
    return { success: true };
  } catch (err) {
    console.error("Erro ao registrar transação de saque:", err.message);
    return { success: false, error: err.message };
  }
};

exports.atualizarSaldoAtual = async (
  locador_id,
  saldo_total,
  saldo_bloqueado
) => {
  try {
    const response = await fetch(
      `${process.env.API_BASE_ASSINATURAS}/atualizar-pos-saque`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.ASSINATURAS_API_KEY}`,
        },
        body: JSON.stringify({ locador_id, saldo_total, saldo_bloqueado }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.warn(
        "Erro ao atualizar saldo do locador:",
        response.status,
        errorText
      );
      return { sucesso: false, erro: errorText };
    }

    return { sucesso: true };
  } catch (err) {
    console.error("Erro ao atualizar saldo do locador:", err.message);
    return { sucesso: false, erro: err.message };
  }
};
