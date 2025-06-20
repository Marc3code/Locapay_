const axios = require("axios");
require("dotenv").config();

const BASE_URL = "https://sandbox.asaas.com/api/v3"; // para ambiente de testes
// Para produção: 'https://www.asaas.com/api/v3'

//Função para gerar fatura Pix
const gerarPagamentoPix = async (customerId, value, dueDate) => {
  console.log(process.env.ASAAS_API_KEY);
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
    // tentando testar a fuuncao de gerar as cobrancas funcionar, mas qando testo rodando ela localmente da problema com a variavel de ambiiente. pelo postman a reqisicao funciona
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
