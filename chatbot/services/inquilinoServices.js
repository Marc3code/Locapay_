const API_BASE = "https://backend-isolado-production.up.railway.app";

const getInquilinoPorTelefone = async (numero) => {
  try {
    const response = await fetch(
      `${API_BASE}/inquilinos/getinquilino/${numero}`
    );

    if (!response.ok) {
      console.error("Nenhum inquilino encontrado");
      return { erro: "Nenhum inquilino encontrado" };
    }

    return await response.json();
  } catch (err) {
    console.error("Erro ao buscar inquilino por telefone:", err);
    return { erro: "Erro ao buscar inquilino por telefone" };
  }
};

const buscarLinkPagamento = async (id) => {
  try {
    const response = await fetch(`${API_BASE}/pagamentos/link_pagamento/${id}`);

    if (!response.ok) {
      console.error("Nenhum inquilino encontrado");
      return { erro: "Nenhum inquilino encontrado" };
    }

    return await response.json();
  } catch (err) {
    console.error("Erro ao buscar inquilino por telefone:", err);
    return { erro: "Erro ao buscar inquilino por telefone" };
  }
};

module.exports = {
  getInquilinoPorTelefone,
  buscarLinkPagamento,
};
