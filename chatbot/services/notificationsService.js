const notificacoes = require("../notifications/index");

async function enviarNotificacaoCobrancadoMesService (data, telefone)  {
  try {
    const envio = await notificacoes.enviarNotificacaoCobrancaDoMes(
      data,
      telefone
    );
    if (!envio.ok) {
      return {
        ok: false,
        error: `Erro ao enviar notificação de cobrança do mês: ${envio.error}`,
      };
    }
    return { ok: true, sid: envio.sid };
  } catch (err) {
    return { ok: false, error: err.message || err.toString() };
  }
};

async function enviarNotificacaoPagamentoAtrasado (data, telefone) {
  try {
    const envio = await notificacoes.enviarNotificacaoPagamentoAtrasado(
      data,
      telefone
    );
    if (!envio.ok) {
      return {
        ok: false,
        error: `Erro ao enviar notificação de cobrança do mês: ${envio.error}`,
      };
    }
    return { ok: true, sid: envio.sid };
  } catch (err) {
    return { ok: false, error: err.message || err.toString() };
  }
};

async function enviarNotificacaoPagamentoRealizado (data, telefone) {
  try {
    const envio = await notificacoes.enviarNotificacaoPagamentoRealizado(
      data,
      telefone
    );
    if (!envio.ok) {
      return {
        ok: false,
        error: `Erro ao enviar notificação de pagamento realizado: ${envio.error}`,
      };
    }
    return { ok: true, sid: envio.sid };
  } catch (err) {
    return { ok: false, error: err.message || err.toString() };
  }
};

async function enviarNotificacao3DiasAntes (data, telefone) {
  try {
    const envio = await notificacoes.enviarNotificacao3DiasAntes(
      data,
      telefone
    );
    if (!envio.ok) {
      return {
        ok: false,
        error: `Erro ao enviar notificação de cobrança 3 dias antes do vencimento: ${envio.error}`,
      };
    }
    return { ok: true, sid: envio.sid };
  } catch (err) {
    return { ok: false, error: err.message || err.toString() };
  }
};

module.exports = {
  enviarNotificacaoCobrancadoMesService,
  enviarNotificacaoPagamentoAtrasado,
  enviarNotificacaoPagamentoRealizado,
  enviarNotificacao3DiasAntes
};
