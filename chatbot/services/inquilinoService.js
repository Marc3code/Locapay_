const API_base = "https://backend-production-78eb.up.railway.app";

async function buscarInquilinoPorNumero(numeroFormatado) {
  try {
    const res = await fetch(`${API_base}/getinquilino/${numeroFormatado}`);
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Erro ao buscar inquilino:", error);
    return null;
  }
}

module.exports = { buscarInquilinoPorNumero };
