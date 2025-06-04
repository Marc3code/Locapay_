const dotenv = require("dotenv").config();

const getInquilinoPorTelefone = async (numero) => {
  try {
    const response = await fetch(
      `${process.env.API_BASE}/inquilinos/getinquilino/${numero}`
    );

    if (!response) {
      console.error("nenhum inquilino encontrado");
      response.status(400).json({ erro: "nenhum inquilino encontrado" });
    }
  } catch (err) {
    console.error("Erro ao buscar inquilino por telefone:", err);
    res.status(500).json({ err0: "Erro ao buscar inquilino por telefone" });
  }
};

module.exports = {
  getInquilinoPorTelefone,
};
