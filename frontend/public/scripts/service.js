const API_BASE = "https://backend-isolado-production.up.railway.app";

// Função auxiliar para obter o token armazenado
export function getToken() {
  return localStorage.getItem("token");
}

// ======================= AUTENTICAÇÃO =======================

// Cadastrar novo locador
export const cadastrarLocador = async (dados) => {
  try {
    const response = await fetch(`${API_BASE}/user/locadores`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dados)
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.erro || 'Erro ao cadastrar locador');
    }

    return data;
  } catch (err) {
    console.error("Erro ao cadastrar locador:", err);
    return { erro: err.message };
  }
};

// Fazer login
export const fazerLogin = async (credenciais) => {
  try {
    const response = await fetch(`${API_BASE}/user/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credenciais)
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.erro || 'Credenciais inválidas');
    }

    return data;
  } catch (err) {
    console.error("Erro ao fazer login:", err);
    return { erro: err.message };
  }
};

// ======================= LOCADOR =======================

// Buscar dados do locador logado
export const buscarDadosGerais = async () => {
  try {
    const response = await fetch(`${API_BASE}/user/info`, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Erro HTTP: ${response.status}`);
    }

    return await response.json();
  } catch (err) {
    console.error("Erro ao buscar dados gerais:", err);
    return [];
  }
};

// Buscar dados bancarios do locador logado
export const buscarDadosBancarios = async (id) => {
  try {
    const response = await fetch(`${API_BASE}/bkdt/dados-bancarios`, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify(id),
    });

    if (!response.ok) {
      throw new Error(`Erro HTTP: ${response.status}`);
    }

    return await response.json();
  } catch (err) {
    console.error("Erro ao buscar dados bancarios:", err);
    return [];
  }
};

// ======================= INQUILINOS =======================

// Buscar inquilinos vinculados ao locador logado com contrato
export const buscarInquilinosComContrato = async () => {
  try {
    const response = await fetch(
      `${API_BASE}/inquilinos/inquilinos-com-imovel`,
      {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Erro HTTP: ${response.status}`);
    }

    return await response.json();
  } catch (err) {
    console.error("Erro ao buscar inquilinos:", err);
    return [];
  }
};

// Buscar inquilinos vinculados ao locador logado sem contrato
export const buscarInquilinos = async () => {
  try {
    const response = await fetch(
      `${API_BASE}/inquilinos`,
      {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Erro HTTP: ${response.status}`);
    }

    return await response.json();
  } catch (err) {
    console.error("Erro ao buscar inquilinos:", err);
    return [];
  }
};

// ======================= PAGAMENTOS =======================

// Buscar todos os pagamentos (vinculados ao locador logado)
export const buscarPagamentos = async () => {
  try {
    const response = await fetch(`${API_BASE}/pagamentos`, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Erro HTTP: ${response.status}`);
    }

    const pagamentos = await response.json();
    return Array.isArray(pagamentos) ? pagamentos : [pagamentos];
  } catch (err) {
    console.error("Erro ao buscar pagamentos:", err);
    return [];
  }
};

// ======================= IMÓVEIS =======================

// Buscar imóveis do locador
export const buscarImoveis = async () => {
  try {
    const res = await fetch(`${API_BASE}/imoveis`, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });
    if (!res.ok) throw new Error("Erro ao buscar imóveis");
    return await res.json();
  } catch (err) {
    console.error("Erro ao buscar imóveis:", err.message);
    return [];
  }
};

// Cadastrar novo imóvel
export const cadastrarImovel = async (imovel) => {
  try {
    const res = await fetch(`${API_BASE}/imoveis`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify(imovel),
    });
    if (!res.ok) throw new Error("Erro ao cadastrar imóvel");
    return await res.json();
  } catch (err) {
    console.error("Erro ao cadastrar imóvel:", err.message);
    alert("Erro ao cadastrar imóvel.");
  }
};

// Vincular inquilino a imóvel
export const vincularInquilino = async (dados) => {
  try {
    const res = await fetch(`${API_BASE}/inquilinos/inquilino-imovel`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify(dados),
    });
    if (!res.ok) throw new Error("Erro ao vincular inquilino");
    return await res.json();
  } catch (err) {
    console.error("Erro ao vincular inquilino:", err.message);
    alert("Erro ao vincular inquilino.");
  }
};

// Buscar todos os inquilinos do locador logado
export const buscarInquilinosComImovel = async () => {
  try {
    const response = await fetch(`${API_BASE}/inquilinos/inquilinos-com-imovel`, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Erro HTTP: ${response.status}`);
    }

    return await response.json();
  } catch (err) {
    console.error("Erro ao buscar inquilinos:", err);
    return [];
  }
};

// Cadastrar novo inquilino
export const cadastrarInquilino = async (inquilino) => {
  try {
    const response = await fetch(`${API_BASE}/inquilinos`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify(inquilino),
    });

    if (!response.ok) {
      throw new Error(`Erro HTTP: ${response.status}`);
    }

    alert("Inquilino cadastrado com sucesso!");
    return await response.json();
  } catch (err) {
    console.error("Erro ao cadastrar inquilino:", err);
    alert("Erro ao cadastrar inquilino.");
  }
};

export const buscarMovimentações = async () => {
  try {
    const response = await fetch(`${API_BASE}/locadores/registro-transacoes`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Erro HTTP: ${response.status}`);
    }
    return await response.json();
  } catch (err) {
    console.error("Erro ao buscar registros de transações:", err);
    alert("Não conseguimos buscar seus registros de transações. Por favor, entre em contato com o suporte.")
  }
};

export const buscarSaldo = async () => {
  try {
    const response = await fetch(`${API_BASE}/locadores/buscar-saldo`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Erro HTTP: ${response.status}`);
    }
    return await response.json();
  } catch (err) {
    console.error("Erro ao buscar saldos:", err);
    alert("Não conseguimos buscar seus dados de saldo. Por favor, entre em contato com o suporte.");
  }
};