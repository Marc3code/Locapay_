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
    
}