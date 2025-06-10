const enviarNotificacaoCobrancaDoDia = require("./cobrancaDoMes");
const enviarNotificacaoCobranca3DiasAntes = require("./aviso3DiasAntes");
const enviarNotificacaoAtraso = require("./pagamentoAtrasado");

module.exports = {
  enviarNotificacaoCobrancaDoDia,
  enviarNotificacaoCobranca3DiasAntes,
  enviarNotificacaoAtraso,
};
