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
          access_token: process.env.ASAAS_API_KEY,
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
          access_token: process.env.ASAAS_API_KEY,
        },
      }
    );
    return response.data.id;
  } catch (err) {
    console.error("Erro ao criar cliente:", err.response?.data || err.message);
    throw new Error(err.response?.data?.message || "Erro ao criar cliente");
  }
};

const criarContaDestinoPix = async ({ name, cpfCnpj, pixKey }) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/account`,
      {
        name,
        cpfCnpj,
        bankAccount: {
          type: "PIX",
          pixKey,
        },
      },
      {
        headers: {
          "Content-Type": "application/json",
          access_token: process.env.ASAAS_API_KEY,
        },
      }
    );

    return response.data.walletId;
  } catch (err) {
    console.error(
      "Erro ao criar conta de destino:",
      err.response?.data || err.message
    );
    throw new Error(
      err.response?.data?.message || "Erro ao criar conta de destino"
    );
  }
};

const transferirPix = async ({ valor, chave_pix, tipoChavePix }) => {
  try {
    const response = await axios.post(
      `https://www.asaas.com/api/v3/transfers`,
      {
        value: valor,
        pixAddressKey: chave_pix,
        pixAddressKeyType: tipoChavePix, // ex: "CPF", "PHONE"
        description: "Saque direto via Pix",
      },
      {
        headers: {
          "Content-Type": "application/json",
          access_token: process.env.ASAAS_API_KEY,
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

module.exports = {
  gerarPagamentoPix,
  criarClienteAsaas,
  criarContaDestinoPix,
  transferirPix,
};
