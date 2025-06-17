const notificacoes = require("../notifications/index");

const enviarNotificacaoCobrancadoMesService = async (data, telefone) => {
  try {
    const envio = await notificacoes.enviarNotificacaoCobrancaDoMes(
      data,
      telefone
    );
    if (!envio.ok) {
      return "Erro ao enviar notificação de cobrança do mês";
    }
  } catch (err) {
    return { ok: false, error: err };
  }
};

module.exports = {
  enviarNotificacaoCobrancadoMesService,
};
