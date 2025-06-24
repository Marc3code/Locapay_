const API_BASE = "https://chatbot-isolado-production.up.railway.app";

async function enviarNotificacaoCobrancaDoMes(data, telefone) {
  try {
    const response = await fetch(`${API_BASE}/notifications/cobranca_do_mes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data, telefone }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        `Erro na notificação: ${response.status} - ${JSON.stringify(errorData)}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error(
      "Erro no notificationService.enviarNotificacaoCobrancaDoMes:",
      error
    );
    throw error;
  }
}

async function enviarNotificacaoPagamentoAtrasado(data, telefone) {
   try {
    const response = await fetch(`${API_BASE}/notifications/pagamento_atrasado`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data, telefone }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        `Erro na notificação: ${response.status} - ${JSON.stringify(errorData)}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error(
      "Erro no notificationService.enviarNotificacaoPagamentoAtrasado:",
      error
    );
    throw error;
  }
}

module.exports = { enviarNotificacaoCobrancaDoMes, enviarNotificacaoPagamentoAtrasado };
