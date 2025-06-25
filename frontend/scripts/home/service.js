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
    const lista = Array.isArray(pagamentos) ? pagamentos : [pagamentos];

    const hoje = new Date();
    const mesAtual = hoje.getMonth(); // de 0 a 11
    const anoAtual = hoje.getFullYear();

    // Filtrar pagamentos cujo due_date seja do mês e ano atual
    const pagamentosDoMesAtual = lista.filter((pagamento) => {
      const dataVencimento = new Date(pagamento.due_date);
      return (
        dataVencimento.getMonth() === mesAtual &&
        dataVencimento.getFullYear() === anoAtual
      );
    });

    return pagamentosDoMesAtual;

  } catch (err) {
    console.error('Erro ao buscar pagamentos:', err);
    return [];
  }
};

