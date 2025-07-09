require('dotenv').config()

async function buscarInquilinoPorId(id) {
  try {
    const response = await fetch(`${process.env.API_BASE}/inquilinos/inquilino/${id}`, {
      headers: { 'Content-Type': 'application/json' }
    });
    
    if (!response.ok) throw new Error(`Erro ao buscar inquilino: ${response.status}`);
    
    const data = await response.json();
    return data[0]; 
  } catch (error) {
    console.error('Erro no inquilinoService.buscarInquilinoPorId:', error);
    throw error;
  }
}

async function buscarPagamentos() {
  try {
    const response = await fetch(`${process.env.API_BASE}/pagamentos`, {
      headers: { 'Content-Type': 'application/json' }
    });
    
    if (!response.ok) throw new Error(`Erro ao buscar inquilino: ${response.status}`);
    
    const data = await response.json();
    return data; // Retorna o primeiro item ou undefined
  } catch (error) {
    console.error('Erro no inquilinoService.buscarInquilinoPorId:', error);
    throw error;
  }
}


module.exports = { buscarInquilinoPorId, buscarPagamentos };