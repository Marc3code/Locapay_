const notificationService = require("../../services/admin/admin_notificationService");

async function enviarNotificacaoNovoUsuario(req, res) {
  try {
    const telefone = req.body.telefone;
    const nome = req.body.nome;

    const envio = await notificationService.enviarNotificacaoNovoUsuario(
      telefone,
      nome
    );

    if (!envio.ok) {
      return res.status(400).json(envio);
    }

    return res.status(200).json({ message: "Notificação enviada com sucesso" });
  } catch (err) {
    res
      .status(404)
      .json({ message: "erro ao enviar notificaçao de novo usuário" });
  }
}

module.exports = {
    enviarNotificacaoNovoUsuario
}
