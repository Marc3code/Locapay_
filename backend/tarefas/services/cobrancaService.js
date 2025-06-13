
const API_BASE = "https://backend-production-78eb.up.railway.app";

async function buscarCobrancas() {
  try {
    const response = await fetch(`${API_BASE}/cobrancas/pendentes`, {
      headers: { 'Content-Type': 'application/json' }
    });
    
    if (!response.ok) throw new Error(`Erro ao buscar cobranças: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error('Erro no cobrancaService.buscarCobrancas:', error);
    throw error;
  }
}

async function atualizarDataVencimento(id, novaData) {
  try {
    const response = await fetch(`${API_BASE}/inquilinos/updt_data_vencimento/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data_vencimento: novaData, id })
    });
    
    if (!response.ok) throw new Error(`Erro ao atualizar vencimento: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error('Erro no cobrancaService.atualizarDataVencimento:', error);
    throw error;
  }
}

async function gerarCobranca(dadosPagamento) {
  try {
    const response = await fetch(`${API_BASE}/pagamentos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dadosPagamento)
    });
    
    if (!response.ok) throw new Error(`Erro ao criar pagamento: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error('Erro no pagamentoService.criarPagamento:', error);
    throw error;
  }
}

module.exports = { buscarCobrancas, atualizarDataVencimento, gerarCobranca };