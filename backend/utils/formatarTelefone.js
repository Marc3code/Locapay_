function formatarTelefone(telefone) {
  return telefone.replace(/^(\+55\d{2})9/, "$1");
}

module.exports = formatarTelefone;
