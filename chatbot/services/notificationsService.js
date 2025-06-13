const notificacoes = require('../notifications/index')

const enviarNotificacaoCobrancadoMesService = async (data, telefone) => {
  try {

    const envio = await notificacoes.enviarNotificacaoCobrancaDoMes(data, telefone);
    if(!envio.ok){
        return ("Erro ao enviar notificação de cobrança do mês");
    }
  } catch (err) {
    res.status(404).json({message: "erro ao enviar notificaçao de cobrança do mês"});
  }
};

module.exports = {
    enviarNotificacaoCobrancadoMesService
}