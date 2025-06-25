const { enviarNotificacaoCobrancaDoMes } = require("./cobrancaDoMes");
const { enviarNotificacaoCobranca3DiasAntes } = require("./aviso3DiasAntes");
const { enviarNotificacaoPagamentoAtrasado } = require("./pagamentoAtrasado");
const { enviarNotificacaoPagamentoRealizado } = require("./pagamentoRealizado");

module.exports = {
  enviarNotificacaoCobrancaDoMes,
  enviarNotificacaoCobranca3DiasAntes,
  enviarNotificacaoPagamentoAtrasado,
  enviarNotificacaoPagamentoRealizado
};
