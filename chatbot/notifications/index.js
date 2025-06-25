const { enviarNotificacaoCobrancaDoMes } = require("./cobrancaDoMes");
const { enviarNotificacao3DiasAntes } = require("./aviso3DiasAntes");
const { enviarNotificacaoPagamentoAtrasado } = require("./pagamentoAtrasado");
const { enviarNotificacaoPagamentoRealizado } = require("./pagamentoRealizado");

module.exports = {
  enviarNotificacaoCobrancaDoMes,
  enviarNotificacao3DiasAntes,
  enviarNotificacaoPagamentoAtrasado,
  enviarNotificacaoPagamentoRealizado
};
