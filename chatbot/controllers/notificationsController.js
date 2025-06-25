const  notificationService  = require("../services/notificationsService");

async function enviarNotificacaoCobrancadoMesController (req, res) {
  try {
    const telefone = req.body.telefone;
    const data = req.body.data;

    const envio =
      await notificationService.enviarNotificacaoCobrancadoMesService(
        data,
        telefone
      );

    if (!envio.ok) {
      return res.status(400).json(envio);
    }

    return res.status(200).json({ message: "Notificação enviada com sucesso" });
  } catch (err) {
    res
      .status(404)
      .json({ message: "erro ao enviar notificaçao de cobrança do mês" });
  }
};

async function enviarNotificacaoPagamentoAtrasadoController (req, res) {
  try {
    const telefone = req.body.telefone;
    const data = req.body.data;

    const envio = await notificationService.enviarNotificacaoPagamentoAtrasado(
      data,
      telefone
    );

    if (!envio.ok) {
      return res.status(400).json(envio);
    }

    return res.status(200).json({ message: "Notificação enviada com sucesso" });
  } catch (err) {
    res
      .status(404)
      .json({ message: "erro ao enviar notificaçao de pagamento atrasado" });
  }
}

async function enviarNotificacaoPagamentoRealizadoController (req, res) {
  try {
    const telefone = req.body.telefone;
    const data = req.body.data;

    const envio = await notificationService.enviarNotificacaoPagamentoRealizado(
      data,
      telefone
    );

    if (!envio.ok) {
      return res.status(400).json(envio);
    }

    return res.status(200).json({ message: "Notificação enviada com sucesso" });
  } catch (err) {
    res
      .status(404)
      .json({ message: "erro ao enviar notificaçao de pagamento realizado" });
  }
}

async function enviarNotificacao3DiasAntesController (req, res) {
  try {
    const telefone = req.body.telefone;
    const data = req.body.data;

    const envio = await notificationService.enviarNotificacao3DiasAntes(
      data,
      telefone
    );

    if (!envio.ok) {
      return res.status(400).json(envio);
    }

    return res.status(200).json({ message: "Notificação enviada com sucesso" });
  } catch (err) {
    res
      .status(404)
      .json({ message: "erro ao enviar notificaçao de cobrança 3 dias antes do vencimento" });
  }
}


module.exports = {
  enviarNotificacaoCobrancadoMesController,
  enviarNotificacaoPagamentoAtrasadoController,
  enviarNotificacaoPagamentoRealizadoController,
  enviarNotificacao3DiasAntesController
};
