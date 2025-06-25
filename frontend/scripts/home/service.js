export const buscarInquilinos = async () => {
  try {
    const response = await fetch('https://backend-isolado-production.up.railway.app/inquilinos/inquilinos-com-imovel');

    if (!response.ok) {
      throw new Error(`Erro HTTP: ${response.status}`);
    }

    return await response.json();
  } catch (err) {
    console.error('Erro ao buscar inquilinos:', err);
    return [];
  }
};

export const buscarPagamentos = async () => {
  try {
    const response = await fetch('https://backend-isolado-production.up.railway.app/pagamentos');

    if (!response.ok) {
      throw new Error(`Erro HTTP: ${response.status}`);
    }

    const pagamentos = await response.json();

    const pagamentosA = Array.isArray(pagamentos) ? pagamentos : [pagamentos];

    // Exemplo de filtro (pegando apenas os pendentes)
    const pagamentos_pendentes = pagamentos.filter(
      (pagamento) => pagamento.status === "pendente"
    );

    return pagamentos_pendentes;

  } catch (err) {
    console.error('Erro ao buscar inquilinos:', err);
    return [];
  }
};
