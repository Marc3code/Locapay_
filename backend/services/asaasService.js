const axios = require("axios");
require('dotenv').config();


const BASE_URL = "https://sandbox.asaas.com/api/v3"; // para ambiente de testes
// Para produção: 'https://www.asaas.com/api/v3'

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
    const response = await axios.post(`${BASE_URL}/customers`, clienteData, {
      headers: {
        "Content-Type": "application/json",
        access_token: process.env.ASAAS_API_KEY,
      },
    });
    return response.data.id;

  } catch (err) {
    console.error("Erro ao criar cliente:", err.response?.data || err.message);
    throw new Error(err.response?.data?.message || "Erro ao criar cliente");
  }
};


const criarContaDestinoPix = async ({ name, cpfCnpj, pixKey }) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/recipientAccount`,
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
        }
      }
    );

    return response.data.id;
  } catch (err) {
    console.error("Erro ao criar conta de destino:", err.response?.data || err.message);
    throw new Error(err.response?.data?.message || "Erro ao criar conta de destino");
  }
};



const transferirPix = async ({ valor, recipientAccountId }) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/transfers`,
      {
        value: valor,
        recipientAccountId: recipientAccountId,
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
    console.error("Erro ao transferir via Pix:", err.response?.data || err.message);
    throw new Error(err.response?.data?.message || "Erro ao transferir via Pix");
  }
};


module.exports = {
  gerarPagamentoPix,
  criarClienteAsaas,
  criarContaDestinoPix,
  transferirPix
};
