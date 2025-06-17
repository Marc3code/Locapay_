const notificationService = require("../services/notificationsService");

const enviarNotificacaoCobrancadoMesController = async (req, res) => {
  try {
    const telefone = req.body.telefone;
    const data = req.body.data;

    const envio =
      await notificationService.enviarNotificacaoCobrancadoMesService(
        data,
        telefone
      );
    if (!envio.ok) {
      return "Erro ao enviar notificação de cobrança do mês";
    }
    return res.status(200).json({ message: "Notificação enviada com sucesso" });
  } catch (err) {
    return { ok: false, error: err };
  }
};

module.exports = {
  enviarNotificacaoCobrancadoMesController,
};
