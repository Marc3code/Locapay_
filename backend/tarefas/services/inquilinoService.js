const fetch = require('node-fetch');
const API_BASE = "https://backend-production-78eb.up.railway.app";

async function buscarInquilinoPorId(id) {
  try {
    const response = await fetch(`${API_BASE}/inquilino?id=${id}`, {
      headers: { 'Content-Type': 'application/json' }
    });
    
    if (!response.ok) throw new Error(`Erro ao buscar inquilino: ${response.status}`);
    
    const data = await response.json();
    return data[0]; // Retorna o primeiro item ou undefined
  } catch (error) {
    console.error('Erro no inquilinoService.buscarInquilinoPorId:', error);
    throw error;
  }
}

module.exports = { buscarInquilinoPorId };