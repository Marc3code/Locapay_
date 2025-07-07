require('dotenv').config()

async function enviarNotificacaoCobrancaDoMes(data, telefone) {
  try {
    const response = await fetch(`${process.env.API_BASE_CHATBOT}/notifications/cobranca_do_mes`, {
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
    const response = await fetch(
      `${process.env.API_BASE_CHATBOT}/notifications/pagamento_atrasado`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data, telefone }),
      }
    );

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

async function enviarNotificacaoPagamentoRealizado(data, telefone) {
  try {
    const response = await fetch(
      `${process.env.API_BASE_CHATBOT}/notifications/pagamento_realizado`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data, telefone }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        `Erro na notificação: ${response.status} - ${JSON.stringify(errorData)}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error(
      "Erro no notificationService.enviarNotificacaoPagamentoRealizado:",
      error
    );
    throw error;
  }
}

async function enviarNotificacaoLembretePagamento(data, telefone) {
  try {
    const response = await fetch(`${process.env.API_BASE_CHATBOT}/notifications/cobranca_3d`, {
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
      "Erro no notificationService.enviarNotificacaoLembretePagamento:",
      error
    );
    throw error;
  }
}

async function enviarNotificacaoBoasVindas(telefone) {
  try {
    const response = await fetch(`${process.env.API_BASE_CHATBOT}/notifications/boas_vindas`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ telefone }),
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
      "Erro no notificationService.enviarNotificacaoBoasVindas:",
      error
    );
    throw error;
  }
}

module.exports = {
  enviarNotificacaoCobrancaDoMes,
  enviarNotificacaoPagamentoAtrasado,
  enviarNotificacaoPagamentoRealizado,
  enviarNotificacaoLembretePagamento,
  enviarNotificacaoBoasVindas
};
