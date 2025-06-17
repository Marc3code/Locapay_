const notificationService = require('../services/notificationsService');

const enviarNotificacaoCobrancadoMesController = async (req, res) => {
  try {
    const telefone = req.body.telefone;
    const data = req.body.data;

    const envio = await notificationService.enviarNotificacaoCobrancadoMesService(data, telefone);
    if(!envio.ok){
        return ("Erro ao enviar notificação de cobrança do mês");
    }
    return res.status(200).json({ message: "Notificação enviada com sucesso" });

  } catch (err) {
    res.status(404).json({message: "erro ao enviar notificaçao de cobrança do mês"});
  }
};

module.exports = {
    enviarNotificacaoCobrancadoMesController,
};
