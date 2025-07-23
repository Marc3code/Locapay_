const { formatarData } = require("../../utils/formatDate");

const { client, FROM_NUMBER } = require("../twilioClient");

const enviarNotificacaoNovoUsuario = (telefone, nome) => {

  return client.messages
    .create({
      from: "whatsapp:" + FROM_NUMBER,
      to: "whatsapp:" + numeroAdmin,
      contentSid: "HX786141c251f0b683b2976403532b3cba",
      contentVariables: JSON.stringify({
        1: nome, 2: telefone
      }),
    })
    .then((message) => {
      console.log("✅ Notificação de novo usuário cadastrado:", message.sid);
      return { ok: true, sid: message.sid };
    })
    .catch((err) => {
      console.error("❌ Erro ao enviar notificação:", err.message);
      return { ok: false, error: err.message };
    });
};

module.exports = { enviarNotificacao3DiasAntes };
