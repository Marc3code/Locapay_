const axios = require("axios");
require("dotenv").config();

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
          access_token:
            "$aact_hmlg_000MzkwODA2MWY2OGM3MWRlMDU2NWM3MzJlNzZmNGZhZGY6OjQ0NzcwZjE4LWJiOWItNDg4My1hMTU4LWM1NDJmN2ExNmMwYjo6JGFhY2hfYTVkOTJjMjAtMDY3ZC00MDBjLTg2ZjgtNDFhYThlZWU5OThl",
        },
      }
    );

    console.log("Cobrança criada com sucesso!");
    return response.data;
  } catch (err) {
    console.error(
      "Erro ao criar pagamento:",
      err.response?.data || err.message
    );
    throw new Error(err.response?.data?.message || "Erro ao criar pagamento");
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

module.exports = {
  gerarPagamentoPix,
  criarClienteAsaas,
};
