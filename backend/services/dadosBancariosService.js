const API_URL = process.env.API_BASE_ASSINATURAS;
const API_KEY = process.env.ASSINATURAS_API_KEY;

exports.enviarDados = async (locadorId, dados) => {
  const url = `${API_URL}/dados-bancarios/${locadorId}`;

  return await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${API_KEY}`
    },
    body: JSON.stringify(dados)
  });
};

exports.obterDados = async (locadorId) => {
  const url = `${API_URL}/dados-bancarios/${locadorId}`;

  return await fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${API_KEY}`
    }
  });
};
