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
    return { ok: true, sid: envio.sid }; // retorna ok e o sid da mensagem 
  } catch (err) {
    return { ok: false, error: err };
  }
};

module.exports = {
  enviarNotificacaoCobrancadoMesService,
};
