const enviarNotificacaoCobrancaDoMes = require("./cobrancaDoMes");
const enviarNotificacaoCobranca3DiasAntes = require("./aviso3DiasAntes");
const enviarNotificacaoAtraso = require("./pagamentoAtrasado");

module.exports = {
  enviarNotificacaoCobrancaDoMes,
  enviarNotificacaoCobranca3DiasAntes,
  enviarNotificacaoAtraso,
};
