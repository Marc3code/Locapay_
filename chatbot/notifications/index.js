const { enviarNotificacaoCobrancaDoMes } = require("./inquilino/cobrancaDoMes");
const { enviarNotificacao3DiasAntes } = require("./inquilino/aviso3DiasAntes");
const { enviarNotificacaoPagamentoAtrasado } = require("./inquilino/pagamentoAtrasado");
const { enviarNotificacaoPagamentoRealizado } = require("./inquilino/pagamentoRealizado");
const { enviarNotificacaoBoasVindas } = require("./inquilino/inquilinoAdicionado");

const { enviarNotificacaoSaqueSolicitado } = require('./admin/saqueSolicitado');

module.exports = {
  enviarNotificacaoCobrancaDoMes,
  enviarNotificacao3DiasAntes,
  enviarNotificacaoPagamentoAtrasado,
  enviarNotificacaoPagamentoRealizado,
  enviarNotificacaoBoasVindas,

  enviarNotificacaoSaqueSolicitado
};
