

async function enviarNotificacaoCobrancaDoMes(data, telefone) {
  try {
    const response = await fetch('/notifications/cobrancaDoMes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data, telefone })
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Erro na notificação: ${response.status} - ${JSON.stringify(errorData)}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Erro no notificationService.enviarNotificacaoCobrancaDoMes:', error);
    throw error;
  }
}

module.exports = { enviarNotificacaoCobrancaDoMes };