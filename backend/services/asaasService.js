const axios = require("axios");
require("dotenv").config();

const BASE_URL_SANDBOX = "https://sandbox.asaas.com/api/v3"; // para ambiente de testes
const BASE_URL = "https://www.asaas.com/api/v3";

//Função para gerar fatura Pix
const gerarPagamentoPix = async (customerId, value, dueDate) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/payments`,
      {
        customer: customerId,
        billingType: "PIX",
        value: value,
        dueDate: dueDate,
      },
      {
        headers: {
          "Content-Type": "application/json",
          access_token: process.env.ASAAS_API_KEY_SANDBOX,
        },
      }
    );
    console.log("Cobrança criada com sucesso!");
    return response.data;
  } catch (err) {
    console.error(
      "Erro ao criar pagamento:",
      err?.response?.data || err.message,
      "\nDetalhes completos:",
      err
    );
    throw new Error(err?.response?.data?.message || "Erro ao criar pagamento");
  }
};

const criarClienteAsaas = async (clienteData) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/customers`,
      clienteData,
      {
        headers: {
          "Content-Type": "application/json",
          access_token: process.env.ASAAS_API_KEY_SANDBOX,
        },
      }
    );
    return response.data.id;
  } catch (err) {
    console.error("Erro ao criar cliente:", err.response?.data || err.message);
    throw new Error(err.response?.data?.message || "Erro ao criar cliente");
  }
};


const transferirPix = async ({ valor, chave_pix, tipoChavePix, saque_id }) => {
  try {
    const response = await axios.post(
      `https://www.asaas.com/api/v3/transfers`,
      {
        value: valor,
        pixAddressKey: chave_pix,
        pixAddressKeyType: tipoChavePix,
        description: `Saque via Pix - id: ${saque_id}`,
      },
      {
        headers: {
          "Content-Type": "application/json",
          access_token: process.env.ASAAS_API_KEY_SANDBOX,
        },
      }
    );

    return response.data;
  } catch (err) {
    console.error(
      "Erro ao transferir via Pix:",
      err.response?.data || err.message
    );
    throw new Error(
      err.response?.data?.message || "Erro ao transferir via Pix"
    );
  }
};


const criarSubconta = async (locador) => {
  const payload = {
    name: locador.nome,
    email: locador.email,
    cpfCnpj: locador.cpf_cnpj,
    mobilePhone: locador.telefone,
    incomeValue: locador.rendaMensal,
    address: locador.rua,
    addressNumber: locador.numeroEndereco,
    complement: locador.complemento || "",
    province: locador.bairro,
    postalCode: locador.cep,
    city: locador.cidade,
    state: locador.estado
  };

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.ASAAS_API_KEY_SANDBOX}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.errors?.[0]?.description || "Erro ao criar subconta no Asaas");
    }

    return {
      ok: true,
      id: data.id,
      apiKey: data.apiKey,
      status: data.status
    };
  } catch (err) {
    console.error("Erro ao criar subconta no Asaas:", err);
    return { ok: false, error: err.message };
  }
};

module.exports = {
  gerarPagamentoPix,
  criarClienteAsaas,
  transferirPix,
  criarSubconta
};
