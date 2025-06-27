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
    return Array.isArray(pagamentos) ? pagamentos : [pagamentos];
  } catch (err) {
    console.error('Erro ao buscar pagamentos:', err);
    return [];
  }
};


