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

module.exports = {
  enviarNotificacaoCobrancadoMesService,
  enviarNotificacaoPagamentoAtrasado,
};
