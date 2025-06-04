const API_BASE = "https://backend-production-78eb.up.railway.app";

const getInquilinoPorTelefone = async (numero) => {
  try {
    const response = await fetch(
      `${API_BASE}/inquilinos/getinquilino/${numero}`
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
