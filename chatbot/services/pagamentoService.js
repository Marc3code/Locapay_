const API_base = "https://backend-production-78eb.up.railway.app";

exports.buscarLinkPagamento = async (inquilinoId) => {
  try {
    const response = await fetch(`${API_base}/link_pagamento/${inquilinoId}`);
    const data = await response.json();

    if (data.success && data.paymentLink) {
      return data.paymentLink;
    } else if (data.message) {
      return data.message;
    } else {
      return "❌ Nenhum pagamento pendente encontrado";
    }
  } catch (err) {
    console.error("Erro na requisição:", err);
    return "⚠️ Serviço indisponível no momento";
  }
};
