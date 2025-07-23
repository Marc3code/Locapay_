const notificacoes = require("../../notifications/index");

async function enviarNotificacaoNovoUsuario(telefone, nome) {
  try {
    const envio = await notificacoes.enviarNotificacaoNovoUsuario(
      telefone,
      nome
    );
    if (!envio.ok) {
      return {
        ok: false,
        error: `Erro ao enviar notificação de novo usuário: ${envio.error}`,
      };
    }
    return { ok: true, sid: envio.sid };
  } catch (err) {
    return { ok: false, error: err.message || err.toString() };
  }
}

module.exports = {
    enviarNotificacaoNovoUsuario
}